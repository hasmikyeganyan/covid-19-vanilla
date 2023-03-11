const dateTag = document.getElementById('date');
const today = new Date();
today.setDate(today.getDate() - 1);
dateTag.min = '2020-01-22';

// START Regions Select
const fetchRegions = async () => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '466d2434c6msh6f87b9f37a9e0cfp1e427djsnf5e16fa4fd9e',
      'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com',
    },
  };

  return fetch('https://covid-19-statistics.p.rapidapi.com/regions', options)
    .then((response) => response.json())
    .then((response) => response.data)
    .catch((err) => console.error(err));
};

const renderRegionsSelect = () => {
  fetchRegions().then((regions) => {
    const regionsSelect = document.getElementById('regions-select');

    regions.forEach((region) => {
      const option = document.createElement('option');
      option.setAttribute('value', region.iso);
      option.innerText = region.name;

      regionsSelect.appendChild(option);
    });
  });
};

renderRegionsSelect();
// END Regions Select

// START Global Records
const fetchGlobalRecords = async (date) => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '466d2434c6msh6f87b9f37a9e0cfp1e427djsnf5e16fa4fd9e',
      'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com',
    },
  };

  return fetch(`https://covid-19-statistics.p.rapidapi.com/reports/total?${!date ? '' : `date=${date}`}`, options)
    .then((response) => response.json())
    .then((response) => response.data)
    .catch((err) => console.error(err));
};

const renderGlobalRecords = (selectedDate) => {
  const updatedOn = document.getElementById('updated');

  fetchGlobalRecords(selectedDate).then((data) => {
    updatedOn.innerText = `Updated on: ${data.last_update}`;

    const confirmed = document.getElementById('confirmed');
    confirmed.innerText = data.confirmed;
    const s1 = document.createElement('span');
    s1.innerText = `(+${data.confirmed_diff})`;
    confirmed.appendChild(s1);

    const recovered = document.getElementById('recovered');
    recovered.innerText = data.recovered;
    const s2 = document.createElement('span');
    s2.innerText = `(+${data.recovered_diff})`;
    recovered.appendChild(s2);

    const deaths = document.getElementById('deaths');
    deaths.innerText = data.deaths;
    const s3 = document.createElement('span');
    s3.innerText = `(+${data.deaths_diff})`;
    deaths.appendChild(s3);

    const active = document.getElementById('active');
    active.innerText = data.active;
    const s4 = document.createElement('span');
    s4.innerText = `(+${data.active_diff})`;
    active.appendChild(s4);
  });
};

renderGlobalRecords();
// END Global Records

// START Region Records
const regionTag = document.getElementById('regions-select');

const fetchByRegionAndDate = async (iso, date) => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '466d2434c6msh6f87b9f37a9e0cfp1e427djsnf5e16fa4fd9e',
      'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com',
    },
  };

  return fetch(
    `https://covid-19-statistics.p.rapidapi.com/reports?${!iso ? '' : `iso=${iso}`}&${!date ? '' : `date=${date}`}`,
    options
  )
    .then((response) => response.json())
    .then((response) => response.data)
    .catch((err) => console.error(err));
};

const renderRegionRecords = (iso, selectedDate) => {
  const table = document.getElementById('table');
  const tbody = document.getElementById('rows-body');
  table.removeChild(tbody);

  const newTbody = document.createElement('tbody');
  newTbody.setAttribute('id', 'rows-body');
  table.appendChild(newTbody);

  fetchByRegionAndDate(iso, selectedDate).then((dataArray) => {
    dataArray.forEach((data) => {
      const tr = document.createElement('tr');
      newTbody.appendChild(tr);

      const columnKeys = [
        'region.iso',
        'region.name',
        'region.province',
        'confirmed',
        'confirmed_diff',
        'deaths',
        'deaths_diff',
        'recovered',
        'active',
      ];

      columnKeys.forEach((key) => {
        const keys = key.split('.');

        const td = document.createElement('td');

        td.innerText = keys[1] ? data[keys[0]][keys[1]] : data[keys[0]];

        tr.appendChild(td);
      });
    });
  });
};
// END Region Records

dateTag.addEventListener('change', () => {
  renderGlobalRecords(dateTag.value);
  renderRegionRecords(regionTag.value, dateTag.value);
});

regionTag.addEventListener('change', () => renderRegionRecords(regionTag.value, dateTag.value));
