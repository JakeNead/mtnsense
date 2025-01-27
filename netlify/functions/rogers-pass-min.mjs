import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

let browser;

function replaceUrlSegment(url) {
  const oldSegment = "map?panel=mountain-information-network-submissions";
  const newSegment = "mountain-information-network/submissions";
  return url.replace(oldSegment, newSegment);
}

export default async () => {
  chromium.setGraphicsMode = false;
  chromium.setHeadlessMode = true;
  try {
    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

    browser = await puppeteer.launch({
      args: isLocal ? puppeteer.defaultArgs() : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto(
      "https://avalanche.ca/mountain-information-network/submissions",
      {
        waitUntil: "networkidle0",
        timeout: 60000,
      }
    );

    console.log("page.goto executed");
    await page.waitForTimeout(2000);

    const selkirkLinks = await page.evaluate(() => {
      return "SelkirkLinks evaluated";
    });

    console.log(selkirkLinks);
  } catch (err) {
    console.log(err);
  } finally {
    if (browser) await browser.close();
  }
};

export const config = {
  schedule: "*/2 * * * *",
};
