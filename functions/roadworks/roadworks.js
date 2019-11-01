const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async function(event, context) {
  try {

    let feed = await parser.parseURL('https://trafficscotland.org/rss/feeds/roadworks.aspx');
    // console.info(feed.title);
    // console.dir(feed);

    return {
      statusCode: 200,
      body: JSON.stringify(feed)
    };

  } catch (err) {
    console.err(err); // output to netlify function log

    return {
      statusCode: 500,
      body: JSON.stringify({ "msg": err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
