import { useState, useMemo } from "react";
import logger from "@utils/logger.js";
import { UseSetCollection } from "@store/UseSetCollection.js";
import { getBorderStyle } from "@store/UseShapeStyle.js";
import DrawHandlers from "@module/container/main/map/DrawHandlers.js";

export const useMapDrawHandlers = () => {
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

  const { handleCreateSubmit, onCreated } = DrawHandlers({
    setIsModalOpen,
    collection_Name,
    getBorderStyleOptions,
    collections,
    tempLayer,
    setTempLayer,
    modalData,
    setModalData,
  });

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
