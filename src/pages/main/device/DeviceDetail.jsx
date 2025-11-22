import { useLocation } from "react-router-dom";
import { formatTimestamps } from "@utils/formatDate.js";
import InfoCard from "@module/card/InfoCard.jsx";
import { FaClock, FaUserCircle } from "react-icons/fa";
import {
  MdOutlineBrandingWatermark,
  MdOutlineDescription,
  MdOutlineDevices,
  MdOutlineLan,
  MdOutlineModelTraining,
  MdOutlineTopic,
  MdOutlineWifi,
} from "react-icons/md";

const DeviceDetail = () => {
  const location = useLocation();
  const { device } = location.state || {};

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(device);

  return (
    <div className="flex flex-col gap-2 h-auto 2xl:h-full shadow bg-white text-dark-100 dark:bg-gray-100 dark:text-white px-5 cursor-default font-bold">
      <div className="mb-6 w-full">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
          <FaUserCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Device Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard icon={MdOutlineDevices} label="Name:" value={device.name} />
          <InfoCard
            icon={MdOutlineBrandingWatermark}
            label="Brand:"
            value={device.brand || "empty"}
          />
          <InfoCard
            icon={MdOutlineModelTraining}
            label="Model:"
            value={device.model || "empty"}
          />
          <InfoCard
            icon={MdOutlineDescription}
            label="Description:"
            value={device.description || "empty"}
          />
          <InfoCard
            icon={MdOutlineTopic}
            label="MQTT Topic"
            value={device.mqtt_topic || "empty"}
          />
          <InfoCard
            icon={MdOutlineWifi}
            label="WiFi:  "
            value={device.wifi || "empty"}
          />
          <InfoCard
            icon={MdOutlineLan}
            label="LAN:"
            value={device.lan || "empty"}
          />
        </div>
      </div>

      <div className="mt-8 lg:mt-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
          <FaClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          System Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={FaClock}
            label="Created At:"
            value={formattedCreatedAt}
          />
          <InfoCard
            icon={FaClock}
            label="Updated At:"
            value={formattedUpdatedAt}
          />
        </div>
      </div>

      <div className="w-full h-auto flex flex-col justify-center items-start gap-2">
        {device.patterns.length !== 0 && (
          <p className="text-[0.90rem] text-dark-100 dark:text-white">
            Patterns :{" "}
          </p>
        )}

        {device.patterns.length === 0 ? (
          <InfoCard icon={FaClock} label="Patterns:" value="empty" />
        ) : (
          device.patterns.map((index, i) => {
            return (
              <div
                key={i}
                className={`w-full h-auto flex flex-row justify-between items-center p-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 max-lg:flex-col max-lg:items-start max-lg:w-auto `}
              >
                <div className="flex flex-row justify-center items-center gap-2">
                  <p className="text-[0.90rem] text-dark-100 dark:text-white">
                    Type :{" "}
                  </p>
                  <p> {index.type || "empty"}</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                  <p className="text-[0.90rem] text-dark-100 dark:text-white">
                    Setter :{" "}
                  </p>
                  <p> {index.setter || "empty"}</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                  <p className="text-[0.90rem] text-dark-100 dark:text-white">
                    Separator :{" "}
                  </p>
                  <p> {index.separator || "empty"}</p>
                </div>

                <div className="flex flex-row justify-center items-center gap-2">
                  <p className="text-[0.90rem] text-dark-100 dark:text-white">
                    Connector :{" "}
                  </p>
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
