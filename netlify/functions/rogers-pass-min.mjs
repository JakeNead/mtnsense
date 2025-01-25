import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

let browser;

function replaceUrlSegment(url) {
  const oldSegment = "map?panel=mountain-information-network-submissions";
  const newSegment = "mountain-information-network/submissions";
  return url.replace(oldSegment, newSegment);
}

export default async () => {
  try {
    browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(
      "https://avalanche.ca/mountain-information-network/submissions",
      {
        waitUntil: "networkidle0",
        timeout: 60000,
      }
    );

    console.log("page.goto executed");

    const selkirkLinks = await page.evaluate(() => {
      return "SelkirkLinks evaluated";
    });

    console.log(selkirkLinks);
  } catch (err) {
    console.log("Error: ", err);
  }
};

export const config = {
  schedule: "*/4 * * * *",
};
