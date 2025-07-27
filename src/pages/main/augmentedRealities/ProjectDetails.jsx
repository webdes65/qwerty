import { useLocation } from "react-router-dom";

const ProjectDetails = () => {
  const location = useLocation();
  const { data } = location.state || {};

  return (
    <div className="flex flex-col justify-start items-start gap-2 shadow rounded-lg bg-white p-5 cursor-default font-bold">
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Name : </p>
        <p> {data.name}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">Address : </p>
        <p> {data.address}</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <p className="text-[0.90rem] text-gray-500">City : </p>
        <p> {data.city.name}</p>
      </div>
      <div className="flex flex-col justify-center items-start gap-2">
        <p className="text-[0.90rem] text-gray-500">Description :</p>
        <p className="break-words whitespace-normal">
          {data.description}
        </p>
      </div>
      <div className="flex flex-col justify-center items-start gap-2 w-auto">
        <p className="text-[0.90rem] text-gray-500">Devices : </p>
        <div className="flex flex-row justify-center items-center gap-2 bg-gray-200 w-full p-2 rounded-lg">
          {data.devices.map((index) => {
            return <p key={index.uuid} className="bg-gray-300 rounded-md p-2">{index.name}</p>;
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
