const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {

  const url = 'https://trafficscotland.org/bridgerestrictions/index.aspx';

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 600 });

  await page.goto(url);

  const element = await page.$('.main');

  await page.evaluate(() => {
    let h = document.querySelector('.main')
    let d = h.querySelector('h2');
    let t = h.querySelector('table');
    h.innerHTML = `<h3>${d.innerHTML}</h3>`;
    h.appendChild(t);
  });

  const ss = await element.screenshot();
  const b64 = ss.toString('base64');

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({ "src": `data:image/png;base64,${b64}` })
  };

}