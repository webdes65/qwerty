import Cookies from "universal-cookie";
import { triggerMapRefresh } from "@module/card/map/MapShapesLoader.jsx";
import logger from "@utils/logger.js";
import { useEffect, useMemo } from "react";
import { UseSetCollection } from "@store/UseSetCollection.js";

const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

export default function DetailModalHandlers({
  color,
  setColor,
  initialData,
  borderType,
  borderWidth,
  setSelectedCollection,
  isOpenModal,
  setAllCollections,
  form,
  setBorderType,
  setBorderWidth,
  setIsOpenModal,
  onSubmit,
  edit,
}) {
  const setCollection = UseSetCollection((state) => state.setCollection);
  const collections = UseSetCollection((state) => state.collections);
  const collection = UseSetCollection((state) => state.collection);

  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");

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

  useEffect(() => {
    if (isOpenModal && initialData) {
      const formattedCollections =
        collections?.map((item) => ({
          label: item.name,
          value: item.uuid,
        })) || [];

      setAllCollections(formattedCollections);

      form.setFieldsValue({
        title: initialData.name ?? "",
        description: initialData.description ?? "",
        type: "polygon",
        collections: initialData.collection_id ?? null,
        borderType: initialData.properties?.borderType || "solid",
        borderWidth: initialData.properties?.borderWidth || 3,
      });

      setColor(initialData.properties?.color || initialData.color || "#ff0000");

      if (initialData.collection_id) {
        setSelectedCollection(initialData.collection_id);
        setCollection(initialData.collection_id);
      }

      if (initialData.properties?.borderType) {
        setBorderType(initialData.properties.borderType);
      }
      if (initialData.properties?.borderWidth) {
        setBorderWidth(initialData.properties.borderWidth);
      }
    } else if (!isOpenModal) {
      form.resetFields();
      setColor("#ff0000");
      setAllCollections([]);
      setSelectedCollection(null);
      setCollection(null);
    }
  }, [
    isOpenModal,
    initialData,
    form,
    collections,
    setCollection,
    setBorderType,
    setBorderWidth,
  ]);

  const handleCancel = () => {
    form.resetFields();
    setColor("#ff0000");
    setSelectedCollection(null);
    setCollection(null);
    setIsOpenModal(false);
  };

  const handleCollectionChange = (value) => {
    setSelectedCollection(value);
    setCollection(value);
  };

  const handleEditSubmit = async (values) => {
    try {
      const hexColor = typeof color === "string" ? color : color.toHexString();

      const response = await fetch(
        BASE_URL + `/gis/features/${initialData?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              name: values.title,
              description: values.description,
              type: values.type || "polygon",
              color: hexColor,
              borderType: values.borderType || borderType,
              borderWidth: values.borderWidth || borderWidth,
              collection_id: isNewCollection ? null : collection,
              collection_name: collection_Name,
            },
          }),
        },
      );

      if (!response.ok) {
        return;
      }

      form.resetFields();
      setColor("#ff0000");
      setSelectedCollection(null);
      setCollection(null);
      setIsOpenModal(false);

      triggerMapRefresh();
    } catch (error) {
      logger.error("❌ خطا در ویرایش:", error);
    }
  };

  const handleSubmit = async (values) => {
    const hexColor = typeof color === "string" ? color : color.toHexString();

    const dataToSubmit = {
      name: values.title,
      description: values.description,
      type: values.type || "polygon",
      color: hexColor,
      borderType: values.borderType || borderType,
      borderWidth: values.borderWidth || borderWidth,
    };

    if (!edit) {
      onSubmit(dataToSubmit);
      return;
    }

    await handleEditSubmit(values);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        BASE_URL + `/gis/features/${initialData?.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        return;
      }

      form.resetFields();
      setColor("");
      setSelectedCollection(null);
      setCollection(null);
      setIsOpenModal(false);

      triggerMapRefresh();
    } catch (error) {
      logger.error("❌ خطا در حذف:", error);
    }
  };

  return {
    handleDeleteConfirm,
    handleCancel,
    handleCollectionChange,
    handleSubmit,
  };
}
