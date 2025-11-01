import "@styles/inputStyle.css";

export default function MapToolbar({
  position,
  zoom,
  onLatChange,
  onLngChange,
  onZoomChange,
  // onGoToLocation,
}) {
  /*const cities = [
        { name: "تهران", lat: 35.6892, lng: 51.389 },
        { name: "مشهد", lat: 36.2974, lng: 59.6061 },
        { name: "اصفهان", lat: 32.6546, lng: 51.668 },
        { name: "شیراز", lat: 29.5918, lng: 52.5836 },
        { name: "تبریز", lat: 38.0736, lng: 46.2919 },
        { name: "رودسر", lat: 37.1378, lng: 50.2856 },
    ];*/

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

      {/*<div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">مکان‌های پیشنهادی:</p>
                <div className="flex flex-wrap gap-2">
                    {cities.map((city) => (
                        <button
                            key={city.name}
                            onClick={() => onGoToLocation(city.lat, city.lng)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                        >
                            {city.name}
                        </button>
                    ))}
                </div>
            </div>*/}
    </div>
  );
}
