import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Response } from "node-fetch";

let browser;

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

    const response = await fetch(
      "https://mtnsense.s3.us-west-2.amazonaws.com/rogers-pass/min-links.json"
    );
    if (!response.ok)
      throw new Error(
        "Something went wrong fetching the rogers pass MIN links"
      );
    const links = await response.json();

    const reports = [];

    for (const link of links) {
      await page.goto(link, { waitUntil: "networkidle0" });

      await page.waitForSelector("dt");

      const report = await page.evaluate(() => {
        const obj = {};
        // title
        const h1 = document.querySelector("h1").textContent;
        obj.title = h1;

        // date
        const dtArr = Array.from(document.querySelectorAll("dt"));
        const dateEl = dtArr
          ? dtArr.find((el) => el.textContent.trim() === "Observations date")
          : null;
        const dateContent = dateEl
          ? dateEl.nextElementSibling.textContent.trim()
          : null;
        obj.date = dateContent;

        // author
        const authorEl = dtArr
          ? dtArr.find((el) => el.textContent.trim() === "Submitted by")
          : null;
        const authorContent = authorEl
          ? authorEl.nextElementSibling.textContent.trim()
          : null;
        obj.author = authorContent;

        // comments
        const h4 = Array.from(document.querySelectorAll("h4"));
        const commentEl = h4
          ? h4.find((el) => el.textContent.trim() === "Comments")
          : null;
        const commentContent = commentEl.nextElementSibling.textContent.trim();
        obj.comments = commentContent;

        return obj;
      });

      reports.push(report);
    }

    // s3 here
    const s3 = new S3Client({
      region: process.env.MY_AWS_REGION,
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
      },
    });

    const key = `rogers-pass/min-content.json`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(reports),
      ContentType: "application/json",
    };
    await s3.send(new PutObjectCommand(params));
    if (isLocal) return undefined;
    return new Response(
      JSON.stringify({
        message: "MIN report content successfully updated",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "MIN report links update failed" }),
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
  schedule: "2 */2 * * *",
};
