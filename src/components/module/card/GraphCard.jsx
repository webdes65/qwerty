import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { request } from "@services/apiService.js";
import { formatTimestamps } from "@utils/formatDate.js";
import logger from "@utils/logger.js";
import DeleteModal from "@module/modal/DeleteModal.jsx";

const GraphCard = ({ data }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(data);

  const deleteMutation = useMutation(
    (id) => request({ method: "DELETE", url: `/api/templates/${id}` }),
    {
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries(["fetchGraphs"]);
      },
      onError: (error) => {
        logger.error(error);
      },
    },
  );

  const handleRemove = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <>
      <div
        className="w-4/12 h-auto p-1 font-bold cursor-pointer max-xl:w-1/2 max-lg:w-full"
        onClick={() => navigate(`/graphs/${data.uuid}`)}
      >
        <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white shadow p-3 hover:shadow-xl">
          <div className="flex flex-row justify-start items-center gap-2 text-[1rem]">
            <p className="text-gray-500">Name : </p>
            <p>{data.title || "empty"}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-[0.80rem]">
              <span className="text-gray-500">Columns : </span>
              {data.columns || "---"}
            </p>
            <p className="text-[0.80rem]">
              <span className="text-gray-500">Rows : </span>
              {data.rows || "---"}
            </p>
            <p className="text-[0.80rem] text-gray-500">
              <span>Created at : </span>
              {formattedCreatedAt || "empty"}
            </p>
            <p className="text-[0.80rem] text-gray-500">
              <span>Updated at : </span>
              {formattedUpdatedAt || "empty"}
            </p>
          </div>
          <div className="w-full h-auto flex flex-row  gap-2 pt-2">
            <Button
              className="w-full font-Quicksand font-medium !bg-red-200 !p-5 !shadow !text-[#ef4444] !text-[0.90rem] !border-[2.5px] !border-red-500"
              color="danger"
              variant="solid"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
            >
              <DeleteOutlined
                style={{
                  fontSize: "18px",
                  color: "ef4444 ",
                  marginLeft: "5px",
                }}
              />
              Remove
            </Button>
          </div>
        </div>
      </div>
      <DeleteModal
        title="Are you sure you want to delete this item?"
        isOpenModal={isDeleteModalOpen}
        setIsOpenModal={setIsDeleteModalOpen}
        onDelete={() => handleRemove(data.uuid)}
        loading={deleteMutation.isLoading}
      />
    </>
  );
};

export default GraphCard;
