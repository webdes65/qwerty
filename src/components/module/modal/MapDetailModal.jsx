import { useState, useEffect, useMemo } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Modal, Form, Input, Button, ColorPicker, Select } from "antd";
import Cookies from "universal-cookie";
import logger from "@utils/logger.js";
import { triggerMapRefresh } from "@module/card/map/MapShapesLoader.jsx";
import { UseSetCollection } from "@store/UseSetCollection.js";

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
  const [color, setColor] = useState("#ff0000");
  const [AllCollections, setAllCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const collections = UseSetCollection((state) => state.collections);
  const setCollection = UseSetCollection((state) => state.setCollection);
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

  useEffect(() => {
    if (isOpenModal && initialData) {
      const formattedCollections =
        collections?.map((item) => ({
          label: item.name,
          value: item.uuid,
        })) || [];

      setAllCollections(formattedCollections);

      // logger.info("formattedCollections", formattedCollections);

      form.setFieldsValue({
        title: initialData.name ?? "",
        description: initialData.description ?? "",
        type: initialData.type || "polygon",
        collections: initialData.collection_id ?? null,
      });

      setColor(initialData.properties?.color || initialData.color || "#ff0000");

      if (initialData.collection_id) {
        setSelectedCollection(initialData.collection_id);
        setCollection(initialData.collection_id);
      }
    } else if (!isOpenModal) {
      form.resetFields();
      setColor("#ff0000");
      setAllCollections([]);
      setSelectedCollection(null);
      setCollection(null);
    }
  }, [isOpenModal, initialData, form, collections, setCollection]);

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

    /*const isUUID = collections?.some((item) => item.uuid === value);
    logger.log("Collection:", {
      value,
      isUUID,
      type: isUUID ? "Existing (UUID)" : "New (String)",
    });*/
  };

  const handleSubmit = async (values) => {
    const hexColor = typeof color === "string" ? color : color.toHexString();

    const dataToSubmit = {
      name: values.title,
      description: values.description,
      type: values.type || "polygon",
      color: hexColor,
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
      setColor("#ff0000");
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
      className="font-Quicksand"
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

        <Form.Item label="Color" required>
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
            <div
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{
                backgroundColor:
                  typeof color === "string" ? color : color.toHexString(),
              }}
            />
          </div>
        </Form.Item>

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
