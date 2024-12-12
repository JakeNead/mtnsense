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
//       "https://mountainconditions.ca/reports/list?field_report_type_tid%5B%5D=5&field_report_type_tid%5B%5D=3&field_report_type_tid%5B%5D=8&field_report_type_tid%5B%5D=1&field_report_type_tid%5B%5D=7&keys=&field_date_value=3#",
//       {
//         waitUntil: "networkidle0",
//       }
//     );

//     const reportSelector = "#content-area > div > div.view-content";
//     const reportContent = [];

//     for (let i = 0; i < 3; i++) {
//       await page.waitForSelector(reportSelector);
//       // page$$ -> if no match, returns empty array
//       const reports = await page.$$(reportSelector + " > div");

//       if (reports.length > i) {
//         await reports[i].click();
//         await page.waitForNavigation({ waitUntil: "networkidle0" });

//         const content = await page.evaluate(() => {
//           const title = document.querySelector(
//             "#content-area > article > div.header-wrapper > div.columns-2 > div:nth-child(2) > h2 > a"
//           ).innerText;

//           const date = document.querySelector(
//             "#content-area > article > div.header-wrapper > div.submitted > p"
//           ).innerText;

//           const author = document.querySelector(
//             "#content-area > article > div.header-wrapper > div.submitted > div.submitted--author > a"
//           ).innerText;

//           const body = Array.from(
//             document.querySelectorAll(
//               "#content-area > article > div.content > div.field.field-name-body.field-type-text-with-summary.field-label-hidden > div > div > p"
//             )
//           ).map((el) => el.innerHTML);

//           return { title, date, author, body };
//         });

//         // Log the body content in Node.js console
//         // console.log(content.body);

//         // Check for duplicates
//         const isDuplicate = reportContent.some(
//           (report) => report.title === content.title
//         );

//         if (!isDuplicate) {
//           reportContent.push(content);
//         }

//         await page.goBack({ waitUntil: "networkidle0" });
//       }
//     }

//     const sanitizedReports = reportContent.map((report) => ({
//       title: sanitizeHtml(report.title),
//       date: sanitizeHtml(report.date),
//       author: sanitizeHtml(report.author),
//       body: report.body.map((paragraph) =>
//         sanitizeHtml(paragraph, {
//           allowedTags: ["p", "br", "a"],
//           allowedAttributes: {
//             a: ["href"],
//           },
//         })
//       ),
//     }));
//     console.log(sanitizedReports);
//     res.json(sanitizedReports);

//     await browser.close();
//   } catch (error) {
//     console.error("Error fetching avalanche report:", error);
//     res.status(500).json({ error: "Failed to fetch avalanche report" });
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

          const body = document.querySelector(
            "#content-area > article > div.content > div.field.field-name-body.field-type-text-with-summary.field-label-hidden > div > div"
          ).innerHTML;

          return { title, date, author, body };
        });

        // Log the body content in Node.js console
        // console.log(content.body);

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

    res.json(sanitizedReports);

    await browser.close();
  } catch (error) {
    console.error("Error fetching avalanche report:", error);
    res.status(500).json({ error: "Failed to fetch avalanche report" });
  }
});

export default rogersPassReport;
