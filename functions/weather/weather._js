/*jshint esversion: 8 */

const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {

    console.dir(event.queryStringParameters.location);

    const location = event.queryStringParameters.location;

    const SITE = 'https://www.yr.no/place/United_Kingdom/Scotland/';
    const PAGE = '/hour_by_hour_detailed.html';

    const browser = await chromium.puppeteer.launch({
        executablePath: await chromium.executablePath,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: true, //chromium.headless,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 600 });

    const URL = SITE + location + PAGE;
    // console.log(logPrefix + URL);
    await page.goto(URL);
    const element = await page.$('.meteogramme-img');
    const ss = await element.screenshot({});
    const b64 = ss.toString('base64');

    await browser.close();

    return {
        statusCode: 200,
        body: JSON.stringify({ "src": `data:image/png;base64,${b64}` })
    };
}