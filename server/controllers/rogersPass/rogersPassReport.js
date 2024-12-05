import expressAsyncHandler from "express-async-handler";
import puppeteer from "puppeteer";
import sanitizeHtml from "sanitize-html";

const rogersPassReport = expressAsyncHandler(async (req, res) => {
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
      const selectedElements = [];

      const title = document
        .querySelector(
          "#content-area > article > div.header-wrapper > div.columns-2 > div:nth-child(2) > span"
        )
        .getAttribute("content");
      selectedElements.push(title);

      const date = document.querySelector(
        "#content-area > article > div.header-wrapper > div.submitted > p"
      ).textContent;
      selectedElements.push(date);

      const content = document.querySelector(
        "#content-area > article > div.content > div.field.field-name-body.field-type-text-with-summary.field-label-hidden > div > div"
      );
      if (!content) return null;

      const contentText = Array.from(content.children).map((child) =>
        child.textContent.trim()
      );
      selectedElements.push(...contentText);

      return selectedElements;
    });

    const sanitizedReport = avyReport.map((content) =>
      sanitizeHtml(String(content))
    );

    await browser.close();

    res.json({ avyReport: sanitizedReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch avalanche forecast" });
  }
});

export default rogersPassReport;
