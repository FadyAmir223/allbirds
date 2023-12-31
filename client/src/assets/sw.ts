import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute } from 'workbox-precaching'
import { imageCache, pageCache, staticResourceCache } from 'workbox-recipes'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)

staticResourceCache()

pageCache()

imageCache()

registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxAgeSeconds: 14 * 24 * 60 * 60 }),
    ],
  }),
)

registerRoute(
  ({ url }) => url.origin === 'https://allbirds-server.vercel.app',
  new NetworkFirst({ cacheName: 'api-response', networkTimeoutSeconds: 3 }),
)
