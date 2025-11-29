import { useQuery } from "react-query";
import { request } from "@services/apiService.js";
import { useEffect } from "react";

export default function GraphIdHandler({ id, setProcessedData }) {
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

  return { loadingGraph };
}
