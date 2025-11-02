import { useState, useEffect, useMemo } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Modal, Form, Input, Button, ColorPicker, Select, Slider } from "antd";
import Cookies from "universal-cookie";
import logger from "@utils/logger.js";
import { triggerMapRefresh } from "@module/card/map/MapShapesLoader.jsx";
import { UseSetCollection } from "@store/UseSetCollection.js";
import { UseShapeStyle } from "@store/UseShapeStyle.js";

const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

const MapDetailModal = ({
  isOpenModal,
  setIsOpenModal,
  onSubmit,
  title,
  initialData = null,
  edit = false,
}) => {
  const [form] = Form.useForm();
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");
  const [color, setColor] = useState("");
  const [AllCollections, setAllCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const setCollection = UseSetCollection((state) => state.setCollection);
  const collections = UseSetCollection((state) => state.collections);
  const collection = UseSetCollection((state) => state.collection);

  const borderType = UseShapeStyle((state) => state.borderType);
  const setBorderType = UseShapeStyle((state) => state.setBorderType);
  const borderWidth = UseShapeStyle((state) => state.borderWidth);
  const setBorderWidth = UseShapeStyle((state) => state.setBorderWidth);

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
        const errorText = await response.text();
        logger.error("خطا در ویرایش شکل:", errorText);
        return;
      }

      const result = await response.json();
      logger.log("✅ تغییرات با موفقیت ذخیره شد:", result);

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
        const errorText = await response.text();
        logger.error("خطا در حذف شکل:", errorText);
        return;
      }

      logger.log("✅ شکل با موفقیت حذف شد");

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

  return (
    <Modal
      className="font-Quicksand cursor-default"
      title={title || "shape information"}
      open={isOpenModal}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Please enter a title" },
            { min: 3, message: "Title must be at least 3 characters." },
          ]}
        >
          <Input
            placeholder="Example: office area, park, ..."
            size="large"
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { min: 10, message: "Description must be at least 10 characters" },
          ]}
        >
          <Input.TextArea
            placeholder="Full description of this area..."
            rows={4}
            maxLength={100}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Collection"
          name="collections"
          rules={[{ required: true, message: "Collection is required" }]}
        >
          <Select
            mode="tags"
            maxCount={1}
            showSearch
            className="customSelect w-full font-Quicksand"
            placeholder="Choose existing or type new collection name"
            optionFilterProp="label"
            allowClear
            options={AllCollections}
            value={selectedCollection ? [selectedCollection] : []}
            onChange={(values) => {
              const value =
                values && values.length > 0 ? values[values.length - 1] : null;
              handleCollectionChange(value);
            }}
            suffixIcon
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            tokenSeparators={[","]}
          />
        </Form.Item>

        {initialData?.type !== "marker" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Border Style"
                name="borderType"
                initialValue="solid"
              >
                <Select
                  value={borderType}
                  onChange={setBorderType}
                  size="middle"
                  options={[
                    { label: "Solid", value: "solid" },
                    { label: "Dotted", value: "dotted" },
                    { label: "Dashed", value: "dashed" },
                    { label: "Double", value: "double" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label={`Border Width (${borderWidth}px)`}
                name="borderWidth"
                initialValue={3}
              >
                <Slider
                  min={1}
                  max={10}
                  value={borderWidth}
                  onChange={setBorderWidth}
                  marks={{
                    1: "1",
                    5: "5",
                    10: "10",
                  }}
                />
              </Form.Item>
            </div>
          </>
        )}

        <div
          className={`flex items-center justify-between w-full ${initialData?.type !== "marker" ? "flex-row" : "flex-col"}`}
        >
          <Form.Item
            label="Color"
            required
            className={initialData?.type !== "marker" ? "w-2/4" : "w-full"}
          >
            <div className="flex items-center gap-3">
              <ColorPicker
                value={color}
                onChange={setColor}
                showText
                size="middle"
                presets={[
                  {
                    label: "Suggested colors",
                    colors: [
                      "#ff0000",
                      "#00ff00",
                      "#0000ff",
                      "#ffff00",
                      "#ff00ff",
                      "#00ffff",
                      "#ff8800",
                      "#8800ff",
                    ],
                  },
                ]}
              />
            </div>
          </Form.Item>

          {initialData?.type !== "marker" && (
            <div className="mb-4 bg-white dark:bg-dark-100 rounded w-2/4">
              <p className="text-dark-100 dark:text-white mb-2">
                Border Preview:
              </p>
              <div
                className="w-full h-12 rounded"
                style={{
                  border: `${borderWidth}px ${borderType} ${typeof color === "string" ? color : color.toHexString()}`,
                }}
              />
            </div>
          )}
        </div>

        {initialData?.latlngs ? (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Number of points: {initialData?.latlngs?.length}
            </p>
          </div>
        ) : initialData?.coordinates ? (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Number of points: {initialData?.coordinates?.length}
            </p>
          </div>
        ) : null}

        <Form.Item className="mb-0 mt-6">
          <div className="flex flex-row-reverse items-center justify-between">
            <div className="flex justify-end gap-2">
              <Button
                className="bg-blue-500 hover:!bg-blue-500 hover:!border-blue-500 hover:!text-white"
                onClick={handleCancel}
                size="middle"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="middle"
                className="bg-green-500 hover:!bg-green-500 hover:!border-green-500 hover:!text-white"
              >
                {edit ? "Update" : "Send"}
              </Button>
            </div>
            {edit && (
              <Button
                type="text"
                danger
                icon={<IoTrashOutline size={20} />}
                onClick={handleDeleteConfirm}
                size="middle"
              >
                Delete
              </Button>
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MapDetailModal;
