import { useState, useEffect } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Modal, Form, Input, Button, ColorPicker } from "antd";
import Cookies from "universal-cookie";
import logger from "@utils/logger.js";
import { triggerMapRefresh } from "@module/card/map/MapShapesLoader.jsx";

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

  useEffect(() => {
    if (isOpenModal && initialData) {
      form.setFieldsValue({
        title: initialData.name || "",
        description: initialData.description || "",
      });
      setColor(initialData.properties?.color || initialData.color || "#ff0000");
    } else if (!isOpenModal) {
      form.resetFields();
      setColor("#ff0000");
    }
  }, [isOpenModal, initialData, form]);

  const handleCancel = () => {
    form.resetFields();
    setColor("#ff0000");
    setIsOpenModal(false);
  };

  const handleSubmit = async (values) => {
    const hexColor = typeof color === "string" ? color : color.toHexString();

    const dataToSubmit = {
      title: values.title,
      description: values.description,
      color: hexColor,
    };

    logger.log("📤 Data being submitted from modal:", dataToSubmit);

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
            name: values.title,
            description: values.description,
            color: hexColor,
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
            { required: true, message: "Please enter a description" },
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

        <Form.Item label="Color" required>
          <div className="flex items-center gap-3">
            <ColorPicker
              value={color}
              onChange={setColor}
              showText
              size="large"
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
              className="w-12 h-12 rounded border-2 border-gray-300"
              style={{
                backgroundColor:
                  typeof color === "string" ? color : color.toHexString(),
              }}
            />
          </div>
        </Form.Item>

        {initialData?.latlngs && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Number of points: {initialData.latlngs.length}
            </p>
          </div>
        )}

        {initialData?.coordinates && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Number of points: {initialData.coordinates.length}
            </p>
          </div>
        )}

        <Form.Item className="mb-0 mt-6">
          <div className="flex flex-row-reverse items-center justify-between">
            <div className="flex justify-end gap-2">
              <Button
                className="bg-blue-500 hover:!bg-blue-500 hover:!border-blue-500 hover:!text-white"
                onClick={handleCancel}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
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
                size="large"
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
