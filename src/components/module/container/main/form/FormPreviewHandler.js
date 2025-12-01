import { useEffect } from "react";
import logger from "@utils/logger.js";

export default function FormPreviewHandler({
  setLoading,
  token,
  setForm,
  setContainerDimensions,
  setError,
}) {
  useEffect(() => {
    const fetchDefaultForm = async () => {
      try {
        setLoading(true);

        const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

        const response = await fetch(`${BASE_URL}/forms/default-building`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          logger.error("Failed to fetch default form");
        }

        const data = await response.json();

        setForm(data.data);

        if (data.data?.width && data.data?.height) {
          setContainerDimensions({
            width: data.data.width,
            height: data.data.height,
          });
        }

        setLoading(false);
      } catch (err) {
        logger.error("Error fetching default form:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDefaultForm();
  }, [token]);
}
