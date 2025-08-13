import { useLocation } from "react-router-dom";
import { formatTimestamps } from "@utils/formatDate.js";

const DeviceDetail = () => {
  const location = useLocation();
  const { device } = location.state || {};

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(device);

  return (
    <div className="flex flex-col justify-start items-start gap-2 shadow rounded-lg bg-white p-5 cursor-default font-bold">
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Name : </p>
        <p> {device.name}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Brand : </p>
        <p> {device.brand || "empty"}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Model : </p>
        <p> {device.model || "empty"}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Description : </p>
        <p> {device.description || "empty"}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">MQTT Topic : </p>
        <p> {device.mqtt_topic || "empty"}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">WiFi : </p>
        <p> {device.wifi || "empty"}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">LAN : </p>
        <p> {device.lan || "empty"}</p>
      </div>

      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Created at : </p>
        <p> {formattedCreatedAt || "empty"}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Updated at : </p>
        <p> {formattedUpdatedAt || "empty"}</p>
      </div>

      <div className="w-full h-auto flex flex-col justify-center items-start gap-2">
        {device.patterns.length !== 0 && (
          <p className="text-[0.90rem] text-gray-500">Patterns : </p>
        )}

        {device.patterns.length === 0 ? (
          <div className="flex flex-row justify-center items-center gap-2">
            <p className="text-[0.90rem] text-gray-500">Patterns : </p>
            <p>empty</p>
          </div>
        ) : (
          device.patterns.map((index, i) => {
            return (
              <div
                key={i}
                className={`w-full h-auto flex flex-row justify-between items-center p-2 rounded-lg border-2 border-gray-300 max-lg:flex-col max-lg:items-start max-lg:w-auto ${
                  i % 2 === 0 ? "bg-gray-100" : "bg-gray-100"
                }`}
              >
                <div className="flex flex-row justify-center items-center gap-2">
                  <p className="text-[0.90rem] text-gray-500">Type : </p>
                  <p> {index.type || "empty"}</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                  <p className="text-[0.90rem] text-gray-500">Setter : </p>
                  <p> {index.setter || "empty"}</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                  <p className="text-[0.90rem] text-gray-500">Separator : </p>
                  <p> {index.separator || "empty"}</p>
                </div>

                <div className="flex flex-row justify-center items-center gap-2">
                  <p className="text-[0.90rem] text-gray-500">Connector : </p>
                  <p> {index.connector || "empty"}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DeviceDetail;
