import { fetchAuthControllerChangePassword, useAuthControllerChangePassword } from "@/queries/api/barsApiComponents";

// Helper to call change-password and explicitly opt-in to refresh behavior if desired.
export const changePassword = (body: any, opts: { skipRefresh?: boolean } = {}) => {
  // pass through skipRefresh to the fetcher via variables object – cast to any to avoid excess prop checks
  const variables: any = { body, ...(opts.skipRefresh ? { skipRefresh: true } : {}) };
  return fetchAuthControllerChangePassword(variables);
};

export const useChangePassword = (options?: any) => {
  // This hook can expose the underlying mutation, and callers can pass skipRefresh via variables if needed
  return useAuthControllerChangePassword(options);
};
