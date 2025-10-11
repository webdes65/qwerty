import { useState } from "react";
import L from "leaflet";
import Cookies from "universal-cookie";
import { triggerMapRefresh } from "@module/card/map/MapShapesLoader.jsx";
import logger from "@utils/logger.js";

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

    const coordinates = latlngs.map((point) => [point.lng, point.lat]);

    const shapeType =
      e.layerType === "polygon"
        ? "polygon"
        : e.layerType === "polyline"
          ? "polyline"
          : "unknown";

    const data = {
      latlngs,
      coordinates,
      type: shapeType,
      zoom: layer._map.getZoom(),
    };

    setModalData(data);
    setIsModalOpen(true);
  };

  const handleCreateSubmit = async (formData) => {
    if (!tempLayer || !modalData) {
      return;
    }

    const color =
      typeof formData.color === "string"
        ? formData.color
        : formData.color?.toHexString?.() || "#ff0000";

    tempLayer.setStyle({
      color: color,
      fillColor: color,
      fillOpacity: 0.4,
    });

    const center = tempLayer.getBounds().getCenter();
    const label = L.marker(center, {
      icon: L.divIcon({
        className: "polygon-label",
        html: `<div style="color:white; font-weight:bold; background:rgba(0,0,0,0.5); padding:4px 8px; border-radius:4px;">${formData.title}</div>`,
      }),
    }).addTo(tempLayer._map);

    tempLayer._label = label;
    tempLayer._text = formData.title;
    tempLayer._description = formData.description;
    tempLayer._color = color;
    tempLayer._id = Date.now();

    tempLayer.addTo(tempLayer._map);

    const dataToSend = {
      name: formData.title,
      ProvincName: formData.title,
      description: formData.description,
      color: color,
      coordinates: modalData.coordinates,
      type: modalData.type || "polygon",
      zoom: tempLayer._map.getZoom(),
    };

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
          data: [dataToSend],
        }),
      });

      if (!response.ok) {
        return;
      }

      triggerMapRefresh();

      setTempLayer(null);
      setModalData(null);
      setIsModalOpen(false);
    } catch (error) {
      logger.error("❌ خطا در ارسال به بکاند:", error);
    }
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
