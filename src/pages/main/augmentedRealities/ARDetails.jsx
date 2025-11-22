import { useLocation } from "react-router-dom";
import { FaClock, FaUserCircle } from "react-icons/fa";
import { MdOutlineArchitecture, MdOutlineDescription } from "react-icons/md";
import { formatTimestamps } from "@utils/formatDate.js";
import InfoCard from "@module/card/InfoCard.jsx";

const ARDetails = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(data);

  return (
    <div className="h-full bg-white text-dark-100 dark:bg-gray-100 dark:text-white px-5">
      <div className="mb-6 w-full">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
          <FaUserCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          AR Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={MdOutlineArchitecture}
            label="Name:"
            value={data.name || "empty"}
          />
          <InfoCard
            icon={MdOutlineDescription}
            label="Description:"
            value={data.description || "empty"}
          />
        </div>

        <div className="mt-8 lg:mt-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
            <FaClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            System Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icon={FaClock}
              label="Created At:"
              value={formattedCreatedAt}
            />
            <InfoCard
              icon={FaClock}
              label="Updated At:"
              value={formattedUpdatedAt}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-start gap-2 mt-8 lg:mt-12">
          <p className="text-[0.90rem] md:text-lg text-dark-100 dark:text-white">
            Images :{" "}
          </p>
          <div className="flex flex-row justify-start items-start gap-2 bg-gray-200 dark:bg-dark-100 w-auto p-4 rounded-lg">
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
