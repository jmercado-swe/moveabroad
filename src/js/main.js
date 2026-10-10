import { loadHeaderFooter, qs } from './utils.mjs';
import CountryData from './CountryData.mjs';
import CountryList from './CountryList.mjs';

loadHeaderFooter();

const searchInput = qs('#search');
const regionSelect = qs('#region');
const incomeSelect = qs('#income');
const resultsCount = qs('#results-count');

const dataSource = new CountryData();
const countryList = new CountryList(
  dataSource,
  qs('#country-list'),
  resultsCount,
);

// adds one <option> to a dropdown for each value
function fillSelect(selectElement, values) {
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
}

function applyFilters() {
  countryList.filter(searchInput.value, regionSelect.value, incomeSelect.value);
}

async function start() {
  resultsCount.textContent = 'Loading countries...';
  try {
    await countryList.init();
    fillSelect(regionSelect, countryList.getOptions('region'));
    fillSelect(incomeSelect, countryList.getOptions('income'));
  } catch (err) {
    resultsCount.textContent =
      'Sorry, the countries could not be loaded. Please refresh the page to try again.';
  }
}

// filter as the user types or picks from a dropdown
searchInput.addEventListener('input', applyFilters);
regionSelect.addEventListener('change', applyFilters);
incomeSelect.addEventListener('change', applyFilters);

qs('#clear-filters').addEventListener('click', () => {
  searchInput.value = '';
  regionSelect.value = '';
  incomeSelect.value = '';
  applyFilters();
});

start();
