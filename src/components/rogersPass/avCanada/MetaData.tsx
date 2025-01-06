import { Flex, Box, Text } from "@chakra-ui/react";

interface MetaDataProps {
  dateIssued: string;
  validUntil: string;
}

export default function MetaData({ report }: { report: MetaDataProps }) {
  return (
    <Flex justifyContent="start">
      <Box flex="1">
        <Text fontWeight="bold">Date Issued</Text>
        <Text>{report.dateIssued}</Text>
      </Box>
      <Box flex="1">
        <Text fontWeight="bold">Valid Until</Text>
        <Text>{report.validUntil}</Text>
      </Box>
    </Flex>
  );
}
