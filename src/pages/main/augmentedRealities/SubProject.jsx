import { Button } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddSubProjectModal from "../../../components/module/modal/AddSubProjectModal";
import { useQuery } from "react-query";
import { request } from "../../../services/apiService";
import SubprojectCard from "../../../components/module/card/SubprojectCard";
import ARProjectSubprojectSkeleton from "../../../components/module/card/ARProjectSubprojectSkeleton";

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
    })
  );

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins pt-2">
      <div className="w-full h-auto flex flex-row justify-end items-center">
        <Button
          type="primary"
          className="font-Quicksand font-bold !bg-blue-200 !py-5 !px-6 !shadow !text-[#3b82f6] !text-[0.90rem] !border-[2.5px] !border-blue-500"
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
          <p className="font-bold text-gray-500">No subprojects available.</p>
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
