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

  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

  try {
    const response = await fetch(
      "https://api.avalanche.ca/forecasts/:lang/products/point?lat=51.291168&long=-117.456425"
    );
    const data = await response.json();

    const key = `rogers-pass-avy/latest.json`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(data),
      ContentType: "application/json",
    };

    await s3.send(new PutObjectCommand(params));

    await browser.close();

    //Returning a Response locally throws an error
    if (isLocal) return;

    return new Response("Scheduled Rogers Pass avy screenshot updated", {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error taking avy screenshot:", error);
    if (browser) {
      await browser.close();
    }
    //Returning a Response locally throws an error
    if (isLocal) return;

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
