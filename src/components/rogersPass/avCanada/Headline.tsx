import { Report } from "../../../interfaces/AvyReport";
import { Box } from "@chakra-ui/react";

export default function Headline({ highlights }: Report) {
  return (
    <>
      <Box
        dangerouslySetInnerHTML={{ __html: highlights }}
        m="3rem 0rem"
        fontSize="xl"
        css={{
          "& p": {
            marginBottom: "1rem",
          },
        }}
      />
    </>
  );
}
