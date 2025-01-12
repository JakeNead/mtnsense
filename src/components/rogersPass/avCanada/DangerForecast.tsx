import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { DangerRating } from "../../../interfaces/AvyReport";

interface DangerForecastProps {
  dangerRatings: DangerRating[];
}

const borderRadius = "5px";

function capitalize(str: string) {
  if (!str) return str;
  const lowerCase = str.toLowerCase();
  return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
}

function getValueColor(str: string) {
  switch (str) {
    case "low":
      return "rgb(84,183, 78)";
    case "moderate":
      return "rgb(255,240, 53)";
    case "considerable":
      return "rgb(247, 148, 30)";
    case "high":
      return "rgb(237, 28, 36)";
    case "extreme":
      return "rgb(35, 31, 32)";
    case "no rating":
      return "white";
    default:
      return "white";
  }
}

export default function DangerForecast({ dangerRatings }: DangerForecastProps) {
  const padding = ".3rem .6rem";
  const alp = "rgb(222, 238, 250)";
  const tln = "rgb(209, 216, 166)";
  const btl = "rgb(175, 191, 173)";
  return (
    <Flex flexDir="column" color="black" gap="2px">
      {dangerRatings
        .filter((_, index) => index !== 0)
        .map((rating, index) => (
          <Box key={index}>
            <Heading
              color={{ base: "gray.900", _dark: "gray.100" }}
              bg={{ base: "gray.100", _dark: "gray.900" }}
              padding=".3rem .6rem"
            >
              {rating.date.display}{" "}
            </Heading>
            <Flex
              flexDir="row"
              gap="2px"
              borderRadius={borderRadius}
              overflow="hidden"
            >
              <Flex flexDir="column" flex="1" gap="2px">
                <Text p={padding} background={alp}>
                  {rating.ratings.alp.display}
                </Text>
                <Text p={padding} background={tln}>
                  {rating.ratings.tln.display}
                </Text>
                <Text p={padding} background={btl}>
                  {rating.ratings.btl.display}
                </Text>
              </Flex>
              <Flex flexDir="column" flex="1" gap="2px">
                <Text
                  p={padding}
                  background={getValueColor(rating.ratings.alp.rating.display)}
                >
                  {capitalize(rating.ratings.alp.rating.display)}
                </Text>
                <Text
                  p={padding}
                  background={getValueColor(rating.ratings.tln.rating.display)}
                >
                  {capitalize(rating.ratings.tln.rating.display)}
                </Text>
                <Text
                  p={padding}
                  background={getValueColor(rating.ratings.btl.rating.display)}
                >
                  {capitalize(rating.ratings.btl.rating.display)}
                </Text>
              </Flex>
            </Flex>
          </Box>
        ))}
    </Flex>
  );
}
