import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import RegisterCard from "@components/module/card/RegisterCard";
import { request } from "@services/apiService.js";

const Registers = () => {
  const { deviceId } = useParams();

  const { data: dataRegisters, isLoading: loadingRegisters } = useQuery(
    ["registersList", deviceId],
    () =>
      request({
        method: "GET",
        url: `/api/devices/${deviceId}/registers`,
      }),
  );

  if (loadingRegisters) {
    return (
      <div className="w-full h-full flex flex-row justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto">
      {loadingRegisters ? (
        <div className="w-full h-full flex flex-row justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="w-full h-full flex flex-row justify-start items-start flex-wrap overflow-auto">
          {dataRegisters?.data?.length > 0 ? (
            dataRegisters.data.map((data, index) => (
              <RegisterCard key={index} data={data} />
            ))
          ) : (
            <div className="w-full flex justify-center items-center">
              <p>No registers found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Registers;
