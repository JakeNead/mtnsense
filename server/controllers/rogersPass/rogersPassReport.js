// import expressAsyncHandler from "express-async-handler";
// import puppeteer from "puppeteer";
// import sanitizeHtml from "sanitize-html";

// const rogersPassReport = expressAsyncHandler(async (req, res) => {
//   try {
//     const browser = await puppeteer.launch({
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });
//     const page = await browser.newPage();
//     await page.goto(
//       "https://mountainconditions.ca/reports/central-kootenay-ski-conditions-0",
//       {
//         waitUntil: "networkidle0",
//       }
//     );

//     const avyReport = await page.evaluate(() => {
//       const selectedElements = [];

//       const title = document
//         .querySelector(
//           "#content-area > article > div.header-wrapper > div.columns-2 > div:nth-child(2) > span"
//         )
//         .getAttribute("content");
//       selectedElements.push(title);

//       const date = document.querySelector(
//         "#content-area > article > div.header-wrapper > div.submitted > p"
//       ).textContent;
//       selectedElements.push(date);

//       const content = document.querySelector(
//         "#content-area > article > div.content > div.field.field-name-body.field-type-text-with-summary.field-label-hidden > div > div"
//       );
//       if (!content) return null;

//       const contentText = Array.from(content.children).map((child) =>
//         child.textContent.trim()
//       );
//       selectedElements.push(...contentText);

//       return selectedElements;
//     });

//     const sanitizedReport = avyReport.map((content) =>
//       sanitizeHtml(String(content))
//     );

//     await browser.close();

//     res.json({ avyReport: sanitizedReport });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch avalanche forecast" });
//   }
// });

// export default rogersPassReport;

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
          // const body = document.querySelector(".field-name-body").innerHTML;
          return { title, date, author };
        });

        // Check for duplicates
        const isDuplicate = reportContent.some(
          (report) => report.title === content.title
        );

        if (!isDuplicate) {
          reportContent.push(content);
        }

        await page.goBack({ waitUntil: "networkidle0" });
      }
    }
    //

    await browser.close();

    res.json({ avyReport: reportContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch avalanche forecast" });
  }
});

export default rogersPassReport;
