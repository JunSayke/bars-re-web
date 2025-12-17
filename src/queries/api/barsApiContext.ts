import type { QueryKey } from "react-query";

export type BarsApiContext = {
  fetcherOptions: {
    /**
     * Headers to inject in the fetcher
     */
    headers?: {};
    /**
     * Query params to inject in the fetcher
     */
    queryParams?: {};
  };
  queryOptions: {
    /**
     * Set this to `false` to disable automatic refetching when the query mounts or changes query keys.
     * Defaults to `true`.
     */
    enabled?: boolean;
  };
  /**
   * Query key middleware.
   */
  queryKeyFn: (queryKey: QueryKey) => QueryKey;
};

/**
 * Context injected into every react-query hook wrappers
 */
export const useBarsApiContext = (): BarsApiContext => {
  return {
    fetcherOptions: {},
    queryOptions: {},
    queryKeyFn: (queryKey) => queryKey,
  };
};
