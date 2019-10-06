const getWeather = async(locations) => {

  locations = locations || "";
  console.log("main.js -> getWeather -> " + locations.toString() + " " + typeof(locations));

  const res = await fetch(`/weather?locations=${locations}`);
  const json = await res.json();

  const element = document.getElementById('weather');

  for (let location in json) {
    const node = document.createElement("div");
    node.innerHTML = `<h3>${location}</h3><img src="${json[location]}"/>`;

    element.appendChild(node);
  }
}

const locations = ['Edinburgh','Grantown on Spey','Tongue','Shieldaig','Portree','Glenelg','Inveraray'];
getWeather(locations);


const getCalmacStatus = async() => {

    const res = await fetch('/calmac');
    const json = await res.json();
    // const json = JSON.parse(body);
    const element = document.getElementById('calmac');

    const status = json.map(f => {

        let src = '';
        switch (f.image) {
          case 'normal': 
            src = 'https://www.calmac.co.uk/image/1788/normal-icon-green/original.png'
          break;
          case 'beware': 
            src = 'https://www.calmac.co.uk/image/3119/Be-Aware-Yellow-icon/original.jpg'
          break;
          case 'affected': 
            src = 'https://www.calmac.co.uk/image/1787/maybe-affected-icon-amber/original.png'
          break;
          case 'cancelled': 
            src = 'https://www.calmac.co.uk/image/1786/cancelled-icon-red/original.png'
          break;
          default:
            'no-image';
        }
  
        f.reason = '- ' + f.reason;
        f.reason = f.reason.replace('- NONE', '');

        let html = `<img src="${src}" height="16" alt="${f.status}" title="${f.status}"/> <a href="https://www.calmac.co.uk/service-status?route=${f.code}" title="Route: ${f.code}">${f.routeName}</a> ${f.reason}`;
        // html = html + ` ${f.infoMsg}`;

        return html;

    });

    for (var s in status) {
        const el = document.createElement("div");
        el.innerHTML = status[s];
        element.appendChild(el);
    }
}

getCalmacStatus();

const getBridges = async() => {
    console.log("main.js -> getBridges");

    const res = await fetch(`/bridges`);
    const json = await res.json();

    const element = document.getElementById('bridges');

    const node = document.createElement("div");
    node.innerHTML = `<img src="${json.src}"/>`;

    element.appendChild(node);
}

getBridges();