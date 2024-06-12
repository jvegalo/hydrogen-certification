import {Link, useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import FavoriteProduct from '~/models/favorite-product';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Favorite Products'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  let customer_id = '';

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );
  customer_id = data.customer.id.split('/').pop();

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  let favoriteProducts = [];

  try {
    const response = await FavoriteProduct.getFavorites(customer_id);

    for (const favoriteProduct of response.data) {
      const {product} = await storefront.query(PRODUCT_QUERY, {
        variables: {id: favoriteProduct.product_id},
      });
      favoriteProducts.push(product);
    }
  } catch (error) {
    console.log(JSON.stringify(error));
    throw new Error(error);
  }
  return json(
    {favoriteProducts},
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export default function FavoriteProducts() {
  /** @type {LoaderReturnData} */
  const {favoriteProducts} = useLoaderData();
  return (
    <div className="account-favorites">
      {favoriteProducts.length ? (
        <FavoriteProductsTable favoriteProducts={favoriteProducts} />
      ) : (
        <EmptyFavoriteProducts />
      )}
    </div>
  );
}

function FavoriteProductsTable({favoriteProducts}) {
  return (
    <div className="account-favorites">
      {favoriteProducts.length > 0 ? (
        favoriteProducts.map((favoriteProduct) => (
          <FavoriteProductItem
            key={favoriteProduct.id}
            favoriteProduct={favoriteProduct}
          />
        ))
      ) : (
        <EmptyFavoriteProducts />
      )}
    </div>
  );
}

/**
 * @param {{product: ProductFragment}}
 */
function FavoriteProductItem({favoriteProduct}) {
  return (
    <>
      <fieldset>
        <p>{favoriteProduct.title}</p>
      </fieldset>
      <br />
    </>
  );
}

function EmptyFavoriteProducts() {
  return (
    <div>
      <p>You haven&apos;t added any product to favorites yet.</p>
      <br />
      <p>
        <Link to="/collections">Start Shopping →</Link>
      </p>
    </div>
  );
}

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    handle
    description
    featuredImage{
      url
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $id: ID!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(id: $id) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
