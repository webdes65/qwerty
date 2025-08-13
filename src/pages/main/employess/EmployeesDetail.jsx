import { useLocation } from "react-router-dom";
import { formatTimestamps } from "@utils/formatDate.js";

const EmployeesDetail = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(
    data.data,
  );

  return (
    <div className="flex flex-col justify-start items-start gap-2 shadow rounded-lg bg-white p-5 cursor-default font-bold">
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Full Name : </p>
        <p>
          {data.data.profile.first_name} {data.data.profile.last_name}
        </p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">User Name : </p>
        <p> {data.data.name}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Phone Number : </p>
        <p> {data.data.phone_number || "---"}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Email : </p>
        <p> {data.data.email || "---"}</p>
      </div>

      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Address : </p>
        <p> {data.data.profile.address || "---"}</p>
      </div>

      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Birthday : </p>
        <p> {data.data.profile.birthday || "---"}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Gender : </p>
        <p> {data.data.profile.gender || "---"}</p>
      </div>

      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Created At : </p>
        <p> {formattedCreatedAt || "---"}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Updated At : </p>
        <p> {formattedUpdatedAt || "---"}</p>
      </div>
    </div>
  );
};

export default EmployeesDetail;
