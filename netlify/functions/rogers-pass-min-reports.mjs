import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Response } from "node-fetch";

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
      "https://avalanche.ca/mountain-information-network/submissions",
      {
        waitUntil: "networkidle0",
      }
    );

    // Find the Selkirk reports and get the first three links
    const selkirkLinks = await page.evaluate(() => {
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
            const href = anchor.getAttribute("href");
            if (href && href.startsWith("/")) {
              links.push("https://avalanche.ca" + href);
            }
          }
        }
      });
      return links.slice(0, 3); // Keep only the first three links
    });

    console.log("selkrirksLinks: ", selkirkLinks);

    const reportContent = [];

    for (const link of selkirkLinks) {
      try {
        const newPage = await browser.newPage();
        await newPage.goto(link, { waitUntil: "networkidle0" });
        console.log("Visiting selkirks link", link);

        const content = await newPage.evaluate(() => {
          const getTextContent = (text) => {
            const element = Array.from(
              document.querySelectorAll("dt, h4")
            ).find((el) => el.textContent.trim() === text);
            if (!element) return null;

            // Get the next sibling element
            const nextElement = element.nextElementSibling;
            if (!nextElement) return null;
            console.log("nextElement: ", nextElement);

            // Check if the next sibling is a <dd> with <li> children or a <div> with <p> children
            if (nextElement.tagName === "dd") {
              const liElements = nextElement.querySelectorAll("li");
              return Array.from(liElements).map((li) => li.textContent.trim());
            } else if (nextElement.tagName === "div") {
              const pElements = nextElement.querySelectorAll("p");
              return Array.from(pElements).map((p) => p.textContent.trim());
            }

            return null;
          };

          const comments = getTextContent("COMMENTS");
          // const avalancheConditions = getTextContent("Avalanche conditions");
          console.log(comments);

          return { comments };
        });

        reportContent.push(content);
        // await page.goBack({ waitUntil: "networkidle0" });
        await newPage.close();
      } catch (err) {
        console.error("Error navigating to link: ", link, err);
      }
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
    if (browser) {
      await browser.close();
    }
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
