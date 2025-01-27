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
        waitUntil: "domcontentloaded",
      }
    );

    const selkirkLinks = await page.evaluate(() => {
      const links = [];
      const rows = Array.from(document.querySelectorAll("tr"));
      // if (rows.length > 3) rows.slice(0, 3);
      // rows.forEach((row) => {
      //   const cells = row.querySelectorAll("td");
      //   if (cells.length > 0 && cells[4].textContent.trim() === "Selkirks") {
      //     const anchor = cells[0].querySelector("a");
      //     if (anchor) {
      //       const href = anchor.getAttribute("href");
      //       if (href) {
      //         links.push("https://avalanche.ca" + href);
      //       }
      //     }
      //   }
      // });
      // return links;
      return rows;
    });

    console.log(selkirkLinks);
  } catch (err) {
    console.error(err);
  } finally {
    if (browser) await browser.close();
  }
};

export const config = {
  schedule: "*/2 * * * *",
};
