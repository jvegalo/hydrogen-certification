// tests/favorite-button.test.jsx
import React from 'react';
import {render, waitFor, screen, fireEvent} from '@testing-library/react';
import {createRemixStub} from '@remix-run/testing';
import AddToFavoritesButton from '../app/components/AddToFavoritesButton';
import {describe, expect, it, beforeEach, vi} from 'vitest';
import {useLoaderData, Outlet} from '@remix-run/react';

// Mocking useFetcher from @remix-run/react
vi.mock('@remix-run/react', () => {
  return {
    useFetcher: () => ({
      submit: vi.fn(),
      state: 'idle',
    }),
    useLoaderData: () => fakeProduct, // Mock useLoaderData to return the fakeProduct
  };
});

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
        id: 'root',
        path: '/',
        element: <Layout />,
        children: [
          {
            path: 'favorites',
            element: <AddToFavoritesButtonTest />,
            loader: () => fakeProduct,
            action: async ({request}) => {
              const formData = await request.formData();
              const intent = formData.get('intent');
              if (intent === 'add-to-favorites') {
                fakeProduct.isFavoriteProduct = true;
              } else if (intent === 'remove-from-favorites') {
                fakeProduct.isFavoriteProduct = false;
              }
              return null;
            },
          },
        ],
      },
    ]);
  });

  function Layout() {
    return (
      <div>
        <Outlet />
      </div>
    );
  }

  function AddToFavoritesButtonTest() {
    const data = useLoaderData();
    return (
      <AddToFavoritesButton
        isFavoriteProduct={data.isFavoriteProduct}
        product_id={data.product_id}
        customer_id={data.customer_id}
      />
    );
  }

  afterEach(() => {
    vi.clearAllMocks();
    fakeProduct.isFavoriteProduct = false;
  });

  it('should add to favorites', async () => {
    render(<RemixStub initialEntries={['/favorites']} />);

    await waitFor(() => screen.getByText('Add to favorites'));

    fireEvent.click(screen.getByText('Add to favorites'));

    await waitFor(() =>
      expect(screen.getByText('Remove from favorites')).toBeInTheDocument(),
    );
    expect(fakeProduct.isFavoriteProduct).toBe(true);
  });

  it('should remove from favorites', async () => {
    fakeProduct.isFavoriteProduct = true;

    render(<RemixStub initialEntries={['/favorites']} />);

    await waitFor(() => screen.getByText('Remove from favorites'));

    fireEvent.click(screen.getByText('Remove from favorites'));

    await waitFor(() =>
      expect(screen.getByText('Add to favorites')).toBeInTheDocument(),
    );
    expect(fakeProduct.isFavoriteProduct).toBe(false);
  });
});
