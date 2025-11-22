import { useLocation } from "react-router-dom";
import { formatTimestamps } from "@utils/formatDate.js";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserCircle,
  FaClock,
} from "react-icons/fa";
import InfoCard from "@module/card/InfoCard.jsx";
import "@styles/employeeStyles.css";

const EmployeesDetail = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(
    data.data,
  );

  return (
    <div className="flex flex-col justify-start items-start gap-2 h-auto md:h-full shadow bg-white text-dark-100 dark:bg-gray-100 dark:text-white p-5 cursor-default font-bold">
      <div className="w-full mx-auto">
        <div className="mb-6 w-full">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
            <FaUserCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icon={FaUser}
              label="Full Name:"
              value={data.data.profile.first_name + data.data.profile.last_name}
            />
            <InfoCard icon={FaUser} label="Username:" value={data.data.name} />
            <InfoCard
              icon={FaPhone}
              label="Phone Number:"
              value={data.data.phone_number}
            />
            <InfoCard
              icon={FaEnvelope}
              label="Email:"
              value={data.data.email}
            />
            <InfoCard
              icon={FaMapMarkerAlt}
              label="Address:"
              value={data.data.profile.address}
            />
            <InfoCard
              icon={FaCalendarAlt}
              label="Birthday:"
              value={data.data.profile.birthday}
            />
            <InfoCard
              icon={FaUserCircle}
              label="Gender:"
              value={data.data.profile.gender}
            />
          </div>
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
      </div>
    </div>
  );
};

export default EmployeesDetail;
