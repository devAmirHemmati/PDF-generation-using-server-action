"use server";
import { Browser } from "puppeteer-core";

export async function generatePDF(html: string): Promise<Buffer | null> {
  // Initiate the browser instance
  let browser: Browser | undefined | null;

  // Check if the environment is development
  if (process.env.NODE_ENV !== "development") {
    // Import the packages required on production
    const chromium = require("@sparticuz/chromium");
    const puppeteer = require("puppeteer-core");

    // Assign the browser instance
    browser = await puppeteer.launch({
      executablePath: await chromium.executablePath(),
      headless: "new",
      ignoreHTTPSErrors: true,
      defaultViewport: chromium.defaultViewport,
      args: [
        ...chromium.args,
        "--disable-extensions",
        "--hide-scrollbars",
        "--disable-web-security",
      ],
    });
  } else {
    // Else, use the full version of puppeteer
    const puppeteer = require("puppeteer");
    browser = await puppeteer.launch({
      headless: true,
    });
  }

  // Create a PDF
  if (browser) {
    const page = await browser.newPage();
    await page.setContent(html);

    const pdfBuffer = await page.pdf({
      format: "a4",
      printBackground: true,
      margin: {
        top: 80,
        bottom: 80,
        left: 80,
        right: 80,
      },
    });

    await browser.close();

    return pdfBuffer;
  }

  return null;
}
