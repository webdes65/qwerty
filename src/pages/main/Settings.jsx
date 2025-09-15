import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import { setRealtimeService } from "@redux_toolkit/features/realtimeServiceSlice.js";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

const Settings = () => {
  const dispatch = useDispatch();
  const realtimeService = useSelector((state) => state.realtimeService);
  const userId = localStorage.getItem("user_id");

  const handleChange = (event) => {
    const value = event.target.value;
    mutation.mutate(value);
  };

  const mutation = useMutation(
    (data) =>
      request({
        method: "POST",
        url: `/api/users/${userId}/service`,
        data: { service: data },
      }),
    {
      onSuccess: (data) => {
        dispatch(setRealtimeService(data.data));
      },
      onError: (error) => {
        logger.error(error);
      },
    },
  );

  return (
    <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white shadow p-5 cursor-default">
      <div className="w-full flex flex-col justify-center items-start gap-5">
        <p className="font-semibold">Select the type of service :</p>
        <div className="flex flex-row justify-start items-start gap-2 text-[0.90rem]">
          <label
            className={`w-20 flex items-center gap-2 cursor-pointer p-2 rounded-md border-2 
        ${realtimeService === "echo" ? "border-blue-500" : "border-gray-300"}`}
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
                    : "border-gray-300"
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

export default Settings;
