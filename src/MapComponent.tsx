import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import avalancheData from "./useAvalancheData";

// Set your Mapbox access token here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getAvalancheData() {
      const avyData = await avalancheData();
      console.log(avyData);
      if (mapContainerRef.current) {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11", // Map style
          center: [-117.52354, 51.29677], // Initial map center [lng, lat]
          zoom: 8, // Initial map zoom level
        });

        map.on("load", () => {
          avyData.forEach((risk) => {
            new mapboxgl.Marker()
              .setLngLat([risk.longitude, risk.latitude])
              .setPopup(new mapboxgl.Popup().setText(`Risk: ${risk.riskLevel}`))
              .addTo(map);
          });
        });

        // Clean up on unmount
        return () => map.remove();
      }
    }
    getAvalancheData();
  }, []);

  return <div ref={mapContainerRef} style={{ width: "90%", height: "auto" }} />;
};

export default MapComponent;
