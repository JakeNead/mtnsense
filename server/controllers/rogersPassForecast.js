import expressAsyncHandler from "express-async-handler";
import puppeteer from "puppeteer";

const rogersPassForecast = expressAsyncHandler(async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      "https://spotwx.com/products/grib_index.php?model=gem_reg_10km&lat=51.19742&lon=-117.72125&tz=America/Vancouver&display=graph",
      {
        waitUntil: "networkidle0",
      }
    );

    const screenshotBuffer = await page.screenshot({ fullPage: true });

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": screenshotBuffer.length,
    });
    res.end(screenshotBuffer);

    // res.send("screenshotBuffer");
    await browser.close();
  } catch (error) {
    console.error("Error taking forecast screenshot:", error);
    res.status(500).json({ error: "Failed to fetch weather forecast" });
  }
});

export default rogersPassForecast;
