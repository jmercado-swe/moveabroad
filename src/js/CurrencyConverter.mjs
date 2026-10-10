// shows a number as money, like "¥24,595.00"
function formatMoney(amount, currencyCode) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

export default class CurrencyConverter {
  constructor(currency, dataSource, element) {
    this.currency = currency;
    this.dataSource = dataSource;
    this.element = element;
    this.rate = null;
  }

  async init() {
    // no currency found, or the country already uses pesos
    if (!this.currency) {
      this.element.innerHTML =
        '<p>Currency information is not available for this country.</p>';
      return;
    }
    if (this.currency.code === 'PHP') {
      this.element.innerHTML =
        '<p>This country uses the Philippine peso, so there is nothing to convert.</p>';
      return;
    }

    const result = await this.dataSource.getRate(this.currency.code);
    if (!result) {
      this.element.innerHTML = `<p>Live exchange rates are not available for the ${this.currency.name} (${this.currency.code}).</p>`;
      return;
    }

    this.rate = result.rate;
    this.renderForm(result.date);

    const form = this.element.querySelector('#converter-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.convert(form.elements['php-amount'].value);
    });

    // show a first result right away
    this.convert(form.elements['php-amount'].value);
  }

  renderForm(date) {
    this.element.innerHTML = `
      <form id="converter-form" class="converter-form">
        <label for="php-amount">Amount in Philippine pesos (PHP)</label>
        <div class="converter-row">
          <input type="number" id="php-amount" name="php-amount" min="1" step="any" value="10000" required />
          <button type="submit">Convert</button>
        </div>
      </form>
      <p class="converter-result" id="converter-result" aria-live="polite"></p>
      <p class="converter-note">
        1 PHP = ${this.rate} ${this.currency.code} (rate from the Frankfurter API, ${date})
      </p>`;
  }

  convert(amount) {
    const pesos = Number(amount);
    const converted = pesos * this.rate;
    this.element.querySelector('#converter-result').textContent =
      `${formatMoney(pesos, 'PHP')} = ${formatMoney(converted, this.currency.code)}`;
  }
}
