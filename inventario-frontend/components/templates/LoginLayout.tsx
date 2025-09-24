/**
 * LoginLayout - Template component for the login page layout.
 *
 * Provides a centered card layout with a header and login form.
 * Designed for authentication pages with a modern, responsive style.
 *
 * Features:
 * - Centered card with blurred background and border
 * - Customizable header with icon, title, and subtitle
 * - Slot for login form or other authentication content
 *
 * @returns {JSX.Element} The login layout template component
 *
 * @example
 * <LoginLayout />
 */
import React from "react";
import { Card, CardBody } from "@heroui/card";
import { LoginHeader } from "../organisms/LoginHeader";
import { LoginForm } from "../organisms/LoginForm";
import LoginProvider from "../organisms/LoginOtherProviders";

const LoginLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-content1 to-content2 p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-md bg-content1/60 border border-content3/50 shadow-2xl">
          <LoginHeader
            title="Welcome back"
            subtitle="Sign in to continue to your account"
          />
          <CardBody className="px-8 py-10">
            <LoginForm />
            <div className="relative w-full flex items-center py-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300" />
            </div>
            <LoginProvider callbackUrl="/dashboard" />

          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginLayout;