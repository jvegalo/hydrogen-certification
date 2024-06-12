# Good American - Hydrogen Storefront

This storefront is built with Hydrogen and uses a [third party API](https://github.com/jvegalo/good-american-backend) to handle customer's favorite products. Also storefront uses Shopify's Customer API to handle user authentication and identify users whenever they add a product to their favorites.


## Storefront URL

https://gnat-happy-barely.ngrok-free.app


## Local development

**Requirements:**

- Node.js version 18.0.0 or higher

**Commands for running the project:**

```bash
npm install
npm run dev
```
Take into account that when running the project locally, you will not be able to use Shopify's Customer API unless you generate a static domain using ngrok which is a requirement to use the API correctly.

Learn more about the Customer API: <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>

## Unit Testing

Tests are located in "tests/favorite-button.test.js"
To run the tests, simply run:

```bash
npx vitest
```
