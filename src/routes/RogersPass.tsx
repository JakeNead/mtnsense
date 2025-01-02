import { useState, useEffect } from "react";
import "../App.css";
import { Text, Heading, Image, Box, Flex } from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";

interface AvyReport {
  title: string;
  date: string;
  author: string;
  body: string[];
}

function RogersPass() {
  const [avyReport, setAvyReport] = useState<AvyReport[] | null>(null);

  useEffect(() => {
    async function fetchAvyReport() {
      try {
        const response = await fetch(`api/rogers-pass-report`);
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

  // this is a trigger to test serverless functions before refactoring to schedule functions
  useEffect(() => {
    const fetchAvy = async () => {
      try {
        const response = await fetch(`api/rogers-pass-avy`);
        if (!response.ok) {
          throw new Error(`Something went wrong. Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching forecast:", error);
      }
    };
    fetchAvy();
  }, []);

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

  const invertColors = useColorModeValue("none", "invert(1)");

  return (
    <>
      <Heading>Rogers Pass, BC</Heading>
      <Heading>Webcam</Heading>
      <Flex direction="column" padding=".5rem" alignItems="center" gap="1rem">
        <Image src="https://cache.drivebc.ca/bchighwaycam/pub/cameras/101.jpg"></Image>
        <Image
          src={"https://mtnsense.s3.amazonaws.com/rogers-pass-avy/latest.png"}
          alt="Rogers Pass Avalanche Forecast"
          filter={invertColors}
        />

        <Heading>Weather</Heading>
        <Image
          src={
            "https://mtnsense.s3.amazonaws.com/rogers-pass-forecast/latest.png"
          }
          alt="Rogers Pass Weather Forecast"
          filter={invertColors}
        />
        <Heading>Reports</Heading>
        {avyReport ? (
          avyReport.map((obj, index) => (
            <Box key={index} maxW="95vw" p=".5rem" m="1rem 0">
              <Text fontWeight="bold" mb="0.5rem">
                {obj.title}
              </Text>
              <Text mb="0.5rem">{obj.date}</Text>
              <Text mb="1rem">{obj.author}</Text>
              <Box dangerouslySetInnerHTML={{ __html: obj.body }} />
            </Box>
          ))
        ) : (
          <Text>Loading avalanche report...</Text>
        )}
      </Flex>
    </>
  );
}

export default RogersPass;
