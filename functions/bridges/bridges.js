// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const fetch = require("puppeteer-lambda");

exports.handler = async (event, context) => {
  try {
    const puppeteerLambda = require('puppeteer-lambda');
    const browser = await puppeteerLambda.getBrowser({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 600 });
    await page.goto(`https://trafficscotland.org/bridgerestrictions/index.aspx`);
    const element = await page.$('.main');
    const ss = await element.screenshot();
    const b64 = ss.toString('base64');
    // await browser.close(); 
    
    return {
      statusCode: 200,
      body: JSON.stringify({ "src": `data:image/png;base64,${b64}` })
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};