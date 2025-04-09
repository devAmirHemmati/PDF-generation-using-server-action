"use server";
import { Browser } from "playwright-core";

export async function generatePDF(html: string): Promise<Buffer | null> {
  let browser: Browser | undefined | null;

  if (process.env.NODE_ENV !== "development") {
    // Import the packages required on production
    const chromium = require("@sparticuz/chromium");
    const { chromium: playwrightChromium } = require("playwright-core");

    // Assign the browser instance using Playwright
    browser = await playwrightChromium.launch({
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    });
  } else {
    // Use Playwright's full version for development
    const { chromium } = require("playwright");
    browser = await chromium.launch({
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
