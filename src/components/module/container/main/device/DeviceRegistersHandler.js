import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function DeviceRegistersHandler({ deviceId }) {
  const { data: dataRegisters, isLoading: loadingRegisters } = useQuery(
    ["registersList", deviceId],
    () =>
      request({
        method: "GET",
        url: `/api/devices/${deviceId}/registers`,
      }),
  );

  return { dataRegisters, loadingRegisters };
}
