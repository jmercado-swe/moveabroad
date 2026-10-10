const baseURL = 'https://api.frankfurter.dev/v1/';

export default class CurrencyData {
  // finds the currency for a country in our own JSON file
  async getCurrencyInfo(countryCode) {
    const response = await fetch('/json/currencies.json');
    const currencies = await response.json();
    return currencies[countryCode] || null;
  }

  // gets today's rate from 1 Philippine peso to another currency
  async getRate(currencyCode) {
    const response = await fetch(
      `${baseURL}latest?base=PHP&symbols=${currencyCode}`,
    );

    // Frankfurter only has about 30 currencies, so some are not found
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (!data.rates || !data.rates[currencyCode]) {
      return null;
    }
    return { rate: data.rates[currencyCode], date: data.date };
  }
}
