import { useState } from "react";
import { Button } from "antd";
import RegisterReportsModal from "@module/modal/RegisterReportsModal";
import { formatTimestamps } from "@utils/formatDate.js";
import "@styles/formAndComponentStyles.css";

const RegisterCard = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { formattedCreatedAt, formattedUpdatedAt } = formatTimestamps(data);

  return (
    <div className="w-4/12 h-auto p-1 font-bold cursor-default max-xl:w-1/2 max-lg:w-full max-md:w-1/2 max-sm:w-full">
      <div className="h-full w-full flex flex-col gap-2 rounded-md bg-white text-dark-100 dark:bg-gray-100 dark:text-white shadow p-3 hover:shadow-xl">
        <div className="flex flex-row justify-start items-center gap-2 text-[1rem]">
          <p className=" text-dark-100 dark:text-white">Register Name : </p>
          <p>{data.title || "---"}</p>
        </div>
        <div className="flex flex-col text-black dark:text-white">
          <p className="text-[0.80rem]">
            <span className="text-dark-100 dark:text-white">Value : </span>
            {data.value || "---"}
          </p>

          <p className="text-[0.80rem] flex items-center gap-2">
            <span className="text-dark-100 dark:text-white">Status :</span>
            {data.connected_at ? (
              (() => {
                const connectedTime = new Date(data.connected_at).getTime();
                const currentTime = Date.now();
                const timeDifference = (currentTime - connectedTime) / 60000;

                if (timeDifference <= 5) {
                  return (
                    <span className="flex items-center gap-1 text-green-500 uppercase">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>{" "}
                      Active
                    </span>
                  );
                } else {
                  return (
                    <span className="flex items-center gap-1 text-yellow-500 uppercase">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>{" "}
                      Disconnected
                    </span>
                  );
                }
              })()
            ) : (
              <span className="flex items-center gap-1 text-red-500 uppercase">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span> Never
                connected
              </span>
            )}
          </p>

          <p className="text-[0.80rem] text-dark-100 dark:text-white">
            <span className="text-dark-100 dark:text-white">Created at : </span>
            {formattedCreatedAt || "empty"}
          </p>
          <p className="text-[0.80rem] text-dark-100 dark:text-white">
            <span className="text-dark-100 dark:text-white">Updated at : </span>
            {formattedUpdatedAt || "empty"}
          </p>
        </div>
        <div className="w-full h-auto flex flex-row gap-2 pt-2">
          <Button
            className="w-full dark:!bg-blue-300 dark:!text-blue-600 dark:!border-blue-600 buttonPrimaryStyle"
            variant="solid"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Get Report
          </Button>
        </div>
      </div>
      <RegisterReportsModal
        deviceName={data.title}
        registerId={data.uuid}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default RegisterCard;
