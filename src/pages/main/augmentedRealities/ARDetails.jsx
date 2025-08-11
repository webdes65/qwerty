import { useLocation } from "react-router-dom";
import { format } from "date-fns";

const ARDetails = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const formattedCreatedAt = data.created_at
    ? format(new Date(data.created_at), "yyyy/MM/dd HH:mm:ss")
    : "N/A";

  const formattedUpdatedAt = data.updated_at
    ? format(new Date(data.updated_at), "yyyy/MM/dd HH:mm:ss")
    : "N/A";

  return (
    <div className="flex flex-col justify-start items-start gap-2 shadow rounded-lg bg-white p-5 cursor-default font-bold">
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Name : </p>
        <p> {data.name}</p>
      </div>

      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Description : </p>
        <p> {data.description}</p>
      </div>

      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">created_at : </p>
        <p> {formattedCreatedAt}</p>
      </div>

      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Updated at : </p>
        <p> {formattedUpdatedAt}</p>
      </div>

      <div className="flex flex-col justify-center items-start gap-2">
        <p className="text-[0.90rem] text-gray-500">Images : </p>
        <div className="flex flex-row justify-center items-start gap-2 bg-gray-200 w-full p-2 rounded-lg">
          {data.images && Object.keys(data.images).length > 0 ? (
            Object.values(data.images).map((item) => (
              <div
                key={item.uuid}
                className="w-[100px] h-[100px] flex flex-col justify-start items-center gap-2 rounded-xl shadow-xl"
              >
                <img
                  alt="Augmented Reality"
                  src={item.path}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ))
          ) : (
            <p>No images available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ARDetails;
