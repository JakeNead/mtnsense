import { Box, Heading, Text } from "@chakra-ui/react";
import {
  Summary as SummaryType,
  Confidence as ConfidenceType,
} from "../../../interfaces/AvyReport";
import DOMPurify from "dompurify";

interface SummaryProps {
  summaries: SummaryType[];
  confidence: ConfidenceType;
}

function capitalize(str: string) {
  if (!str) return str;
  const lowerCase = str.toLowerCase();
  return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
}

export default function Summary({ summaries, confidence }: SummaryProps) {
  return (
    <>
      {summaries.map((summary, index) => {
        if (summary.type.value === "avalanche-summary") {
          return (
            <Box key={`avalanche-summary-${index}`}>
              <Heading textAlign="center" margin="1rem">
                Avalanche Summary
              </Heading>
              <Box
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(summary.content),
                }}
                css={{
                  "& p": {
                    marginBottom: ".8rem",
                  },
                }}
              ></Box>
            </Box>
          );
        }
        if (summary.type.value === "snowpack-summary") {
          return (
            <Box key={`snowpack-summary-${index}`}>
              <Heading textAlign="center" m="1rem">
                Snowpack Summary
              </Heading>
              <Box
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(summary.content),
                }}
                css={{
                  "& p": {
                    marginBottom: ".8rem",
                  },
                }}
              ></Box>
            </Box>
          );
        }
      })}
      <Box>
        <Heading textAlign="center">Confidence</Heading>
        <Heading as="h3" fontSize="large">
          {capitalize(confidence.rating.value)}
        </Heading>
        {confidence.statements.map((statement, index) => (
          <Text key={index}> - {statement}</Text>
        ))}
      </Box>
    </>
  );
}

// warning banner!
