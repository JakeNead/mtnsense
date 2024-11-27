import expressAsyncHandler from "express-async-handler";
import puppeteer from "puppeteer";
import sanitizeHtml from "sanitize-html";

const revelstokeReport = expressAsyncHandler(async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(
      "https://mountainconditions.ca/reports/central-kootenay-ski-conditions-0",
      {
        waitUntil: "networkidle0",
      }
    );

    const avyReport = await page.evaluate(() => {
      const parentElement = document.querySelector(
        "#content-area > article > div.content > div.field.field-name-body.field-type-text-with-summary.field-label-hidden > div > div"
      );
      if (!parentElement) return null;
      const selectedElements = Array.from(parentElement.children).map((child) =>
        child.textContent.trim()
      );

      return selectedElements;
    });

    const sanitizedReport = avyReport.map((content) => sanitizeHtml(content));

    await browser.close();

    res.json({ avyReport: sanitizedReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch avalanche forecast" });
  }
});

export default revelstokeReport;
