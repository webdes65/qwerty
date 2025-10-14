import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

function TestMap() {
  const position = { lat: 35.6892, lng: 51.389 };

  return (
    <APIProvider apiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <Map
        defaultCenter={position}
        defaultZoom={12}
        style={{ width: "100%", height: "500px" }}
      >
        <Marker position={position} />
      </Map>
    </APIProvider>
  );
}

export default TestMap;
