import { BaseService } from './BaseService';
import { Product, ProductResponse, SuccessResponse, ShoppingCartResponse } from '../models';

export class ProductService extends BaseService {

  async getProducts(group: string, action: string, onSale: boolean) {
    let params: URLSearchParams;
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

    const response = await super.fetch('GET', `/api/products/all?${params}`);
    //console.log('getProducts res: ', response);
    const json = await response.json();
    return json;
  }

  async getProduct(productId: string): Promise<ProductResponse> {
    const res = await super.fetch('GET', `/api/products/${productId}`)
    const json: ProductResponse = await res.json();
    return json;
  }

  async addToCart(productId: string): Promise<boolean> {
    const res = await super.fetch('POST', '/api/orders/cart', { id: productId });
    const json: SuccessResponse = await res.json();
    return json.success;
  }

  async getCart(): Promise<Product[]> {
    const res = await super.fetch('GET', '/api/products/cart');
    const json: ShoppingCartResponse = await res.json();
    return json.products;
  }
}
