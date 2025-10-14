import { useEffect, useState, useMemo } from "react";
import L from "leaflet";
import Cookies from "universal-cookie";
import { triggerMapRefresh } from "@module/card/map/MapShapesLoader.jsx";
import logger from "@utils/logger.js";
import { UseSetCollection } from "@store/UseSetCollection.js";

const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

export const useMapDrawHandlers = () => {
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");

  const [tempLayer, setTempLayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const collections = UseSetCollection((state) => state.collections);
  const collectionId = UseSetCollection((state) => state.collectionId);

  const featureName = useMemo(() => {
    if (!collections?.length || !collectionId) {
      // logger.warn("⚠️ collections یا collectionId موجود نیست");
      return "";
    }

    const foundCollection = collections.find(
      (item) => item.uuid === collectionId,
    );

    if (!foundCollection) {
      // logger.warn("⚠️ Collection با این ID پیدا نشد:", collectionId);
      return "";
    }

    // logger.info("✅ Collection پیدا شد:", foundCollection.name);
    return foundCollection.name;
  }, [collections, collectionId]);

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
      // logger.error("❌ tempLayer یا modalData موجود نیست");
      return;
    }

    if (!featureName) {
      // logger.error("❌ featureName خالی است! لطفاً یک Collection انتخاب کنید");
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
        html: `<div style="color:white; font-weight:bold; padding:20px 12px; border-radius:4px; position: absolute">${formData.title}</div>`,
      }),
    }).addTo(tempLayer._map);

    tempLayer._label = label;
    tempLayer._text = formData.title;
    tempLayer._description = formData.description;
    tempLayer.collection_id = formData.collection_id;
    tempLayer._color = color;

    tempLayer.addTo(tempLayer._map);

    const dataToSend = {
      name: formData.title,
      ProvincName: formData.title,
      description: formData.description,
      collection_id: formData.collection_id,
      color: color,
      coordinates: modalData.coordinates,
      type: modalData.type || "polygon",
      zoom: tempLayer._map.getZoom(),
    };

    /*logger.log("📤 ارسال به بکاند:", {
      feature: featureName,
      data: dataToSend,
    });*/

    try {
      const response = await fetch(BASE_URL + "/gis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          feature: featureName,
          data: [dataToSend],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        // logger.error("❌ خطا از سرور:", errorText);
        return;
      }

      const result = await response.json();
      // logger.log("✅ پاسخ موفق از سرور:", result);

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
