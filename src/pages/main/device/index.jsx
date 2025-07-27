import { request } from "../../../services/apiService";
import { useQuery } from "react-query";
import DeviceCard from "../../../components/module/card/DeviceCard";
import { Button } from "antd";
import { useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddDeviceModal from "../../../components/module/modal/AddDeviceModal";
import ARProjectSubprojectSkeleton from "../../../components/module/card/ARProjectSubprojectSkeleton";

const Devices = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery(["fetchDevices"], () =>
    request({
      method: "GET",
      url: "/api/devices",
    })
  );

  if (error) {
    console.error(error);
    return <div>{error.message}</div>;
  }

  const devices = data?.data || [];

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins pt-2 pr-2">
      <div className="w-full h-auto flex flex-row justify-end items-center">
        <Button
          type="primary"
          className="font-Quicksand font-bold !bg-blue-200 !py-5 !px-6 !shadow !text-[#3b82f6] !text-[0.90rem] !border-[2.5px] !border-blue-500"
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
