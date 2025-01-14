import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Response } from "node-fetch";

// MIN
// click regions -> selkirks
// click report[i]
// scrape
// back

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

  // const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
  const isLocal =
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null &&
    !!process.env.CHROME_EXECUTABLE_PATH;

  try {
    browser = await puppeteer.launch({
      args: isLocal ? puppeteer.defaultArgs() : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    const baseUrl = "https://avalanche.ca";
    await page.goto(`${baseUrl}/mountain-information-network/submissions`, {
      waitUntil: "networkidle0",
    });

    // Find the Selkirk reports and get the first three links
    const selkirkLinks = await page.evaluate((baseUrl) => {
      const links = [];
      const rows = Array.from(document.querySelectorAll("tr"));
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (
          cells.length > 0 &&
          cells[cells.length - 2].textContent.trim() === "Selkirks"
        ) {
          const anchor = cells[0].querySelector("a");
          if (anchor) {
            links.push(baseUrl + anchor.getAttribute("href"));
          }
        }
      });
      return links.slice(0, 3); // Keep only the first three links
    });

    const reportContent = [];

    for (const link of selkirkLinks) {
      await page.goto(link, { waitUntil: "networkidle0" });

      const content = await page.evaluate(() => {
        const getTextContent = (dtText) => {
          const dtElement = Array.from(document.querySelectorAll("dt")).find(
            (dt) => dt.textContent.trim() === dtText
          );
          if (!dtElement) return null;
          const ddElement = dtElement.nextElementSibling;
          if (!ddElement) return null;
          const liElements = ddElement.querySelectorAll("li");
          return Array.from(liElements).map((li) => li.textContent.trim());
        };

        const comments = getTextContent("COMMENTS");
        const avalancheConditions = getTextContent("Avalanche conditions");

        return { comments, avalancheConditions };
      });

      reportContent.push(content);
      await page.goBack({ waitUntil: "networkidle0" });
    }

    const key = `rogers-pass-min-report/latest.json`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(reportContent),
      ContentType: "application/json",
    };

    await s3.send(new PutObjectCommand(params));

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
      JSON.stringify("Rogers Pass MINreports update failed"),
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
U;
