const pactum = require('pactum');
const { expect } = require('chai');
const { getStandardQuote } = require('../testData/quoteData');
const { quoteFullUrl } = require('../utils/urls');

describe('Delivery options', () => {
  context('General tests of delivery options', () => {
    it('should have standard and now delivery options', async () => {
      const expectedDeliveryOptions = ['now', 'standard']
      const quote = getStandardQuote()
        .build();

      await pactum.spec()
        .get(quoteFullUrl)
        .withQueryParams(quote)
        .expectStatus(200)
        .expect(((ctx) => {
          const { res } = ctx;
          for(const deliveryOption of expectedDeliveryOptions) {
            expect(res.body.deliveryOptions).to.have.property(deliveryOption);
          }
        }));
    });

    it('should have standard and today delivery options', async () => {
        const expectedDeliveryOptions = ['today', 'standard']
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
            for(const deliveryOption of expectedDeliveryOptions) {
                expect(res.body.deliveryOptions).to.have.property(deliveryOption);
            }
        }));
    });
  });
  context('Standard delivery option', () => {
      const deliveryOption = 'standard';
      const paymentOptions = ['bank', 'card'];
      it('should have correct set of payments options available', async () => {
          const quote = getStandardQuote()
              .build();
          await pactum.spec()
              .get(quoteFullUrl)
              .withQueryParams(quote)
              .expectStatus(200)
              .expect(((ctx) => {
                  const { res } = ctx;
                  shouldHaveSetOfPaymentsOptions(res.body, paymentOptions);
              }));
      });
      it('should have correctly calculated receiving amount', async () => {
          const quote = getStandardQuote()
              .build();

          await pactum.spec()
              .get(quoteFullUrl)
              .withQueryParams(quote)
              .expectStatus(200)
              .expect(((ctx) => {
                  const { res } = ctx;
                  for (const paymentOption of paymentOptions) {
                      assertReceivingAmount(res.body, deliveryOption, paymentOption)
                  }
              }));
      });
  })
  context('Now delivery option', () => {
      const deliveryOption = 'now';
      const paymentOptions = ['bank', 'card'];

      it('should have correct set of payments options available', async () => {
          const quote = getStandardQuote()
              .build();

          await pactum.spec()
              .get(quoteFullUrl)
              .withQueryParams(quote)
              .expectStatus(200)
              .expect(((ctx) => {
                  const { res } = ctx;
                  shouldHaveSetOfPaymentsOptions(res.body, paymentOptions);
              }));

      });
      it('should have correctly calculated receiving amount', async () => {
          const quote = getStandardQuote()
              .build();

          await pactum.spec()
              .get(quoteFullUrl)
              .withQueryParams(quote)
              .expectStatus(200)
              .expect(((ctx) => {
                  const { res } = ctx;
                  for (const paymentOption of paymentOptions) {
                      assertReceivingAmount(res.body, deliveryOption, paymentOption)
                  }
              }));
      });
  })
  context('Today delivery option', () => {
      const deliveryOption = 'now';
      const paymentOptions = ['bank'];
      it('should have correct set of payments options available', async () => {
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
                  shouldHaveSetOfPaymentsOptions(res.body, paymentOptions);
              }));
      });
      it('should have correctly calculated receiving amount', async () => {
          const quote = getStandardQuote()
              .build();

          await pactum.spec()
              .get(quoteFullUrl)
              .withQueryParams(quote)
              .expectStatus(200)
              .expect(((ctx) => {
                  const { res } = ctx;
                  for (const paymentOption of paymentOptions) {
                      assertReceivingAmount(res.body, deliveryOption, paymentOption)
                  }
              }));
      });
  })
});


function shouldHaveSetOfPaymentsOptions(responseBody, paymentOptions) {
    for (const paymentOption of paymentOptions) {{
        expect(responseBody.deliveryOptions.standard.paymentOptions).to.have.property(paymentOption);
    }}
}

function assertReceivingAmount(responseBody, deliveryOption, paymentOption) {
    const paymentOptionObject = responseBody.deliveryOptions[deliveryOption].paymentOptions[paymentOption]
    const quote = paymentOptionObject.quote
    const sendingAmount = quote.sendingAmount
    const finalFee = quote.fees.finalFee
    const receivingAmount = quote.receivingAmount
    const receivingAmountCalculated = sendingAmount - finalFee
    expect(receivingAmount).to.be.equal(receivingAmountCalculated)
}