import { useMutation, useQueryClient } from "react-query";
import { request } from "@services/apiService.js";
import { message } from "antd";
import logger from "@utils/logger.js";

export default function EditDeviceHandlers({ id, setIsEditable }) {
  const queryClient = useQueryClient();

  const updateDeviceMutation = useMutation(
    (values) =>
      request({
        method: "PATCH",
        url: `/api/devices/${id}`,
        data: values,
      }),
    {
      onSuccess: () => {
        message.success("Device updated successfully!");
        setIsEditable(false);
        queryClient.invalidateQueries(["device", id]);
      },
      onError: (error) => {
        message.error("Failed to update device!");
        logger.error("Update error:", error);
      },
    },
  );

  const onSubmit = (values) => {
    logger.error("Submitting values:", values);
    updateDeviceMutation.mutate(values);
  };

  return { updateDeviceMutation, onSubmit };
}
