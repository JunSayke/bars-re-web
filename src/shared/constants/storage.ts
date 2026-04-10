export const ACCOUNT_STORAGE_LIMIT_BYTES = 100 * 1024 * 1024

export function formatMegabytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
