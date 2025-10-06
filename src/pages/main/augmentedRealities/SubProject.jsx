import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddSubProjectModal from "@components/module/modal/AddSubProjectModal";
import SubprojectCard from "@components/module/card/SubprojectCard";
import ARProjectSubprojectSkeleton from "@components/module/card/ARProjectSubprojectSkeleton";
import { request } from "@services/apiService.js";

const SubProject = () => {
  const { id } = useParams();

  const [isModalOpenAddSub, setIsModalOpenAddSub] = useState(false);

  const {
    data: dataSub,
    isLoading: loadingSub,
    // error: errSub,
  } = useQuery(["subsList", id], () =>
    request({
      method: "GET",
      url: `/api/projects/${id}/subs`,
    }),
  );

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins pt-2 bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
      <div className="w-full h-auto flex flex-row justify-end items-center">
        <Button
          type="primary"
          className="font-Quicksand font-bold !bg-blue-200 dark:!bg-blue-300 !py-5 !px-6 !shadow !text-[#3b82f6] dark:!text-blue-600 !text-[0.90rem] !border-[2.5px] !border-blue-500 dark:!border-blue-600"
          onClick={() => setIsModalOpenAddSub(true)}
        >
          <PlusCircleOutlined style={{ fontSize: "20px", color: "#3b82f6 " }} />
          Add SubProject
        </Button>
      </div>
      <ul className="w-full h-auto flex flex-row justify-start items-start flex-wrap">
        {loadingSub ? (
          <>
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
          </>
        ) : dataSub?.data?.length > 0 ? (
          dataSub.data.map((index) => (
            <SubprojectCard key={index.uuid} data={index} idProject={id} />
          ))
        ) : (
          <p className="font-bold text-dark-100 dark:text-white cursor-default">
            No subprojects available.
          </p>
        )}
      </ul>
      <AddSubProjectModal
        isModalOpenAddSub={isModalOpenAddSub}
        setIsModalOpenAddSub={setIsModalOpenAddSub}
        id={id}
      />
    </div>
  );
};

export default SubProject;
