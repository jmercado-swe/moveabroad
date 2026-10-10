import { loadHeaderFooter, getParam, qs } from './utils.mjs';
import CountryData from './CountryData.mjs';
import CurrencyData from './CurrencyData.mjs';
import CountryDetails from './CountryDetails.mjs';
import CurrencyConverter from './CurrencyConverter.mjs';

loadHeaderFooter();

const code = getParam('code');
const detailsElement = qs('#country-details');
const converterSection = qs('#converter');

async function start() {
  if (!code) {
    detailsElement.innerHTML =
      '<p>No country was picked. Please go back and choose a country.</p>';
    return;
  }

  try {
    const currencyData = new CurrencyData();
    const details = new CountryDetails(
      code,
      new CountryData(),
      currencyData,
      detailsElement,
    );
    await details.init();

    // the converter needs the currency that the details page found
    converterSection.classList.remove('hide');
    const converter = new CurrencyConverter(
      details.currency,
      currencyData,
      qs('#converter-content'),
    );
    await converter.init();
  } catch (err) {
    detailsElement.innerHTML =
      '<p>Sorry, this country could not be loaded. Please go back and try again.</p>';
  }
}

start();
