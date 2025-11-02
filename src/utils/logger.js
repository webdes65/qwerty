const DEBUG_MODE =
  import.meta.env.MODE === "development" ||
  import.meta.env.VITE_DEBUG_LOGS === "true";

const nativeConsole = console;

const logger = {
  log: (...args) => {
    if (DEBUG_MODE) {
      nativeConsole.log(...args);
    }
  },

  error: (...args) => {
    if (DEBUG_MODE) {
      nativeConsole.error(...args);
    }
  },

  warn: (...args) => {
    if (DEBUG_MODE) {
      nativeConsole.warn(...args);
    }
  },

  info: (...args) => {
    if (DEBUG_MODE) {
      nativeConsole.info(...args);
    }
  },

  forceError: (...args) => {
    nativeConsole.error(...args);
  },

  debugStatus: () => {
    nativeConsole.log("Debug Mode:", DEBUG_MODE);
    nativeConsole.log("Environment Mode:", import.meta.env.MODE);
    nativeConsole.log("VITE_DEBUG_LOGS:", import.meta.env.VITE_DEBUG_LOGS);
  },
};

export default logger;
