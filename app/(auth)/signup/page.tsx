import React from "react";
import AuthForm from "@/components/organisms/AuthForm";
import AuthAside from "@/components/organisms/AuthAside";

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden">
      <AuthAside variant="signup" />
      <div className="flex w-full lg:w-1/2 flex-col bg-background-light dark:bg-background-dark overflow-y-auto">
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-20 xl:px-24">
          <AuthForm variant="signup" fullLayout />
        </div>
      </div>
    </div>
  );
}
