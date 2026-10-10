const baseURL = 'https://api.worldbank.org/v2/';

// keeps only the fields the app uses, with simple names.
// the same shape is saved in localStorage for favorites
export function simplifyCountry(country) {
  return {
    code: country.iso2Code,
    name: country.name,
    capital: country.capitalCity || 'No capital listed',
    region: country.region.value.trim(),
    income: country.incomeLevel.value,
  };
}

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export default class CountryData {
  // gets every country from the World Bank API
  async getCountries() {
    const response = await fetch(`${baseURL}country?format=json&per_page=300`);
    const data = await convertToJson(response);

    // the World Bank sends back an array with two parts:
    // data[0] is page information and data[1] is the list of countries
    const countries = data[1];

    // the list also has groups like "World" or "Euro area" that are not real countries.
    // those groups have the region "Aggregates", so we remove them
    return countries
      .filter((country) => country.region.value.trim() !== 'Aggregates')
      .map(simplifyCountry);
  }

  // gets one country by its 2-letter code, like "JP"
  async getCountry(code) {
    const response = await fetch(`${baseURL}country/${code}?format=json`);
    const data = await convertToJson(response);

    // if the code is wrong, the World Bank sends a message instead of data[1]
    if (!data[1]) {
      throw new Error('Country not found');
    }
    return simplifyCountry(data[1][0]);
  }

  // gets the newest value of one indicator, like population, for a country.
  // mrnev=1 means "most recent year that has a value"
  async getIndicator(code, indicator) {
    const response = await fetch(
      `${baseURL}country/${code}/indicator/${indicator}?format=json&mrnev=1`,
    );
    const data = await convertToJson(response);

    // some small countries have no data for some indicators
    if (!data[1] || data[1].length === 0) {
      return null;
    }
    return { value: data[1][0].value, year: data[1][0].date };
  }
}
