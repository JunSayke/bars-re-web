import qs from "qs";
import { BarsApiContext } from "./barsApiContext";

/**
 * Customized fetcher used by generated OpenAPI hooks.
 *
 * Key behaviors:
 * - Sends cookies with every request (credentials: 'include') so cookie-based JWTs work.
 * - On 401 responses, attempts a single refresh by calling POST /api/auth/refresh
 *   (the server should set new cookies). Concurrent requests share the same refresh
 *   promise to avoid duplicate refresh calls.
 * - Retries the original request once after a successful refresh.
 *
 * This file is the only generator-modified file we edit; keep the generated components
 * (in `barsApiComponents.ts`) unchanged and use the components/hooks to call endpoints.
 */

export type BarsApiFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> =
  {
    url: string;
    method: string;
    body?: TBody;
    headers?: THeaders;
    queryParams?: TQueryParams;
    pathParams?: TPathParams;
    // If true, skip refresh-on-401 for this request (opt-out)
    skipRefresh?: boolean;
  } & BarsApiContext["fetcherOptions"];

let refreshingPromise: Promise<void> | null = null;

async function doRefreshIfNeeded(refreshUrl: string) {
  if (refreshingPromise) return refreshingPromise;
  refreshingPromise = (async () => {
    try {
      const r = await window.fetch(refreshUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!r.ok) {
        let payload = "";
        try {
          payload = await r.text();
        } catch (e) {
          // ignore
        }
        throw new Error(`Refresh failed (${r.status} ${r.statusText}): ${payload || "(no body)"}`);
      }

      // success — cookies should be set by server; do not store tokens in-memory for cookie-only flow
      return;
    } finally {
      // clear the promise so subsequent refresh attempts can happen if necessary
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
}

export async function barsApiFetch<
  TData,
  TBody extends {} | undefined,
  THeaders extends {},
  TQueryParams extends {},
  TPathParams extends {}
>({
  url,
  method,
  body,
  headers,
  pathParams,
  queryParams,
  skipRefresh,
}: BarsApiFetcherOptions<
  TBody,
  THeaders,
  TQueryParams,
  TPathParams
>): Promise<TData> {
  const finalUrl = resolveUrl(url, queryParams, pathParams);

  const makeRequest = async () => {
    return await window.fetch(finalUrl, {
      method: method.toUpperCase(),
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include", // ensure cookies (access/refresh) are sent
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
    });
  };

  let response = await makeRequest();

  // If unauthorized, attempt a single refresh and retry for *non-auth* endpoints only.
  if (response.status === 401) {
    // Determine request path relative to the API base
    const pathname = (() => {
      try {
        const u = new URL(finalUrl, window.location.origin);
        return u.pathname;
      } catch (e) {
        return finalUrl;
      }
    })();

    // Allow refresh for authenticated auth endpoints (e.g., change-password),
    // but never attempt refresh for unauthenticated flows like login/register/refresh itself.
    if (skipRefresh) {
      // caller asked to skip refresh for this request
    } else if (pathname.startsWith("/api/auth/")) {
      const noRefreshAuthPaths = [
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/refresh",
        "/api/auth/forgot",
        "/api/auth/reset",
      ];
      const normalized = pathname.replace(/\/+$/, "");
      const shouldSkipRefresh = noRefreshAuthPaths.some((p) => p === normalized);
      if (!shouldSkipRefresh) {
        const refreshUrl = resolveUrl("/api/auth/refresh");
        try {
          await doRefreshIfNeeded(refreshUrl);
          response = await makeRequest();
        } catch (err) {
          // refresh failed — propagate original 401 with info
          let payload = "";
          try {
            payload = await response.text();
          } catch (e) {
            // ignore
          }
          throw new Error(`Network response was not ok (${response.status} ${response.statusText}) when calling ${finalUrl}: ${payload || "(no body)"}`);
        }
      }
    } else {
      const refreshUrl = resolveUrl("/api/auth/refresh");
      try {
        await doRefreshIfNeeded(refreshUrl);
        response = await makeRequest();
      } catch (err) {
        // refresh failed — propagate original 401 with info
        let payload = "";
        try {
          payload = await response.text();
        } catch (e) {
          // ignore
        }
        throw new Error(`Network response was not ok (${response.status} ${response.statusText}) when calling ${finalUrl}: ${payload || "(no body)"}`);
      }
    }
  }

  if (!response.ok) {
    // attempt to parse JSON body if present
    let parsedBody: any = undefined;
    let text = "";
    try {
      text = await response.text();
      if (text) {
        try {
          parsedBody = JSON.parse(text);
        } catch (e) {
          parsedBody = text;
        }
      }
    } catch (e) {
      // ignore
    }

    const err: any = new Error(`Network response was not ok (${response.status} ${response.statusText}) when calling ${finalUrl}`);
    err.status = response.status;
    err.statusText = response.statusText;
    err.url = finalUrl;
    err.body = parsedBody;
    throw err;
  }

  // Try to parse JSON, but handle empty responses
  const text = await response.text();
  if (!text) return ({} as unknown) as TData;

  try {
    return JSON.parse(text) as TData;
  } catch (e) {
    const err: any = new Error(`Failed to parse JSON response from ${finalUrl}: ${(e as Error).message}`);
    err.url = finalUrl;
    throw err;
  }
}

const resolveUrl = (
  url: string,
  queryParams: Record<string, unknown> = {},
  pathParams: Record<string, string> = {}
) => {
  const defaultDevBase = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? defaultDevBase ?? "";

  let query = qs.stringify(queryParams);
  if (query) query = `?${query}`;

  // replace path params like {id}
  const pathResolved = url.replace(/\{\w*\}/g, (key) => pathParams[key.slice(1, -1)]) + query;

  if (!base) return pathResolved;
  const normalizeBase = (b: string) => (b.endsWith("/") ? b.slice(0, -1) : b);
  const normalizedPath = pathResolved.startsWith("/") ? pathResolved : `/${pathResolved}`;
  return `${normalizeBase(base)}${normalizedPath}`;
};
