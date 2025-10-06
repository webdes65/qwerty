import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Cookies from "universal-cookie";
import { request } from "@services/apiService.js";
import { generateCypherKey } from "@utils/generateCypherKey.js";
import { formatTimestamps } from "@utils/formatDate.js";
import logger from "@utils/logger.js";
import DeleteModal from "@module/modal/DeleteModal.jsx";

const SubprojectCard = ({ data, idProject }) => {
  const queryClient = useQueryClient();
  const cookies = new Cookies();
  const [scanLoading, setScanLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
        logger.error(error);
      },
    },
  );

  const handleRemove = (id) => {
    deleteMutation.mutate(id);
  };

  const handleScan = async () => {
    if (!data?.token || !data?.uuid) {
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

    // const baseURL = `${process.env.REACT_APP_BASE_URL}/projects/${idProject}/subs/${data.uuid}/ScanAPI`;

    const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

    // const baseURL = `http://192.168.100.135:8000/SubProjects/${data.uuid}/ScanAPI`;
    // const baseURL = `${BASE_URL}/subs/${data.uuid}/scan`;
    const baseURL = `${BASE_URL}/projects/${idProject}/subs/${data.uuid}/scan`;

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
        logger.error("Error: ", error);
        toast.error("خطا در عملیات اسکن");
      })
      .finally(() => {
        setScanLoading(false);
      });
  };

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(data);

  return (
    <div className="w-4/12 h-auto p-1 font-bold cursor-pointer max-xl:w-1/2 max-lg:w-full max-md:w-1/2 max-sm:w-full">
      <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white text-dark-100 dark:bg-gray-100 dark:text-white shadow p-3 hover:shadow-xl">
        <div className="flex flex-row justify-start items-center gap-2 text-[1rem]">
          <p className="text-dark-100 dark:text-white">Name : </p>
          <p>{data.name || "empty"}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[0.80rem] text-dark-100 dark:text-white">
            <span>Created at : </span>
            {formattedCreatedAt || "empty"}
          </p>
          <p className="text-[0.80rem] text-dark-100 dark:text-white">
            <span>Updated at : </span>
            {formattedUpdatedAt || "empty"}
          </p>
        </div>
        <div className="w-full h-auto flex flex-row gap-2 pt-2">
          <Button
            type="primary"
            className="w-1/2 font-Quicksand font-medium !bg-blue-200 dark:!bg-blue-300 !p-5 !shadow !text-[#3b82f6] dark:!text-blue-600 !text-[0.90rem] !border-[2.5px] !border-blue-500 dark:!border-blue-600"
            onClick={handleScan}
            loading={scanLoading}
          >
            Scan
          </Button>
          <Button
            className="w-1/2 font-Quicksand font-medium !bg-red-200 dark:!bg-red-300 !p-5 !shadow !text-[#ef4444] dark:!text-red-600 !text-[0.90rem] !border-[2.5px] !border-red-500 dark:!border-red-600"
            color="danger"
            variant="solid"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
          >
            <DeleteOutlined style={{ fontSize: "18px" }} />
            Remove
          </Button>
        </div>
      </div>
      <DeleteModal
        title="Are you sure you want to delete this item?"
        isOpenModal={isDeleteModalOpen}
        setIsOpenModal={setIsDeleteModalOpen}
        onDelete={() => handleRemove(data.uuid)}
        loading={deleteMutation.isLoading}
      />
    </div>
  );
};

export default SubprojectCard;
