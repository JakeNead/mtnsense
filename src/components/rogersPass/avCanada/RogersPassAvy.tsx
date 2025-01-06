import MetaData from "./MetaData";
import Headline from "./Headline";
import DangerGraphic from "./DangerGraphic";
import DangerForecast from "./DangerForecast";
import Advice from "./Advice";
import Summary from "./Summary";
import { Report } from "../../../interfaces/AvyReport";
import { Box, Text, Heading } from "@chakra-ui/react";
import { useColorModeValue } from "../../ui/color-mode";

interface AvCanProps {
  report: Report | null;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    hour12: true,
  };
  return `${date.toLocaleDateString(
    "en-US",
    dateOptions
  )}, ${date.toLocaleTimeString("en-US", timeOptions)}`;
}

export default function AvCan({ report }: AvCanProps) {
  if (!report) {
    return <Text>Loading...</Text>;
  }

  const {
    dateIssued,
    validUntil,
    dangerRatings,
    highlights,
    terrainAndTravelAdvice,
    summaries,
    confidence,
  } = report;

  return (
    <Box maxW="600px" bg={{ base: "gray.100", _dark: "gray.900" }} p="1rem">
      <Heading textAlign="center" m=".8rem">
        Avalanche Canada
      </Heading>
      <MetaData
        report={{
          dateIssued: formatDate(dateIssued),
          validUntil: formatDate(validUntil),
        }}
      />
      <Headline highlights={highlights} />
      <DangerGraphic report={report} />
      <DangerForecast dangerRatings={dangerRatings} />
      <Heading textAlign="center" m=".8rem">
        Terrain and Travel Advice
      </Heading>
      <Advice advice={terrainAndTravelAdvice} />
      <Summary summaries={summaries} confidence={confidence} />
    </Box>
  );
}
