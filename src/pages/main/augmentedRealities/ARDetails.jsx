import { useLocation } from "react-router-dom";
import { formatTimestamps } from "@utils/formatDate.js";

const ARDetails = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(data);

  return (
    <div className="h-full bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
      <div className="flex flex-col justify-start items-start gap-2 shadow bg-white text-dark-100 dark:bg-gray-100 dark:text-white p-5 cursor-default font-bold">
        <div className="flex flex-row justify-center items-center gap-2">
          <p className="text-[0.90rem] text-dark-100 dark:text-white">
            Name :{" "}
          </p>
          <p> {data.name}</p>
        </div>

        <div className="flex flex-row justify-center items-center gap-2">
          <p className="text-[0.90rem] text-dark-100 dark:text-white">
            Description :{" "}
          </p>
          <p> {data.description}</p>
        </div>

        <div className="flex flex-row justify-center items-center gap-2">
          <p className="text-[0.90rem] text-dark-100 dark:text-white">
            created_at :{" "}
          </p>
          <p> {formattedCreatedAt}</p>
        </div>

        <div className="flex flex-row justify-center items-center gap-2">
          <p className="text-[0.90rem] text-dark-100 dark:text-white">
            Updated at :{" "}
          </p>
          <p> {formattedUpdatedAt}</p>
        </div>

        <div className="flex flex-col justify-center items-start gap-2">
          <p className="text-[0.90rem] text-dark-100 dark:text-white">
            Images :{" "}
          </p>
          <div className="flex flex-row justify-center items-start gap-2 bg-gray-200 dark:bg-dark-100 w-full p-2 rounded-lg">
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
    </div>
  );
};

export default ARDetails;
