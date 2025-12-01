import "@styles/inputStyles.css";

export default function MapToolbar({
  position,
  zoom,
  onLatChange,
  onLngChange,
  onZoomChange,
}) {
  return (
    <div className="p-4 bg-white text-dark-100 dark:bg-gray-100 dark:text-white border-b">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="labelStyle">Latitude</label>
          <input
            type="number"
            step="0.000001"
            value={position[0]}
            onChange={(e) => onLatChange(e.target.value)}
            className="inputStyle"
          />
        </div>

        <div>
          <label className="labelStyle">Longitude</label>
          <input
            type="number"
            step="0.000001"
            value={position[1]}
            onChange={(e) => onLngChange(e.target.value)}
            className="inputStyle"
          />
        </div>

        <div>
          <label className="labelStyle">Zoom</label>
          <input
            type="number"
            min="5"
            max="18"
            value={zoom}
            onChange={(e) => onZoomChange(parseInt(e.target.value))}
            className="inputStyle"
          />
        </div>
      </div>
    </div>
  );
}
