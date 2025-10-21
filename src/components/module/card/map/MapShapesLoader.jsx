import { useEffect, useRef, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import Cookies from "universal-cookie";
import logger from "@utils/logger.js";
import { UseSetCollection } from "@store/UseSetCollection.js";

const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

let globalRefreshShapes = null;

export const triggerMapRefresh = () => {
  if (globalRefreshShapes) {
    globalRefreshShapes();
  } else {
    logger.error("⚠️ MapShapesLoader هنوز آماده نیست");
  }
};

export default function MapShapesLoader({
  onEditShape,
  onEditCoordinates,
  hiddenCollections = new Set(),
}) {
  const map = useMap();
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");

  const loadedShapesRef = useRef(new Set());
  const layersRef = useRef(new Map());
  const collectionsLoadedRef = useRef(false);
  const setCollections = UseSetCollection((state) => state.setCollections);

  const attachButtonEvents = useCallback(
    (labelElement, shapeData) => {
      setTimeout(() => {
        const editBtn = labelElement._icon?.querySelector(".edit-btn");
        const coordsBtn = labelElement._icon?.querySelector(".coords-btn");

        if (editBtn) {
          editBtn.onclick = (e) => {
            e.stopPropagation();
            logger.log("Edit clicked for:", shapeData);
            onEditShape?.(shapeData);
          };
        }

        if (coordsBtn) {
          coordsBtn.onclick = (e) => {
            e.stopPropagation();
            logger.log("Edit coordinates clicked for:", shapeData);
            onEditCoordinates?.(shapeData);
          };
        }
      }, 0);
    },
    [onEditShape, onEditCoordinates],
  );

  const createLabel = useCallback(
    (shape, item) => {
      const labelPosition =
        item.type === "polyline"
          ? shape.getCenter()
          : shape.getBounds().getCenter();

      const label = L.marker(labelPosition, {
        icon: L.divIcon({
          className: "polygon-label",
          html: `
          <div class="group flex items-center text-white font-bold px-2 py-1 rounded">
              <span>${shape._text}</span>
              <div class="ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex gap-1">
                  <button class="edit-btn bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm whitespace-nowrap">
                      Edit
                  </button>
                  <button class="coords-btn bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm whitespace-nowrap">
                      Coords
                  </button>
              </div>
          </div>
      `,
        }),
      });

      const shapeData = {
        id: item.id,
        name: shape._text,
        type: item.type,
        coordinates: item.coordinates,
        properties: item.properties,
      };

      attachButtonEvents(label, shapeData);

      return label;
    },
    [attachButtonEvents],
  );

  const updateLabels = useCallback(() => {
    layersRef.current.forEach(({ shape, label, item }, id) => {
      map.removeLayer(label);

      const newLabel = createLabel(shape, item);
      newLabel.addTo(map);

      layersRef.current.set(id, { shape, label: newLabel, item });
    });
  }, [map, createLabel]);

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
        // logger.log("✅ Collections loaded:", result.collections_basic);
      }
    } catch (err) {
      logger.error("❌ خطا در بارگذاری collections:", err);
    }
  }, [token, setCollections]);

  const loadAllShapes = useCallback(async () => {
    try {
      if (!token) {
        // logger.error("❌ توکن یافت نشد!");
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
        // const errorText = await res.text();
        // logger.error("خطای سرور:", errorText);
        // logger.error(`خطا در واکشی اشکال از سرور: ${res.status}`);
        return;
      }

      const result = await res.json();
      // logger.log("✅ داده دریافتی:", result);

      const currentServerIds = new Set();

      result.data.forEach((featureGroup) => {
        const featureName = featureGroup.collection_name;

        const isHidden = hiddenCollections.has(featureName);

        // logger.log(`🔍 Feature: ${featureName}, Hidden: ${isHidden}`);

        if (isHidden) {
          (featureGroup.data || []).forEach((item) => {
            if (loadedShapesRef.current.has(item.id)) {
              const layers = layersRef.current.get(item.id);
              if (layers) {
                map.removeLayer(layers.shape);
                map.removeLayer(layers.label);
                layersRef.current.delete(item.id);
                loadedShapesRef.current.delete(item.id);
                // logger.log(`🚫 شکل حذف شد (collection مخفی): ${item.id} - ${featureName}`);
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

          const latlngs = item.coordinates.map((c) => [
            c.latitude,
            c.longitude,
          ]);

          const shape =
            item.type === "polyline"
              ? L.polyline(latlngs, { color: item.properties?.color || "blue" })
              : L.polygon(latlngs, {
                  color: item.properties?.color || "red",
                  fillColor: item.properties?.color || "red",
                  fillOpacity: 0.4,
                });

          shape._serverId = item.id;
          shape._text =
            item.properties?.name ?? item.properties?.ProvincName ?? "No title";

          const label = createLabel(shape, item);

          shape.addTo(map);
          label.addTo(map);
          shape._label = label;

          loadedShapesRef.current.add(item.id);
          layersRef.current.set(item.id, { shape, label, item });
          // logger.log(
          //   `✅ شکل جدید اضافه شد: ${item.id} (Feature: ${featureName})`,
          // );
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
            // logger.log(`🗑️ شکل حذف شد: ${loadedId}`);
          }
        }
      });
    } catch (err) {
      logger.error("❌ خطا در بارگذاری اشکال:", err);
    }
  }, [map, token, createLabel, hiddenCollections]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  useEffect(() => {
    loadAllShapes();
  }, [loadAllShapes]);

  useEffect(() => {
    if (layersRef.current.size > 0) {
      updateLabels();
    }
  }, [updateLabels]);

  useEffect(() => {
    globalRefreshShapes = loadAllShapes;

    return () => {
      globalRefreshShapes = null;
    };
  }, [loadAllShapes]);

  return null;
}
