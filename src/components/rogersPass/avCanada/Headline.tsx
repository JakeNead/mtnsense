import { Report } from "../../../interfaces/AvyReport";
import { Box } from "@chakra-ui/react";

interface HeadlineProps {
  highlights: string;
}

export default function Headline({ highlights }: HeadlineProps) {
  return (
    <>
      <Box
        dangerouslySetInnerHTML={{ __html: highlights }}
        m="2rem 0rem"
        fontSize="large"
        css={{
          "& p": {
            marginBottom: "1rem",
          },
        }}
      />
    </>
  );
}
