import qs from "qs";
import { BarsApiContext } from "./barsApiContext";

export type BarsApiFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> =
  {
    url: string;
    method: string;
    body?: TBody;
    headers?: THeaders;
    queryParams?: TQueryParams;
    pathParams?: TPathParams;
  } & BarsApiContext["fetcherOptions"];

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
}: BarsApiFetcherOptions<
  TBody,
  THeaders,
  TQueryParams,
  TPathParams
>): Promise<TData> {
  const finalUrl = resolveUrl(url, queryParams, pathParams);
  const response = await window.fetch(finalUrl, {
    method: method.toUpperCase(),
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    let payload = "";
    try {
      payload = await response.text();
    } catch (e) {
      // ignore
    }
    throw new Error(`Network response was not ok (${response.status} ${response.statusText}) when calling ${finalUrl}: ${payload || "(no body)"}`);
  }

  return await response.json();
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
