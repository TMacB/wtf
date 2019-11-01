const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async function(event, context) {
  try {

    const feed = await parser.parseURL('https://trafficscotland.org/rss/feeds/currentincidents.aspx');

    return {
      statusCode: 200,
      body: JSON.stringify(feed)
    };

  } catch (err) {
    console.log(err); // output to netlify function log

    return {
      statusCode: 500,
      body: JSON.stringify({ items: [{ title: "error", link: 'http://trafficscotland.org/currentincidents/index.aspx', content: err.message }] })
    };
  }
};
