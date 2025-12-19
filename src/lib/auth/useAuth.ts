"use client";
import { useCallback } from "react";
import { useQueryClient } from "react-query";
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "../zod/auth";
import { useAuthControllerLogin, useAuthControllerRegister } from "../../queries/api/barsApiComponents";

export function useLogin() {
  const qc = useQueryClient();
  const remote = useAuthControllerLogin({});

  const login = useCallback(
    async (payload: LoginInput) => {
      const result = loginSchema.safeParse(payload);
      if (!result.success) {
        const first = result.error.issues[0];
        throw new Error(first?.message ?? "Invalid input");
      }
      const data = await remote.mutateAsync({ body: { email: payload.email, password: payload.password } });
      // Cookie-based auth: server should set HttpOnly cookie; do not store tokens in-memory in the frontend
      // refresh queries that depend on auth
      qc.invalidateQueries();
      return data;
    },
    [remote, qc]
  );

  return {
    ...remote,
    login,
  };
}

export function useRegister() {
  const qc = useQueryClient();
  const remote = useAuthControllerRegister({});

  const register = useCallback(
    async (payload: RegisterInput) => {
      const result = registerSchema.safeParse(payload);
      if (!result.success) {
        const first = result.error.issues[0];
        throw new Error(first?.message ?? "Invalid input");
      }
      const body = { username: payload.username, email: payload.email, password: payload.password };
      const data = await remote.mutateAsync({ body });
      // Cookie-based auth: server should set HttpOnly cookie; do not store tokens in-memory in the frontend
      qc.invalidateQueries();
      return data;
    },
    [remote, qc]
  );

  return { ...remote, register };
}

import { useAuthControllerLogout } from "../../queries/api/barsApiComponents";

export function useLogout() {
  const qc = useQueryClient();
  const remote = useAuthControllerLogout();
  const logout = useCallback(async () => {
    try {
      await remote.mutateAsync({});
    } catch (e) {
      // ignore network/server errors; still clear queries to reflect logged-out state
    }
    qc.invalidateQueries();
  }, [remote, qc]);
  return { logout };
}
