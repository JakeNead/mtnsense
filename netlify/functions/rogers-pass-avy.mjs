import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Response } from "node-fetch";

export default async () => {
  let browser = null;

  const s3 = new S3Client({
    region: process.env.MY_AWS_REGION,
    credentials: {
      accessKeyId: process.env.MY_AWS_ACCESS_KEY,
      secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    },
  });

  chromium.setGraphicsMode = false;
  chromium.setHeadlessMode = true;

  try {
    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
    browser = await puppeteer.launch({
      args: isLocal ? puppeteer.defaultArgs() : chromium.args,
      // defaultViewport: chromium.defaultViewport,
      defaultViewport: { width: 1920, height: 3300 },
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto("https://avalanche.ca/map?lat=51.291168&lng=-117.456425", {
      waitUntil: "networkidle0",
    });

    const fileElement = await page.waitForSelector("#primary-drawer > div");

    const screenshotBuffer = await fileElement.screenshot();

    const key = `rogers-pass-avy/latest.png`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: screenshotBuffer,
      ContentType: "image/png",
    };

    await s3.send(new PutObjectCommand(uploadParams));

    await browser.close();

    return new Response("Scheduled Rogers Pass avy screenshot updated", {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error taking avy screenshot:", error);
    if (browser) {
      await browser.close();
    }
    return new Response(
      "scheduled rogers pass avy function failed: " + error.message,
      { status: 500 }
    );
  }
};

// converts from serverless function to scheduled function
export const config = {
  schedule: "0 */2 * * *",
};
