import { useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import {
  MdOutlineArchitecture,
  MdOutlineDescription,
  MdOutlineDevices,
  MdOutlineLocationCity,
  MdOutlineLocationOn,
} from "react-icons/md";
import InfoCard from "@module/card/InfoCard.jsx";

const ProjectDetails = () => {
  const location = useLocation();
  const { data } = location.state || {};

  return (
    <div className="h-full bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
      <div className="mb-6 w-full">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
          <FaUserCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Poject Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={MdOutlineArchitecture}
            label="Name:"
            value={data.name || "empty"}
          />
          <InfoCard
            icon={MdOutlineLocationOn}
            label="Address:"
            value={data.address || "empty"}
          />
          <InfoCard
            icon={MdOutlineLocationCity}
            label="City:"
            value={data.city.name || "empty"}
          />
          <InfoCard
            icon={MdOutlineDescription}
            label="Description:"
            value={data.description || "empty"}
          />
          <InfoCard
            icon={MdOutlineDevices}
            label="Devices:"
            value={
              data.devices.map((item) => {
                item.name;
              }) || "empty"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
