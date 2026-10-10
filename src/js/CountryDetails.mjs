// shows an indicator value with its year, or "No data"
function indicatorText(indicator, formatFn) {
  if (!indicator || indicator.value === null) {
    return 'No data';
  }
  return `${formatFn(indicator.value)} <span class="data-year">(${indicator.year})</span>`;
}

function countryDetailsTemplate(country, population, gdp, currency) {
  const code = country.iso2Code.toLowerCase();
  const capital = country.capitalCity || 'No capital listed';
  const currencyText = currency
    ? `${currency.name} (${currency.code})`
    : 'Not available';

  return `
    <div class="country-header">
      <img src="https://flagcdn.com/w640/${code}.png" alt="Flag of ${country.name}" />
      <div>
        <h1>${country.name}</h1>
        <p class="country-sub">${capital} · ${country.region.value.trim()}</p>
        <p class="income-badge">${country.incomeLevel.value}</p>
      </div>
    </div>

    <ul class="fact-tiles">
      <li class="fact-tile">
        <h2>Population</h2>
        <p>${indicatorText(population, (value) => value.toLocaleString('en-US'))}</p>
      </li>
      <li class="fact-tile">
        <h2>GDP per capita (US$)</h2>
        <p>${indicatorText(gdp, (value) => `$${Math.round(value).toLocaleString('en-US')}`)}</p>
      </li>
      <li class="fact-tile">
        <h2>Region</h2>
        <p>${country.region.value.trim()}</p>
      </li>
      <li class="fact-tile">
        <h2>Income level</h2>
        <p>${country.incomeLevel.value}</p>
      </li>
      <li class="fact-tile">
        <h2>Capital</h2>
        <p>${capital}</p>
      </li>
      <li class="fact-tile">
        <h2>Currency</h2>
        <p>${currencyText}</p>
      </li>
    </ul>`;
}

export default class CountryDetails {
  constructor(code, countryData, currencyData, element) {
    this.code = code;
    this.countryData = countryData;
    this.currencyData = currencyData;
    this.element = element;
    this.currency = null;
  }

  async init() {
    // these 4 requests don't depend on each other, so we run them at the same time
    const [country, population, gdp, currency] = await Promise.all([
      this.countryData.getCountry(this.code),
      this.countryData.getIndicator(this.code, 'SP.POP.TOTL'),
      this.countryData.getIndicator(this.code, 'NY.GDP.PCAP.CD'),
      this.currencyData.getCurrencyInfo(this.code.toUpperCase()),
    ]);

    this.currency = currency;
    document.title = `MoveAbroad | ${country.name}`;
    this.element.innerHTML = countryDetailsTemplate(
      country,
      population,
      gdp,
      currency,
    );
  }
}
