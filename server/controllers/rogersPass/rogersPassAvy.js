import expressAsyncHandler from "express-async-handler";
import puppeteer from "puppeteer";

const rogersPassAvy = expressAsyncHandler(async (req, res) => {
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

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": screenshotBuffer.length,
    });
    res.end(screenshotBuffer);

    await browser.close();
  } catch (error) {
    console.error("Error taking avalanche canada screenshot:", error);
    res.status(500).json({ error: "Failed to fetch avy danger info" });
  }
});

export default rogersPassAvy;
