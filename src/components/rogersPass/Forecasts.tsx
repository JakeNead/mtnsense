import { Box, Flex, Heading, Link } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";

const borderRadius = "5px";

export default function RogersPassForecasts() {
  return (
    <Flex flexDir="column" alignItems="center" gap="1rem" width="100%">
      <Flex flexDir="column" alignItems="center" width="100%">
        <Heading>Five Fingers 1250m</Heading>
        <Link href="https://www.windy.com/multimodel/50.935/-118.253?canRdwpsWaves,waves,50.929,-118.253,14">
          View Detailed Forecast <LuExternalLink />
        </Link>
        <Box
          width="100%"
          maxWidth="650px"
          borderRadius={borderRadius}
          overflow="hidden"
        >
          <iframe
            width="100%"
            height="450"
            src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=9&overlay=ptype&product=ecmwf&level=surface&lat=50.935&lon=-118.253&detailLat=50.929&detailLon=-118.253&detail=true&message=true"
            frameBorder="0"
            style={{ display: "block" }}
          ></iframe>
        </Box>
      </Flex>
      <Flex flexDir="column" alignItems="center" width="100%">
        <Heading>"Pearly Rock" 2300m</Heading>
        <Link href="https://www.windy.com/multimodel/51.244/-117.443?canRdwpsWaves,waves,51.238,-117.443,14">
          View Detailed Forecast <LuExternalLink />
        </Link>
        <Box
          width="100%"
          maxWidth="650px"
          borderRadius={borderRadius}
          overflow="hidden"
        >
          <iframe
            width="100%"
            height="187"
            src="https://embed.windy.com/embed.html?type=forecast&location=coordinates&detail=true&detailLat=51.244&detailLon=-117.443&metricTemp=°C&metricRain=mm&metricWind=km/h"
            frameBorder="0"
            style={{ display: "block" }}
          ></iframe>
        </Box>
      </Flex>
      <Flex flexDir="column" alignItems="center" width="100%">
        <Heading>Sir Donald Summit 3070m</Heading>
        <Link href="https://www.windy.com/multimodel/51.264/-117.433?canRdwpsWaves,waves,51.261,-117.433,15">
          View Detailed Forecast <LuExternalLink />
        </Link>
        <Box
          width="100%"
          maxWidth="650px"
          mb="1rem"
          borderRadius={borderRadius}
          overflow="hidden"
        >
          <iframe
            width="100%"
            height="187"
            src="https://embed.windy.com/embed.html?type=forecast&location=coordinates&detail=true&detailLat=51.261&detailLon=-117.433&metricTemp=°C&metricRain=mm&metricWind=km/h"
            frameBorder="0"
            style={{ display: "block" }}
          ></iframe>
        </Box>
      </Flex>
    </Flex>
  );
}
