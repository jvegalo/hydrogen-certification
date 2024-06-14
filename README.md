# Good American - Hydrogen Storefront

This storefront is built with Hydrogen and uses a [third party API](https://github.com/jvegalo/good-american-backend) to handle customer's favorite products. Also storefront uses Shopify's Customer API to handle user authentication and identify users whenever they add a product to their favorites.


## Storefront URL

https://gnat-happy-barely.ngrok-free.app


## Local development

**Requirements:**

- Node.js version 18.0.0 or higher

- Create a .env file with the following variables:

```bash
PUBLIC_STOREFRONT_ID=1000019330
PUBLIC_STOREFRONT_API_TOKEN=ba6da11bea4dd7df455cdbee5481a12c
PUBLIC_STORE_DOMAIN=0d6c73-d5.myshopify.com
PRIVATE_STOREFRONT_API_TOKEN=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
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=shp_69223d80-e46b-4a3a-918f-70ee6d04eaa2
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://shopify.com/69014651139
SESSION_SECRET=580fa5d615732210a75085361cd0ec85044a9a18
```

**Commands for running the project:**

```bash
npm install
npm run dev
```
> [!NOTE]
> Take into account that when running the project locally, you will not be able to use Shopify's Customer API unless you generate a static domain using ngrok which is a Shopify requirement to use the API locally. With that being said, please use the addToFavorites feature using the Storefront URL: https://gnat-happy-barely.ngrok-free.app


Learn more about the Customer API: <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>

## Unit Testing

Tests are located in "tests/favorite-button.test.js"

- Run the backend locally, here the [instructions](https://github.com/jvegalo/good-american-backend)

- Run the following commands while being in the root of the project:
```bash
npm install
npx vitest
```
> [!NOTE]
> For unit testing purposes, we are mocking the customer_id so you can run the test locally without using ngrok and Customer API
