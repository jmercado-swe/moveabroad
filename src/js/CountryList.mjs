import { renderListWithTemplate } from './utils.mjs';
import { isFavorite, toggleFavorite, setHeartButton } from './Favorites.mjs';

// builds the HTML for one country card
export function countryCardTemplate(country) {
  const saved = isFavorite(country.code);
  const label = saved
    ? `Remove ${country.name} from favorites`
    : `Save ${country.name} to favorites`;

  return `<li class="country-card">
    <a href="/country/index.html?code=${country.code}">
      <img
        src="https://flagcdn.com/w320/${country.code.toLowerCase()}.png"
        alt="Flag of ${country.name}"
        loading="lazy"
      />
      <h2>${country.name}</h2>
      <p class="capital">Capital: ${country.capital}</p>
      <p class="region">${country.region}</p>
      <p class="income-badge">${country.income}</p>
    </a>
    <button type="button" class="heart-button ${saved ? 'saved' : ''}"
      data-code="${country.code}" aria-pressed="${saved}" aria-label="${label}">&#9829;</button>
  </li>`;
}

export default class CountryList {
  constructor(listElement, countElement) {
    this.listElement = listElement;
    this.countElement = countElement;
    this.countries = [];

    // one click listener for the whole list (event delegation),
    // so we don't need a listener on every heart button
    this.listElement.addEventListener('click', (event) => {
      const button = event.target.closest('.heart-button');
      if (button) {
        this.handleHeartClick(button);
      }
    });
  }

  setCountries(countries) {
    // show the countries in A to Z order
    this.countries = [...countries].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  handleHeartClick(button) {
    const country = this.countries.find(
      (item) => item.code === button.dataset.code,
    );
    const saved = toggleFavorite(country);
    setHeartButton(button, saved, country.name, true);
    if (this.onFavoriteChange) {
      this.onFavoriteChange(country, saved);
    }
  }

  // shows only the countries that match the search box and both dropdowns
  filter(search, region, income) {
    const term = search.trim().toLowerCase();

    const filtered = this.countries.filter((country) => {
      const matchesSearch =
        country.name.toLowerCase().includes(term) ||
        country.capital.toLowerCase().includes(term);
      const matchesRegion = region === '' || country.region === region;
      const matchesIncome = income === '' || country.income === income;

      return matchesSearch && matchesRegion && matchesIncome;
    });

    this.renderList(filtered);
  }

  // returns the different regions or income levels, used to fill the dropdowns
  getOptions(type) {
    const values = this.countries.map((country) => country[type]);
    // a Set removes duplicates, then we turn it back into a sorted array
    return [...new Set(values)].sort();
  }

  renderList(
    list,
    emptyMessage = 'No countries match your search. Try different words or clear the filters.',
  ) {
    renderListWithTemplate(
      countryCardTemplate,
      this.listElement,
      list,
      'afterbegin',
      true,
    );

    if (list.length === 0) {
      this.countElement.textContent = emptyMessage;
    } else {
      const word = list.length === 1 ? 'country' : 'countries';
      this.countElement.textContent = `Showing ${list.length} ${word}`;
    }
  }
}
