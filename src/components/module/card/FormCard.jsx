import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { request } from "@services/apiService.js";
import { formatTimestamps } from "@utils/formatDate.js";

const FormCard = ({ form }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitLoading, setSubmitLoading] = useState(false);

  const deleteMutation = useMutation(
    (id) => request({ method: "DELETE", url: `/api/forms/${id}` }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["GetForms"]);
      },
      onError: (error) => {
        console.error(error);
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
    <div
      className="w-4/12 h-auto p-1 font-bold cursor-pointer max-xl:w-1/2 max-lg:w-full max-md:w-1/2 max-sm:w-full"
      onClick={() => navigate("/forms/formDetail", { state: { form } })}
    >
      <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white shadow p-3 hover:shadow-xl">
        <div className="flex flex-col text-[1rem]">
          <p className="text-gray-500">Form Name :</p>
          <p>{form.name || "empty"}</p>
        </div>
        <div className="flex flex-col text-black">
          <p className="text-[0.80rem]">
            <span className="text-gray-500">Category : </span>
            {form.category || "---"}
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
        <div className="w-full h-auto flex flex-row gap-2 pt-2">
          <Button
            type="primary"
            className="w-1/2 font-Quicksand font-medium !bg-blue-200 !p-5 !shadow !text-[#3b82f6] !text-[0.90rem] !border-[2.5px] !border-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/createform", { state: { id, name } });
            }}
          >
            <EditOutlined style={{ fontSize: "18px" }} />
            Edit
          </Button>
          <Button
            className="w-1/2 font-Quicksand font-medium !bg-red-200 !p-5 !shadow !text-[#ef4444] !text-[0.90rem] !border-[2.5px] !border-red-500"
            color="danger"
            variant="solid"
            loading={submitLoading}
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(form.uuid);
            }}
          >
            <DeleteOutlined style={{ fontSize: "18px" }} />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormCard;
