import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Response } from "node-fetch";

// 1/21/25 added netlify chromium plugin

function replaceUrlSegment(url) {
  const oldSegment = "map?panel=mountain-information-network-submissions";
  const newSegment = "mountain-information-network/submissions";
  return url.replace(oldSegment, newSegment);
}

export default async () => {
  chromium.setGraphicsMode = false;
  chromium.setHeadlessMode = true;

  let browser = null;

  const s3 = new S3Client({
    region: process.env.MY_AWS_REGION,
    credentials: {
      accessKeyId: process.env.MY_AWS_ACCESS_KEY,
      secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    },
  });

  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

  try {
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

    //update link urls
    const updatedSelkirkLinks = selkirkLinks.map((link) =>
      replaceUrlSegment(link)
    );

    let reportContent;

    for (const link of updatedSelkirkLinks) {
      await page.goto(link, { waitUntil: "networkidle0" });

      reportContent = await page.evaluate((link) => {
        const getDate = (text) => {
          const element = Array.from(document.querySelectorAll("dt")).find(
            (el) => el.textContent.trim() === text
          );
          if (!element) return null;

          return element.nextElementSibling.textContent.trim();
        };

        const getTextContent = (text) => {
          const element = Array.from(document.querySelectorAll("h4")).find(
            (el) => el.textContent.trim() === text
          );
          if (!element) return null;

          const nextElement = element.nextElementSibling;
          if (!nextElement) return null;

          // if no child nodes
          if (!!nextElement.hasChildNodes) {
            return nextElement.textContent.trim();
          } else if (nextElement.tagName === "dd") {
            const liElements = nextElement.querySelectorAll("li");
            return Array.from(liElements).map((li) => li.textContent.trim());
          } else if (nextElement.tagName === "div") {
            const pElements = nextElement.querySelectorAll("p");
            return Array.from(pElements).map((p) => p.textContent.trim());
          }

          // return null;
        };

        const date = getDate("Observations date");
        const comments = getTextContent("Comments");

        return { date, comments };
      });
      reportContent.link = link;
      // console.log("content: ", content);
    }

    ///// s3 code /////
    const key = `rogers-pass-min-report/latest.json`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(reportContent),
      ContentType: "application/json",
    };

    await s3.send(new PutObjectCommand(params));
    ///// s3 code /////

    await browser.close();

    if (isLocal) return;
    return new Response(
      JSON.stringify({
        message: "Rogers Pass MIN report successfully updated",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating avalanche MIN reports:", error);

    if (isLocal) return;
    return new Response(
      JSON.stringify("Rogers Pass MIN reports update failed"),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const config = {
  schedule: "*/5 * * * *",
};
