import axios from 'axios';

class GoodAmericanApiClient {
  static client = axios.create({
    baseURL: 'http://localhost:3030/',
    //baseURL: 'https://18.118.193.60/',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  static get(path, config = {}) {
    return GoodAmericanApiClient.client.get(path, config);
  }

  static post(path, data, config = {}) {
    return GoodAmericanApiClient.client.post(path, data, config);
  }

  static patch(path, data, config = {}) {
    return GoodAmericanApiClient.client.patch(path, data, config);
  }

  static delete(path, data, config = {}) {
    return GoodAmericanApiClient.client.delete(path, {data, ...config});
  }
}

export {GoodAmericanApiClient};
