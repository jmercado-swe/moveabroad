const baseURL = 'https://api.worldbank.org/v2/';

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
    return countries.filter(
      (country) => country.region.value.trim() !== 'Aggregates',
    );
  }
}
