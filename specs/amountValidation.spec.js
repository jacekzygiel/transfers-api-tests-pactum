const pactum = require('pactum');
const { getStandardQuote } = require('../testData/quoteData');
const { quoteFullUrl } = require('../utils/urls');

describe('Amount validation', () => {
  it('should successfully respond for amount at minimum', async () => {
    const quote = getStandardQuote()
      .setAmount('1')
      .build();

    await pactum.spec()
      .get(quoteFullUrl)
      .withQueryParams(quote)
      .expectStatus(200);
  });

  it('should respond with error for amount below minimum', async () => {
    const quote = getStandardQuote()
      .setAmount('0.99')
      .build();

    await pactum.spec()
      .get(quoteFullUrl)
      .withQueryParams(quote)
      .expectStatus(422)
      .expectJson({
        error: 'AMOUNT_IS_TOO_SMALL',
        message: 'tooSmallAmount',
      });
  });

  it('should successfully respond for amount at maximum', async () => {
    const quote = getStandardQuote()
      .setAmount('1000000.00')
      .build();

    await pactum.spec()
      .get(quoteFullUrl)
      .withQueryParams(quote)
      .expectStatus(200);
  });

  it('should respond with error for amount above maximum', async () => {
    const quote = getStandardQuote()
      .setAmount('1000000.01')
      .build();

    await pactum.spec()
      .get(quoteFullUrl)
      .withQueryParams(quote)
      .expectStatus(422)
      .expectJson({
        error: 'AMOUNT_IS_TOO_LARGE',
        message: 'invalidAmount',
      });
  });
});
