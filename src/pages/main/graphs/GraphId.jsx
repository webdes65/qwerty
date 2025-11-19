import { useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import Graph from "@components/module/Graph";
import GraphIdHandler from "@module/container/main/graphs/GraphIdHandler.js";

const GraphId = () => {
  const { id } = useParams();
  const [processedData, setProcessedData] = useState([]);

  const { loadingGraph } = GraphIdHandler({ id, setProcessedData });

  return (
    <div className="w-full h-full">
      {loadingGraph && (
        <div className="w-full h-full flex flex-row justify-center items-center bg-white dark:bg-dark-100">
          <Spin className="dark:text-lightBlue" size="large" />
        </div>
      )}
      <div className="w-full h-full flex flex-row justify-start items-start flex-wrap overflow-auto bg-white dark:bg-dark-100">
        {processedData.map((data, index) => (
          <Graph key={index} data={data} />
        ))}
      </div>
    </div>
  );
};

export default GraphId;
