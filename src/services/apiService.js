import axios from "axios";
import Cookies from "universal-cookie";
import { generateCypherKey } from "@utils/generateCypherKey";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

export const request = async ({
  method,
  url,
  data = null,
  contentType = null,
}) => {
  try {
    const isAuthRequest = url === "/api/login" || url === "/api/register";

    let headers = {};

    if (!isAuthRequest) {
      const cypherKey = await generateCypherKey();
      const cookies = new Cookies();
      const token = cookies.get("bms_access_token");

      headers = {
        Authorization: `Bearer ${token}`,
        cypherKey,
      };
    }

    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    const config = {
      method,
      url,
      headers,
      ...(data && { data }),
    };

    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
