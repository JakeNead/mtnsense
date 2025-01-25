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

    const browser = puppeteer.launch({
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

    // Find the Selkirk reports and get the first three links
    const selkirkLinks = await page.evaluate(() => {
      console.log("evaluating links");
      const links = [];
      const rows = Array.from(document.querySelectorAll("tr"));
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0 && cells[4].textContent.trim() === "Selkirks") {
          const anchor = cells[0].querySelector("a");
          if (anchor) {
            const href = anchor.getAttribute("href");
            if (href) {
              links.push("https://avalanche.ca" + href);
            }
          }
        }
      });
      return links.slice(0, 3); // Keep first 3 links
    });

    const updatedSelkirkLinks = selkirkLinks.map((link) =>
      replaceUrlSegment(link)
    );
    console.log("updatedSelkirkLinks: ", updatedSelkirkLinks);

    let reportContent = [];

    // const content = await page.evaluate(() => {
    //   const getDate = (text) => {
    //     const element = Array.from(document.querySelectorAll("dt")).find(
    //       (el) => el.textContent.trim() === text
    //     );
    //     if (!element) return null;

    //     return element.nextElementSibling.textContent.trim();
    //   };

    //   const getTextContent = (text) => {
    //     const element = Array.from(document.querySelectorAll("h4")).find(
    //       (el) => el.textContent.trim() === text
    //     );
    //     if (!element) return null;

    //     const nextElement = element.nextElementSibling;
    //     if (!nextElement) return null;

    //     // if no child nodes
    //     if (!!nextElement.hasChildNodes) {
    //       return nextElement.textContent.trim();
    //     } else if (nextElement.tagName === "dd") {
    //       const liElements = nextElement.querySelectorAll("li");
    //       return Array.from(liElements).map((li) => li.textContent.trim());
    //     } else if (nextElement.tagName === "div") {
    //       const pElements = nextElement.querySelectorAll("p");
    //       return Array.from(pElements).map((p) => p.textContent.trim());
    //     }

    //     // return null;
    //   };

    //   const date = getDate("Observations date");
    //   const comments = getTextContent("Comments");

    //   return { date, comments };
    // });

    // content.link = link;
    // reportContent.push(content);
    // console.log("reportContent: ", reportContent);
  } catch (err) {
    console.log("Error: ", err);
  }
};

export const config = {
  schedule: "*/4 * * * *",
};
