# transfers-api-tests
E2E tests for TransferGo Transfers API

## Tools/libraries used 
  * [node - javascript runtime](https://nodejs.org/en/)
  * [pactumJS - REST API Testing Tool](https://pactumjs.github.io/)
  * [mocha - test framework](https://mochajs.org/)
  * [mochawesome - custome reporter for mocha](https://www.npmjs.com/package/mochawesome)
  * [chai - BDD/TDD assertions library](https://www.chaijs.com/)
  * [http-status-codes - constants enumerating the HTTP status codes](https://www.npmjs.com/package/http-status-codes)

## Prerequisites 
  * Node.js v14.17.3
  * npm
  * Installed npm packages `npm install`

## Project structer
  * **domain** contains Quote and QuoteBuilder classes. Use QuoteBuilder to prepare data for query to transfers api
  * **specs** contains test specs divided by tests context
  * **testData** contains standard QuoteBuilder object, which is most commonly used. As per needs can be transferred to Factory to provide more types of objects
  * **utils** contains reusable utils

## Test execution
To execute tests use `npm test` command

## Reporting
As a test reporter mochawesome is used.\
Test report is available in `./mochawesome-report` directory.\
Open `mochawesome.html` to display nicely formatted report in html format.