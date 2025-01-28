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
      "https://avalanche.ca/mountain-information-network/submissions"
    );
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("tr td:nth-child(5)")).some(
        (cell) => cell.textContent.trim() === "Selkirks"
      )
    );

    const selkirkLinks = await page.evaluate(() => {
      const links = [];
      // get all rows
      const rows = Array.from(document.querySelectorAll("tr"));
      // find the selkirk rows
      rows.forEach((row) => {
        // cells is all elements in each row
        const cells = row.querySelectorAll("td");
        if (cells.length > 4 && cells[4].textContent.trim() === "Selkirks") {
          const anchor = cells[0].querySelector("a");
          if (anchor) {
            const href = anchor.getAttribute("href");
            if (href) {
              links.push("https://avalanche.ca" + href);
            }
          }
        }
      });

      return links.slice(0, 3);
    });

    const updatedLinks = selkirkLinks.map((link) => replaceUrlSegment(link));
    const reports = [];

    for (const link of updatedLinks) {
      let newPage;
      try {
        newPage = await browser.newPage();
        //new
        await newPage.setRequestInterception(false);
        await newPage.goto(updatedLinks[0], { waitUntil: "networkidle0" });

        await newPage.waitForSelector("dt", { timeout: 10000 });

        const report = await page.evaluate(() => {
          const obj = {};
          obj.date = (() => {
            const element = Array.from(document.querySelectorAll("dt")).find(
              (el) => el.textContent.trim() === "Observations date"
            );
            if (!element) return null;

            return element.nextElementSibling.textContent.trim();
          })();
          return obj;
        });
        reports.push(report);
      } catch (err) {
        console.error(err);
      } finally {
        if (newPage) await newPage.close();
      }
    }

    console.log(reports);
  } catch (err) {
    console.error(err);
  } finally {
    if (browser) await browser.close();
  }
};

export const config = {
  schedule: "*/2 * * * *",
};
