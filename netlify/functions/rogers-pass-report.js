import puppeteer from "puppeteer";
import sanitizeHtml from "sanitize-html";
import chromium from "@sparticuz/chromium";

chromium.setGraphicsMode = false;
chromium.setHeadlessMode = true;

export async function handler(event, context) {
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
      "https://mountainconditions.ca/reports/list?field_report_type_tid%5B%5D=5&field_report_type_tid%5B%5D=3&field_report_type_tid%5B%5D=8&field_report_type_tid%5B%5D=1&field_report_type_tid%5B%5D=7&keys=&field_date_value=3#",
      {
        waitUntil: "networkidle0",
      }
    );

    const reportSelector = "#content-area > div > div.view-content";
    const reportContent = [];

    for (let i = 0; i < 3; i++) {
      await page.waitForSelector(reportSelector);
      // page$$ -> if no match, returns empty array
      const reports = await page.$$(reportSelector + " > div");

      if (reports.length > i) {
        await reports[i].click();
        await page.waitForNavigation({ waitUntil: "networkidle0" });

        const content = await page.evaluate(() => {
          const title = document.querySelector(
            "#content-area > article > div.header-wrapper > div.columns-2 > div:nth-child(2) > h2 > a"
          ).innerText;

          const date = document.querySelector(
            "#content-area > article > div.header-wrapper > div.submitted > p"
          ).innerText;

          const author = document.querySelector(
            "#content-area > article > div.header-wrapper > div.submitted > div.submitted--author > a"
          ).innerText;

          const body = document.querySelector(
            "#content-area > article > div.content > div.field.field-name-body.field-type-text-with-summary.field-label-hidden > div > div"
          ).innerHTML;

          return { title, date, author, body };
        });

        const isDuplicate = reportContent.some(
          (report) => report.title === content.title
        );

        if (!isDuplicate) {
          reportContent.push(content);
        }

        await page.goBack({ waitUntil: "networkidle0" });
      }
    }

    const sanitizedReports = reportContent.map((report) => ({
      title: sanitizeHtml(report.title),
      date: sanitizeHtml(report.date),
      author: sanitizeHtml(report.author),
      body: sanitizeHtml(report.body, {
        allowedTags: ["p", "a"],
        allowedAttributes: {
          a: ["href"],
        },
      }),
    }));

    await browser.close();

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(sanitizedReports),
    };
  } catch (error) {
    console.error("Error fetching avalanche report:", error);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Failed to fetch avalanche report" }),
    };
  }
}
