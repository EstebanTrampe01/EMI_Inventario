import { Button } from "@heroui/button";
import React from "react";
import { providerMap } from "@/auth";
import { signIn } from "@/auth";

interface LoginProviderProps {
  callbackUrl?: string;
}

export default function LoginProvider({ callbackUrl = "/" }: LoginProviderProps) {
  if (providerMap.length === 0) {
    return null
  }
  return (
    <div className="flex flex-col gap-2">
      {providerMap.map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            "use server";
            await signIn(provider.id, { redirectTo: callbackUrl });
          }}
        >
          <Button 
          type="submit" 
          color="primary" 
          className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-500 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 hover:text-gray-100 transition-colors duration-100">            
            <img
              src={provider.icon}
              alt={provider.name}              
              className={provider.name === "GitHub" ? "h-5 w-5 dark:invert" : "h-5 w-5"}              
            />
            {`Continuar con ${provider.name}`}
          </Button>
        </form>
      ))}
    </div>
    
  );
}
