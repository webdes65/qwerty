import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function DeviceIndexHandler() {
  const { data, isLoading, error } = useQuery(["fetchDevices"], () =>
    request({
      method: "GET",
      url: "/api/devices",
    }),
  );

  const devices = data?.data || [];

  return { devices, error, isLoading };
}
