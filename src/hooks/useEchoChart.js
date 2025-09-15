import { useEffect } from "react";
import echo from "@config/echo";
import logger from "@utils/logger.js";

const useEchoChart = (
  setRegisters,
  allowedIds = [],
  isLiveUpdate,
  realtimeService,
) => {
  useEffect(() => {
    if (realtimeService !== "echo") return;
    if (!(allowedIds.length > 0 && isLiveUpdate)) {
      return;
    }

    allowedIds.forEach((id) => {
      echo.leave(`register.${id}`);
    });

    const initializeEcho = () => {
      allowedIds.forEach((id) => {
        echo
          .private(`register.${id}`)
          .listen("RegisterEvent", (data) => {
            setRegisters((registers) => [...registers, data]);
          })
          // .subscribed(() =>
          // logger.log(`Successfully subscribed to register ${id}`)
          // )
          .error((error) => logger.warn(error));
      });
    };

    initializeEcho();

    return () => {
      allowedIds.forEach((id) => {
        echo.leave(`register.${id}`);
      });
    };
  }, [allowedIds, setRegisters, isLiveUpdate, realtimeService]);
};

export default useEchoChart;
