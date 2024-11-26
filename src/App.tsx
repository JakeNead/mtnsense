import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [avyForecast, setAvyForecast] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvyForecast() {
      try {
        const response = await fetch("http://localhost:3000/revelstoke/report");
        if (!response.ok)
          throw new Error(`Uh oh, HTTP error! status ${response.status}`);
        const data: { avyReport: string } = await response.json();

        setAvyForecast(data.avyReport);
      } catch (err) {
        console.error("Error fetching avalanche forecast: ", err);
      }
    }
    fetchAvyForecast();
  }, []);
  return (
    <>
      <h1>Revelstoke, BC</h1>
      <h2>Webcam</h2>
      <img src="https://cache.drivebc.ca/bchighwaycam/pub/cameras/101.jpg"></img>
      <h2>Avalanche</h2>

      <iframe
        style={{ width: "90vw", height: "80vw" }}
        src="https://avalanche.ca/map"
      ></iframe>
      <h2>Report</h2>
      {avyForecast ? (
        <p dangerouslySetInnerHTML={{ __html: avyForecast }} />
      ) : (
        <p>Loading avalanche report...</p>
      )}
      <h2>Weather</h2>
      <div>weather info goes here</div>
    </>
  );
}

export default App;
