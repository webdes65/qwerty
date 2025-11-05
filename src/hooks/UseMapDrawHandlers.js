import { useState, useMemo } from "react";
import L from "leaflet";
import Cookies from "universal-cookie";
import { triggerMapRefresh } from "@module/card/map/MapShapesLoader.jsx";
import logger from "@utils/logger.js";
import { UseSetCollection } from "@store/UseSetCollection.js";
import { UseShapeStyle, getBorderStyle } from "@store/UseShapeStyle.js";

const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

export const useMapDrawHandlers = () => {
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");

  const [tempLayer, setTempLayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const collections = UseSetCollection((state) => state.collections);
  const collection = UseSetCollection((state) => state.collection);
  const borderType = UseShapeStyle((state) => state.borderType);
  const borderWidth = UseShapeStyle((state) => state.borderWidth);

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

  const getBorderStyleOptions = (color, bType, bWidth) => {
    const dashArray = getBorderStyle(bType, bWidth);

    logger.log("🎨 Applying style:", {
      borderType: bType,
      borderWidth: bWidth,
      dashArray,
      color,
    });

    return {
      color: color,
      weight: bWidth,
      opacity: 1,
      dashArray: dashArray,
      lineCap: bType === "dotted" ? "round" : "butt",
      lineJoin: bType === "dotted" ? "round" : "miter",
    };
  };

  const onCreated = (e) => {
    const layer = e.layer;
    setTempLayer(layer);

    let coordinates;
    let shapeType;

    if (e.layerType === "marker") {
      const latlng = layer.getLatLng();
      coordinates = [latlng.lat, latlng.lng];
      shapeType = "marker";
    } else if (e.layerType === "circle") {
      const radius = layer.getRadius();
      const center = layer.getLatLng();

      coordinates = [
        {
          lat: center.lat,
          lng: center.lng,
        },
        {
          lat: radius,
          lng: radius,
        },
      ];
      shapeType = "circle";
    } else if (e.layerType === "polygon") {
      const latlngs = layer
        .getLatLngs()[0]
        .map((p) => ({ lat: p.lat, lng: p.lng }));
      coordinates = latlngs.map((point) => [point.lng, point.lat]);
      shapeType = "polygon";
    } else if (e.layerType === "polyline") {
      const latlngs = layer
        .getLatLngs()
        .map((p) => ({ lat: p.lat, lng: p.lng }));
      coordinates = latlngs.map((point) => [point.lng, point.lat]);
      shapeType = "polyline";
    } else {
      shapeType = "unknown";
    }

    const data = {
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

    if (!collection_Name) {
      return;
    }

    const color =
      typeof formData.color === "string"
        ? formData.color
        : formData.color?.toHexString?.() || "#ff0000";

    if (modalData.type === "marker") {
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      tempLayer.setIcon(customIcon);
    } else {
      const styleOptions = getBorderStyleOptions(
        color,
        borderType,
        borderWidth,
      );
      tempLayer.setStyle(styleOptions);
    }

    tempLayer._text = formData.name;
    tempLayer._description = formData.description;
    tempLayer.collection_id = formData.collection_id;

    tempLayer.addTo(tempLayer._map);

    const data = {
      name: formData.name,
      ProvincName: formData.name,
      description: formData.description,
      collection_id: isNewCollection ? "" : collection,
      color: color,
      coordinates: modalData.coordinates,
      type: modalData.type,
      zoom: tempLayer._map.getZoom(),
      collection_name: collection_Name,
      ...(modalData.type !== "marker" && {
        borderType: borderType,
        borderWidth: borderWidth,
      }),
    };

    logger.log("📤 ارسال به بکاند:", {
      isNewCollection,
      collection_id: data.collection_id,
      collection_name: data.collection_name,
      borderType: data.borderType,
      borderWidth: data.borderWidth,
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
