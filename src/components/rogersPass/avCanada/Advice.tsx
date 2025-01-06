import { Box, Text } from "@chakra-ui/react";

interface AdviceProps {
  advice: string[];
}

export default function Advice({ advice }: AdviceProps) {
  return (
    <Box>
      {advice.map((text: string) => (
        <Text marginBottom="1rem"> - {text}</Text>
      ))}
    </Box>
  );
}
