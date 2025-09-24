import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { Provider } from "next-auth/providers"

// Define authentication providers for the application
// Includes both custom credentials (username/password) and Google OAuth
const providers: Provider[] = [
  // Custom credentials provider - handles username/password authentication via backend API
  Credentials({
    name: "credentials",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    // Authorization function that validates user credentials against the backend
    async authorize(credentials) {
      try {
        console.log("Attempting to authenticate with credentials:", { username: credentials?.username });
        
        // Make API call to backend authentication endpoint
        const res = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        console.log("Backend response status:", res.status);

        if (!res.ok) {
          console.log("Authentication failed, status:", res.status);
          return null;
        }

        // Parse user data from backend response
        const data = await res.json();
        console.log("Data received from backend:", data);

        // Return user object with accessToken if authentication was successful
        if (data && data.access_token) {
          const returnUser = {
            id: credentials?.username as string || 'admin',
            name: credentials?.username as string || 'admin',
            email: `${credentials?.username}@local.com`,
            accessToken: data.access_token,
          };
          console.log("Returning user:", returnUser);
          return returnUser;
        }

        console.log("No valid user or accessToken found");
        return null;
      } catch (error) {
        console.error("Auth error:", error);
        return null;
      }
    }
  })
]

const providerIcons: { [key: string]: string } = {}

 
// Create a map of OAuth providers (excludes credentials) for UI display
// This is used to render login buttons for external providers like Google
export const providerMap: { id: string; name: string; icon: string }[] = []

// Extend NextAuth TypeScript types to include custom accessToken property
// This allows TypeScript to recognize accessToken in session and JWT objects
declare module "next-auth" {
  interface Session {
    accessToken?: string // Custom property to store backend access token
  }
  
  interface JWT {
    accessToken?: string // Custom property to store backend access token in JWT
  }
}
 
// Configure and export NextAuth instance with providers and callbacks
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: "/login", // Custom sign-in page
  },
  session: {
    strategy: "jwt", // Use JWT strategy for session management
  },
  callbacks: {
    // Handle redirects after authentication
    async redirect({ url, baseUrl }) {
      // Allow relative redirects (e.g., "/dashboard")
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allow redirects to same origin
      else if (new URL(url).origin === baseUrl) return url
      // Default to base URL for security
      return baseUrl
    },
    // Customize session object - add accessToken to client-side session
    async session({ session, token }: any) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
      }
      return session
    },
    // Customize JWT token - persist accessToken from user object or OAuth account
    async jwt({ token, user, account }: any) {
      // Store accessToken from credentials provider (custom backend)
      if (user?.accessToken) {
        token.accessToken = user.accessToken
      }
      // Store accessToken from OAuth providers (Google, etc.)
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
})