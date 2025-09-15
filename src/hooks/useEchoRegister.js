import { useEffect } from "react";
import echo from "@config/echo";
import logger from "@utils/logger.js";

const useEchoRegister = (setRegisters, allowedIds, realtimeService) => {
  useEffect(() => {
    if (realtimeService !== "echo" || !allowedIds) return;
    const initializeEcho = () => {
      echo
        .private(`register.${allowedIds}`)
        .listen("RegisterEvent", (data) => {
          setRegisters((prevTemps) => {
            const existingTemp = prevTemps.find((temp) => temp.id === data.id);

            if (!existingTemp) {
              return [
                ...prevTemps,
                {
                  id: data.id,
                  label: data.label,
                  value: data.value,
                  type: data.type,
                },
              ];
            }

            if (existingTemp.value !== data.value) {
              const updatedTemps = prevTemps.filter(
                (temp) => temp.id !== data.id,
              );
              return [
                ...updatedTemps,
                {
                  id: data.id,
                  label: data.label,
                  value: data.value,
                  type: data.type,
                },
              ];
            }

            return prevTemps;
          });
        })
        // .subscribed(() =>
        //   logger.log("Successfully subscribed to register channel")
        // )
        .error((error) => logger.error(error));
    };

    initializeEcho();

    return () => {
      echo.leave("secure-broadcast-channel");
    };
  }, [setRegisters, allowedIds, realtimeService]);
};

export default useEchoRegister;
