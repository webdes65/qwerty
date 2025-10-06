import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { request } from "@services/apiService.js";
import { formatTimestamps } from "@utils/formatDate.js";
import logger from "@utils/logger.js";
import DeleteModal from "@module/modal/DeleteModal.jsx";

const UserCard = (data) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteMutation = useMutation(
    (id) => request({ method: "DELETE", url: `/api/users/${id}` }),
    {
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries(["fetchUsers"]);
      },
      onError: (error) => {
        logger.error("Error deleting device:", error);
      },
    },
  );

  const handleRemove = (id) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = () => {
    navigate("/employees/editEmployess", { state: { data } });
  };

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(
    data.data,
  );

  return (
    <>
      <div
        className="w-4/12 h-auto p-1 font-bold cursor-pointer max-xl:w-1/2 max-lg:w-full "
        onClick={() =>
          navigate("/employees/employeesDetail", { state: { data } })
        }
      >
        <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white text-dark-100 dark:bg-gray-100 dark:text-white shadow p-3 hover:shadow-xl">
          <div className="flex flex-row justify-start items-center gap-2 text-[1rem]">
            <p className=" text-dark-100 dark:text-white">UserName : </p>
            <p>{data.data.name || "empty"}</p>
          </div>
          <div className="flex flex-col text-black dark:text-white">
            <p className="text-[0.80rem]">
              <span className="text-dark-100 dark:text-white">
                Phone number :{" "}
              </span>
              {data.data.phone_number || "---"}
            </p>
            <p className="text-[0.80rem]">
              <span className="text-dark-100 dark:text-white">Email : </span>
              {data.data.email || "---"}
            </p>
            <p className="text-[0.80rem] text-dark-100 dark:text-white">
              <span className="text-dark-100 dark:text-white">
                Created at :{" "}
              </span>
              {formattedCreatedAt || "empty"}
            </p>
            <p className="text-[0.80rem] text-dark-100 dark:text-white">
              <span className="text-dark-100 dark:text-white">
                Updated at :{" "}
              </span>
              {formattedUpdatedAt || "empty"}
            </p>
          </div>
          <div className="w-full h-auto flex flex-row gap-2 pt-2">
            <Button
              type="primary"
              className="w-full font-Quicksand font-medium !bg-blue-200 dark:!bg-blue-300 !p-5 !shadow !text-[#3b82f6] dark:!text-blue-600 !text-[0.90rem] !border-[2.5px] !border-blue-500 dark:!border-blue-600 max-sm:!px-3"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <EditOutlined style={{ fontSize: "18px" }} />
              Edit
            </Button>
            {data.data.self === false ? (
              <Button
                className="w-full font-Quicksand font-medium !bg-red-200 dark:!bg-red-300 !p-5 !shadow !text-[#ef4444] dark:!text-red-600 !text-[0.90rem] !border-[2.5px] !border-red-500 dark:!border-red-600 max-sm:!px-3"
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
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <DeleteModal
        title="Are you sure you want to delete this item?"
        isOpenModal={isDeleteModalOpen}
        setIsOpenModal={setIsDeleteModalOpen}
        onDelete={() => handleRemove(data.data.uuid)}
        loading={deleteMutation.isLoading}
      />
    </>
  );
};

export default UserCard;
