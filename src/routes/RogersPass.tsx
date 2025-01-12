import { useState, useEffect } from "react";
import "../App.css";
import { Text, Heading, Image, Box, Flex } from "@chakra-ui/react";
// import { useColorModeValue } from "../components/ui/color-mode";
import AvCan from "../components/rogersPass/avCanada/RogersPassAvy";
import { AvyData, Report } from "../interfaces/AvyReport";
import RogersPassForecasts from "../components/rogersPass/Forecasts";

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

  const borderRadius = "5px";
  return (
    <>
      <Heading>Rogers Pass, BC</Heading>
      <Heading>Webcam</Heading>
      <Flex direction="column" alignItems="center" gap="1rem">
        <Image
          src="https://cache.drivebc.ca/bchighwaycam/pub/cameras/101.jpg"
          borderRadius={borderRadius}
        ></Image>
        <AvCan report={avyData} />
        <Heading>Weather</Heading>
        <RogersPassForecasts />

        <Heading>Reports</Heading>
        {reports ? (
          reports.map((obj, index) => (
            <Box key={index} maxW="95vw" p=".5rem" m="1rem 0">
              <Text fontWeight="bold" mb="0.5rem">
                {obj.title}
              </Text>
              <Text mb="0.5rem">{obj.date}</Text>
              <Text mb="1rem">{obj.author}</Text>
              <Box
                maxW="850px"
                dangerouslySetInnerHTML={{
                  __html: Array.isArray(obj.body)
                    ? obj.body.join("")
                    : obj.body,
                }}
                css={{
                  "& p": {
                    marginBottom: ".8rem",
                  },
                }}
              />
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
