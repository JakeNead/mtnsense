import { Flex, Box, Text } from "@chakra-ui/react";

interface MetaDataProps {
  dateIssued: string;
  validUntil: string;
}

export default function MetaData({ report }: { report: MetaDataProps }) {
  return (
    <Flex>
      <Box>
        <Text>Date Issued</Text>
        <Text>{report.dateIssued}</Text>
      </Box>
      <Box>
        <Text>Valid Until</Text>
        <Text>{report.validUntil}</Text>
      </Box>
    </Flex>
  );
}
