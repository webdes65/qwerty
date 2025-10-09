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
import MapDetailModal from "@module/modal/MapDetailModal.jsx";

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
  height = "500px",
}) {
  const [position, setPosition] = useState([lat, lng]);
  const [currentZoom, setCurrentZoom] = useState(zoom);

  const {
    onCreated,
    onEdited,
    onDeleted,
    isModalOpen,
    modalData,
    handleModalSubmit,
    handleModalCancel,
  } = useMapDrawHandlers();

  return (
    <div className="w-full bg-white text-dark-100 dark:bg-dark-100 dark:text-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-tealBlue dark:from-blue-600 dark:to-blue-800 text-white p-4">
        <h2 className="text-2xl font-bold">Interactive map</h2>
        <p className="text-sm  mt-1">Click on the map to select a location</p>
      </div>

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
          minZoom={15}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={onCreated}
              onEdited={onEdited}
              onDeleted={onDeleted}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polygon: {
                  allowIntersection: true,
                  showArea: true,
                  shapeOptions: { color: "#3388ff", weight: 3 },
                  repeatMode: true,
                },
              }}
            />
          </FeatureGroup>

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

          <UseMapEvents setPosition={setPosition} setZoom={setCurrentZoom} />
        </MapContainer>
      </div>

      <div className="p-3 border-t text-sm text-dark-100 dark:text-white flex justify-between">
        <span>
          Position: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </span>
        <span>Zoom: {currentZoom}</span>
      </div>

      <MapDetailModal
        isOpenCreateModal={isModalOpen}
        setIsOpenCreateModal={(open) => {
          if (!open) {
            handleModalCancel();
          }
        }}
        onSubmit={handleModalSubmit}
        initialData={modalData}
        title="اطلاعات شکل جدید"
      />
    </div>
  );
}
