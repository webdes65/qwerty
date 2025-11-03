import { useState } from "react";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import DeviceCard from "@components/module/card/DeviceCard";
import AddDeviceModal from "@components/module/modal/AddDeviceModal";
import ARProjectSubprojectSkeleton from "@components/module/card/ARProjectSubprojectSkeleton";
import DeviceIndexHandler from "@module/container/main/device/DeviceIndexHandler.js";
import logger from "@utils/logger.js";

const Devices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { devices, isLoading, error } = DeviceIndexHandler();

  if (error) {
    logger.error(error);
    return <div>{error.message}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins pt-2 pr-2 bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
      <div className="w-full h-auto flex flex-row justify-end items-center">
        <Button
          type="primary"
          className="font-Quicksand font-bold !bg-blue-200 dark:!bg-blue-300 !py-5 !px-6 !shadow !text-[#3b82f6] dark:!text-blue-600 !text-[0.90rem] !border-[2.5px] !border-blue-500 dark:!border-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleOutlined style={{ fontSize: "20px", color: "#3b82f6 " }} />
          Add Device
        </Button>
      </div>

      <ul className="w-full flex flex-row justify-start items-center flex-wrap">
        {isLoading ? (
          <>
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
          </>
        ) : (
          devices.map((device) => (
            <DeviceCard key={device.uuid} device={device} />
          ))
        )}
      </ul>
      <AddDeviceModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default Devices;
