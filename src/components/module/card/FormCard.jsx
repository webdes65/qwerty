import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { request } from "@services/apiService.js";
import { formatTimestamps } from "@utils/formatDate.js";
import logger from "@utils/logger.js";
import DeleteModal from "@module/modal/DeleteModal.jsx";

const FormCard = ({ form }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteMutation = useMutation(
    (id) => request({ method: "DELETE", url: `/api/forms/${id}` }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["GetForms"]);
        queryClient.invalidateQueries(["searchForms"]);
      },
      onError: (error) => {
        logger.error(error);
      },
      onSettled: () => {
        setSubmitLoading(false);
      },
    },
  );

  const handleRemove = (id) => {
    setSubmitLoading(true);
    deleteMutation.mutate(id);
  };

  const name = form.name;
  const id = form.uuid;

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(form);

  return (
    <>
      <div
        className="w-4/12 h-auto p-1 font-bold cursor-pointer max-xl:w-1/2 max-lg:w-full max-md:w-1/2 max-sm:w-full"
        onClick={() => navigate("/forms/formDetail", { state: { form } })}
      >
        <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white text-dark-100 dark:bg-gray-100 dark:text-white shadow p-3 hover:shadow-xl">
          <div className="flex gap-1 text-[1rem]">
            <p className="text-dark-100 dark:text-white">Form Name :</p>
            <p>{form.name || "empty"}</p>
          </div>
          <div className="flex flex-col text-black">
            <p className="text-[0.80rem]">
              <span className="text-dark-100 dark:text-white">Category : </span>
              {form.category?.title ?? "---"}
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
          <div className="w-full h-auto flex flex-row gap-2 pt-2">
            <Button
              type="primary"
              className="w-1/2 font-Quicksand font-medium !bg-blue-200 dark:!bg-blue-300 !p-5 !shadow !text-[#3b82f6] dark:!text-blue-600 !text-[0.90rem] !border-[2.5px] !border-blue-500 dark:!border-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/createform", { state: { id, name } });
              }}
            >
              <EditOutlined style={{ fontSize: "18px" }} />
              Edit
            </Button>
            <Button
              className="w-1/2 font-Quicksand font-medium !bg-red-200 dark:!bg-red-300 !p-5 !shadow !text-[#ef4444] dark:!text-red-600 !text-[0.90rem] !border-[2.5px] !border-red-500 dark:!border-red-600"
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
        onDelete={() => handleRemove(form.uuid)}
      />
    </>
  );
};

export default FormCard;
