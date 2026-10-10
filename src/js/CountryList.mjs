import { renderListWithTemplate } from './utils.mjs';

// builds the HTML for one country card
function countryCardTemplate(country) {
  const code = country.iso2Code.toLowerCase();
  const capital = country.capitalCity || 'No capital listed';

  return `<li class="country-card">
    <img
      src="https://flagcdn.com/w320/${code}.png"
      alt="Flag of ${country.name}"
      loading="lazy"
    />
    <h2>${country.name}</h2>
    <p class="capital">Capital: ${capital}</p>
    <p class="region">${country.region.value.trim()}</p>
    <p class="income-badge">${country.incomeLevel.value}</p>
  </li>`;
}

export default class CountryList {
  constructor(dataSource, listElement, countElement) {
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.countElement = countElement;
    this.countries = [];
  }

  async init() {
    this.countries = await this.dataSource.getCountries();
    // show the countries in A to Z order
    this.countries.sort((a, b) => a.name.localeCompare(b.name));
    this.renderList(this.countries);
  }

  // shows only the countries that match the search box and both dropdowns
  filter(search, region, income) {
    const term = search.trim().toLowerCase();

    const filtered = this.countries.filter((country) => {
      const matchesSearch =
        country.name.toLowerCase().includes(term) ||
        country.capitalCity.toLowerCase().includes(term);
      const matchesRegion =
        region === '' || country.region.value.trim() === region;
      const matchesIncome =
        income === '' || country.incomeLevel.value === income;

      return matchesSearch && matchesRegion && matchesIncome;
    });

    this.renderList(filtered);
  }

  // returns the different regions or income levels, used to fill the dropdowns
  getOptions(type) {
    const values = this.countries.map((country) =>
      type === 'region'
        ? country.region.value.trim()
        : country.incomeLevel.value,
    );
    // a Set removes duplicates, then we turn it back into a sorted array
    return [...new Set(values)].sort();
  }

  renderList(list) {
    renderListWithTemplate(
      countryCardTemplate,
      this.listElement,
      list,
      'afterbegin',
      true,
    );

    if (list.length === 0) {
      this.countElement.textContent =
        'No countries match your search. Try different words or clear the filters.';
    } else {
      const word = list.length === 1 ? 'country' : 'countries';
      this.countElement.textContent = `Showing ${list.length} ${word}`;
    }
  }
}
