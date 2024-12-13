import { useState, useEffect } from "react";
import "../App.css";
import { Text, Heading, Image, Box } from "@chakra-ui/react";
// import MapComponent from "../MapComponent";

interface AvyReport {
  title: string;
  date: string;
  author: string;
  body: any;
}

function RogersPass() {
  const [avyReport, setAvyReport] = useState<AvyReport[] | null>(null);
  const [forecast, setForecast] = useState<string | null>(null);
  const [avy, setAvy] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvyReport() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}rogersPass/report`
        );
        if (!response.ok)
          throw new Error(`Something went wrong. Status: ${response.status}`);
        const data: { avyReport: string[] } = await response.json();
        setAvyReport(data);
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
          `${import.meta.env.VITE_BASE_URL}rogersPass/forecast`
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

  useEffect(() => {
    const fetchAvy = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}rogersPass/avy`
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
        setAvy(`data:image/png;base64,${base64}`);
      } catch (error) {
        console.error("Error fetching forecast:", error);
      }
    };

    fetchAvy();
  }, []);

  return (
    <>
      <Heading>Rogers Pass, BC</Heading>
      <Heading>Webcam</Heading>
      <Image src="https://cache.drivebc.ca/bchighwaycam/pub/cameras/101.jpg"></Image>
      {/* <MapComponent /> */}
      <Heading>Avalanche Map</Heading>
      {forecast ? (
        <Image
          src={avy}
          alt="Rogers Pass Weather Forecast"
          style={{ maxWidth: "90vw" }}
        />
      ) : (
        <Text>Loading avalanche info...</Text>
      )}
      <Heading>Report</Heading>
      {avyReport ? (
        avyReport.map((obj, index) => (
          <Box key={index}>
            <Text>{obj.author}</Text>
            <Text>{obj.date}</Text>
            <Text>{obj.title}</Text>
            <Box dangerouslySetInnerHTML={{ __html: obj.body }} />
          </Box>
        ))
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
