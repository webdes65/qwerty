import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Modal, Form, Button, Slider } from "antd";
import { UseShapeStyle } from "@store/UseShapeStyle.js";
import DetailModalHandlers from "@module/container/map/DetailModalHandlers.js";
import DynamicColorPicker from "@module/field/DynamicColorPicker.jsx";
import DynamicInput from "@module/field/DynamicInput.jsx";
import DynamicTextArea from "@module/field/DynamicTextArea.jsx";
import DynamicSelectBox from "@module/field/DynamicSelectBox.jsx";

const MapDetailModal = ({
  isOpenModal,
  setIsOpenModal,
  onSubmit,
  title,
  initialData = null,
  edit = false,
}) => {
  const [form] = Form.useForm();
  const [color, setColor] = useState("");
  const [allCollections, setAllCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const borderType = UseShapeStyle((state) => state.borderType);
  const setBorderType = UseShapeStyle((state) => state.setBorderType);
  const borderWidth = UseShapeStyle((state) => state.borderWidth);
  const setBorderWidth = UseShapeStyle((state) => state.setBorderWidth);

  const {
    handleCancel,
    handleCollectionChange,
    handleDeleteConfirm,
    handleSubmit,
  } = DetailModalHandlers({
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
  });

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
        <DynamicInput
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Please enter a title" },
            { min: 3, message: "Title must be at least 3 characters." },
          ]}
          placeholder="Example: office area, park, ..."
          size="large"
          maxLength={50}
        />

        <DynamicTextArea
          label="Description"
          name="description"
          rules={[
            { min: 10, message: "Description must be at least 10 characters" },
          ]}
          placeholder="Full description of this area..."
          rows={4}
          maxLength={100}
        />

        <DynamicSelectBox
          label="Collection"
          name="collections"
          rules={[{ required: true, message: "Collection is required" }]}
          mode="tags"
          maxCount={1}
          showSearch
          placeholder="Choose existing or type new collection name"
          optionFilterProp="label"
          allowClear
          options={allCollections}
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

        {initialData?.type !== "marker" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <DynamicSelectBox
                label="Border Style"
                name="borderType"
                initialValue="solid"
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
          <DynamicColorPicker
            label="Color"
            data={initialData}
            color={color}
            setColor={setColor}
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
