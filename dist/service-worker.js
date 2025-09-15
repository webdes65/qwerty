// cache the original app resources on the first installation
// cache the original app resources without requiring the application to be installed
// runs when the service worker is first installed or updated

import logger from "@utils/logger.js";

self.addEventListener("install", (event) => {
  event.waitUntil(
    fetch("/asset-manifest.json")
      .then((response) => {
        if (!response.ok)
          throw new Error("SW - Failed to fetch assets-manifest.json.");
        return response.json();
      })
      .then((manifest) => {
        const files = Object.values(manifest.files).filter(Boolean);
        const urlsToCache = ["/", ...files];
        return caches
          .open("my-cache")
          .then((cache) => cache.addAll(urlsToCache));
      })
      .then(() => {
        // logger.log("SW - Cache the original app resources!");
        // logger.log("SW - Activating the service worker.");
        self.skipWaiting();
      })
      .catch((error) => {
        logger.error("SW - Error cache the original app resources.", error);
      }),
  );
});

// activating the new service worker by receiving a message with the type SKIP_WAITING, and then reloading the page

self.addEventListener("message", (event) => {
  const { type } = event.data || {};
  if (type === "SKIP_WAITING") {
    self.skipWaiting();
    // logger.log("SW - Activating the service worker.");
  }
});
