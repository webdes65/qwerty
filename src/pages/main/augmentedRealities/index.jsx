import { useState } from "react";
import { useQuery } from "react-query";
import { IoLogoDropbox } from "react-icons/io5";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddAugmentedRealitiesModal from "@components/module/modal/AddAugmentedRealitiesModal";
import AugmentedRealitiesCard from "@components/module/card/AugmentedRealitiesCard";
import AddProject from "@components/module/modal/AddProject";
import ProjectCard from "@components/module/card/ProjectCard";
import ARProjectSubprojectSkeleton from "@components/module/card/ARProjectSubprojectSkeleton";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

const AugmentedRealities = () => {
  const [isModalOpenAR, setIsModalOpenAR] = useState(false);
  const [isModalOpenAddProject, setIsModalOpenOpenAddProject] = useState(false);

  const {
    data: dataAR,
    isLoading: loadingAR,
    error: errAR,
  } = useQuery(["ARList"], () =>
    request({
      method: "GET",
      url: "/api/augmented-realities",
    }),
  );

  const {
    data: dataProject,
    isLoading: loadingProject,
    error: errProject,
  } = useQuery(["getProject"], () =>
    request({
      method: "GET",
      url: "/api/projects",
    }),
  );

  if (errAR) {
    logger.error(errAR);
    return <div>{errAR.message}</div>;
  }

  if (errProject) {
    logger.error(errProject);
    return <div>{errProject.message}</div>;
  }

  const dataAugmentedRealities = dataAR?.data || [];
  const dataListProject = dataProject?.data || [];

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
            <>
              <ARProjectSubprojectSkeleton />
              <ARProjectSubprojectSkeleton />
              <ARProjectSubprojectSkeleton />
            </>
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
          <AddAugmentedRealitiesModal
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
            <>
              <ARProjectSubprojectSkeleton />
              <ARProjectSubprojectSkeleton />
              <ARProjectSubprojectSkeleton />
            </>
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
          <AddProject
            isModalOpenAddProject={isModalOpenAddProject}
            setIsModalOpenAddProject={setIsModalOpenOpenAddProject}
          />
        )}
      </div>
    </div>
  );
};

export default AugmentedRealities;
