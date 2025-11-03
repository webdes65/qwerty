import { useState } from "react";
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
import { useMapDrawHandlers } from "@hooks/UseMapDrawHandlers.js";
import UseMapEvents from "@hooks/UseMapEvents.js";
import MapToolbar from "@module/card/map/MapToolbar.jsx";
import MapShapesLoader from "@module/card/map/MapShapesLoader.jsx";
import MapDetailModal from "@module/modal/map-modal/MapDetailModal.jsx";
import CoordinateEditorModal from "@module/modal/map-modal/CoordinatesEditorModal.jsx";
import CollectionDropdown from "@module/card/map/CollectionDropdown.jsx";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url,
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

export default function MapCard({
  lat = 37.1378,
  lng = 50.2856,
  zoom = 15,
  height = "650px",
}) {
  const [position, setPosition] = useState([lat, lng]);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editShapeData, setEditShapeData] = useState(null);
  const [hiddenCollections, setHiddenCollections] = useState(new Set());
  const [isCordEditModalOpen, setIsCordEditModalOpen] = useState(false);
  const [cordEditShapeData, setCordEditShapeData] = useState(null);

  const {
    onCreated,
    isModalOpen,
    modalData,
    handleCreateSubmit,
    handleModalCancel,
  } = useMapDrawHandlers();

  const handleEditShape = (shapeData) => {
    setEditShapeData(shapeData);
    setIsEditModalOpen(true);
  };

  const handleEditCoordinates = (shapeData) => {
    setCordEditShapeData(shapeData);
    setIsCordEditModalOpen(true);
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

        <CollectionDropdown
          hiddenCollections={hiddenCollections}
          setHiddenCollections={setHiddenCollections}
        />
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
      />
    </div>
  );
}
