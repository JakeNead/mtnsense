import {
  Low,
  Moderate,
  Considerable,
  High,
  Extreme,
  NoRating,
} from "./DangerIcons";
import { Report } from "../../../interfaces/AvyReport";
import { Heading, Text, Box } from "@chakra-ui/react";

interface AvCanProps {
  report: Report | null;
}
const borderRadius = "5px";

function getDangerSvg(level: string) {
  switch (level) {
    case "low":
      return <Low />;
    case "moderate":
      return <Moderate />;
    case "considerable":
      return <Considerable />;
    case "high":
      return <High />;
    case "extreme":
      return <Extreme />;
    case "no rating":
      return <NoRating />;
    default:
      return <NoRating />;
  }
}

function getDangerColor(level: string) {
  switch (level) {
    case "low":
      return "rgb(88 182 84)";
    case "moderate":
      return "rgb(255 240 53)";
    case "considerable":
      return "rgb(245 148 49)";
    case "high":
      return "rgb(235 33 46)";
    case "extreme":
      return "purple";
    case "no rating":
      return "white";
    default:
      return "white";
  }
}

function capitalize(str: string) {
  if (!str) return str;
  const lowerCase = str.toLowerCase();
  return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
}

export default function DangerGraphic({ report }: AvCanProps) {
  if (!report) {
    return <Text>Avalanche report loading...</Text>;
  }

  return (
    <Box marginBottom="2px">
      <Heading
        bg={{ base: "gray.100", _dark: "gray.900" }}
        color={{ base: "gray.900", _dark: "gray.100" }}
        padding=".3rem .6rem"
      >
        {report.dangerRatings[0].date.display}
      </Heading>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="255 205 450 146"
        style={{
          overflow: "hidden",
          borderRadius: borderRadius,
          width: "100%",
          position: "relative",
        }}
      >
        <path
          fill="#DDEEFA"
          d="M705 204.9v50.6H418.8c-15.7 1.2-29.5 12.3-29.5 12.3-2.5 7.6-34.7 1.4-34.7 1.4l2.5 4.7c-8.9-5.8-29.4.4-29.4.5 0 .1-26.8 12.9-40.3.1-10.2-9.7-25.1-6.2-32.3-3.9v-65.8H705z"
        ></path>
        <path
          fill="#D1D9A3"
          d="M704.8 255.6v49.3l-283.8-.2-18.6-11.2c-18.8 1.6-29.2 10.1-37.3 16.2-8.1 6-12.4 5.7-20.8 6.3-8.5.6-15.5-2.9-21.5-6.2-6-3.3-8.3-4.7-20.8-9.7-12.5-4.9-22.6-3.2-23-3.2s-11 1.6-12.8-1.7c-1.2-2.2-6.8-1.5-11-.8v-23.8c7.2-2.4 22.1-5.9 32.3 3.7 13.6 12.8 40.3.1 40.3-.1s20.6-6.4 29.5-.6l-2.5-4.7s32.1 6.3 34.7-1.3c0 0 13.9-11.1 29.5-12.3h137.7l148.1.3z"
        ></path>
        <path
          fill="#AEBFAC"
          d="M704.8 304.8v49.6H255v-59.9c4.2-.7 9.8-1.4 11 .8 1.8 3.3 12.3 1.7 12.7 1.7s10.6-1.8 23.1 3.2c12.5 5 14.8 6.3 20.8 9.7s13.1 6.8 21.6 6.2c8.5-.6 12.7-.3 20.8-6.3 8.1-6 18.6-14.6 37.4-16.2l18.6 11.2h283.8z"
        ></path>
        <path
          fill="#88B1C9"
          d="M388.7 269c-.5.6-1.1 1.1-2 1.4L369 236.1l-17.2 24.4 6.3 9.8c-.7-.1-1.4-.3-1.9-.3l-32.7-45.9-34.1 52.4-1.8-1.5-.3-.3 36.2-54.7 26.6 38.4 19.2-26.9 19.4 37.5z"
        ></path>
        <path
          fill="#C1D831"
          d="M399.1 294.6c-16.8 2.2-26.4 10.1-34.1 15.7-8.1 6-12.4 5.7-20.8 6.3-2.1.1-4.1.1-6.1-.3l-6.8-42.4c6.3-1.6 21.8-3.1 28.4 1.3L356 270s-1-.2 0 0l19.4 27.3-2.7-25.4c5.5.3 10.8.1 13.9-1.4l12.5 24.1z"
        ></path>
        <path
          fill="#88B1C9"
          d="M375.5 297.3L356.1 270c.5.1 1.1.2 1.9.3l17.5 27z"
        ></path>
        <path
          fill="#6EA469"
          d="M411.7 318.9l-36.2 3.6-31.8 28.5-5.5-34.6c1.9.3 4 .4 6.1.3 8.5-.6 12.7-.3 20.8-6.3 7.7-5.7 17.3-13.5 34.1-15.7l12.5 24.2z"
        ></path>
        <path
          fill="#829D3B"
          d="M401.8 294.2l-2.6.3-12.4-24c.8-.4 1.6-.9 2-1.4l13 25.1z"
        ></path>
        <path
          fill="#507F4F"
          d="M415.2 320.3l-38.1 7.7-32.8 26-46.8-24.6-42.4-5.5 17-25.9c1.1.1 2.4 0 3.4-.1l-15.1 23.2 37.3 4.4 46.1 25.5 31.8-28.5 36.2-3.6-12.5-24.4c.8-.1 1.8-.3 2.6-.3l13.3 26.1z"
        ></path>
        <path
          fill="#789226"
          d="M289.4 276.5L275.5 298c-1 .1-2.2.1-3.4.1l15.3-23.2.3.3c.5.3 1.1.8 1.7 1.3z"
        ></path>
        <linearGradient id="a" x1="143.62" x2="176.32" y1="109.89" y2="109.89">
          <stop offset="0" stopColor="#789226"></stop>
          <stop offset="1" stopColor="#C1D831"></stop>
        </linearGradient>
        <path
          fill="url(#a)"
          d="M338.2 316.3c-5.8-.8-11-3.4-15.5-5.9-6-3.3-8.3-4.7-20.8-9.7-12.5-4.9-22.6-3.1-23-3.1-.2 0-1.6.2-3.4.3l13.9-21.5c14 10.2 38.3-1.3 38.3-1.5 0-.1 1.4-.5 3.7-1.1l6.8 42.5z"
        ></path>
        <linearGradient id="b" x1="186.53" x2="197.34" y1="86.37" y2="92.61">
          <stop offset="0" stopColor="#8ECEF3"></stop>
          <stop offset=".05" stopColor="#A4D8F5"></stop>
          <stop offset=".13" stopColor="#C0E4F8"></stop>
          <stop offset=".22" stopColor="#D7EEFB"></stop>
          <stop offset=".33" stopColor="#E9F6FD"></stop>
          <stop offset=".45" stopColor="#F6FBFE"></stop>
          <stop offset=".62" stopColor="#FDFEFF"></stop>
          <stop offset="1" stopColor="#FFF"></stop>
        </linearGradient>
        <path
          fill="url(#b)"
          d="M372.8 271.9c-5.5-.3-11.3-1-14.8-1.6l-6.3-9.8 17.3-24.4 3.8 35.8z"
        ></path>
        <linearGradient id="c" x1="186.66" x2="195.78" y1="104.01" y2="104.01">
          <stop offset="0" stopColor="#789226"></stop>
          <stop offset=".14" stopColor="#90A92A"></stop>
          <stop offset=".3" stopColor="#A6BE2D"></stop>
          <stop offset=".49" stopColor="#B5CD2F"></stop>
          <stop offset=".7" stopColor="#BED531"></stop>
          <stop offset="1" stopColor="#C1D831"></stop>
        </linearGradient>
        <path
          fill="url(#c)"
          d="M375.5 297.3l-17.5-27c3.5.5 9.2 1.3 14.8 1.6l2.7 25.4z"
        ></path>
        <path
          fill="#FFF"
          d="M386.7 270.5c-3.1 1.4-8.5 1.6-13.9 1.4l-3.9-35.7 17.8 34.3z"
        ></path>
        <linearGradient id="d" x1="159" x2="174.85" y1="86.16" y2="95.31">
          <stop offset="0" stopColor="#8ECEF3"></stop>
          <stop offset=".05" stopColor="#A4D8F5"></stop>
          <stop offset=".13" stopColor="#C0E4F8"></stop>
          <stop offset=".22" stopColor="#D7EEFB"></stop>
          <stop offset=".33" stopColor="#E9F6FD"></stop>
          <stop offset=".45" stopColor="#F6FBFE"></stop>
          <stop offset=".62" stopColor="#FDFEFF"></stop>
          <stop offset="1" stopColor="#FFF"></stop>
        </linearGradient>
        <path
          fill="url(#d)"
          d="M331.4 273.9c-2.3.5-3.7 1-3.7 1.1 0 .1-24.3 11.8-38.3 1.5l34.1-52.4 7.9 49.8z"
        ></path>
        <path
          fill="#FFF"
          d="M359.9 275.1c-6.5-4.3-22.1-2.8-28.4-1.3l-8-49.9 32.7 45.9c-1-.2 0 0 0 0l3.7 5.3z"
        ></path>
        <linearGradient id="e" x1="135.77" x2="179.2" y1="125.04" y2="125.04">
          <stop offset="0" stopColor="#507F4F"></stop>
          <stop offset="1" stopColor="#6EA469"></stop>
        </linearGradient>
        <path
          fill="url(#e)"
          d="M343.7 351l-46.1-25.5-37.3-4.4 15.1-23.2c1.8-.1 3.2-.3 3.4-.3.5 0 10.6-1.8 23 3.1s14.8 6.3 20.8 9.7c4.5 2.5 9.7 5.1 15.5 5.9l5.6 34.7z"
        ></path>
        <text x="302" y="265" fontSize="8" tab-index="0">
          Alpine
        </text>
        <g transform="translate(385 211)">
          <rect
            x="18"
            width="301"
            height="37"
            fill={getDangerColor(
              report.dangerRatings[0].ratings.alp.rating.value
            )}
            stroke="#231F20"
            strokeWidth="0.5"
            strokeMiterlimit="10"
          ></rect>
          <text
            x="70"
            y="23"
            fill="#231F20"
            tab-index="0"
            fontSize="18.5"
            fontWeight="bold"
          >
            <title>
              {capitalize(report.dangerRatings[0].ratings.alp.rating.value)}
            </title>
            {capitalize(report.dangerRatings[0].ratings.alp.rating.value)}
          </text>
          {getDangerSvg(report.dangerRatings[0].ratings.alp.rating.value)}
        </g>
        <text x="291" y="293" fontSize="8" tab-index="0">
          Treeline
        </text>
        <g transform="translate(405 261)">
          <rect
            x="18"
            width="281"
            height="37"
            fill={getDangerColor(
              report.dangerRatings[0].ratings.tln.rating.value
            )}
            stroke="#231F20"
            strokeWidth="0.5"
            strokeMiterlimit="10"
          ></rect>
          <text
            x="70"
            y="23"
            fill="#231F20"
            tab-index="0"
            fontSize="18.5"
            fontWeight="bold"
          >
            <title>
              {capitalize(report.dangerRatings[0].ratings.tln.rating.value)}
            </title>
            {capitalize(report.dangerRatings[0].ratings.tln.rating.value)}
          </text>
          {getDangerSvg(report.dangerRatings[0].ratings.tln.rating.value)}
        </g>
        <text x="269" y="320" fontSize="8" tab-index="0">
          Below Treeline
        </text>
        <g transform="translate(425 311)">
          <rect
            x="18"
            width="261"
            height="37"
            fill={getDangerColor(
              report.dangerRatings[0].ratings.btl.rating.value
            )}
            stroke="#231F20"
            strokeWidth="0.5"
            strokeMiterlimit="10"
          ></rect>
          <text
            x="70"
            y="23"
            fill="#231F20"
            tab-index="0"
            fontSize="18.5"
            fontWeight="bold"
          >
            <title>
              {capitalize(report.dangerRatings[0].ratings.btl.rating.value)}
            </title>
            {capitalize(report.dangerRatings[0].ratings.btl.rating.value)}
          </text>
          {getDangerSvg(report.dangerRatings[0].ratings.btl.rating.value)}
        </g>
      </svg>
    </Box>
  );
}
