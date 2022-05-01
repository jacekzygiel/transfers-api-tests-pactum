const pactum = require('pactum');
const { expect } = require('chai');
const { getStandardQuote } = require('../testData/quoteData');
const { quoteFullUrl } = require('../utils/urls');

describe('Performance tests of quote ', () => {
  it('should responds below 200ms', async () => {
    const quote = getStandardQuote()
      .build();

    await pactum.spec()
      .get(quoteFullUrl)
      .withQueryParams(quote)
      .expectStatus(200)
      .expectResponseTime(200);
  });
});
