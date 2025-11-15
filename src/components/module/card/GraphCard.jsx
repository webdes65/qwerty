import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { formatTimestamps } from "@utils/formatDate.js";
import DeleteModal from "@module/modal/DeleteModal.jsx";
import DeleteHandler from "@module/container/main/delete/DeleteHandler.js";
import "@styles/formAndComponentStyles.css";

const GraphCard = ({ data }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { deleteMutation, handleRemove } = DeleteHandler({
    url: "/api/templates/",
    queryKey: "fetchGraphs",
    setSubmitLoading,
  });

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(data);

  return (
    <>
      <div
        className="w-4/12 h-auto p-1 font-bold cursor-pointer max-xl:w-1/2 max-lg:w-full"
        onClick={() => navigate(`/graphs/${data.uuid}`)}
      >
        <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white text-dark-100 dark:bg-gray-100 dark:text-white shadow p-3 hover:shadow-xl">
          <div className="flex flex-row justify-start items-center gap-2 text-[1rem]">
            <p className="text-dark-100 dark:text-white">Name : </p>
            <p>{data.title || "empty"}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-[0.80rem]">
              <span className="text-dark-100 dark:text-white">Columns : </span>
              {data.columns || "---"}
            </p>
            <p className="text-[0.80rem]">
              <span className="text-dark-100 dark:text-white">Rows : </span>
              {data.rows || "---"}
            </p>
            <p className="text-[0.80rem] text-dark-100 dark:text-white">
              <span>Created at : </span>
              {formattedCreatedAt || "empty"}
            </p>
            <p className="text-[0.80rem] text-dark-100 dark:text-white">
              <span>Updated at : </span>
              {formattedUpdatedAt || "empty"}
            </p>
          </div>
          <div className="w-full h-auto flex flex-row  gap-2 pt-2">
            <Button
              className="w-full dark:!bg-red-300 dark:!text-red-600 dark:!border-red-600 dragButtonSecondaryStyle"
              color="danger"
              variant="solid"
              loading={submitLoading}
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
