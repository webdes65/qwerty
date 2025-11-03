import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function CityIndexHandler() {
  const { data, isLoading, error } = useQuery(["fetchCities"], () =>
    request({
      method: "GET",
      url: "/api/cities",
    }),
  );

  const cities = data?.data || [];

  return { cities, error, isLoading };
}
