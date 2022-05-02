const pactum = require('pactum');
const {getStandardQuote} = require('../testData/quoteData');
const {quoteFullUrl} = require('../utils/urls');
const {OK} = require('http-status-codes');

const expectedMaxResponseTime = 200;

describe('Performance tests of quote ', () => {
  it('should responds below 200ms', async () => {
    const quote = getStandardQuote()
        .build();

    await pactum.spec()
        .get(quoteFullUrl)
        .withQueryParams(quote)
        .expectStatus(OK)
        .expectResponseTime(expectedMaxResponseTime);
  });
});
