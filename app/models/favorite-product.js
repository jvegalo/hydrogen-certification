import {GoodAmericanApiClient} from '../api/apiClient';

export default class FavoriteProduct {
  static async getFavorites(customer_id) {
    try {
      const favorites = await GoodAmericanApiClient.get(
        '/favorites/' + customer_id,
      );

      return {
        success: true,
        data: [...favorites.data],
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error to get favorite products',
        message: error.response?.statusText || 'Unknown error',
      };
    }
  }

  static async saveFavorite(product_id, customer_id) {
    customer_id = customer_id.split('/').pop();
    try {
      await GoodAmericanApiClient.post('/favorites', {
        product_id,
        customer_id,
      });

      return {
        success: true,
        message: 'Favorite product saved successfully',
        product: product_id,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error to save favorite product',
        message: error.response?.statusText || 'Unknown error',
      };
    }
  }

  static async deleteFavorite(product_id, customer_id) {
    customer_id = customer_id.split('/').pop();
    try {
      await GoodAmericanApiClient.delete('/favorites', {
        product_id,
        customer_id,
      });

      return {
        success: true,
        message: 'Favorite product deleted successfully',
        product: product_id,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error to save delete product',
        message: error.response?.statusText || 'Unknown error',
      };
    }
  }
}
