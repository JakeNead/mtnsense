import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

chromium.setGraphicsMode = false;
chromium.setHeadlessMode = true;

export async function handler(event, context) {
  let browser = null;
  try {
    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

    browser = await puppeteer.launch({
      args: isLocal
        ? puppeteer.defaultArgs()
        : [
            ...chromium.args,
            "--hide-scrollbars",
            "--incognito",
            "--no-sandbox",
          ],
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    // await page.goto(
    //   "https://spotwx.com/products/grib_index.php?model=gem_reg_10km&lat=51.19742&lon=-117.72125&tz=America/Vancouver&display=graph",
    //   {
    //     waitUntil: "networkidle0",
    //   }
    // );

    // const screenshotBuffer = await page.screenshot({
    //   fullPage: true,
    // });

    await page.goto("https://www.wikipedia.com");

    const description = await page.$eval(
      'meta[name="description"]',
      (element) => element.content
    );
    await browser.close();
    return {
      statusCode: 200,
      headers: {
        // "Content-Type": "image/png",
        // "Content-Length": screenshotBuffer.length,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
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
}

////////////////////////////////////////////////

// import puppeteer from "puppeteer";

// export async function handler(event, context) {
//   let browser = null;
//   try {
//     browser = await puppeteer.launch({
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.goto(
//       "https://spotwx.com/products/grib_index.php?model=gem_reg_10km&lat=51.19742&lon=-117.72125&tz=America/Vancouver&display=graph",
//       {
//         waitUntil: "networkidle0",
//       }
//     );

//     const screenshotBuffer = await page.screenshot({
//       fullPage: true,
//     });

//     await browser.close();

//     //option 1
//     // return {
//     //   statusCode: 200,
//     //   headers: {
//     //     "Content-Type": "image/png",
//     //     "Content-Length": screenshotBuffer.length.toString(),
//     //   },
//     //   body: screenshotBuffer.toString("base64"),
//     //   isBase64Encoded: true,
//     // };
//   } catch (error) {
//     console.error("Error taking forecast screenshot:", error);
//     return {
//       statusCode: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ error: "Failed to fetch weather forecast" }),
//     };
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// }
