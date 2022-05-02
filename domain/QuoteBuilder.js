const {Quote} = require('./Quote');

class QuoteBuilder {
    constructor() {
    }

    setCalculationBase(calculationBase) {
        this.calculationBase = calculationBase;
        return this;
    }

    withCalculationBaseSendAmount() {
        this.calculationBase = 'sendAmount';
        return this;
    }

    setAmount(amount) {
        this.amount = amount;
        return this;
    }

    setFromCountryCode(fromCountryCode) {
        this.fromCountryCode = fromCountryCode;
        return this;
    }

    setToCountryCode(toCountryCode) {
        this.toCountryCode = toCountryCode;
        return this;
    }

    setFromCurrencyCode(fromCurrencyCode) {
        this.fromCurrencyCode = fromCurrencyCode;
        return this;
    }

    setToCurrencyCode(toCurrencyCode) {
        this.toCurrencyCode = toCurrencyCode;
        return this;
    }

    build() {
        if (!('calculationBase' in this)) {
            throw new Error('CalculationBase is missing');
        }
        if (!('amount' in this)) {
            throw new Error('Amount is missing');
        }
        if (!('fromCountryCode' in this)) {
            throw new Error('FromCountryCode is missing');
        }
        if (!('toCountryCode' in this)) {
            throw new Error('ToCountryCode is missing');
        }
        if (!('fromCurrencyCode' in this)) {
            throw new Error('FromCurrencyCode is missing');
        }
        if (!('toCurrencyCode' in this)) {
            throw new Error('ToCurrencyCode is missing');
        }
        return new Quote(
            this.calculationBase,
            this.amount,
            this.fromCountryCode,
            this.toCountryCode,
            this.fromCurrencyCode,
            this.toCurrencyCode,
        );
    }
}

module.exports = {QuoteBuilder};
