/*jshint esversion: 8 */

// ===========================================
// Met Office Warnings
// ===========================================
const getMetOfficeWarnings2 = async () => {
  console.info(`main.js -> getMetOfficeWarnings`);

  const res = await fetch(`/metoffice`);
  const json = await res.json();
  // console.dir(json);

  const element = document.getElementById('metoffice');
  const h = document.createElement("h5");

  // console.log(json);

  if (json.title == 'no warnings') {
    element.style.display = 'none';
  }
  else {

    h.innerHTML = "Met Office Weather Warnings";
    element.appendChild(h);
  
    for (var s in json) {
      const j = json[s];
      const el = document.createElement("div");
  
      if (j.title == 'error') {
        console.error("Error retrieving Met Office Warnings...");
        console.error(j.content);
        el.innerHTML = `Error loading <a href="${j.link}">Met Office Warnings</a> - Please try refreshing your browser`;
      }
      else {
        el.innerHTML = `<table><tr><td><img src="${j.icon}"/>&nbsp;</td><td><a href="${j.link}">${j.title}</a> <span class="date">- ${j.time}</span><br/>${j.desc}</td></tr></table>`;
      }
      element.appendChild(el);
    }

  }
};

const getMetOfficeWarnings = async () => {
  console.info(`main.js -> getMetOfficeWarnings`);

  // const res = await fetch(`/incidents`);
  const res = await fetch(`/metoffice`);
  let html = await res.text();

  const element = document.getElementById('metoffice');
  const el = document.createElement('div');
  el.innerHTML = html;
  
  element.appendChild(el);
};


// ===========================================
// Weather Forecasts
// ===========================================
const getWeather = async (location) => {
  console.info(`main.js -> getWeather -> ${location}`);

  const res = await fetch(`/.netlify/functions/weather/weather.go?location=${location}`);
  const html = await res.text();
  const element = document.getElementById(location);
  const node = document.createElement("div");
  node.innerHTML = html
  element.appendChild(node);
};

const getForecasts = () => {
  const places = document.getElementsByClassName("weather");
  for (var i = 0; i < places.length; i++) {
    const location = places[i].id;

    // console.log(location);

    getWeather(location);
  }
};


// ===========================================
// Calmac Statuses
// ===========================================
const getCalmacStatus2 = async () => {
  console.info(`main.js -> getCalmacStatus`);

  const res = await fetch('/calmac');
  const json = await res.json();

  const status = json.map(f => {
    let src = '';
    switch (f.image) {
      case 'normal':
        src = 'https://www.calmac.co.uk/image/1788/normal-icon-green/original.png';
        break;
      case 'beware':
        src = 'https://www.calmac.co.uk/image/3119/Be-Aware-Yellow-icon/original.jpg';
        break;
      case 'affected':
        src = 'https://www.calmac.co.uk/image/1787/maybe-affected-icon-amber/original.png';
        break;
      case 'cancelled':
        src = 'https://www.calmac.co.uk/image/1786/cancelled-icon-red/original.png';
        break;
      default:
        src = 'no-image';
    }

    f.reason = '- ' + f.reason;
    f.reason = f.reason.replace('- NONE', '');

    let html = `<img src="${src}" height="16" alt="${f.status}" title="${f.status}"/> <a href="https://www.calmac.co.uk/service-status?route=${f.code}" title="Route: ${f.code}">${f.routeName}</a> ${f.reason}`;
    // html = html + ` ${f.infoMsg}`;

    return html;

  });

  const element = document.getElementById('calmac');
  const h = document.createElement("h5");
  h.innerHTML = "Calmac";
  element.appendChild(h);

  for (var s in status) {
    const el = document.createElement("div");
    el.innerHTML = status[s];
    element.appendChild(el);
  }
};

const getCalmacStatus = async () => {
  console.info(`main.js -> getCalmacStatus`);

  // const res = await fetch(`/incidents`);
  const res = await fetch(`/.netlify/functions/calmac/calmac.go`);
  let html = await res.text();

  const element = document.getElementById('calmac');

  const el = document.createElement('div');
  el.innerHTML = `<h5 class="section-heading">Calmac Ferries</h5>` + html + "<br/>"
  
  element.appendChild(el);
};


// ===========================================
// Bridge Statuses
// ===========================================
const getBridges = async () => {
  console.info(`main.js -> getBridges`);

  const res = await fetch(`/bridges`);
  const json = await res.json();
  const element = document.getElementById('bridges');

  const node = document.createElement("div");
  node.innerHTML = `<h5 class="section-heading">Bridges</h5>
                    <img class="u-max-full-width" src="${json.src}"/>`
  element.appendChild(node);
};

const getBridges2 = async () => {
  console.info(`main.js -> getBridges`);

  const res = await fetch(`/.netlify/functions/bridges/bridges.go`);

  const html = await res.text();
  const element = document.getElementById('bridges');

  const node = document.createElement("div");
  node.innerHTML = `<h5 class="section-heading">Bridges</h5>` + html + "<br/>"
  element.appendChild(node);

};



// ===========================================
// Travel Scotland - Incidents
// ===========================================
const getIncidents = async () => {
  console.info(`main.js -> getIncidents`);

  // const res = await fetch(`/incidents`);
  const res = await fetch(`/.netlify/functions/incidents/incidents.go`);
  let html = await res.text();

  const element = document.getElementById('incidents');

  // for (var s in json) {
  //   const j = json[s];
    const el = document.createElement('div');

    el.innerHTML = html;
    
    element.appendChild(el);
  // }
};

// ===========================================
// Travel Scotland - Roadworks
// ===========================================
const getRoadworks = async () => {
  console.info(`main.js -> getRoadworks`);

  // const res = await fetch(`/incidents`);
  const res = await fetch(`/.netlify/functions/roadworks/roadworks.go`);
  let html = await res.text();

  const element = document.getElementById('roadworks');
  const h = document.createElement("h5");
  h.className = "collapsible";
  h.onclick = function () {
    collapse(this);
  };
  h.innerHTML = "Roadworks";
  element.appendChild(h);

  const content = document.createElement("div");
  content.className = "content";
  element.appendChild(content);

  // for (var s in json) {
  //   const j = json[s];
    const el = document.createElement('div');

    el.innerHTML = html;
    
    content.appendChild(el);
  // }
};


// ===========================================
// Travel Scotland - Roadworks
// ===========================================
const getRoadworks2 = async () => {
  console.info(`main.js -> getRoadworks`);

  const res = await fetch(`/roadworks`);
  let json = await res.json();
  json = json.items;

  json = json.sort(function (a, b) {
    var x = a['title'];
    var y = b['title'];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });

  const element = document.getElementById('roadworks');
  const h = document.createElement("h5");
  h.className = "collapsible";
  h.onclick = function () {
    collapse(this);
  };
  h.innerHTML = "Roadworks";
  element.appendChild(h);

  const content = document.createElement("div");
  content.className = "content";
  element.appendChild(content);

  for (var s in json) {
    const j = json[s];
    const el = document.createElement('div');

    if (j.title == 'error') {
      console.error('Error retrieving Travel Scotland Roadworks...');
      console.error(j.content);
      el.innerHTML = `Error loading <a href="${j.link}">Travel Scotland Roadworks</a> - Please try refreshing your browser`;
    }
    else {

      j.content = j.content.replace(/^Start Date: /gi, '');
      j.content = j.content.replace(/ - 00:00<br \/>End Date: /gi, ' - ');
      j.content = j.content.replace(/ - 00:00/gi, '');
      j.content = j.content.replace(/<br \/>/gi, ' -');
      j.content = j.content.replace(/ -$/gi, '');
      j.content = j.content.replace(/Delay Information:/gi, ' ');

      j.content = j.content.replace(/Monday,/g, 'Mon');
      j.content = j.content.replace(/Tuesday,/g, 'Tue');
      j.content = j.content.replace(/Wednesday,/g, 'Wed');
      j.content = j.content.replace(/Thursday,/g, 'Thu');
      j.content = j.content.replace(/Friday,/g, 'Fri');
      j.content = j.content.replace(/Saturday,/g, 'Sat');
      j.content = j.content.replace(/Sunday,/g, 'Sun');

      j.content = j.content.replace(/January/g, 'Jan');
      j.content = j.content.replace(/February/g, 'Feb');
      j.content = j.content.replace(/March/g, 'Mar');
      j.content = j.content.replace(/April/g, 'April');
      j.content = j.content.replace(/June/g, 'Jun');
      j.content = j.content.replace(/July/g, 'Jul');
      j.content = j.content.replace(/August/g, 'Aug');
      j.content = j.content.replace(/September/g, 'Sep');
      j.content = j.content.replace(/October/g, 'Oct');
      j.content = j.content.replace(/November/g, 'Nov');
      j.content = j.content.replace(/December/g, 'Dec');

      el.innerHTML = `<a href="${j.link}">${j.title}</a> <span class="date"> ${j.content}</span><br/>`;
    }
    content.appendChild(el);
  }
  // element.appendChild(content);
};


// ===========================================
// Skye Ferry Status
// ===========================================
const getSkyeFerry = async () => {
  console.info(`main.js -> getSkyeFerry`);

  const res = await fetch(`/.netlify/functions/skyeferry/skyeferry.go`);

  const html = await res.text();
  const element = document.getElementById('skyeferry');

  const node = document.createElement("div");
  node.innerHTML = `<h5 class="section-heading">Glenelg / Skye Ferry</h5>` + html + "<br/>"
  element.appendChild(node);

};


// ===========================================
// Get Items
// ===========================================

getMetOfficeWarnings();
getForecasts();

getIncidents();
getRoadworks();
getBridges();

getSkyeFerry();
getCalmacStatus();


collapse = (e) => {
  e.classList.toggle("active");
  var content = e.nextElementSibling;
  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
}