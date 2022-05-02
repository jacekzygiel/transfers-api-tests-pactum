const pactum = require('pactum');
const {getStandardQuote} = require('../testData/quoteData');
const {quoteFullUrl} = require('../utils/urls');
const {OK, UNPROCESSABLE_ENTITY} = require('http-status-codes');

const minGlobalAmount = 1.00
const maxGlobalAmount = 1000000.00

describe('Amount validation', () => {
  it('should successfully respond for amount at minimum', async () => {
    const quote = getStandardQuote()
        .setAmount(minGlobalAmount)
        .build();

    await pactum.spec()
        .get(quoteFullUrl)
        .withQueryParams(quote)
        .expectStatus(OK);
  });

  it('should respond with error for amount below minimum', async () => {
    const quote = getStandardQuote()
        .setAmount(minGlobalAmount - 0.01)
        .build();

    await pactum.spec()
        .get(quoteFullUrl)
        .withQueryParams(quote)
        .expectStatus(UNPROCESSABLE_ENTITY)
        .expectJson({
          error: 'AMOUNT_IS_TOO_SMALL',
          message: 'tooSmallAmount',
        });
  });

  it('should successfully respond for amount at maximum', async () => {
    const quote = getStandardQuote()
        .setAmount(maxGlobalAmount)
        .build();

    await pactum.spec()
        .get(quoteFullUrl)
        .withQueryParams(quote)
        .expectStatus(OK);
  });

  it('should respond with error for amount above maximum', async () => {
    const quote = getStandardQuote()
        .setAmount(maxGlobalAmount + 0.01)
        .build();

    await pactum.spec()
        .get(quoteFullUrl)
        .withQueryParams(quote)
        .expectStatus(UNPROCESSABLE_ENTITY)
        .expectJson({
          error: 'AMOUNT_IS_TOO_LARGE',
          message: 'invalidAmount',
        });
  });
});
