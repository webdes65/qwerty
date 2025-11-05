import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function GraphIndexHandler() {
  const { data, isLoading, error } = useQuery(["fetchGraphs"], () =>
    request({
      method: "GET",
      url: "/api/templates",
    }),
  );
  const graphs = data?.data || [];

  return { isLoading, error, graphs };
}
