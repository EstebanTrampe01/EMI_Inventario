/**
 * LoginForm - Organism component for user authentication.
 *
 * Renders a login form with username and password fields, validation, and loading state.
 * Handles user input, displays validation errors, and uses the AuthContext for authentication.
 *
 * Features:
 * - Username and password input fields with validation
 * - Error messages for invalid or missing credentials
 * - Loading state on submit
 * - Redirects to dashboard on successful login
 * - Uses admin/admin as valid credentials
 *
 * @returns {JSX.Element} The login form component
 *
 * @example
 * <LoginForm />
 */
"use client";

import { Button } from "@heroui/button";
import { useState } from "react"
import { Input } from "@heroui/input";
import React from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginProvider from "../organisms/LoginOtherProviders";
import { LockKeyhole, User, Eye, EyeOff } from "lucide-react";

export const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({});
    if (!validateForm()) return; // Validar antes de enviar
    setIsLoading(true);
    const res = await signIn("credentials", {
      username,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    })
    if (res?.error)  
        setErrors({
            general: "Credenciales incorrectas.",
          });
    if (res?.ok && res.url) window.location.href = res.url
    setIsLoading(false);
  }

  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = "Usuario es obligatorio";
    }

    if (!password.trim()) {
      newErrors.password = "Contraseña es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">


      <Input
        placeholder="Ingrese su usuario"
        value={username}
        onValueChange={handleUsernameChange}
        isInvalid={!!errors.username}
        errorMessage={errors.username}
        variant="bordered"
        startContent={
            <User className="w-4 h-4" />
        }
      />

      <Input
        placeholder="Ingrese su contraseña"
        value={password}
        onValueChange={handlePasswordChange}
        isInvalid={!!errors.password}
        errorMessage={errors.password}
        variant="bordered"
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        }
        type={isVisible ? "text" : "password"}
        startContent={
            <LockKeyhole className="w-4 h-4" />
        }
      />

      {errors.general && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            {errors.general}
          </p>
        </div>
      )}

      <Button
        type="submit"
        color="primary"
        className="mt-2 bg-primary-300 shadow-lg shadow-primary-500/20"
        isLoading={isLoading}
        fullWidth
        size="lg"
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>
    </form>
  );
};