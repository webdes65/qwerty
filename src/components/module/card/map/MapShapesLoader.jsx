import { useEffect, useRef, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import ShapeHandlers from "@module/container/map/ShapeHandlers.js";
import logger from "@utils/logger.js";

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
  const layersRef = useRef(new Map());

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
          <div class="group flex flex-col items-center justify-center text-white text-lg font-bold px-2 py-1 min-w-40 min-h-16">
              <h1 class="text-start min-w-full">${shape._text}</h1>
              <p class="text-start min-w-full">${item.properties.ProvinDesc ?? ""}</p>
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
        description: item.properties?.ProvinDesc,
        type: item.type,
        coordinates: item.coordinates,
        properties: item.properties,
      };

      attachButtonEvents(label, shapeData);

      return label;
    },
    [attachButtonEvents],
  );

  const { loadCollections, loadAllShapes } = ShapeHandlers({
    createLabel,
    hiddenCollections,
    layersRef,
  });

  const updateLabels = useCallback(() => {
    layersRef.current.forEach(({ shape, label, item }, id) => {
      map.removeLayer(label);

      const newLabel = createLabel(shape, item);
      newLabel.addTo(map);

      layersRef.current.set(id, { shape, label: newLabel, item });
    });
  }, [map, createLabel]);

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
