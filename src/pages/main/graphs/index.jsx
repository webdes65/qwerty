import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import AddGraphModal from "../../../components/module/modal/AddGraphModal";
import { useQuery } from "react-query";
import { request } from "../../../services/apiService";
import ARProjectSubprojectSkeleton from "../../../components/module/card/ARProjectSubprojectSkeleton";
import GraphCard from "../../../components/module/card/GraphCard";
import { IoLogoDropbox } from "react-icons/io5";

const Graphs = () => {
  const [isOpenAddGraphModal, setIsOpenAddGraphModal] = useState(false);

  const { data, isLoading, error } = useQuery(["fetchGraphs"], () =>
    request({
      method: "GET",
      url: "/api/templates",
    })
  );

  if (error) {
    return <div>{error.message}</div>;
  }

  const graphs = data?.data || [];

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Quicksand pr-2">
      <div className="w-full h-auto flex flex-row justify-end items-center pt-1">
        <Button
          type="primary"
          className="font-Quicksand font-bold !bg-blue-200 !py-5 !px-6 !shadow !text-[#3b82f6] !text-[0.90rem] !border-[2.5px] !border-blue-500"
          onClick={() => setIsOpenAddGraphModal(true)}
        >
          <PlusCircleOutlined style={{ fontSize: "20px", color: "#3b82f6 " }} />
          Add Graph
        </Button>
      </div>
      <ul className="w-full h-auto flex flex-row justify-start items-start flex-wrap">
        {isLoading ? (
          <>
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
          </>
        ) : graphs.length === 0 ? (
          <div className="w-full h-full flex flex-col justify-center items-center font-Quicksand uppercase font-bold bg-gray-200 rounded-md shadow">
            <IoLogoDropbox className="text-[5rem] text-gray-400" />
            <p className="text-gray-500 cursor-default">No Data</p>
          </div>
        ) : (
          graphs.map((index) => <GraphCard key={index.uuid} data={index} />)
        )}
      </ul>
      <AddGraphModal
        isOpenAddGraphModal={isOpenAddGraphModal}
        setIsOpenAddGraphModal={setIsOpenAddGraphModal}
      />
    </div>
  );
};

export default Graphs;
