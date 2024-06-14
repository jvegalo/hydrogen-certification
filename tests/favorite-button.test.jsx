// tests/favorite-button.test.jsx
import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { createRemixStub } from '@remix-run/testing';
import AddToFavoritesButton from '../app/components/AddToFavoritesButton';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';
import FavoriteProduct from '../app/models/favorite-product';

const fakeProduct = {
  product_id: '123',
  customer_id: 'abc',
  isFavoriteProduct: false,
};

describe('AddToFavoritesButton', () => {
  let RemixStub;

  beforeEach(() => {
    RemixStub = createRemixStub([
      {
        path: '/',
        Component() {
          const data = useLoaderData();
          return (
            <AddToFavoritesButton
              isFavoriteProduct={data.isFavoriteProduct}
              product_id={data.product_id}
              customer_id={data.customer_id}
            />
          );
        },
        loader() {
          return json(fakeProduct);
        },
        action: async ({ request }) => {
          const formData = await request.formData();
          const intent = formData.get('intent');
          const product_id = formData.get('product_id');
          const customer_id = formData.get('customer_id');
          if (intent === 'add-to-favorites') {
            fakeProduct.isFavoriteProduct = true;
            const result = await FavoriteProduct.saveFavorite(product_id, customer_id);
            return { success: true };
          } else if (intent === 'remove-from-favorites') {
            fakeProduct.isFavoriteProduct = false;
            const result = await FavoriteProduct.deleteFavorite(product_id, customer_id);
            return { success: true };
          }
          return { success: false };
        },
      },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
    fakeProduct.isFavoriteProduct = false;
  });

  it('should add to favorites', async () => {
    render(<RemixStub initialEntries={['/']} />);

    await waitFor(() => screen.getByText('Add to favorites'));

    fireEvent.click(screen.getByText('Add to favorites'));

    await waitFor(() =>
      expect(screen.getByText('Remove from favorites')).toBeInTheDocument()
    );
    expect(fakeProduct.isFavoriteProduct).toBe(true);
  });

  it('should remove from favorites', async () => {
    fakeProduct.isFavoriteProduct = true;

    render(<RemixStub initialEntries={['/']} />);

    await waitFor(() => screen.getByText('Remove from favorites'));

    fireEvent.click(screen.getByText('Remove from favorites'));

    await waitFor(() =>
      expect(screen.getByText('Add to favorites')).toBeInTheDocument()
    );
    expect(fakeProduct.isFavoriteProduct).toBe(false);
  });
});
