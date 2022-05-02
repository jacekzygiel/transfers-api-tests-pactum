const {QuoteBuilder} = require('../domain/QuoteBuilder');

function getStandardQuote() {
  return new QuoteBuilder()
      .withCalculationBaseSendAmount()
      .setAmount('150')
      .setFromCountryCode('LT')
      .setToCountryCode('PL')
      .setFromCurrencyCode('EUR')
      .setToCurrencyCode('EUR');
}

module.exports = {getStandardQuote};
