import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { formatTimestamps } from "@utils/formatDate.js";
import DeleteModal from "@module/modal/DeleteModal.jsx";
import DeleteHandler from "@module/container/main/delete/DeleteHandler.js";
import "@styles/allRepeatStyles.css";

const ProjectCard = ({ index }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { deleteMutation, handleRemove } = DeleteHandler({
    url: "/api/projects/",
    queryKey: "getProject",
    setSubmitLoading,
  });

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(index);

  return (
    <>
      <div
        className="w-4/12 h-auto p-1 font-bold cursor-pointer max-xl:w-1/2 max-lg:w-full max-md:w-1/2 max-sm:w-full"
        onClick={() => navigate("/ProjectDetails", { state: { data: index } })}
      >
        <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white text-dark-100 dark:bg-gray-100 dark:text-white shadow p-3 hover:shadow-xl">
          <div className="flex flex-row justify-start items-center gap-2 text-[1rem]">
            <p className=" text-dark-100 dark:text-white">Project Name : </p>
            <p>{index.name || "empty"}</p>
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
              className="w-1/2 dark:!bg-blue-300 dark:!text-blue-600 dark:!border-blue-600 buttonPrimaryStyle"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/SubProject/${index.uuid}`);
              }}
            >
              Sub Projects
            </Button>
            <Button
              className="w-1/2 dark:!bg-red-300 dark:!text-red-600 dark:!border-red-600 buttonSecondaryStyle"
              color="danger"
              variant="solid"
              loading={submitLoading}
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
      </div>
      <DeleteModal
        title="Are you sure you want to delete this item?"
        isOpenModal={isDeleteModalOpen}
        setIsOpenModal={setIsDeleteModalOpen}
        onDelete={() => handleRemove(index.uuid)}
        loading={deleteMutation.isLoading}
      />
    </>
  );
};

export default ProjectCard;
