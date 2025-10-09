import L from "leaflet";
import { useState } from "react";
import logger from "@utils/logger.js";

export const useMapDrawHandlers = () => {
  const [tempLayer, setTempLayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const onCreated = (e) => {
    const layer = e.layer;

    setTempLayer(layer);

    const latlngs = layer.getLatLngs()[0].map((p) => ({
      lat: p.lat,
      lng: p.lng,
    }));

    setModalData({
      latlngs,
      type: "polygon",
      zoom: layer._map.getZoom(),
    });

    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
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
      const response = await fetch("/api/polygons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: tempLayer._id,
          title: data.title,
          description: data.description,
          color: data.color,
          coordinates: data.coordinates,
          type: data.type,
          zoom: tempLayer._map.getZoom(),
          createdAt: data.createdAt,
        }),
      });

      if (!response.ok) {
        throw new Error("خطا در ارسال اطلاعات به سرور");
      }

      logger.log("اطلاعات با موفقیت ارسال شد");
    } catch (error) {
      logger.error("خطا در ارسال به بک‌اند:", error);
    }

    setTempLayer(null);
    setModalData(null);
  };

  const handleModalCancel = () => {
    if (tempLayer && tempLayer._map) {
      tempLayer._map.removeLayer(tempLayer);
    }
    setTempLayer(null);
    setModalData(null);
    setIsModalOpen(false);
  };

  const onEdited = async (e) => {
    e.layers.eachLayer(async (layer) => {
      const latlngs = layer.getLatLngs()[0].map((p) => ({
        lat: p.lat,
        lng: p.lng,
      }));

      try {
        await fetch(`/api/polygons/${layer._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: latlngs,
            zoom: layer._map.getZoom(),
            updatedAt: new Date().toISOString(),
          }),
        });
        logger.log("تغییرات با موفقیت ذخیره شد");
      } catch (error) {
        logger.error("خطا در ویرایش:", error);
      }
    });
  };

  const onDeleted = async (e) => {
    e.layers.eachLayer(async (layer) => {
      // حذف label
      if (layer._label) {
        layer._map.removeLayer(layer._label);
      }

      try {
        await fetch(`/api/polygons/${layer._id}`, {
          method: "DELETE",
        });
        logger.log("شکل با موفقیت حذف شد");
      } catch (error) {
        logger.log("خطا در حذف:", error);
      }

      layer._map.removeLayer(layer);
    });
  };

  return {
    onCreated,
    onEdited,
    onDeleted,
    isModalOpen,
    setIsModalOpen,
    modalData,
    handleModalSubmit,
    handleModalCancel,
  };
};
