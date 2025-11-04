import { useLocation } from "react-router-dom";
import { formatTimestamps } from "@utils/formatDate.js";
import "@styles/employeeStyles.css";

const EmployeesDetail = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(
    data.data,
  );

  return (
    <div className="flex flex-col justify-start items-start gap-2 h-full shadow bg-white text-dark-100 dark:bg-gray-100 dark:text-white p-5 cursor-default font-bold">
      <div className="detailParentStyle">
        <p className="detailChildStyle">Full Name : </p>
        <p>
          {data.data.profile.first_name + data.data.profile.last_name || ""}
        </p>
      </div>
      <div className="detailParentStyle">
        <p className="detailChildStyle">User Name : </p>
        <p> {data.data.name}</p>
      </div>
      <div className="detailParentStyle">
        <p className="detailChildStyle">Phone Number : </p>
        <p> {data.data.phone_number || "---"}</p>
      </div>
      <div className="detailParentStyle">
        <p className="detailChildStyle">Email : </p>
        <p> {data.data.email || "---"}</p>
      </div>

      <div className="detailParentStyle">
        <p className="detailChildStyle">Address : </p>
        <p> {data.data.profile.address || "---"}</p>
      </div>

      <div className="detailParentStyle">
        <p className="detailChildStyle">Birthday : </p>
        <p> {data.data.profile.birthday || "---"}</p>
      </div>
      <div className="detailParentStyle">
        <p className="detailChildStyle">Gender : </p>
        <p> {data.data.profile.gender || "---"}</p>
      </div>

      <div className="detailParentStyle">
        <p className="detailChildStyle">Created At : </p>
        <p> {formattedCreatedAt || "---"}</p>
      </div>
      <div className="detailParentStyle">
        <p className="detailChildStyle">Updated At : </p>
        <p> {formattedUpdatedAt || "---"}</p>
      </div>
    </div>
  );
};

export default EmployeesDetail;
