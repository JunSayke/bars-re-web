"use client";
import { useAuthControllerLogin, useAuthControllerRegister } from "@/queries/api/barsApiComponents";
import type { UseMutationOptions } from "react-query";
import { useQueryClient } from "react-query";
import { loginSchema, registerSchema } from "@/lib/zod/auth";

export const useLogin = (
  options?: Omit<
    UseMutationOptions<any, undefined, any>,
    "mutationFn"
  >
) => {
  const base = useAuthControllerLogin(options as any);

  const qc = useQueryClient();

  return {
    ...base,
    mutate: (input: { email: string; password: string }, mutateOptions?: any) => {
      const parsed = loginSchema.safeParse(input);
      if (!parsed.success) {
        const err = parsed.error;
        if (options && options.onError) (options.onError as any)(err, undefined, undefined);
        // throw to allow caller to catch
        throw err;
      }
      const wrapped = {
        ...mutateOptions,
        onSuccess: (resp: any, ...rest: any[]) => {
          const user = (resp && resp.data) ? { id: resp.data.id, name: resp.data.username, email: resp.data.email } : null;
          if (user) qc.setQueryData(["currentUser"], user);
          if (mutateOptions && mutateOptions.onSuccess) mutateOptions.onSuccess(resp, ...rest);
        },
      };
      return base.mutate({ body: parsed.data } as any, wrapped);
    },
    mutateAsync: async (input: { email: string; password: string }) => {
      const parsed = loginSchema.parse(input);
      const resp = await base.mutateAsync({ body: parsed } as any);
      // If server returns auth info, populate currentUser cache
      const user = (resp && resp.data) ? { id: resp.data.id, name: resp.data.username, email: resp.data.email } : null;
      if (user) qc.setQueryData(["currentUser"], user);
      return resp;
    },
  } as typeof base & {
    mutate: (input: { email: string; password: string }, mutateOptions?: any) => void;
    mutateAsync: (input: { email: string; password: string }) => Promise<any>;
  };
};

export const useRegister = (
  options?: Omit<
    UseMutationOptions<any, undefined, any>,
    "mutationFn"
  >
) => {
  const base = useAuthControllerRegister(options as any);

  const qc = useQueryClient();

  return {
    ...base,
    mutate: (input: { username: string; email: string; password: string }, mutateOptions?: any) => {
      const parsed = registerSchema.safeParse(input);
      if (!parsed.success) {
        const err = parsed.error;
        if (options && options.onError) (options.onError as any)(err, undefined, undefined);
        throw err;
      }
      const wrapped = {
        ...mutateOptions,
        onSuccess: (resp: any, ...rest: any[]) => {
          const user = (resp && resp.data) ? { id: resp.data.id, name: resp.data.username, email: resp.data.email } : null;
          if (user) qc.setQueryData(["currentUser"], user);
          if (mutateOptions && mutateOptions.onSuccess) mutateOptions.onSuccess(resp, ...rest);
        },
      };
      return base.mutate({ body: parsed.data } as any, wrapped);
    },
    mutateAsync: async (input: { username: string; email: string; password: string }) => {
      const parsed = registerSchema.parse(input);
      const resp = await base.mutateAsync({ body: parsed } as any);
      // populate currentUser cache if response contains user info
      const user = (resp && resp.data) ? { id: resp.data.id, name: resp.data.username, email: resp.data.email } : null;
      if (user) qc.setQueryData(["currentUser"], user);
      return resp;
    },
  } as typeof base & {
    mutate: (input: { username: string; email: string; password: string }, mutateOptions?: any) => void;
    mutateAsync: (input: { username: string; email: string; password: string }) => Promise<any>;
  };
};
