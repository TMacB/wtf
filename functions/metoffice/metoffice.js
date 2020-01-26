/*jshint esversion: 8 */

const Parser = require('rss-parser');
const parser = new Parser({
  customFields: {
    item: [
      ['metadata:warningKind', 'kind'],
      ['metadata:warningLevel', 'level'],
      ['metadata:warningType', 'type'],
    ]
  }
});

exports.handler = async function (event, context) {
  try {
    const feed = await parser.parseURL('http://www.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/UK');
    console.info(feed.title);

    // return if none found
    if (feed.items.length == 0) {
      console.info('No MetOffice Warnings...');
      return {
        statusCode: 200,
        body: JSON.stringify('No MetOffice Warnings')
      };
    } else {
      console.info(`${feed.items.length}  MetOffice Warnings detected...`);
    }

    // pull out any Scottish warnings
    let items = feed.items.map(function (item) {
      if (item.title.match(/ scotland /gi)) {
        const desc = item.contentSnippet.replace(`${item.title} : `, '');
        return { title: item.title, desc: desc, link: item.link, kind: item.kind, type: item.type, level: item.level };
      }
    });

    // clean out null entries from map function (above)
    items = items.filter(n => {
      return n != null;
    });

    // if none found
    if (items.length == 0) {
      console.info('No MetOffice Warnings for Scotland...');
    }

    items.forEach(item => {
      const title = item.title;
      item.desc = item.desc.replace(`${title} : `, '');
      item.desc = item.desc.replace(`valid from`, '----');

      item.mw = item.desc.split('----');
      item.desc = item.mw[0];
      item.time = item.mw[1];

      // item.warning = title.match(/^\S+ \S+/gi).toString();
      // item.warning = item.warning.replace(' ', '');
      item.warning = item.level.toLowerCase() + item.kind.charAt(0).toUpperCase() + item.kind.slice(1).toLowerCase();
      item.title = title.replace(/^\S+ \S+ of /gi, '');
      item.title = item.title.replace(/affecting scotland /gi, '');
      item.icon = `https://www.metoffice.gov.uk/webfiles/1572349202202/images/icons/warnings/${item.warning}.svg`;
      // item.icon = `https://www.metoffice.gov.uk/webfiles/1572349202202/images/icons/warnings/warning-triangles.svg`;
    });

    console.info(`${items.length}  MetOffice Warnings for Scotland detected...`);

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };

  } catch (err) {
    console.log(err); // output to netlify function log

    return {
      statusCode: 500,
      body: JSON.stringify([{title: "error", desc: err.message, link: 'https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings'}])
    };
  }
};