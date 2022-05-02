const pactum = require('pactum');
const {expect} = require('chai');
const {getStandardQuote} = require('../testData/quoteData');
const {quoteFullUrl} = require('../utils/urls');
const {OK, UNPROCESSABLE_ENTITY} = require('http-status-codes');

let defaultResponseBody;
let turkishResponseBody;

describe('Delivery options', () => {
    context('General tests of delivery options', () => {
        before(async () => {
            const quote = getStandardQuote()
                .build();

            const defaultResponse = await pactum.spec()
                .get(quoteFullUrl)
                .withQueryParams(quote)
                .expectStatus(OK);

            defaultResponseBody = defaultResponse.json

            const quoteTurkish = getStandardQuote()
                .setFromCountryCode('TR')
                .setFromCurrencyCode('TRY')
                .build();

            const turkishResponse = await pactum.spec()
                .get(quoteFullUrl)
                .withQueryParams(quoteTurkish)
                .expectStatus(OK);

            turkishResponseBody = turkishResponse.json
        })
        it('should have standard and now delivery options', async () => {
            const expectedDeliveryOptions = ['now', 'standard']
            for (const deliveryOption of expectedDeliveryOptions) {
                expect(defaultResponseBody.deliveryOptions).to.have.property(deliveryOption);
            }
        });

        it('should have standard and today delivery options', async () => {
            const expectedDeliveryOptions = ['today', 'standard']
            for (const deliveryOption of expectedDeliveryOptions) {
                expect(turkishResponseBody.deliveryOptions).to.have.property(deliveryOption);
            }
        });
    });
    context('Standard delivery option', () => {
        const deliveryOption = 'standard';
        const paymentOptions = ['bank', 'card'];
        for (const paymentOption of paymentOptions) {
            it(`should have ${paymentOption} payment option available for ${deliveryOption} delivery option`,
                async () => {
                expect(defaultResponseBody.deliveryOptions.standard.paymentOptions).to.have.property(paymentOption);
            });
        }
        it(`should have correctly calculated receiving amount for ${deliveryOption} delivery option`,
            async () => {
            for (const paymentOption of paymentOptions) {
                const {receivingAmount, receivingAmountCalculated} =
                    getReceivingAmountAndReceivingAmountCalculated(defaultResponseBody, deliveryOption, paymentOption)
                expect(receivingAmount).to.be.equal(receivingAmountCalculated)
            }
        });
        it(`should ${deliveryOption} deliveryOption be unavailable if exceeding deliveryOption maxAmount`,
            async () => {
            let maxAmount = defaultResponseBody.deliveryOptions[deliveryOption].configuration.maxAmount

            const quoteWithTooHighAmount = getStandardQuote()
                .setAmount(maxAmount + 0.01)
                .build();

            await pactum.spec()
                .get(quoteFullUrl)
                .withQueryParams(quoteWithTooHighAmount)
                .expectStatus(UNPROCESSABLE_ENTITY)
                .expectJson({
                    error: 'AMOUNT_IS_TOO_LARGE',
                    message: 'invalidAmount',
                });
        });
    })
    context('Now delivery option', () => {
        const deliveryOption = 'now';
        const paymentOptions = ['bank', 'card'];

        for (const paymentOption of paymentOptions) {
            it(`should have ${paymentOption} payment option available for ${deliveryOption} delivery option`,
                async () => {
                expect(defaultResponseBody.deliveryOptions.standard.paymentOptions).to.have.property(paymentOption);
            });
        }
        it(`should have correctly calculated receiving amount for ${deliveryOption} delivery option`,
            async () => {
            for (const paymentOption of paymentOptions) {
                const {receivingAmount, receivingAmountCalculated} =
                    getReceivingAmountAndReceivingAmountCalculated(defaultResponseBody, deliveryOption, paymentOption)
                expect(receivingAmount).to.be.equal(receivingAmountCalculated)
            }
        });
        it(`should ${deliveryOption} deliveryOption be unavailable if exceeding deliveryOption maxAmount`,
            async () => {
            let maxAmount = defaultResponseBody.deliveryOptions[deliveryOption].configuration.maxAmount

            const quoteWithTooHighAmount = getStandardQuote()
                .setAmount(maxAmount + 0.01)
                .build();

            const {json: responseBody} = await pactum.spec()
                .get(quoteFullUrl)
                .withQueryParams(quoteWithTooHighAmount)
                .expectStatus(OK);

            expect(responseBody.deliveryOptions[deliveryOption].availability.isAvailable).to.be.eq(false);
            expect(responseBody.deliveryOptions[deliveryOption].availability.reason)
                .to.be.eq('AMOUNT_LIMIT_EXCEEDED')

        });
    })
    context('Today delivery option', () => {
        const deliveryOption = 'today';
        const paymentOptions = ['bank'];
        for (const paymentOption of paymentOptions) {
            it(`should have ${paymentOption} payment option available for ${deliveryOption} delivery option`,
                async () => {
                    expect(turkishResponseBody.deliveryOptions.standard.paymentOptions).to.have.property(paymentOption);
            });
        }
        it(`should have correctly calculated receiving amount for ${deliveryOption} delivery option`,
            async () => {
            for (const paymentOption of paymentOptions) {
                const {receivingAmount, receivingAmountCalculated} =
                    getReceivingAmountAndReceivingAmountCalculated(turkishResponseBody, deliveryOption, paymentOption)
                expect(receivingAmount).to.be.equal(receivingAmountCalculated)
            }
        });
        it(`should ${deliveryOption} deliveryOption be unavailable if exceeding deliveryOption maxAmount`,
            async () => {
            let maxAmount = turkishResponseBody.deliveryOptions[deliveryOption].configuration.maxAmount

            const quoteWithTooHighAmount = getStandardQuote()
                .setAmount(maxAmount + 0.01)
                .build();

            await pactum.spec()
                .get(quoteFullUrl)
                .withQueryParams(quoteWithTooHighAmount)
                .expectStatus(UNPROCESSABLE_ENTITY)
                .expectJson({
                    error: 'AMOUNT_IS_TOO_LARGE',
                    message: 'invalidAmount',
                });
        });
    })
});


function getReceivingAmountAndReceivingAmountCalculated(responseBody, deliveryOption, paymentOption) {
    const paymentOptionObject = responseBody.deliveryOptions[deliveryOption].paymentOptions[paymentOption]
    const quote = paymentOptionObject.quote
    const sendingAmount = quote.sendingAmount
    const finalFee = quote.fees.finalFee
    const receivingAmount = quote.receivingAmount
    const rate = quote.rate
    const receivingAmountCalculated = Math.round((sendingAmount - finalFee) * rate * 100) / 100

    return {receivingAmount, receivingAmountCalculated}
}
