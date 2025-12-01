import { useSelector } from "react-redux";
import SettingHandler from "@module/container/main/setting/SettingHandler.js";

const Setting = () => {
  const realtimeService = useSelector((state) => state.realtimeService);

  const { handleChange } = SettingHandler();

  return (
    <div className="h-full w-full flex flex-col gap-2 bg-white text-dark-100 dark:bg-gray-100 dark:text-white shadow p-5 cursor-default">
      <div className="w-full flex flex-col justify-center items-start gap-5">
        <p className="font-semibold">Select the type of service :</p>
        <div className="flex flex-row justify-start items-start gap-2 text-[0.90rem]">
          <label
            className={`w-20 flex items-center gap-2 cursor-pointer p-2 rounded-md border-2 
        ${realtimeService === "echo" ? "border-blue-500 " : "border-gray-300 dark:border-gray-600"}`}
          >
            <input
              type="radio"
              value="echo"
              checked={realtimeService === "echo"}
              onChange={handleChange}
            />
            Echo
          </label>
          <label
            className={`w-20 flex items-center gap-2 cursor-pointer p-2 rounded-md border-2 
                ${
                  realtimeService === "mqtt"
                    ? "border-blue-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
          >
            <input
              type="radio"
              value="mqtt"
              checked={realtimeService === "mqtt"}
              onChange={handleChange}
            />
            MQTT
          </label>
        </div>
      </div>
    </div>
  );
};

export default Setting;
