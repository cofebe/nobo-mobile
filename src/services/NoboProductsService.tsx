import { environment } from '../environments/environment';

const API_URL = environment.serverUrl + '/api/products';

export class NoboProductsService {
  async getProducts(group: string, action: string, onSale: boolean) {
    let params;
    if (action === 'explore') {
      params = new URLSearchParams({
        filter: JSON.stringify({
          active: true,
          sold: false,
          retailPrice: { $gt: 0 },
          group: group,
          onSale: onSale,
        }),
        sort: JSON.stringify({ createdAt: -1 }),
      });
    } else {
      params = new URLSearchParams({
        filter: JSON.stringify({
          active: true,
          sold: false,
          retailPrice: { $gt: 0 },
          group: group,
          action: action,
          onSale: onSale,
        }),
        sort: JSON.stringify({ createdAt: -1 }),
      });
    }

    const response = await fetch(API_URL + '/all?' + params, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('getProducts res: ', response);
    return response.json();
  }
}
