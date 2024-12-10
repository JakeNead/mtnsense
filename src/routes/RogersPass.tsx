import { useState, useEffect } from "react";
import "../App.css";
import { Text, Heading, Image } from "@chakra-ui/react";
import MapComponent from "../MapComponent";

function RogersPass() {
  const [avyReport, setAvyReport] = useState<string[] | null>(null);
  const [forecast, setForecast] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvyReport() {
      try {
        const response = await fetch("http://localhost:3000/rogersPass/report");
        if (!response.ok)
          throw new Error(`Something went wrong. Status: ${response.status}`);
        const data: { avyReport: string[] } = await response.json();
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
      <Heading>Rogers Pass, BC</Heading>
      <Heading>Webcam</Heading>
      <Image src="https://cache.drivebc.ca/bchighwaycam/pub/cameras/101.jpg"></Image>
      {/* <MapComponent /> */}
      <Heading>Avalanche Map</Heading>
      <iframe
        style={{ width: "90vw", height: "80vw" }}
        src="https://avalanche.ca/map?lat=51.300243&lng=-117.540345"
      ></iframe>
      <Heading>Report</Heading>
      {avyReport ? (
        avyReport.map((text, index) => <Text key={index}>{text}</Text>)
      ) : (
        <Text>Loading avalanche report...</Text>
      )}
      <Heading>Weather</Heading>
      {forecast ? (
        <Image
          src={forecast}
          alt="Rogers Pass Weather Forecast"
          style={{ maxWidth: "90vw" }}
        />
      ) : (
        <Text>Loading forecast...</Text>
      )}
    </>
  );
}

export default RogersPass;
