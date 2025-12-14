import React from "react";
import AuthForm from "@/components/organisms/AuthForm";
import AuthAside from "@/components/organisms/AuthAside";

export default function LoginPage() {
  return (
    <>
      <AuthForm variant="login" />
      <AuthAside />
    </>
  );
}
