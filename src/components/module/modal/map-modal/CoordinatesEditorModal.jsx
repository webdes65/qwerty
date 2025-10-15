import { useState, useEffect } from "react";
import { Modal, Button, InputNumber, Tooltip, Space } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

export default function CoordinateEditorModal({
  isOpenModal,
  setIsOpenModal,
  shapeData,
  onSave,
}) {
  const [coordinates, setCoordinates] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (shapeData?.coordinates) {
      setCoordinates(
        shapeData.coordinates.map((coord) => ({
          latitude: coord.latitude,
          longitude: coord.longitude,
        })),
      );
    }
  }, [shapeData]);

  const handleCoordinateChange = (index, field, value) => {
    const newCoords = [...coordinates];
    newCoords[index] = {
      ...newCoords[index],
      [field]: value || 0,
    };
    setCoordinates(newCoords);
  };

  const handleAddPoint = () => {
    setCoordinates([...coordinates, { latitude: 0, longitude: 0 }]);
  };

  const handleRemovePoint = (index) => {
    if (coordinates.length <= 2) {
      Modal.warning({
        title: "Cannot remove point",
        content: "A shape must have at least 2 points!",
      });
      return;
    }
    const newCoords = coordinates.filter((_, i) => i !== index);
    setCoordinates(newCoords);
  };

  const handleSave = () => {
    onSave?.({
      ...shapeData,
      coordinates,
    });
    setIsOpenModal(false);
  };

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  return (
    <Modal
      className="font-Quicksand cursor-default"
      title={
        <div className="flex items-center gap-2">
          <span>Edit Coordinates - {shapeData?.name || "Shape"}</span>
        </div>
      }
      open={isOpenModal}
      onCancel={handleCancel}
      width={800}
      footer={[
        <div key="footer" className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total points:{" "}
            <span className="font-semibold">{coordinates.length}</span>
          </div>
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSave}
              className="bg-blue-600 hover:!bg-blue-700"
            >
              Save Changes
            </Button>
          </Space>
        </div>,
      ]}
      destroyOnHidden
    >
      <div className="mb-4 p-3 bg-white dark:bg-dark-100 border border-blue-800 dark:border-lightBlue rounded-lg">
        <div className="flex items-start gap-2">
          <InfoCircleOutlined className="text-lightBlue text-lg mt-0.5" />
          <div className="text-sm text-dark-100 dark:text-white">
            <p className="font-semibold mb-1">How to use:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Hover over a point number to highlight it on the map</li>
              <li>Edit latitude and longitude values directly</li>
              <li>Add new points or remove existing ones</li>
              <li>Points are numbered starting from 0</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
        {coordinates.map((coord, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg transition-all ${
              hoveredIndex === index
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md"
                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start gap-4">
              {/* Point Number */}
              <Tooltip title={`Point ${index}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                    hoveredIndex === index ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  {index}
                </div>
              </Tooltip>

              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Latitude
                  </label>
                  <InputNumber
                    value={coord.latitude}
                    onChange={(value) =>
                      handleCoordinateChange(index, "latitude", value)
                    }
                    className="w-full"
                    placeholder="37.123456"
                    step={0.000001}
                    precision={6}
                    controls={false}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Longitude
                  </label>
                  <InputNumber
                    value={coord.longitude}
                    onChange={(value) =>
                      handleCoordinateChange(index, "longitude", value)
                    }
                    className="w-full"
                    placeholder="50.123456"
                    step={0.000001}
                    precision={6}
                    controls={false}
                  />
                </div>
              </div>

              <Tooltip title="Remove point">
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemovePoint(index)}
                  className="flex-shrink-0"
                />
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddPoint}
        className="w-full mt-4"
        size="middle"
      >
        Add New Point
      </Button>
    </Modal>
  );
}
