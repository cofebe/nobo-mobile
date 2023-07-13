import { BaseService } from './BaseService';
import {
  Address,
  BrandsResponse,
  CreateProductRequest,
  CreateProductResponse,
  Order,
  Product,
  ProductResponse,
  ShoppingCartResponse,
  SuccessResponse,
  TaxShippingResponse,
  Trade,
} from '../models';

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

  async getProduct(productId: string, isSneaker?: boolean): Promise<ProductResponse> {
    let res;
    if (isSneaker) {
      res = await super.fetch('GET', `/api/products/sneakers/${productId}`);
    } else {
      res = await super.fetch('GET', `/api/products/${productId}`);
    }
    const json: ProductResponse = await res.json();
    return json;
  }

  async deleteProduct(productId: string): Promise<SuccessResponse> {
    const res = await super.fetch('POST', `/api/products/${productId}/delete`, {});
    const json: SuccessResponse = await res.json();
    return json;
  }

  async createProduct(product: CreateProductRequest): Promise<CreateProductResponse> {
    const res = await super.fetch('POST', `/api/products`, product);
    const json: CreateProductResponse = await res.json();
    return json;
  }

  async getSneakerProduct(productId: string): Promise<ProductResponse> {
    const res = await super.fetch('GET', `/api/products/sneakers/${productId}`);
    const json: ProductResponse = await res.json();
    return json;
  }

  async getFilteredProducts(ids: string[]) {
    const params = new URLSearchParams({
      filter: JSON.stringify({
        _id: { $in: ids },
      }),
    });
    const res = await super.fetch('GET', `/api/products/all?${params}`);
    const json = await res.json();
    return json;
  }

  async addToCart(productId: string): Promise<boolean> {
    const res = await super.fetch('POST', '/api/orders/cart', {
      id: productId,
    });
    const json: SuccessResponse = await res.json();
    return json.success;
  }

  async getCart(): Promise<ShoppingCartResponse> {
    const res = await super.fetch('GET', '/api/products/cart');
    const json: ShoppingCartResponse = await res.json();
    return json;
  }

  async getTaxAndShipping(
    address: Address,
    productOffered?: string,
    productWanted?: string
  ): Promise<TaxShippingResponse> {
    const res = await super.fetch(
      'POST',
      `/api/${productOffered ? 'trades' : 'orders'}/calculate-taxes-shipping`,
      {
        address,
        productOffered,
        productWanted,
      }
    );
    const json: TaxShippingResponse = await res.json();
    return json;
  }

  async placeOrder(address: Address, paymentMethodId: string): Promise<Order> {
    const res = await super.fetch('POST', '/api/orders/finalize', {
      shippingAddress: address,
      source: paymentMethodId,
    });
    const json: Order = await res.json();
    return json;
  }

  async createBuyOffer(productId: string, price: number): Promise<boolean> {
    const res = await super.fetch('POST', '/api/offers/create-offer', {
      productId: productId,
      price: price,
    });
    const json = await res.json();
    return json;
  }

  async createTradeOffer(
    productWanted: Product,
    productOffered: Product,
    shippingAddress: Address,
    paymentMethodId: string
  ): Promise<Trade> {
    const res = await super.fetch('POST', '/api/trades/create-offer', {
      productWanted,
      productOffered,
      selectedShippingAddress: shippingAddress,
      selectedPaymentMethod: paymentMethodId,
    });
    const json: Trade = await res.json();
    return json;
  }
  async getBrands(): Promise<BrandsResponse> {
    const res = await super.fetch('GET', '/api/brands/all');
    const json: BrandsResponse = await res.json();
    return json;
  }

  async checkPromoCode(promoCode: string) {
    const res = await super.fetch('POST', `/api/coupons/activate/${promoCode}`);
    const json = await res.json();
    return json;
  }
}
