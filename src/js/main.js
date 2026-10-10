import {
  loadHeaderFooter,
  qs,
  getLocalStorage,
  setLocalStorage,
} from './utils.mjs';
import CountryData from './CountryData.mjs';
import CountryList from './CountryList.mjs';
import { updateFavoritesBadge } from './Favorites.mjs';

const FILTERS_KEY = 'ma-filters';

loadHeaderFooter().then(updateFavoritesBadge);

const searchInput = qs('#search');
const regionSelect = qs('#region');
const incomeSelect = qs('#income');
const resultsCount = qs('#results-count');

const countryList = new CountryList(qs('#country-list'), resultsCount);

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

  // remember the filters so they are still there when the user comes back
  setLocalStorage(FILTERS_KEY, {
    search: searchInput.value,
    region: regionSelect.value,
    income: incomeSelect.value,
  });
}

async function start() {
  resultsCount.textContent = 'Loading countries...';
  resultsCount.classList.add('loading');
  try {
    const countries = await new CountryData().getCountries();
    countryList.setCountries(countries);
    fillSelect(regionSelect, countryList.getOptions('region'));
    fillSelect(incomeSelect, countryList.getOptions('income'));

    // put back the last search and filters from localStorage
    const saved = getLocalStorage(FILTERS_KEY);
    if (saved) {
      searchInput.value = saved.search;
      regionSelect.value = saved.region;
      incomeSelect.value = saved.income;
    }
    applyFilters();
  } catch (err) {
    resultsCount.textContent =
      'Sorry, the countries could not be loaded. Please refresh the page to try again.';
  }
  resultsCount.classList.remove('loading');
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
