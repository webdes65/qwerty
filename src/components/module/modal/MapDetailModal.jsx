import { Modal, Form, Input, Button, ColorPicker } from "antd";
import { useState, useEffect } from "react";

const MapDetailModal = ({
  isOpenCreateModal,
  setIsOpenCreateModal,
  onSubmit,
  title,
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#ff0000");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpenCreateModal && initialData) {
      form.setFieldsValue({
        title: initialData.text || "",
        description: initialData.description || "",
      });
      setColor(initialData.color || "#ff0000");
    } else if (!isOpenCreateModal) {
      form.resetFields();
      setColor("#ff0000");
    }
  }, [isOpenCreateModal, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const dataToSend = {
        title: values.title,
        description: values.description,
        color: typeof color === "string" ? color : color.toHexString(),
        coordinates: initialData?.latlngs || [],
        type: initialData?.type || "polygon",
        createdAt: new Date().toISOString(),
      };

      if (onSubmit) {
        await onSubmit(dataToSend);
      }

      setIsOpenCreateModal(false);
      form.resetFields();
      setColor("#ff0000");
    } catch (error) {
      console.error("خطا در ارسال اطلاعات:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setColor("#ff0000");
    setIsOpenCreateModal(false);
  };

  return (
    <Modal
      className="font-Quicksand"
      title={title || "اطلاعات شکل"}
      open={isOpenCreateModal}
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

        <Form.Item className="mb-0 mt-6">
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
            >
              Save and send
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MapDetailModal;
