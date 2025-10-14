import { useState, useMemo } from "react";
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
  const collection = UseSetCollection((state) => state.collection);

  const collection_Name = useMemo(() => {
    if (!collection) {
      return "";
    }

    if (collections?.length) {
      const foundCollection = collections.find(
        (item) => item.uuid === collection,
      );

      if (foundCollection) {
        return foundCollection.name;
      }
    }

    return collection;
  }, [collections, collection]);

  const isNewCollection = useMemo(() => {
    if (!collection) return false;

    const found = collections?.find((item) => item.uuid === collection);
    return !found;
  }, [collections, collection]);

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

    if (!collection_Name) {
      // logger.error("❌ collection_Name خالی است! لطفاً یک Collection انتخاب کنید");
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
        html: `<div style="color:white; font-weight:bold; padding:20px 12px; border-radius:4px; position: absolute">${formData.name}</div>`,
      }),
    }).addTo(tempLayer._map);

    tempLayer._label = label;
    tempLayer._text = formData.name;
    tempLayer._description = formData.description;
    tempLayer.collection_id = formData.collection_id;
    tempLayer._color = color;

    tempLayer.addTo(tempLayer._map);

    const data = {
      name: formData.name,
      ProvincName: formData.name,
      description: formData.description,
      collection_id: isNewCollection ? "" : collection,
      color: color,
      coordinates: modalData.coordinates,
      type: modalData.type || "polygon",
      zoom: tempLayer._map.getZoom(),
      collection_name: collection_Name,
    };

    logger.log("📤 ارسال به بکاند:", {
      isNewCollection,
      collection_id: data.collection_id,
      collection_name: data.collection_name,
      fullData: data,
    });

    try {
      const response = await fetch(BASE_URL + "/gis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data,
        }),
      });

      if (!response.ok) {
        // const errorText = await response.text();
        // logger.error("❌ خطا از سرور:", errorText);
        return;
      }

      // const result = await response.json();
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
