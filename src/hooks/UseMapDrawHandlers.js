import { useState } from "react";
import L from "leaflet";
import Cookies from "universal-cookie";
import logger from "@utils/logger.js";
import { triggerMapRefresh } from "@module/card/map/MapShapesLoader.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

export const useMapDrawHandlers = () => {
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");

  const [tempLayer, setTempLayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const onCreated = (e) => {
    const layer = e.layer;

    setTempLayer(layer);

    const latlngs =
      layer.getLatLngs()[0]?.map?.((p) => ({ lat: p.lat, lng: p.lng })) ||
      layer.getLatLngs().map((p) => ({ lat: p.lat, lng: p.lng }));

    const shapeType =
      e.layerType === "polygon"
        ? "polygon"
        : e.layerType === "polyline"
          ? "polyline"
          : "unknown";

    setModalData({
      latlngs,
      type: shapeType,
      zoom: layer._map.getZoom(),
    });

    setIsModalOpen(true);
  };

  const handleCreateSubmit = async (data) => {
    if (!tempLayer) return;

    tempLayer.setStyle({
      color: data.color,
      fillColor: data.color,
      fillOpacity: 0.4,
    });

    const center = tempLayer.getBounds().getCenter();
    const label = L.marker(center, {
      icon: L.divIcon({
        className: "polygon-label",
        html: `<div style="color:white; font-weight:bold; background:rgba(0,0,0,0.5); padding:4px 8px; border-radius:4px;">${data.title}</div>`,
      }),
    }).addTo(tempLayer._map);

    tempLayer._label = label;
    tempLayer._text = data.title;
    tempLayer._description = data.description;
    tempLayer._color = data.color;
    tempLayer._id = Date.now();

    tempLayer.addTo(tempLayer._map);

    try {
      const response = await fetch(BASE_URL + "/gis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          feature: "Test-feature",
          data: [
            {
              name: data.title,
              ProvincName: data.title,
              description: data.description,
              color: data.color,
              coordinates: data.coordinates,
              type: data.type,
              zoom: tempLayer._map.getZoom(),
            },
          ],
        }),
      });

      if (!response.ok) {
        logger.Error("خطا در ارسال اطلاعات به سرور");
      }

      logger.log("اطلاعات با موفقیت ارسال شد");

      triggerMapRefresh();
    } catch (error) {
      logger.error("خطا در ارسال به بک‌اند:", error);
    }

    setTempLayer(null);
    setModalData(null);
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    if (tempLayer && tempLayer._map) {
      tempLayer._map.removeLayer(tempLayer);
    }
    setTempLayer(null);
    setModalData(null);
    setIsModalOpen(false);
  };

  return {
    onCreated,
    isModalOpen,
    setIsModalOpen,
    modalData,
    handleCreateSubmit,
    handleModalCancel,
  };
};
