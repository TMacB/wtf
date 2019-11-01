
// ===========================================
// Weather Forecasts
// ===========================================
const getWeather = async (location) => {
  console.info(`main.js -> getWeather -> ${location}`);

  const res = await fetch(`/weather?location=${location.replace(/ /g, "_")}`);
  const json = await res.json();
  const element = document.getElementById(location);
  const node = document.createElement("div");
  node.innerHTML = `<h4>${location}</h4><img src="${json.src}"/>`;
  element.appendChild(node);
};

const places = document.getElementsByClassName("weather");
for (var i = 0; i < places.length; i++) {
  const location = places[i].id;
  // getWeather(location);
}


// ===========================================
// Calmac Statuses
// ===========================================
const getCalmacStatus = async () => {
  console.info(`main.js -> getCalmacStatus`);

  const res = await fetch('/calmac');
  const json = await res.json();

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

  const element = document.getElementById('calmac');
  const h = document.createElement("h4");
    h.innerHTML = "Calmac";
    element.appendChild(h);

  for (var s in status) {
    const el = document.createElement("div");
    el.innerHTML = status[s];
    element.appendChild(el);
  }
};
getCalmacStatus();


// ===========================================
// Bridge Statuses
// ===========================================
const getBridges = async () => {
  console.info(`main.js -> getBridges`);

  const res = await fetch(`/bridges`);
  const json = await res.json();
  const element = document.getElementById('bridges');
  const node = document.createElement("div");
  node.innerHTML = `<img src="${json.src}"/>`;
  element.appendChild(node);
};
getBridges();


// ===========================================
// Met Office Warnings
// ===========================================
const getMetOfficeWarnings = async () => {
  console.info(`main.js -> getMetOfficeWarnings`);

  const res = await fetch(`/metoffice`);
  const json = await res.json();
  // console.dir(json);

  const element = document.getElementById('metoffice');
  for (var s in json) {
    const j = json[s];
    const el = document.createElement("div");
    el.innerHTML = `<table><tr><td><img src="${j.icon}"/>&nbsp;</td><td><a href="${j.link}">${j.title}</a> - ${j.time}<br/>${j.desc}</td></tr></table>`;
    element.appendChild(el);
  }
};
getMetOfficeWarnings();


// ===========================================
// Travel Scotland - Incidents
// ===========================================
const getIncidents = async () => {
  console.info(`main.js -> getIncidents`);

  const res = await fetch(`/incidents`);
  const json = await res.json();
  // console.dir(json.items);

  const element = document.getElementById('incidents');
  for (var s in json.items) {
    const j = json.items[s];
    const el = document.createElement('div');

    if (j.title == 'error') {
      console.error("Error retrieving Travel Scotland Incidents...")
      console.error(j.content)
      el.innerHTML = `Error loading <a href="${j.link}">Travel Scotland Incidents</a> - Please try refreshing your browser`;
    }
    else {
      el.innerHTML = `<table><tr><td><a href="${j.link}">${j.title}</a> - published on: ${j.pubDate}<br/>${j.content}</td></tr></table>`;
    }
    element.appendChild(el);
  }
};
getIncidents();


// ===========================================
// Travel Scotland - Roadworks
// ===========================================
const getRoadworks = async () => {
  console.info(`main.js -> getRoadworks`);

  const res = await fetch(`/roadworks`);
  const json = await res.json();

  const element = document.getElementById('roadworks');
  for (var s in json.items) {
    const j = json.items[s];
    const el = document.createElement('div');

    if (j.title == 'error') {
      console.error('Error retrieving Travel Scotland Roadworks...')
      console.error(j.content)
      el.innerHTML = `Error loading <a href="${j.link}">Travel Scotland Roadworks</a> - Please try refreshing your browser`;
    }
    else {
      el.innerHTML = `<table><tr><td><a href="${j.link}">${j.title}</a> - published on: ${j.pubDate}<br/>${j.content}</td></tr></table>`;
    }
    element.appendChild(el);
  }
};
getRoadworks();


// ===========================================
// Skye Ferry Status
// ===========================================
const getSkyeFerry = async () => {
  console.info(`main.js -> getSkyeFerry`);

  const res = await fetch(`/skyeferry`);
  const json = await res.json();
  const element = document.getElementById('skyeferry');
  const node = document.createElement("div");
  node.innerHTML = `<h4>Glenelg / Skye Ferry</h4><img src="${json.src}"/>`;
  element.appendChild(node);
};
getSkyeFerry();