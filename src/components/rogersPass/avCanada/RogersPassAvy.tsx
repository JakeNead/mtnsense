import MetaData from "./MetaData";
import Headline from "./Headline";
import DangerGraphic from "./dangerGraphic";
import DangerForecast from "./DangerForecast";
import Advice from "./Advice";
import Summary from "./Summary";
import { Report } from "../../../interfaces/AvyReport";
import { Box } from "@chakra-ui/react";

interface AvCanProps {
  data: Report | null;
}

export default function AvCan({ data }: AvCanProps) {
  return (
    <Box>
      <MetaData />
      <Headline />
      <DangerGraphic data={data} />
      <DangerForecast />
      <Advice />
      <Summary />
    </Box>
  );
}
