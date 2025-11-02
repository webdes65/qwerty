import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import Cookies from "universal-cookie";
import { useMapDrawHandlers } from "@hooks/UseMapDrawHandlers.js";
import UseMapEvents from "@hooks/UseMapEvents.js";
import MapToolbar from "@module/card/map/MapToolbar.jsx";
import MapShapesLoader, {
  triggerMapRefresh,
} from "@module/card/map/MapShapesLoader.jsx";
import MapDetailModal from "@module/modal/map-modal/MapDetailModal.jsx";
import CoordinateEditorModal from "@module/modal/map-modal/CoordinatesEditorModal.jsx";
import logger from "@utils/logger.js";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url,
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

export default function MapCard({
  lat = 37.1378,
  lng = 50.2856,
  zoom = 15,
  height = "650px",
}) {
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");

  const [position, setPosition] = useState([lat, lng]);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editShapeData, setEditShapeData] = useState(null);
  const [shapesList, setShapesList] = useState([]);
  const [hiddenCollections, setHiddenCollections] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);
  const [isCordEditModalOpen, setIsCordEditModalOpen] = useState(false);
  const [cordEditShapeData, setCordEditShapeData] = useState(null);

  const {
    onCreated,
    isModalOpen,
    modalData,
    handleCreateSubmit,
    handleModalCancel,
  } = useMapDrawHandlers();

  const fetchShapesList = async () => {
    setLoading(true);
    try {
      const response = await fetch(BASE_URL + "/gis/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const result = await response.json();
      setShapesList(result.data || result);
    } catch (error) {
      logger.error("❌ خطا در دریافت لیست:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShapesList();
  }, []);

  const handleCollectionToggle = (collectionName) => {
    setHiddenCollections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(collectionName)) {
        newSet.delete(collectionName);
      } else {
        newSet.add(collectionName);
      }
      return newSet;
    });

    setTimeout(() => {
      triggerMapRefresh();
    }, 1);
  };

  const handleEditShape = (shapeData) => {
    setEditShapeData(shapeData);
    setIsEditModalOpen(true);
  };

  const handleEditCoordinates = (shapeData) => {
    setCordEditShapeData(shapeData);
    setIsCordEditModalOpen(true);
  };

  const handleSaveCoordinates = async (updatedShapeData) => {
    try {
      logger.log("Saving coordinates:", updatedShapeData);

      const response = await fetch(
        `${BASE_URL}/gis/features/${updatedShapeData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              coordinates: updatedShapeData.coordinates,
            },
          }),
        },
      );

      if (!response.ok) {
        return;
      }

      triggerMapRefresh();
    } catch (error) {
      logger.error("❌ خطا در آپدیت کوردینیت‌ها:", error);
    }
  };

  return (
    <div className="w-full !h-auto bg-white text-dark-100 dark:bg-gray-100 dark:text-white rounded-lg shadow-lg overflow-hidden">
      <MapToolbar
        position={position}
        zoom={currentZoom}
        onLatChange={(val) => setPosition([parseFloat(val), position[1]])}
        onLngChange={(val) => setPosition([position[0], parseFloat(val)])}
        onZoomChange={setCurrentZoom}
      />

      <div style={{ height, width: "100%", position: "relative" }}>
        <MapContainer
          center={position}
          zoom={currentZoom}
          minZoom={5}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={onCreated}
              draw={{
                rectangle: false,
                circle: true,
                circlemarker: false,
                marker: true,
                polygon: {
                  allowIntersection: true,
                  showArea: true,
                  shapeOptions: { color: "#3388ff", weight: 3 },
                  repeatMode: true,
                },
                polyline: {
                  shapeOptions: {
                    color: "#3388ff",
                    weight: 4,
                  },
                  repeatMode: true,
                },
              }}
              edit={{
                edit: false,
                remove: false,
              }}
            />
          </FeatureGroup>

          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />

          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />

          <Marker position={position}>
            <Popup>
              <div className="text-center text-dark-100">
                <b>Selected position</b>
                <br />
                Lat: {position[0].toFixed(6)}
                <br />
                Lng: {position[1].toFixed(6)}
              </div>
            </Popup>
          </Marker>

          <MapShapesLoader
            onEditShape={handleEditShape}
            onEditCoordinates={handleEditCoordinates}
            hiddenCollections={hiddenCollections}
          />

          <UseMapEvents setPosition={setPosition} setZoom={setCurrentZoom} />
        </MapContainer>

        <div
          className="absolute top-20 left-2 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-xl"
          style={{
            maxWidth: "300px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={() => setIsPanelCollapsed(false)}
          onMouseLeave={() => setIsPanelCollapsed(true)}
        >
          <div
            className="flex items-center justify-between gap-1 p-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg cursor-pointer"
            onClick={() => {
              setIsPanelCollapsed((prevState) => !prevState);
            }}
          >
            <button className="hover:bg-transparent rounded p-1 transition-colors">
              <svg
                className={`w-4 h-4 transition-transform ${isPanelCollapsed ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {!isPanelCollapsed && (
            <div className="p-3">
              {loading ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto" />
                  <p className="mt-2 text-xs">loading...</p>
                </div>
              ) : shapesList.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-xs">Not found</p>
                </div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  {shapesList.map((shape) => {
                    const isVisible = !hiddenCollections.has(shape.name);
                    return (
                      <label
                        key={shape.uuid}
                        className="flex items-center p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors group"
                      >
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={() => handleCollectionToggle(shape.name)}
                          className="w-4 h-4 ml-2 accent-blue-600 cursor-pointer flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 ml-2">
                          <span className="text-sm text-dark-100 dark:text-white block truncate">
                            {shape.name || `shape ${shape.uuid}`}
                          </span>
                        </div>
                        {shape.color && (
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0 mr-2"
                            style={{ backgroundColor: shape.color }}
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t text-sm text-dark-100 dark:text-white flex justify-between">
        <span>
          Position: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </span>
        <span>Zoom: {currentZoom}</span>
      </div>

      <MapDetailModal
        isOpenModal={isModalOpen}
        setIsOpenModal={(open) => {
          if (!open) {
            handleModalCancel();
          }
        }}
        onSubmit={handleCreateSubmit}
        initialData={modalData}
        title="New shape information"
        edit={false}
      />

      <MapDetailModal
        isOpenModal={isEditModalOpen}
        setIsOpenModal={setIsEditModalOpen}
        initialData={editShapeData}
        title="Edit shape information"
        edit={true}
      />

      <CoordinateEditorModal
        isOpenModal={isCordEditModalOpen}
        setIsOpenModal={setIsCordEditModalOpen}
        shapeData={cordEditShapeData}
        onSave={handleSaveCoordinates}
      />
    </div>
  );
}
