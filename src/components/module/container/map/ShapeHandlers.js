import { useCallback, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import Cookies from "universal-cookie";
import logger from "@utils/logger.js";
import { getBorderStyle } from "@store/UseShapeStyle.js";
import { UseSetCollection } from "@store/UseSetCollection.js";

const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

export default function ShapeHandlers({
  hiddenCollections,
  layersRef,
  createLabel,
}) {
  const map = useMap();
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");
  const loadedShapesRef = useRef(new Set());
  const collectionsLoadedRef = useRef(false);
  const setCollections = UseSetCollection((state) => state.setCollections);

  const getStyleOptions = useCallback((item) => {
    const color = item.properties?.color || "red";
    const borderType = item.properties?.borderType || "solid";
    const borderWidth = item.properties?.borderWidth || 3;
    const dashArray = getBorderStyle(borderType, borderWidth);

    return {
      color: color,
      weight: borderWidth,
      opacity: 1,
      dashArray: dashArray,
      lineCap: borderType === "dotted" ? "round" : "butt",
      lineJoin: borderType === "dotted" ? "round" : "miter",
    };
  }, []);

  const loadCollections = useCallback(async () => {
    if (collectionsLoadedRef.current || !token) return;

    try {
      const res = await fetch(BASE_URL + "/gis/showAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const result = await res.json();

      if (result.collections_basic) {
        setCollections(result.collections_basic);
        collectionsLoadedRef.current = true;
      }
    } catch (err) {
      logger.error("❌ خطا در بارگذاری collections:", err);
    }
  }, [token, setCollections]);

  const loadAllShapes = useCallback(async () => {
    try {
      if (!token) {
        return;
      }

      const res = await fetch(BASE_URL + "/gis/showAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        return;
      }

      const result = await res.json();
      const currentServerIds = new Set();

      result.data.forEach((featureGroup) => {
        const featureName = featureGroup.collection_name;

        const isHidden = hiddenCollections.has(featureName);

        if (isHidden) {
          (featureGroup.data || []).forEach((item) => {
            if (loadedShapesRef.current.has(item.id)) {
              const layers = layersRef.current.get(item.id);
              if (layers) {
                map.removeLayer(layers.shape);
                map.removeLayer(layers.label);
                layersRef.current.delete(item.id);
                loadedShapesRef.current.delete(item.id);
              }
            }
          });
          return;
        }

        (featureGroup.data || []).forEach((item) => {
          if (!item.coordinates) return;

          currentServerIds.add(item.id);

          if (loadedShapesRef.current.has(item.id)) {
            return;
          }

          let shape;

          if (item.geometry_type === "marker") {
            if (item.coordinates.length >= 1) {
              const point = item.coordinates[0];

              shape = L.marker([point.latitude, point.longitude], {
                icon: L.icon({
                  iconUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                  iconRetinaUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                  shadowUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                }),
              });
            }
          } else if (item.geometry_type === "circle") {
            if (item.coordinates.length >= 2) {
              const center = item.coordinates[0];
              const radius = item.coordinates[1];
              const styleOptions = getStyleOptions(item);

              shape = L.circle([center.latitude, center.longitude], {
                radius: radius,
                ...styleOptions,
              });
            }
          } else {
            const latlngs = item.coordinates.map((coordinate) => [
              coordinate.latitude,
              coordinate.longitude,
            ]);

            const styleOptions = getStyleOptions(item);

            shape =
              item.geometry_type === "Polyline"
                ? L.polyline(latlngs, {
                    ...styleOptions,
                  })
                : L.polygon(latlngs, {
                    ...styleOptions,
                  });
          }

          if (!shape) return;

          shape._serverId = item.id;
          shape._text =
            item.properties?.name ?? item.properties?.ProvincName ?? "No title";

          const label = createLabel(shape, item);

          shape.addTo(map);
          label.addTo(map);
          shape._label = label;

          loadedShapesRef.current.add(item.id);
          layersRef.current.set(item.id, { shape, label, item });
        });
      });

      loadedShapesRef.current.forEach((loadedId) => {
        if (!currentServerIds.has(loadedId)) {
          const layers = layersRef.current.get(loadedId);
          if (layers) {
            map.removeLayer(layers.shape);
            map.removeLayer(layers.label);
            layersRef.current.delete(loadedId);
            loadedShapesRef.current.delete(loadedId);
          }
        }
      });
    } catch (err) {
      logger.error("❌ خطا در بارگذاری اشکال:", err);
    }
  }, [map, token, createLabel, hiddenCollections, getStyleOptions]);

  return { loadAllShapes, loadCollections };
}
