const pactum = require('pactum');
const { expect } = require('chai');
const { getStandardQuote } = require('../testData/quoteData');
const { quoteFullUrl } = require('../utils/urls');

describe('Delivery options', () => {
  context('General delivery options', () => {
    it('should have standard and now delivery options', async () => {
      const quote = getStandardQuote()
        .build();

      await pactum.spec()
        .get(quoteFullUrl)
        .withQueryParams(quote)
        .expectStatus(200)
        .expect(((ctx) => {
          const { res } = ctx;
          expect(res.body.deliveryOptions).to.have.property('now');
          expect(res.body.deliveryOptions).to.have.property('standard');
        }));
    });

    it('should have standard and today delivery options', async () => {
      const quote = getStandardQuote()
        .setFromCountryCode('TR')
        .setFromCurrencyCode('TRY')
        .build();

      await pactum.spec()
        .get(quoteFullUrl)
        .withQueryParams(quote)
        .expectStatus(200)
        .expect(((ctx) => {
          const { res } = ctx;
          expect(res.body.deliveryOptions).to.have.property('today');
          expect(res.body.deliveryOptions).to.have.property('standard');
        }));
    });
  });
});
