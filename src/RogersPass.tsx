import { useState, useEffect } from "react";
import "./App.css";

function RogersPass() {
  const [avyReport, setAvyReport] = useState<string[] | null>(null);
  const [forecast, setForecast] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvyReport() {
      try {
        const response = await fetch("http://localhost:3000/rogersPass/report");
        if (!response.ok)
          throw new Error(`Something went wrong. Status: ${response.status}`);
        const data: { avyReport: string } = await response.json();

        setAvyReport(data.avyReport);
      } catch (err) {
        console.error("Error fetching avalanche report: ", err);
      }
    }
    fetchAvyReport();
  }, []);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/rogersPass/forecast"
        );
        if (!response.ok) {
          throw new Error(`Something went wrong. Status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setForecast(`data:image/png;base64,${base64}`);
      } catch (error) {
        console.error("Error fetching forecast:", error);
      }
    };

    fetchForecast();
  }, []);

  return (
    <>
      <h1>Rogers Pass, BC</h1>
      <h2>Webcam</h2>
      <img src="https://cache.drivebc.ca/bchighwaycam/pub/cameras/101.jpg"></img>
      <h2>Avalanche Map</h2>
      <iframe
        style={{ width: "90vw", height: "80vw" }}
        src="https://avalanche.ca/map"
      ></iframe>
      <h2>Report</h2>
      {avyReport ? (
        avyReport.map((text) => <p>{text}</p>)
      ) : (
        <p>Loading avalanche report...</p>
      )}
      <h2>Weather</h2>
      {forecast ? (
        <img
          src={forecast}
          alt="Rogers Pass Weather Forecast"
          style={{ maxWidth: "90vw" }}
        />
      ) : (
        <p>Loading forecast...</p>
      )}
    </>
  );
}

export default RogersPass;
