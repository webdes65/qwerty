const DEBUG_MODE =
  import.meta.env.MODE === "development" ||
  import.meta.env.VITE_DEBUG_LOGS === "true";

const logger = {
  log: (...args) => {
    if (DEBUG_MODE) {
      console.log(...args);
    }
  },

  error: (...args) => {
    if (DEBUG_MODE) {
      console.error(...args);
    }
  },

  warn: (...args) => {
    if (DEBUG_MODE) {
      console.warn(...args);
    }
  },

  info: (...args) => {
    if (DEBUG_MODE) {
      console.info(...args);
    }
  },

  forceError: (...args) => {
    console.error(...args);
  },

  debugStatus: () => {
    console.log("Debug Mode:", DEBUG_MODE);
    console.log("Environment Mode:", import.meta.env.MODE);
    console.log("VITE_DEBUG_LOGS:", import.meta.env.VITE_DEBUG_LOGS);
  },
};

export default logger;
