import MetaData from "./MetaData";
import Headline from "./Headline";
import DangerGraphic from "./DangerGraphic";
import DangerForecast from "./DangerForecast";
import Advice from "./Advice";
import Summary from "./Summary";
import { Report } from "../../../interfaces/AvyReport";
import { Box, Text } from "@chakra-ui/react";

interface AvCanProps {
  report: Report | null;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
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

  const { dateIssued, validUntil, dangerRatings } = report;

  return (
    <Box>
      <MetaData
        report={{
          dateIssued: formatDate(dateIssued),
          validUntil: formatDate(validUntil),
        }}
      />
      <Headline />
      <DangerGraphic report={report} />
      <DangerForecast dangerRatings={dangerRatings} />
      <Advice />
      <Summary />
    </Box>
  );
}
