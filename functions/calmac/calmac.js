const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    const response = await fetch("https://www.calmac.co.uk/service-status?ajax=json", {
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }

    const data = await response.json();

    const sorted =  data.sort(function(a, b) {
          var x = a['routeName']; 
          var y = b['routeName'];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });

    return {
      statusCode: 200,
      body: JSON.stringify(sorted)
    };

  } catch (err) {
    console.log(err); // output to netlify function log

    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
