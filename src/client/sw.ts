// The service worker (SPC-0010, REQ-6506). It caches code, the language file
// and pictures, and nothing else: no `/api` reply, so no answer, packet or
// explanation ever sits in a cache, and no sound file until ADR-0320's epic
// lets a channel be switched on. A copy is kept as each file is fetched, and
// the network is asked first, so a changed file always wins.

interface FetchEventLike {
  request: { method: string; url: string };
  respondWith(response: Promise<Response>): void;
}

interface WorkerScope {
  addEventListener(type: string, handler: (event: never) => void): void;
  skipWaiting(): Promise<void>;
  clients: { claim(): Promise<void> };
  location: { origin: string };
}

const scope = self as unknown as WorkerScope;
const CACHE = "meowtower-assets-v1";

const CODE =
  /^\/(?:client\/[a-z-]+\.js|i18n\/[a-z]+\.json|manifest\.webmanifest)?$/;
const PICTURE = /\.(?:png|jpe?g|webp|gif|svg|avif)$/;

/** True for a path whose copy this worker may keep. */
export const cacheable = (path: string): boolean =>
  CODE.test(path) || PICTURE.test(path);

scope.addEventListener("install", ((event: {
  waitUntil(p: Promise<void>): void;
}) => {
  event.waitUntil(scope.skipWaiting());
}) as (event: never) => void);

scope.addEventListener("activate", ((event: {
  waitUntil(p: Promise<void>): void;
}) => {
  event.waitUntil(scope.clients.claim());
}) as (event: never) => void);

scope.addEventListener("fetch", ((event: FetchEventLike) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== scope.location.origin || !cacheable(url.pathname)) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const fresh = await fetch(event.request as unknown as Request);
        if (fresh.ok) await cache.put(url.pathname, fresh.clone());
        return fresh;
      } catch {
        const kept = await cache.match(url.pathname);
        if (kept) return kept;
        throw new Error("offline_and_not_cached");
      }
    })(),
  );
}) as (event: never) => void);
