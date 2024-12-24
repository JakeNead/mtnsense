import puppeteer from "puppeteer";

export async function handler(req, context) {
  try {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 4200 },
    });
    const page = await browser.newPage();
    await page.goto("https://avalanche.ca/map?lat=51.291168&lng=-117.456425", {
      waitUntil: "networkidle0",
    });

    // element screenshot
    const fileElement = await page.waitForSelector("#primary-drawer > div");
    const screenshotBuffer = await fileElement.screenshot();

    await browser.close();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
      },
      body: screenshotBuffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to fetch avy danger info" }),
    };
  }
}
