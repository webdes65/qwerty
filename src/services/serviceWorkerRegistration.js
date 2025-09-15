import { CURRENT_VERSION } from "@version";
import logger from "@utils/logger.js";

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
    ),
);

export function register(config) {
  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    // if ("serviceWorker" in navigator) {
    const publicUrl = new URL(import.meta.env.BASE_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${import.meta.env.BASE_URL}/service-worker.js`;

      // if it is in a local environment (localhost), the validity of the service worker is first checked.
      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);

        navigator.serviceWorker.ready.then(() => {
          logger.log(
            "This web app has cached essential resources using a service worker.",
          );
        });
      } else {
        // if it is in the production environment, the service is registered directly.
        registerValidSW(swUrl, config);
      }
    });
  }
}

// registering and Managing New Versions of Service Worker

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      let installedVersion = localStorage.getItem("app_version");

      if (!installedVersion) {
        logger.log(
          "SW - No version of the app was found, so the app is not installed.",
        );
        return;
      }

      const currentVersion = CURRENT_VERSION;

      /*logger.log("SW - Installed version", installedVersion);
        logger.log("SW - Current version", currentVersion);*/

      if (installedVersion !== currentVersion) {
        logger.log(
          "SW - A new version is available and The installed version is outdated.",
        );

        // update the Worker Service

        registration.update().then(() => {
          localStorage.setItem("app_version", currentVersion);
          logger.log(
            "SW - The old cache has been cleared and the new cache has been created.",
          );

          // activate the Worker Service

          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        });
      } else {
        logger.log("SW - The application is up to date.");
      }
      // reload the page when a new version becomes active.
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    })
    .catch((error) => {
      logger.error("SW - Error service worker registration", error);
    });
}

// service worker validation
function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      logger.log(
        "No internet connection found. App is running in offline mode.",
      );
    });
}

// unregister Service Worker

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister().then(() => {
          logger.log("SW - Service Worker has been unregistered.");
        });
      })
      .catch((error) => {
        logger.error("SW - Error unregistering Service Worker", error.message);
      });
  } else {
    logger.log("SW - Service Worker is not supported.");
  }
}

// register Service Worker
// this function is implemented in both development and production environments
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => {
        // logger.log("SW - Service Worker registered with scope");
      })
      .catch((error) => {
        logger.error("SW - Service Worker registration failed", error);
      });
  }
}
