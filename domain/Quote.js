class Quote {
    constructor(calculationBase, amount, fromCountryCode, toCountryCode, fromCurrencyCode, toCurrencyCode) {
        this.calculationBase = calculationBase
        this.amount = amount
        this.fromCountryCode = fromCountryCode
        this.toCountryCode = toCountryCode
        this.fromCurrencyCode = fromCurrencyCode
        this.toCurrencyCode = toCurrencyCode
    }
}

module.exports = { Quote }
