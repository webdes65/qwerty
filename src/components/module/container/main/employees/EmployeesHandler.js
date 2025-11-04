import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function EmployeesHandler() {
  const { data, isLoading, error, refetch } = useQuery(["fetchUsers"], () =>
    request({
      method: "GET",
      url: "/api/users",
    }),
  );

  const users = data?.data || [];

  return { users, isLoading, error, refetch };
}
