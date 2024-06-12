import React, {useCallback} from 'react';
import {useFetcher} from '@remix-run/react';

export default function AddToFavoritesButton({
  product_id,
  customer_id,
  isFavoriteProduct,
}) {
  const fetcher = useFetcher();
  const addToFavorites = useCallback(() => {
    fetcher.submit(
      {intent: 'add-to-favorites', product_id, customer_id},
      {method: 'post'},
    );
  }, [fetcher, product_id, customer_id]);

  const removeFromFavorites = useCallback(() => {
    fetcher.submit(
      {intent: 'remove-from-favorites', product_id, customer_id},
      {method: 'post'},
    );
  }, [fetcher, product_id, customer_id]);

  if (!customer_id) {
    return null;
  }

  return (
    <>
      <br />
      <br />
      {isFavoriteProduct ? (
        <button onClick={removeFromFavorites}>Remove from favorites</button>
      ) : (
        <button onClick={addToFavorites}>Add to favorites</button>
      )}
    </>
  );
}
