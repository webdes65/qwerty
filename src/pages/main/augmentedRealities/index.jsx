import { useState } from "react";
import { IoLogoDropbox } from "react-icons/io5";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddARModal from "@module/modal/AddARModal.jsx";
import AugmentedRealitiesCard from "@components/module/card/AugmentedRealitiesCard";
import AddProjectModal from "@module/modal/AddProjectModal.jsx";
import ProjectCard from "@components/module/card/ProjectCard";
import ARIndexHandlers from "@module/container/main/argument-realities/ARIndexHandlers.js";
import SkeletonList from "@module/SkeletonList.jsx";
import logger from "@utils/logger.js";

const AugmentedRealities = () => {
  const [isModalOpenAR, setIsModalOpenAR] = useState(false);
  const [isModalOpenAddProject, setIsModalOpenOpenAddProject] = useState(false);

  const {
    dataAugmentedRealities,
    dataListProject,
    loadingAR,
    loadingProject,
    errProject,
    errAR,
  } = ARIndexHandlers();

  if (errAR) {
    logger.error(errAR);
    return <div>{errAR.message}</div>;
  }

  if (errProject) {
    logger.error(errProject);
    return <div>{errProject.message}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 font-Poppins pt-2 bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
      <div className="w-full h-1/2 flex flex-col justify-start items-center gap-2 overflow-auto">
        <div className="w-full flex flex-row justify-end items-center">
          <Button
            type="primary"
            className="font-Quicksand font-bold !bg-blue-200 dark:!bg-blue-300 !py-5 !px-6 !shadow !text-[#3b82f6] dark:!text-blue-600 !text-[0.90rem] !border-[2.5px] !border-blue-500 dark:!border-blue-600"
            onClick={() => setIsModalOpenAR(true)}
          >
            <PlusCircleOutlined
              style={{ fontSize: "20px", color: "#3b82f6 " }}
            />
            Add AR
          </Button>
        </div>

        <ul className="w-full h-full flex flex-row justify-start items-center gap-y-2 flex-wrap overflow-auto">
          {loadingAR ? (
            <SkeletonList count={3} />
          ) : dataAugmentedRealities.length > 0 ? (
            dataAugmentedRealities.map((index) => (
              <AugmentedRealitiesCard key={index.uuid} index={index} />
            ))
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center font-Quicksand uppercase font-bold bg-gray-200 dark:bg-gray-100 rounded-md shadow">
              <IoLogoDropbox className="text-[5rem] text-dark-100 dark:text-white" />
              <p className="text-dark-100 dark:text-white cursor-default">
                No Data
              </p>
            </div>
          )}
        </ul>

        {isModalOpenAR && (
          <AddARModal
            isModalOpenAR={isModalOpenAR}
            setIsModalOpenAR={setIsModalOpenAR}
          />
        )}
      </div>

      <div className="w-full h-1/2 flex flex-col justify-start items-center gap-2">
        <div className="w-full flex flex-row justify-end items-center">
          <Button
            type="primary"
            className="font-Quicksand font-bold !bg-blue-200 dark:!bg-blue-300 !py-5 !px-6 !shadow !text-[#3b82f6] dark:!text-blue-600 !text-[0.90rem] !border-[2.5px] !border-blue-500 dark:!border-blue-600"
            onClick={() => setIsModalOpenOpenAddProject(true)}
          >
            <PlusCircleOutlined
              style={{ fontSize: "20px", color: "#3b82f6 " }}
            />
            Add Project
          </Button>
        </div>

        <ul className="w-full h-full flex flex-row justify-start items-center flex-wrap overflow-auto">
          {loadingProject ? (
            <SkeletonList count={3} />
          ) : dataListProject.length > 0 ? (
            dataListProject.map((index) => (
              <ProjectCard key={index.uuid} index={index} />
            ))
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center font-Quicksand uppercase font-bold bg-gray-200 rounded-md shadow">
              <IoLogoDropbox className="text-[5rem] text-dark-100 dark:text-white" />
              <p className="text-dark-100 dark:text-white cursor-default">
                No Data
              </p>
            </div>
          )}
        </ul>

        {isModalOpenAddProject && (
          <AddProjectModal
            isModalOpenAddProject={isModalOpenAddProject}
            setIsModalOpenAddProject={setIsModalOpenOpenAddProject}
          />
        )}
      </div>
    </div>
  );
};

export default AugmentedRealities;
