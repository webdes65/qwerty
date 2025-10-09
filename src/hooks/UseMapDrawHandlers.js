import L from "leaflet";

export const useMapDrawHandlers = () => {
  const saveToLocalStorage = (data) => {
    localStorage.setItem("polygonsData", JSON.stringify(data));
  };

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem("polygonsData");
    return data ? JSON.parse(data) : [];
  };

  const onCreated = (e) => {
    const layer = e.layer;
    const text = prompt("متن داخل شکل:", "منطقه جدید");
    const color = prompt("رنگ شکل:", "#ff0000");

    layer.setStyle({
      color,
      fillColor: color,
      fillOpacity: 0.4,
    });

    const center = layer.getBounds().getCenter();

    const label = L.marker(center, {
      icon: L.divIcon({
        className: "polygon-label",
        html: `<div style="color:white; font-weight:bold;">${text}</div>`,
      }),
    }).addTo(layer._map);

    layer._label = label;
    layer._text = text;
    layer._color = color;
    layer._id = Date.now();
    const latlngs = layer.getLatLngs()[0].map((p) => ({
      lat: p.lat,
      lng: p.lng,
    }));

    const polygons = loadFromLocalStorage();
    polygons.push({
      id: layer._id,
      text,
      color,
      latlngs,
      zoom: layer._map.getZoom(),
    });
    saveToLocalStorage(polygons);

    layer.addTo(layer._map);
  };

  const onEdited = (e) => {
    const polygons = loadFromLocalStorage();

    e.layers.eachLayer((layer) => {
      const latlngs = layer.getLatLngs()[0].map((p) => ({
        lat: p.lat,
        lng: p.lng,
      }));

      const idx = polygons.findIndex((p) => p.id === layer._id);
      if (idx !== -1) {
        polygons[idx] = {
          ...polygons[idx],
          latlngs,
          zoom: layer._map.getZoom(),
        };
      }
    });

    saveToLocalStorage(polygons);
  };

  const onDeleted = (e) => {
    let polygons = loadFromLocalStorage();

    e.layers.eachLayer((layer) => {
      if (layer._label) {
        layer._map.removeLayer(layer._label);
      }

      polygons = polygons.filter((p) => p.id !== layer._id);

      layer._map.removeLayer(layer);
    });

    saveToLocalStorage(polygons);
  };

  return { onCreated, onEdited, onDeleted };
};
