"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "../atoms/Button";
import Logo from "../atoms/logo";
import FormField from "../molecules/FormField";
import PasswordField from "../molecules/PasswordField";
import Divider from "../atoms/Divider";
import SocialButton from "../molecules/SocialButton";

import { useAuthControllerRegister, useAuthControllerLogin } from "@/queries/api/barsApiComponents";

export const AuthForm: React.FC<{ variant?: "login" | "signup"; fullLayout?: boolean }> = ({ variant = "login", fullLayout = false }) => {
  const isLogin = variant === "login";
  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<'info'|'success'|'error'>('info');
  const messageId = "auth-message";
  const router = useRouter();

  const registerMutation = useAuthControllerRegister({
    onSuccess: () => {
      setMessageKind('success');
      setMessage('Account created — redirecting...');
      setTimeout(() => router.push('/login'), 800);
    },
    onError: (err: unknown) => {
      const raw = (err as Error)?.message ?? 'Registration failed';
      let friendly = raw;
      try {
        // try to parse JSON body produced by fetcher
        // Use a dotall-compatible pattern without the /s flag for older TS targets
        const match = /\{[\s\S]*\}$/.exec(raw);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed && parsed.message) {
            friendly = Array.isArray(parsed.message) ? parsed.message.join('; ') : parsed.message;
          }
        }
      } catch (e) {
        // ignore
      }
      setMessageKind('error');
      setMessage(friendly);
    }
  });

  const loginMutation = useAuthControllerLogin({
    onSuccess: () => {
      setMessageKind('success');
      setMessage('Logged in — redirecting...');
      setTimeout(() => router.push('/editor/workspace'), 400);
    },
    onError: (err: unknown) => {
      const msg = (err as Error)?.message ?? 'Login failed';
      setMessageKind('error');
      setMessage(msg);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameEl = document.getElementById('username') as HTMLInputElement | null;
    const emailEl = document.getElementById('email') as HTMLInputElement | null;
    const pwdEl = document.getElementById('password') as HTMLInputElement | null;
    const confirmEl = document.getElementById('confirm') as HTMLInputElement | null;
    const termsEl = document.getElementById('terms') as HTMLInputElement | null;

    const username = usernameEl?.value ?? '';
    const email = emailEl?.value ?? '';
    const pwd = pwdEl?.value ?? '';
    const confirm = confirmEl?.value ?? '';
    const accepted = !!termsEl?.checked;

    setMessage(null);
    setMessageKind('info');

    if (isLogin) {
      if (!email || !pwd) {
        setMessageKind('error');
        setMessage('Please enter email and password');
        return;
      }
      // call login mutation
      loginMutation.mutate({ body: { email, password: pwd } });
      return;
    }

    // Signup validations
    if (!username || !email || !pwd || !confirm) {
      setMessageKind('error');
      setMessage('Please fill in all fields');
      return;
    }
    if (username.length < 3) {
      setMessageKind('error');
      setMessage('Username must be at least 3 characters');
      return;
    }
    if (pwd.length < 8) {
      setMessageKind('error');
      setMessage('Password must be at least 8 characters');
      return;
    }
    if (pwd !== confirm) {
      setMessageKind('error');
      setMessage('Passwords do not match');
      return;
    }
    if (!accepted) {
      setMessageKind('error');
      setMessage('You must accept the terms to continue');
      return;
    }

    // Call registration mutation
    registerMutation.mutate({ body: { username, email, password: pwd } });
  };

  const inner = (
    <>
      <div className="mb-12 w-full max-w-lg mx-auto">
        <Logo />
      </div>

      <div className="mb-8 space-y-2 w-full max-w-lg mx-auto text-left">
        <h1 className="text-3xl font-black leading-tight tracking-tight lg:text-4xl text-slate-900 dark:text-white">{isLogin ? "Log in to your workspace" : "Create your account"}</h1>
        <p className="text-base font-normal leading-normal text-slate-500 dark:text-[#a492c9]">Continue creating Bisaya bars with AI.</p>
      </div>

      <div className="w-full max-w-lg mx-auto">
        <div className="bg-[#0e0713] rounded-xl shadow-2xl">
            <form className="flex flex-col gap-5 mt-2" onSubmit={handleSubmit} aria-label={isLogin ? 'Login form' : 'Sign up form'}>
              {!isLogin && (
                <FormField id="username" label="Username" type="text" placeholder="Lil AI" icon="person" />
              )}

              <FormField id="email" label="Email Address" type="email" placeholder="mic-dropper@bisayarap.ai" icon="mail" />

              {isLogin ? (
                <PasswordField id="password" showForgot={true} />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <PasswordField id="password" showForgot={false} />
                  <PasswordField id="confirm" label="Confirm" placeholder="••••••••" showForgot={false} />
                </div>
              )}

              {!isLogin && (
                <div className="flex items-center gap-3 py-1">
                  <input className="h-4 w-4 rounded border-slate-300 dark:border-[#443267] bg-white dark:bg-[#221933] text-primary focus:ring-primary" id="terms" type="checkbox" />
                  <label className="text-sm text-slate-400 dark:text-[#a492c9]" htmlFor="terms">
                    I agree to the <a className="font-medium text-primary hover:text-primary/80" href="#">Terms</a> and <a className="font-medium text-primary hover:text-primary/80" href="#">Privacy Policy</a>
                  </label>
                </div>
              )}

              <Button
                variant="purple"
                type="submit"
                className="mt-2 w-full rounded-lg"
                size="lg"
                disabled={isLogin ? loginMutation.isLoading : registerMutation.isLoading}
              >
                {isLogin ? (loginMutation.isLoading ? 'Logging in…' : 'Log In') : (registerMutation.isLoading ? 'Signing up…' : 'Sign Up')}
              </Button>
            </form>

            <div className="pb-6">
              <Divider text="Or continue with" />

              <div className="grid grid-cols-1 gap-4">
                <SocialButton provider="Google" />
              </div>
            </div>
        </div>
        </div>

      <div aria-live="polite" id={messageId} className="mt-4">
        {message ? (
          <div className={`rounded-md px-4 py-2 text-sm ${messageKind === 'success' ? 'bg-green-100 text-green-800' : messageKind === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
            {message}
          </div>
        ) : null}
      </div>
      <div className="mt-auto pt-8">
        <div className="w-full max-w-lg mx-auto text-center">
          {isLogin ? (
            <p className="text-sm text-slate-400 whitespace-nowrap">New to the studio? <Link href="/signup" className="font-bold text-primary dark:text-primary hover:text-primary/90 hover:underline focus:underline underline-offset-2 decoration-primary ml-2 align-middle !text-primary transition-colors" style={{color: '#5b13ec'}}>Create an account</Link></p>
          ) : (
            <p className="text-sm text-slate-400">Already a member? <Link href="/login" className="font-bold text-primary dark:text-primary hover:text-primary/90 hover:underline focus:underline underline-offset-2 decoration-primary transition-colors ml-1" style={{color: '#5b13ec'}}>Log in</Link></p>
          )}
        </div>
      </div>
    </>
  );

  if (fullLayout) return <>{inner}</>;

  return (
    <div className="flex w-full lg:w-[45%] flex-col justify-between min-h-screen px-0 py-8 lg:py-12 relative z-10 bg-background-light dark:bg-background-dark border-r dark:border-[#2f2348] border-slate-200">
      {inner}
    </div>
  );
};

export default AuthForm;
