import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "universal-cookie";
import { generateCypherKey } from "@utils/generateCypherKey.js";
import logger from "@utils/logger.js";

export default function SubProjectScanHandler({
  data,
  idProject,
  setScanLoading,
}) {
  const cookies = new Cookies();

  const handleScan = async () => {
    if (!data?.token || !data?.uuid) {
      toast.error("Token یا User ID موجود نیست!");
      return;
    }

    const payload = {
      token: data.token,
      user: data.uuid,
      url: "/SubProject",
    };

    const token = cookies.get("bms_access_token");
    if (!token) return;

    const cypherKey = await generateCypherKey();

    const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

    const baseURL = `${BASE_URL}/projects/${idProject}/subs/${data.uuid}/scan`;

    setScanLoading(true);

    axios
      .post(baseURL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          cypherKey,
        },
      })

      .then((response) => {
        window.location.href = response.data.data;
      })

      .catch((error) => {
        logger.error("Error: ", error);
        toast.error("خطا در عملیات اسکن");
      })
      .finally(() => {
        setScanLoading(false);
      });
  };

  return { handleScan };
}
