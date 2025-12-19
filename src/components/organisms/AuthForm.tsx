"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "../atoms/Button";
import Logo from "../atoms/logo";
import { useToast } from '@/contexts/toast';
import FormField from "../molecules/FormField";
import PasswordField from "../molecules/PasswordField";
import Divider from "../atoms/Divider";
import SocialButton from "../molecules/SocialButton";

import { useLogin, useRegister } from "@/lib/hooks/useAuth";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerFormSchema, LoginInput, RegisterFormInput } from '@/lib/zod/auth';

export const AuthForm: React.FC<{ variant?: "login" | "signup"; fullLayout?: boolean }> = ({ variant = "login", fullLayout = false }) => {
  const isLogin = variant === "login";
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const toast = useToast();

  // Controlled by react-hook-form + Zod resolver
  const resolver = zodResolver(isLogin ? loginSchema : registerFormSchema) as any;
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, clearErrors, setFocus } = useForm({ resolver, defaultValues: { username: '', email: '', password: '', confirm: '', terms: false } });

  const router = useRouter();



  const registerMutation = useRegister({
    onSuccess: () => {
      clearErrors();
      setConnectionError(null);
      toast.success('Account created — redirecting...');
      // On successful registration the backend returns user info and sets cookies.
      // We now redirect straight to the workspace so users are logged in immediately.
      setTimeout(() => router.push('/editor/workspace'), 400);
    },
    onError: (err: unknown) => {
      clearErrors();
      setConnectionError(null);

      const raw = String((err as any)?.message ?? 'Registration failed');
      const status = (err as any)?.status as number | undefined;
      const body = (err as any)?.body;

      // network / connectivity issues (non-HTTP issues)
      if (err instanceof TypeError || /failed to fetch|failed to connect|network request failed/i.test(raw.toLowerCase())) {
        setConnectionError('Unable to connect to the server. Please check your internet connection and try again.');
        return;
      }

      // Treat 405 (misconfigured backend / method not allowed) like a server error so UI shows a generic server message
      if (status === 405) {
        setConnectionError('Server error. Please try again later.');
        return;
      }

      if (status && status >= 500) {
        setConnectionError('Server error. Please try again later.');
        return;
      }

      // prefer structured message — show inline for register errors
      const msg = body && body.message ? (Array.isArray(body.message) ? body.message.join('; ') : body.message) : raw;
      // set form error on email by default
      setError('email', { type: 'server', message: String(msg) });
      setFocus('email' as any);
    }
  });

  const loginMutation = useLogin({
    onSuccess: () => {
      clearErrors();
      setConnectionError(null);
      toast.success('Logged in — redirecting...');
      setTimeout(() => router.push('/editor/workspace'), 400);
    },
    onError: (err: unknown) => {
      // normalize
      const raw = String((err as any)?.message ?? 'Login failed');
clearErrors();
      setConnectionError(null);

      // structured response from barsApiFetch: check status/body
      const status = (err as any)?.status as number | undefined;

      // Treat 405 (misconfigured backend / method not allowed) like a server error so UI shows a generic server message
      if (status === 405) {
        setConnectionError('Server error. Please try again later.');
        return;
      }

      // For login, show a generic inline field error message for any auth failure
      if (status && (status === 401 || (status >= 400 && status < 500))) {
        setError('password', { type: 'server', message: 'Invalid email or password.' });
        setFocus('password' as any);
        return;
      }

      if (status && status >= 500) {
        setConnectionError('Server error. Please try again later.');
        return;
      }

      // network / connectivity issues (non-HTTP issues)
      if (err instanceof TypeError || /failed to fetch|failed to connect|network request failed/i.test(raw.toLowerCase())) {
        setConnectionError('Unable to connect to the server. Please check your internet connection and try again.');
        return;
      }

      // Fallback: set generic inline password error and focus it
      setError('password', { type: 'server', message: 'Invalid credentials' });
      setFocus('password' as any);
    }
  });

  const onSubmit = (data: LoginInput | RegisterFormInput) => {
    if (isLogin) {
      loginMutation.mutate(data as LoginInput);
      return;
    }

    const payload = { username: (data as RegisterFormInput).username, email: (data as RegisterFormInput).email, password: (data as RegisterFormInput).password };
    registerMutation.mutate(payload);
  };

  const onInvalid = (errs: any) => {
    const first = Object.keys(errs)[0];
    if (first) setFocus(first as any);
  };

  const inner = (
    <>
      {/* Success toast (top-center) */}


      <div className="mb-12 w-full max-w-lg mx-auto">
        <Logo />
      </div>

      <div className="mb-8 space-y-2 w-full max-w-lg mx-auto text-left">
        <h1 className="text-3xl font-black leading-tight tracking-tight lg:text-4xl text-slate-900 dark:text-white">{isLogin ? "Log in to your workspace" : "Create your account"}</h1>
        <p className="text-base font-normal leading-normal text-slate-500 dark:text-[#a492c9]">Continue creating Bisaya bars with AI.</p>
      </div>

      <div className="w-full max-w-lg mx-auto">
        <div className="bg-[#0e0713] rounded-xl shadow-2xl">
            <form className="flex flex-col gap-5 mt-2" onSubmit={handleSubmit(onSubmit, onInvalid)} aria-label={isLogin ? 'Login form' : 'Sign up form'}>
              {connectionError ? (
                <div className="mb-2 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 mt-0.5">error</span>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-red-800 dark:text-red-300">Connection Error</p>
                    <p className="text-sm text-red-700 dark:text-red-400">{connectionError}</p>
                  </div>
                </div>
              ) : null}
              {!isLogin && (
                <FormField id="username" label="Username" type="text" placeholder="Lil AI" icon="person" {...register('username', { onChange: () => { clearErrors('username'); } })} inputClassName={errors.username ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} error={errors.username?.message as string | undefined} />
              )}

              <FormField id="email" label="Email Address" type="email" placeholder="mic-dropper@bisayarap.ai" icon="mail" {...register('email', { onChange: () => { clearErrors('email'); setConnectionError(null); } })} inputClassName={errors.email ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} error={errors.email?.message as string | undefined} />

              {isLogin ? (
                  <PasswordField id="password" showForgot={true} {...register('password', { onChange: () => { clearErrors('password'); setConnectionError(null); } })} inputClassName={errors.password ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} error={errors.password?.message as string | undefined} />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <PasswordField id="password" showForgot={false} {...register('password', { onChange: () => clearErrors('password') })} inputClassName={errors.password ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} error={errors.password?.message as string | undefined} />
                  <PasswordField id="confirm" label="Confirm" placeholder="••••••••" showForgot={false} {...register('confirm', { onChange: () => clearErrors('confirm') })} inputClassName={errors.confirm ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} error={errors.confirm?.message as string | undefined} />
                </div>
              )}

              {!isLogin && (
                <div className="flex flex-col gap-1 py-1">
                  <div className="flex items-center gap-3">
                    <input
                      className={`h-4 w-4 rounded ${errors.terms ? 'border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-[#443267]'} bg-white dark:bg-[#221933] text-primary focus:ring-primary`}
                      id="terms"
                      type="checkbox"
                      aria-invalid={!!errors.terms}
                      aria-describedby={errors.terms ? 'terms-error' : undefined}
                      {...register('terms', { onChange: () => clearErrors('terms') })}
                    />
                    <label className="text-sm text-slate-400 dark:text-[#a492c9]" htmlFor="terms">
                      I agree to the <a className="font-medium text-primary hover:text-primary/80" href="#">Terms</a> and <a className="font-medium text-primary hover:text-primary/80" href="#">Privacy Policy</a>
                    </label>
                  </div>
                  {errors.terms?.message ? <p id="terms-error" role="alert" className="text-sm text-red-600 mt-1">{errors.terms?.message as string}</p> : null}
                </div>
              )}

              <Button
                variant="purple"
                type="submit"
                className="mt-2 w-full rounded-lg"
                size="lg"
                disabled={isSubmitting || (isLogin ? loginMutation.isLoading : registerMutation.isLoading)}
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


      <div className="mt-auto pt-8">
        <div className="w-full max-w-lg mx-auto text-center">
          {isLogin ? (
            <p className="text-sm text-slate-400 whitespace-nowrap">New to the studio? <Link href="/signup" className="font-bold text-primary dark:text-primary hover:text-primary/90 hover:underline focus:underline underline-offset-2 decoration-primary ml-2 align-middle text-primary! transition-colors" style={{color: '#5b13ec'}}>Create an account</Link></p>
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
