const {getStandardQuote} = require("../testData/quoteData");
const pactum = require("pactum");
const {quoteFullUrl} = require("../utils/urls");
const {expect} = require("chai");

describe('Delivery options', () => {
    it('should have standard and now delivery options', async () => {
        const quote = getStandardQuote()
            .build()

        await pactum.spec()
            .get(quoteFullUrl)
            .withQueryParams(quote)
            .expectStatus(200)
            .expect((ctx => {
                const res = ctx.res;
                expect(res.body.deliveryOptions).to.have.property('now')
                expect(res.body.deliveryOptions).to.have.property('standard')
            }))
    });

    it('should have standard and today delivery options', async () => {
        const quote = getStandardQuote()
            .setFromCountryCode('TR')
            .setFromCurrencyCode('TRY')
            .build()

        await pactum.spec()
            .get(quoteFullUrl)
            .withQueryParams(quote)
            .expectStatus(200)
            .expect((ctx => {
                const res = ctx.res;
                expect(res.body.deliveryOptions).to.have.property('today')
                expect(res.body.deliveryOptions).to.have.property('standard')
            }))
    });
});