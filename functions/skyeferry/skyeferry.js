// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {

    const url = 'https://skyeferry.co.uk/';

    const browser = await chromium.puppeteer.launch({
        executablePath: await chromium.executablePath,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: chromium.headless,
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 600 });

    await page.goto(url);

    const element = await page.$('.alert');
    const ss = await element.screenshot();
    const b64 = ss.toString('base64');

    await browser.close();
  
    return {
      statusCode: 200,
      body: JSON.stringify({ "src": `data:image/png;base64,${b64}` })
    };

}