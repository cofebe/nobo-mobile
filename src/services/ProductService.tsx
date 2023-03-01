import { BaseService } from './BaseService';

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
}

export interface SuccessResponse {
  success: boolean;
}

export interface ProductResponse {
  product: Product;
  tags: any;
}

export interface Product {
  _id: string;
  action: string;
  active: boolean;
  attributes: ProductAttribute[];
  brand: string;
  category: ProductCategory;
  createdAt: string;
  description: string;
  giveaway: string;
  group: string;
  image: string;
  images: Image[];
  link: string;
  name: string;
  onSale: boolean;
  parentCategory: ProductCategory;
  postentialTradeItems: string[];
  price: number;
  receipt: string;
  receivedByNobo: boolean;
  rejected: boolean;
  retailPrice: number;
  returnBy: string;
  returnRequested: boolean;
  sold: boolean;
  tags: string[];
  tradeOffers: ProductTradeOffers;
  updatedAt: string;
  vendor: ProductVendor;
}

export interface ProductTradeOffers {
  incoming: string[];
  outgoing: string[];
}

export interface ProductAttribute {
  id: string;
  value: string|string[];
}

export interface Image {
  url: string;
  originalName: string;
}

export interface ProductVendor {
  _id: string;
  rating: number;
  profileBg: string;
  emailVerified: string;
  blocked: boolean;
  blurbText: string;
  reviews: string[];
  cache: ProductVendorCache;
  firstName: string;
  lastName: string;
  avatar: string;
  memberSince: string;
  displayName: string;
  experiencePreferences: string;
  orders: number;
}

export interface ProductVendorCache {
  sellCloset: number;
  tradeCloset: number;
}

export interface ProductCategory {
  parent: string;
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
