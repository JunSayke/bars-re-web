export async function startMocking() {
  if (typeof window === "undefined") return
  const { worker } = await import("./browser")
  await worker.start({ onUnhandledRequest: "warn" })
}
