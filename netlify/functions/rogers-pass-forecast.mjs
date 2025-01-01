import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export default async () => {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.MY_AWS_ACCESS_KEY,
      secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    },
  });

  chromium.setGraphicsMode = false;
  chromium.setHeadlessMode = true;

  let browser = null;

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

    await page.setViewport({ width: 850, height: 1200 });

    await page.goto(
      "https://spotwx.com/products/grib_index.php?model=gem_reg_10km&lat=51.19742&lon=-117.72125&tz=America/Vancouver&display=graph",
      {
        waitUntil: "networkidle0",
      }
    );

    await page.waitForSelector("#container_temperature");

    const screenshotBuffer = await page.screenshot({
      fullPage: true,
    });

    const key = `rogers-pass-forecast/latest.png`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: screenshotBuffer,
      ContentType: "image/png",
    };

    await s3.send(new PutObjectCommand(uploadParams));

    await browser.close();
    console.log("browser closed");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Rogers Pass forecast screenshot successfully updated",
        imageUrl: `https://${bucketName}.s3.amazonaws.com/${key}`,
      }),
    };
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
