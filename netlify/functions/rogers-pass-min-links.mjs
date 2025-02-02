import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Response } from "node-fetch";

let browser;

//old segment routes to map version of report
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

    const s3 = new S3Client({
      region: process.env.MY_AWS_REGION,
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
      },
    });

    await page.goto(
      "https://avalanche.ca/mountain-information-network/submissions",
      {
        waitUntil: "networkidle0",
      }
    );

    const selkirkLinks = await page.evaluate(() => {
      const links = [];
      const rows = Array.from(document.querySelectorAll("tr"));
      rows.forEach((row) => {
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

    const key = `rogers-pass/min-links.json`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(updatedLinks),
      ContentType: "application/json",
    };

    await s3.send(new PutObjectCommand(params));

    if (isLocal) return undefined;
    return new Response(
      JSON.stringify({ message: "MIN report links successfully updated" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error(err);
    if (browser) await browser.close();
    if (isLocal) return undefined;
    return new Response(
      JSON.stringify({ message: "Error: MIN report links did not update" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    if (browser) await browser.close();
  }
};

export const config = {
  schedule: "0 */2 * * *",
};
