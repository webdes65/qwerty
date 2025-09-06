import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { request } from "@services/apiService.js";
import { formatTimestamps } from "@utils/formatDate.js";
import DeleteModal from "@module/modal/DeleteModal.jsx";

const ProjectCard = ({ index }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteMutation = useMutation(
    (id) => request({ method: "DELETE", url: `/api/projects/${id}` }),
    {
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries(["getProject"]);
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );

  const handleRemove = (id) => {
    deleteMutation.mutate(id);
  };

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(index);

  return (
    <>
      <div
        className="w-4/12 h-auto p-1 font-bold cursor-pointer max-xl:w-1/2 max-lg:w-full max-md:w-1/2 max-sm:w-full"
        onClick={() => navigate("/ProjectDetails", { state: { data: index } })}
      >
        <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white shadow p-3 hover:shadow-xl">
          <div className="flex flex-row justify-start items-center gap-2 text-[1rem]">
            <p className=" text-gray-500">Project Name : </p>
            <p>{index.name || "empty"}</p>
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
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/SubProject/${index.uuid}`);
              }}
            >
              Sub Projects
            </Button>
            <Button
              className="w-1/2 font-Quicksand font-medium !bg-red-200 !p-5 !shadow !text-[#ef4444] !text-[0.90rem] !border-[2.5px] !border-red-500"
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
