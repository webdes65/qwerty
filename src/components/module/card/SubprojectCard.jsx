import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import Cookies from "universal-cookie";
import { request } from "@services/apiService.js";
import { generateCypherKey } from "@utils/generateCypherKey.js";

const SubprojectCard = ({ data, idProject }) => {
  const queryClient = useQueryClient();
  const cookies = new Cookies();

  const deleteMutation = useMutation(
    (id) =>
      request({
        method: "DELETE",
        url: `/api/projects/${idProject}/subs/${id}`,
      }),
    {
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries("subsList");
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );

  const [subProjectId, setSubProjectId] = useState(data.uuid);
  const [scanLoading, setScanLoading] = useState(false);

  const handleRemove = (id) => {
    deleteMutation.mutate(id);
  };

  const handleScan = async () => {
    if (!data?.token || !data?.uuid || !subProjectId) {
      toast.error("Token یا User ID موجود نیست!");
      return;
    }

    const payload = {
      token: data.token,
      user: data.uuid,
      url: "/SubProject",
    };

    const token = cookies.get("bms_access_token");
    if (!token) return;

    const cypherKey = await generateCypherKey();

    // const baseURL = `${process.env.REACT_APP_BASE_URL}/projects/${idProject}/subs/${subProjectId}/ScanAPI`;

    // const baseURL = `http://192.168.100.135:8000/SubProjects/${subProjectId}/ScanAPI`;
    const baseURL = `https://bms.behinstart.ir/SubProjects/${subProjectId}/ScanAPI`;

    setScanLoading(true);

    axios
      .post(baseURL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          cypherKey,
        },
      })

      .then((response) => {
        window.location.href = response.data.data;
      })

      .catch((error) => {
        console.error("Error: ", error);
        toast.error("خطا در عملیات اسکن");
      })
      .finally(() => {
        setScanLoading(false);
      });
  };

  const formattedCreatedAt = data.created_at
    ? format(new Date(data.created_at), "yyyy/MM/dd HH:mm:ss")
    : "N/A";

  const formattedUpdatedAt = data.updated_at
    ? format(new Date(data.updated_at), "yyyy/MM/dd HH:mm:ss")
    : "N/A";

  return (
    <div className="w-4/12 h-auto p-1 font-bold cursor-pointer max-xl:w-1/2 max-lg:w-full max-md:w-1/2 max-sm:w-full">
      <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white shadow p-3 hover:shadow-xl">
        <div className="flex flex-row justify-start items-center gap-2 text-[1rem]">
          <p className="text-gray-500">Name : </p>
          <p>{data.name || "empty"}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[0.80rem] text-gray-500">
            <span>Created at : </span>
            {formattedCreatedAt || "empty"}
          </p>
          <p className="text-[0.80rem] text-gray-500">
            <span>Updated at : </span>
            {formattedUpdatedAt || "empty"}
          </p>
        </div>
        <div className="w-full h-auto flex flex-row gap-2 pt-2">
          <Button
            type="primary"
            className="w-1/2 font-Quicksand font-medium !bg-blue-200 !p-5 !shadow !text-[#3b82f6] !text-[0.90rem] !border-[2.5px] !border-blue-500"
            onClick={handleScan}
            loading={scanLoading}
          >
            Scan
          </Button>
          <Button
            className="w-1/2 font-Quicksand font-medium !bg-red-200 !p-5 !shadow !text-[#ef4444] !text-[0.90rem] !border-[2.5px] !border-red-500"
            color="danger"
            variant="solid"
            onClick={() => handleRemove(data.uuid)}
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

export default SubprojectCard;
