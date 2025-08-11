import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { request } from "@services/apiService.js";

const DeviceCard = ({ device }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    (id) => request({ method: "DELETE", url: `/api/devices/${id}` }),
    {
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries(["fetchDevices"]);
      },
      onError: (error) => {
        console.error("Error deleting device:", error);
      },
    },
  );

  const handleRemove = (id) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = () => {
    navigate("/devices/editdevice", { state: { device } });
  };

  const formattedCreatedAt = device.created_at
    ? format(new Date(device.created_at), "yyyy/MM/dd HH:mm:ss")
    : "N/A";

  const formattedUpdatedAt = device.updated_at
    ? format(new Date(device.updated_at), "yyyy/MM/dd HH:mm:ss")
    : "N/A";

  return (
    <div
      className="w-4/12 h-auto p-1 font-bold cursor-pointer max-xl:w-1/2 max-lg:w-full "
      onClick={() => navigate("/devices/deviceDetail", { state: { device } })}
    >
      <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white shadow p-3 hover:shadow-xl">
        <div className="flex flex-row justify-start items-center gap-2 text-[1rem]">
          <p className=" text-gray-500">Device Name : </p>
          <p>{device.name || "empty"}</p>
        </div>
        <div className="flex flex-col text-black">
          <p className="text-[0.80rem]">
            <span className="text-gray-500">Brand : </span>
            {device.brand || "---"}
          </p>
          <p className="text-[0.80rem]">
            <span className="text-gray-500">Model : </span>
            {device.model || "---"}
          </p>
          <p className="text-[0.80rem] text-gray-500">
            <span className="text-gray-500">Created at : </span>
            {formattedCreatedAt || "empty"}
          </p>
          <p className="text-[0.80rem] text-gray-500">
            <span className="text-gray-500">Updated at : </span>
            {formattedUpdatedAt || "empty"}
          </p>
        </div>
        <div className="w-full h-auto flex flex-row gap-2 pt-2">
          <Button
            className="w-full font-Quicksand font-medium !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500 max-sm:!px-3"
            variant="solid"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/devices/${device.uuid}/registers`);
            }}
          >
            Registers
          </Button>
          <Button
            type="primary"
            className="w-full font-Quicksand font-medium !bg-blue-200 !p-5 !shadow !text-[#3b82f6] !text-[0.90rem] !border-[2.5px] !border-blue-500 max-sm:!px-3"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
          >
            <EditOutlined style={{ fontSize: "18px" }} />
            Edit
          </Button>
          <Button
            className="w-full font-Quicksand font-medium !bg-red-200 !p-5 !shadow !text-[#ef4444] !text-[0.90rem] !border-[2.5px] !border-red-500 max-sm:!px-3"
            color="danger"
            variant="solid"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(device.uuid);
            }}
            loading={deleteMutation.isLoading}
          >
            <DeleteOutlined style={{ fontSize: "18px" }} />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
