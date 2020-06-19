import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { StaleWhileRevalidate } from "workbox-strategies/StaleWhileRevalidate";
import { ExpirationPlugin } from "workbox-expiration";
import { NetworkFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import appConfig from "./../config/app";
import api from './api'

export default function() {
    // images
    registerRoute(
        ({ request }) => {
            // console.log({ request });
            return (
                request.destination === "image" ||
                request.destination === "webp" ||
                request.destination === "x-icon"
            );
        },
        new CacheFirst({
            cacheName: "images",
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
                })
            ]
        })
    );

    // Caching HTML, CSS and JS
    registerRoute(
        ({ request }) => {
            const typeToCache = ["script", "style", "document"];
            return typeToCache.includes(request.destination);
        },
        new NetworkFirst({
            cacheName: "static-resources",
            plugins: [
                new ExpirationPlugin({
                    maxEntries: appConfig.static.maxEntriesLimit,
                    maxAgeSeconds: appConfig.static.maxAgeSeconds
                })
            ]
        })
    );

    api();

}
