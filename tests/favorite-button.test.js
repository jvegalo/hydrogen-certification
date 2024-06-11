import React from 'react';
import {render, waitFor, screen, fireEvent} from '@testing-library/react';
import {createRemixStub} from '@remix-run/testing';
import AddToFavoritesButton from '../app/components/AddToFavoritesButton';
import {describe, expect, it, beforeEach, afterEach, vi} from 'vitest';

// Mocking useFetcher from @remix-run/react
vi.mock('@remix-run/react', () => {
  return {
    useFetcher: vi.fn().mockReturnValue({state: 'idle'}),
  };
});

// Simulate the FavoriteProduct module's methods
const FavoriteProduct = {
  saveFavorite: vi.fn().mockResolvedValue({success: true}),
  deleteFavorite: vi.fn().mockResolvedValue({success: true}),
};

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
        element: <FavoriteProductTest />,
        loader: () => fakeProduct,
      },
      {
        path: '/favorites',
        action: async ({request}) => {
          const formData = await request.formData();
          const intent = formData.get('intent');
          if (intent === 'add-to-favorites') {
            fakeProduct.isFavoriteProduct = true;
            await FavoriteProduct.saveFavorite(
              formData.get('product_id'),
              formData.get('customer_id'),
            );
          } else if (intent === 'remove-from-favorites') {
            fakeProduct.isFavoriteProduct = false;
            await FavoriteProduct.deleteFavorite(
              formData.get('product_id'),
              formData.get('customer_id'),
            );
          }
          return null;
        },
      },
    ]);
  });

  function FavoriteProductTest() {
    const {product_id, customer_id, isFavoriteProduct} = fakeProduct;
    return (
      <AddToFavoritesButton
        product_id={product_id}
        customer_id={customer_id}
        isFavoriteProduct={isFavoriteProduct}
      />
    );
  }

  afterEach(() => {
    vi.clearAllMocks();
    fakeProduct.isFavoriteProduct = false;
  });

  it('should add to favorites', async () => {
    render(<RemixStub initialEntries={['/']} />);

    fireEvent.click(screen.getByText('Add to favorites'));

    expect(FavoriteProduct.saveFavorite).toHaveBeenCalledWith(
      fakeProduct.product_id,
      fakeProduct.customer_id,
    );
    await waitFor(() =>
      expect(screen.getByText('Remove from favorites')).toBeInTheDocument(),
    );
    expect(fakeProduct.isFavoriteProduct).toBe(true);
  });

  it('should remove from favorites', async () => {
    fakeProduct.isFavoriteProduct = true;

    render(<RemixStub initialEntries={['/']} />);

    fireEvent.click(screen.getByText('Remove from favorites'));

    expect(FavoriteProduct.deleteFavorite).toHaveBeenCalledWith(
      fakeProduct.product_id,
      fakeProduct.customer_id,
    );
    await waitFor(() =>
      expect(screen.getByText('Add to favorites')).toBeInTheDocument(),
    );
    expect(fakeProduct.isFavoriteProduct).toBe(false);
  });
});
