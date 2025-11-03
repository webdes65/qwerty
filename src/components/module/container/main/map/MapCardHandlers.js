import { useState } from "react";
import Cookies from "universal-cookie";
import { triggerMapRefresh } from "@module/card/map/MapShapesLoader.jsx";
import logger from "@utils/logger.js";

const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

export default function MapCardHandlers() {
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");

  const [shapesList, setShapesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShapesList = async () => {
    setLoading(true);
    try {
      const response = await fetch(BASE_URL + "/gis/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const result = await response.json();
      setShapesList(result.data || result);
    } catch (error) {
      logger.error("❌ خطا در دریافت لیست:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCoordinates = async (updatedShapeData) => {
    try {
      logger.log("Saving coordinates:", updatedShapeData);

      const response = await fetch(
        `${BASE_URL}/gis/features/${updatedShapeData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              coordinates: updatedShapeData.coordinates,
            },
          }),
        },
      );

      if (!response.ok) {
        return;
      }

      triggerMapRefresh();
    } catch (error) {
      logger.error("❌ خطا در آپدیت کوردینیت‌ها:", error);
    }
  };

  return { shapesList, loading, fetchShapesList, handleSaveCoordinates };
}
