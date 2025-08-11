import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { request } from "@services/apiService.js";

const CityCard = ({ city }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    (id) => request({ method: "DELETE", url: `/api/cities/${id}` }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["fetchCities"]);
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );

  // const handleEdit = () => {
  //   navigate("/citys/editcity", { state: { city } });
  // };

  const handleRemove = (id) => {
    deleteMutation.mutate(id);
  };

  const formattedCreatedAt = city.created_at
    ? format(new Date(city.created_at), "yyyy/MM/dd HH:mm:ss")
    : "N/A";

  const formattedUpdatedAt = city.updated_at
    ? format(new Date(city.updated_at), "yyyy/MM/dd HH:mm:ss")
    : "N/A";

  return (
    <div className="w-4/12 h-auto p-1 font-bold cursor-default max-xl:w-1/2 max-lg:w-full max-md:w-1/2 max-sm:w-full">
      <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white shadow p-3 hover:shadow-xl">
        <div className="flex flex-row justify-start items-center gap-2 text-[1rem]">
          <p className=" text-gray-500">Name : </p>
          <p>{city.name || "empty"}</p>
        </div>
        <div className="flex flex-col text-black">
          <p className="text-[0.80rem]">
            <span className="text-gray-500">Country : </span>
            {city?.country?.name || "empty"}
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
          {/* <Button
            type="primary"
            className="w-1/2 font-Quicksan font-bold"
            // onClick={() => navigate("/createform", { state: { id, name } })}
          >
            Edit
            <EditOutlined style={{ fontSize: "18px" }} />
          </Button> */}
          <Button
            className="w-full font-Quicksand font-medium !bg-red-200 !p-5 !shadow !text-[#ef4444] !text-[0.90rem] !border-[2.5px] !border-red-500"
            color="danger"
            variant="solid"
            onClick={() => handleRemove(city.uuid)}
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

export default CityCard;
