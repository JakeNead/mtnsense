import { useState, useEffect } from "react";
import "../App.css";
import { Text, Heading, Image } from "@chakra-ui/react";

// interface AvyReport {
//   title: string;
//   date: string;
//   author: string;
//   body: string[];
// }

function RogersPass() {
  // const [avyReport, setAvyReport] = useState<AvyReport[] | null>(null);
  const [forecast, setForecast] = useState<string | null>(null);
  // const [avy, setAvy] = useState<string | null>(null);

  const baseUrl =
    import.meta.env.VITE_MODE === "production"
      ? import.meta.env.VITE_PROD_BASE_URL
      : "http://localhost:8888/api";

  // useEffect(() => {
  //   async function fetchAvyReport() {
  //     try {
  //       const response = await fetch(`${baseUrl}/rogers-pass-report`);
  //       if (!response.ok)
  //         throw new Error(`Something went wrong. Status: ${response.status}`);
  //       const data: AvyReport[] = await response.json();
  //       setAvyReport(data);
  //     } catch (err) {
  //       console.error("Error fetching avalanche report: ", err);
  //     }
  //   }
  //   fetchAvyReport();
  // }, []);

  useEffect(() => {
    async function test() {
      const response = await fetch(`${baseUrl}/rogers-pass-forecast`);
      const data = await response.json();
      setForecast(data.description);
      console.log(forecast);
    }
    test();
  }, []);

  // useEffect(() => {
  //   const fetchForecast = async () => {
  //     try {
  //       const response = await fetch(`${baseUrl}/rogers-pass-forecast`);
  //       if (!response.ok) {
  //         throw new Error(`Something went wrong. Status: ${response.status}`);
  //       }
  //       // option 1
  //       const arrayBuffer = await response.arrayBuffer();
  //       const base64 = btoa(
  //         new Uint8Array(arrayBuffer).reduce(
  //           (data, byte) => data + String.fromCharCode(byte),
  //           ""
  //         )
  //       );
  //       // console.log(`data:image/png;base64,${base64}`);
  //       setForecast(`data:image/png;base64,${base64}`);

  //       // option 2
  //       // const base64Image = await response.text();
  //       // console.log(base64Image);

  //       // setForecast(`data:image/png;base64,${base64Image}`);

  //       // option 3
  //       // const { status } = await response.json();
  //       // setForecast(status);
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
      {/* <Heading>Report</Heading> */}
      {/* {avyReport ? (
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
      )} */}
      <Heading>Weather</Heading>
      {/* {forecast ? (
        <Image
          src={forecast}
          alt="Rogers Pass Weather Forecast"
          style={{ maxWidth: "90vw" }}
        />
      ) : (
        <Text>Loading forecast...</Text>
      )} */}
      <Text>{forecast}</Text>
    </>
  );
}

export default RogersPass;
