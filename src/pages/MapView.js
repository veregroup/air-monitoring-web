import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Function to return the correct marker color based on AQI
const getAqiColorIcon = (aqi) => {
  let bgColor = '#00e400'; // Default green

  if (aqi > 300) bgColor = '#7e0023'; // maroon
  else if (aqi > 200) bgColor = '#8f3f97'; // purple
  else if (aqi > 150) bgColor = '#ff0000'; // red
  else if (aqi > 100) bgColor = '#ff7e00'; // orange
  else if (aqi > 50) bgColor = '#ffff00'; // yellow

  return L.divIcon({
    className: 'custom-aqi-icon',
    html: `<div style="
      background-color: ${bgColor};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 12px ${bgColor};
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

function MapView() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.openaq.org/v2/latest?city=Makati&parameter=pm25")
      .then((response) => {
        setLocations(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching map data:", error);
      });
  }, []);

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      color: '#fff',
    }}>
      {/* Map Container centered on Lucy Eatery */}
      <MapContainer center={[14.55695, 121.00168]} zoom={17} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />

        {/* AQI markers */}
        {locations.map((loc, i) => (
          loc.coordinates && (
            <Marker
              key={i}
              position={[loc.coordinates.latitude, loc.coordinates.longitude]}
              icon={getAqiColorIcon(loc.measurements[0].value)}
            >
              <Popup>
                <div>
                  <strong>{loc.city}</strong><br />
                  AQI (PM2.5): {loc.measurements[0].value} {loc.measurements[0].unit}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {/* AQI Legend */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        fontSize: '1em',
        color: '#333',
      }}>
        <h4 style={{ marginBottom: '10px', color: '#2575fc' }}>AQI Legend</h4>
        <div style={{ color: '#00e400', fontWeight: 'bold' }}>🟢 Good (0–50)</div>
        <div style={{ color: '#ffff00', fontWeight: 'bold' }}>🟡 Moderate (51–100)</div>
        <div style={{ color: '#ff7e00', fontWeight: 'bold' }}>🟠 Unhealthy for SG (101–150)</div>
        <div style={{ color: '#ff0000', fontWeight: 'bold' }}>🔴 Unhealthy (151–200)</div>
        <div style={{ color: '#8f3f97', fontWeight: 'bold' }}>🟣 Very Unhealthy (201–300)</div>
        <div style={{ color: '#7e0023', fontWeight: 'bold' }}>🟤 Hazardous (301+)</div>
      </div>
    </div>
  );
}

export default MapView;
