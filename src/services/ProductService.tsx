import { BaseService } from './BaseService';
import { environment } from '../environments/environment';

const API_URL = environment.serverUrl + '/api/products';

export class ProductService extends BaseService {

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

  async getProduct(productId: string): Promise<ProductResponse> {
    return await super.fetch('GET', `/api/products/${productId}`)
    .then(res => res.json());
  }
}

export interface ProductResponse {
  product: Product;
  tags: any;
}

export interface Product {
  tradeOffers: ProductTradeOffers;
  attributes: ProductAttribute[];
  images: Image[];
  tags: string[];
  sold: boolean;
  active: boolean;
  rejected: boolean;
  receivedByNobo: boolean;
  returnRequested: boolean;
  returnBy: string;
  giveaway: string;
  _id: string;
  group: string;
  vendor: ProductVendor;
  action: string;
  name: string;
  brand: string;
  description: string;
  receipt: string;
  price: number;
  retailPrice: number;
  category: ProductCategory;
  parentCategory: ProductCategory;
  postentialTradeItems: string[];
  createdAt: string;
  updatedAt: string;
  image: string;
  link: string;
}

export interface ProductTradeOffers {
  incoming: string[];
  outgoing: string[];
}

export interface ProductAttribute {
  id: string;
  value: string;
}

export interface Image {
  url: string;
  originalName: string;
}

export interface ProductVendor {
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
