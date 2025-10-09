import { useMapEvents } from "react-leaflet";

export default function UseMapEvents({ setPosition, setZoom }) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
    zoomend() {
      setZoom(map.getZoom());
    },
  });

  map.getContainer().addEventListener("contextmenu", (e) => e.preventDefault());

  return null;
}
