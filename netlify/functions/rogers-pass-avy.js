// import puppeteer from "puppeteer";

// export async function handler(req, context) {
//   try {
//     const browser = await puppeteer.launch({
//       defaultViewport: { width: 1920, height: 4200 },
//     });
//     const page = await browser.newPage();
//     await page.goto("https://avalanche.ca/map?lat=51.291168&lng=-117.456425", {
//       waitUntil: "networkidle0",
//     });

//     // element screenshot
//     const fileElement = await page.waitForSelector("#primary-drawer > div");
//     const screenshotBuffer = await fileElement.screenshot();

//     await browser.close();
//     return {
//       statusCode: 200,
//       headers: {
//         "Content-Type": "image/png",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: screenshotBuffer.toString("base64"),
//       isBase64Encoded: true,
//     };
//   } catch (error) {
//     if (browser) {
//       await browser.close();
//     }
//     return {
//       statusCode: 500,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: JSON.stringify({ error: "Failed to fetch avy danger info" }),
//     };
//   }
// }

////////////////////////////////////////////////////////////////

import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
      defaultViewport: { width: 1920, height: 3900 },
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto("https://avalanche.ca/map?lat=51.291168&lng=-117.456425", {
      waitUntil: "networkidle0",
    });

    const fileElement = await page.waitForSelector("#primary-drawer > div");

    const boundingBox = await fileElement.boundingBox();

    console.log("boundingBox.height: ", boundingBox.height);

    await page.setViewport({
      width: Math.ceil(boundingBox.width),
      height: Math.ceil(boundingBox.height),
    });

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

    return Response("Rogers Pass avy screenshot successfully updated", {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error taking forecast screenshot:", error);
    if (browser) {
      await browser.close();
    }
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

// converts from serverless function to scheduled function
export const config = {
  schedule: "0 */2 * * *",
};
