import { useState, useEffect } from "react";
import "../App.css";
import { Text, Heading, Image, Box, Flex } from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import AvCan from "../components/rogersPass/avCanada/RogersPassAvy";
import { AvyData, Report } from "../interfaces/AvyReport";

interface AvyReport {
  title: string;
  date: string;
  author: string;
  body: string[];
}

function RogersPass() {
  const [reports, setReports] = useState<AvyReport[] | null>(null);
  const [avyData, setAvyData] = useState<Report | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch(
          "https://mtnsense.s3.us-west-2.amazonaws.com/rogers-pass-report/latest.json"
        );
        if (!response.ok)
          throw new Error(`Something went wrong. Status: ${response.status}`);
        const data: AvyReport[] = await response.json();
        setReports(data);
      } catch (err) {
        console.error("Error fetching avalanche report: ", err);
      }
    }
    fetchReport();
  }, []);

  useEffect(() => {
    async function fetchAvy() {
      try {
        const response = await fetch(
          "https://mtnsense.s3.us-west-2.amazonaws.com/rogers-pass-avy/latest.json"
        );
        if (!response.ok)
          throw new Error(`Something went wrong. Status: ${response.status}`);
        const data: AvyData = await response.json();
        setAvyData(data.report);
      } catch (err) {
        console.error("Error fetching avalanche report: ", err);
      }
    }
    fetchAvy();
  }, []);

  const invertColors = useColorModeValue("none", "invert(1)");

  return (
    <>
      <Heading>Rogers Pass, BC</Heading>
      <Heading>Webcam</Heading>
      <Flex direction="column" padding=".5rem" alignItems="center" gap="1rem">
        <Image src="https://cache.drivebc.ca/bchighwaycam/pub/cameras/101.jpg"></Image>
        <AvCan report={avyData} />
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
        {reports ? (
          reports.map((obj, index) => (
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
