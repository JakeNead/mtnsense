import { useState, useEffect } from "react";
import "../App.css";
import { Text, Heading, Image, Box } from "@chakra-ui/react";

interface AvyReport {
  title: string;
  date: string;
  author: string;
  body: string[];
}

function RogersPass() {
  const [avyReport, setAvyReport] = useState<AvyReport[] | null>(null);
  // const [avy, setAvy] = useState<string | null>(null);

  const isDevMode = import.meta.env.VITE_MODE === "developement";

  const baseUrl = isDevMode ? "http://localhost:8888/api" : "/api";

  const forecastUrl = `https://mtnsense.s3.amazonaws.com/rogers-pass-forecast/latest.png`;

  useEffect(() => {
    async function fetchAvyReport() {
      try {
        const response = await fetch(`${baseUrl}/rogers-pass-report`);
        if (!response.ok)
          throw new Error(`Something went wrong. Status: ${response.status}`);
        const data: AvyReport[] = await response.json();
        setAvyReport(data);
      } catch (err) {
        console.error("Error fetching avalanche report: ", err);
      }
    }
    fetchAvyReport();
  }, []);

  // this is a trigger to test my schedule function
  // useEffect(() => {
  //   const fetchForecast = async () => {
  //     try {
  //       const response = await fetch(`${baseUrl}/rogers-pass-forecast`);
  //       if (!response.ok) {
  //         throw new Error(`Something went wrong. Status: ${response.status}`);
  //       }
  //       const message = await response.json();
  //       console.log(message.imageUrl);
  //     } catch (error) {
  //       console.error("Error fetching forecast:", error);
  //     }
  //   };
  //   fetchForecast();
  // }, []);

  // useEffect(() => {
  //   const fetchAvy = async () => {
  //     try {
  //       const response = await fetch(`${baseUrl}/rogers-pass-avy`);
  //       if (!response.ok) {
  //         throw new Error(`Something went wrong. Status: ${response.status}`);
  //       }
  //       const arrayBuffer = await response.arrayBuffer();
  //       const base64 = btoa(
  //         new Uint8Array(arrayBuffer).reduce(
  //           (data, byte) => data + String.fromCharCode(byte),
  //           ""
  //         )
  //       );
  //       setAvy(`data:image/png;base64,${base64}`);
  //     } catch (error) {
  //       console.error("Error fetching forecast:", error);
  //     }
  //   };

  //   fetchAvy();
  // }, []);

  // useEffect(() => {
  //   const fetchAvy = async () => {
  //     try {
  //       const response = await fetch(`${baseUrl}/rogers-pass-avy`);
  //       if (!response.ok) {
  //         throw new Error(`Something went wrong. Status: ${response.status}`);
  //       }
  //       const arrayBuffer = await response.arrayBuffer();
  //       const base64 = btoa(
  //         new Uint8Array(arrayBuffer).reduce(
  //           (data, byte) => data + String.fromCharCode(byte),
  //           ""
  //         )
  //       );
  //       setAvy(`data:image/png;base64,${base64}`);
  //     } catch (error) {
  //       console.error("Error fetching forecast:", error);
  //     }
  //   };

  //   fetchAvy();
  // }, []);

  return (
    <>
      <Heading>Rogers Pass, BC</Heading>
      <Heading>Webcam</Heading>
      <Image src="https://cache.drivebc.ca/bchighwaycam/pub/cameras/101.jpg"></Image>
      {/* {avy ? (
        <Image
          src={avy || ""}
          alt="Rogers Pass Weather Forecast"
          style={{ maxWidth: "90vw" }}
        />
      ) : (
        <Text>Loading avalanche info...</Text>
      )} */}
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
      <Image
        src={
          "https://mtnsense.s3.amazonaws.com/rogers-pass-forecast/latest.png"
        }
        alt="Rogers Pass Weather Forecast"
        style={{ maxWidth: "90vw" }}
      />
    </>
  );
}

export default RogersPass;
