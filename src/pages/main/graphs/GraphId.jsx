import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Spin } from "antd";
import Graph from "@components/module/Graph";
import { request } from "@services/apiService.js";

const GraphId = () => {
  const { id } = useParams();
  const [processedData, setProcessedData] = useState([]);

  const { data: dataGraph, isLoading: loadingGraph } = useQuery(
    ["subsList", id],
    () =>
      request({
        method: "GET",
        url: `/api/templates/${id}`,
      }),
  );

  useEffect(() => {
    if (dataGraph?.data?.items) {
      const formattedData = dataGraph.data.items.map((item) =>
        item.registers.map((register) => ({
          id: register.uuid,
          title: register.title,
          color: register.border_color,
          logs: register.logs,
        })),
      );
      setProcessedData(formattedData);
    }
  }, [dataGraph]);

  return (
    <div className="w-full h-full">
      {loadingGraph && (
        <div className="w-full h-full flex flex-row justify-center items-center">
          <Spin size="large" />
        </div>
      )}
      <div className="w-full h-full flex flex-row justify-start items-start flex-wrap overflow-auto">
        {processedData.map((data, index) => (
          <Graph key={index} data={data} />
        ))}
      </div>
    </div>
  );
};

export default GraphId;
