export interface LoginResponse {
  token: string;
  user: User;
  error: string;
}

export interface User {
  _id: string;
  avatar: string;
  blocked: boolean;
  blurbText: string;
  cart: ShoppingCartShort;
  createdAt: string;
  displayName: string;
  email: string;
  emailVerified: string;
  experiencePreferences: string;
  favoriteBrands: string[];
  favorites: string[];
  firstName: string;
  followers: string[];
  following: string[];
  lastName: string;
  memberSince: string;
  notifications: string[];
  profileBg: string;
  rating: number;
  reviews: UserReview[];
  role: string;
  salesSchedule: string[];
  sellCloset: number;
  shippingAddress: Address[];
  tradeCloset: number;
  unfinishedOnboardActivity: string;
  updatedAt: string;
}

export interface UserReview {
  _id: string;
  product: Product;
  buyer: User;
  createdAt: string;
  ratingNum: number;
  reviewText: string;
  reviewType: string;
  seller: string;
  updatedat: string;
}

export interface Address {
  address1: string;
  address2: string;
  city: string;
  country: string;
  default: boolean;
  ep_deliverable: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  state: string;
  _id: string;
}

export interface AddressRequest {
  address1: string;
  address2: string;
  city: string;
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  state: string;
  notes: string;
}

export interface CreateShippingAddressResponse {
  currentUser: User;
}

export interface ShoppingCartShort {
  _id: string;
  products: string[];
}

export interface ShoppingCart {
  _id: string;
  products: Product[];
}

export interface SuccessResponse {
  success: boolean;
}

export interface ProductResponse {
  product: Product;
  tags: any;
}

export interface ProductsResponse {
  docs: Product[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: string;
  nextPage: string;
}

export interface Product {
  tradeOffers: {
    incoming: any[];
    outgoing: any[];
  };
  attributes: {
    id: string;
    value: string | string[];
  }[];
  images: {
    url: string;
    originalName: string;
  }[];
  tags: any[];
  sold: boolean;
  active: boolean;
  rejected: boolean;
  receivedByNobo: boolean;
  returnRequested: boolean;
  returnBy: any;
  giveaway: {
    active: boolean;
    ticket_allocation_limit: number;
    distributed: string[];
    concluded: boolean;
    _id: string;
    name: string;
    product: string;
    entry_steps: {
      _id: string;
      text: string;
      id: number;
    }[];
    event: string;
    __v: number;
  };
  _id: string;
  group: string;
  vendor: {
    profileBg: string;
    emailVerified: boolean;
    blocked: boolean;
    blurbText: string;
    reviews: any[];
    _id: string;
    cache: {
      sellCloset: number;
      tradeCloset: number;
    };
    wpId: string;
    firstName: string;
    lastName: string;
    memberSince: string;
    displayName: string;
    avatar: string;
    __v: number;
    experiencePreferences: string;
    orders: number;
    rating: number;
  };
  action: string;
  name: string;
  brand: string;
  description: string;
  receipt: string;
  price: number;
  retailPrice: number;
  category: ProductCategory;
  parentCategory: ProductCategory;
  potentialTradeItems: any[];
  createdAt: string;
  updatedAt: string;
  image: string;
  link: string;
  shop: {
    new: { [key: string]: any };
    used: { [key: string]: any };
  };
  trade: { [key: string]: string[] };
}

//export interface Product {
//  _id: string;
//  action: string;
//  active: boolean;
//  attributes: ProductAttribute[];
//  brand: string;
//  category: ProductCategory;
//  createdAt: string;
//  description: string;
//  giveaway: string;
//  group: string;
//  image: string;
//  images: Image[];
//  link: string;
//  name: string;
//  onSale: boolean;
//  parentCategory: ProductCategory;
//  potentialTradeItems: string[];
//  price: number;
//  receipt: string;
//  receivedByNobo: boolean;
//  rejected: boolean;
//  retailPrice: number;
//  returnBy: string;
//  returnRequested: boolean;
//  sold: boolean;
//  tags: string[];
//  tradeOffers: ProductTradeOffers;
//  updatedAt: string;
//  vendor: ProductVendor;
//  shop?: ProductShop;
//  trade?: ProductTrade;
//}
//export interface ProductShop {
//  new: { [key: string]: any };
//  used: { [key: string]: any };
//}
//
//export interface ProductTrade {
//  [key: string]: string[];
//}
//
//export interface ProductTradeOffers {
//  incoming: string[];
//  outgoing: string[];
//}
//
//export interface ProductAttribute {
//  id: string;
//  value: string | string[];
//}
//
//export interface Image {
//  url: string;
//  originalName: string;
//}
//
//export interface ProductVendor {
//  _id: string;
//  rating: number;
//  profileBg: string;
//  emailVerified: string;
//  blocked: boolean;
//  blurbText: string;
//  reviews: string[];
//  cache: ProductVendorCache;
//  firstName: string;
//  lastName: string;
//  avatar: string;
//  memberSince: string;
//  displayName: string;
//  experiencePreferences: string;
//  orders: number;
//}
//
//export interface ProductVendorCache {
//  sellCloset: number;
//  tradeCloset: number;
//}

export interface ProductCategory {
  parent: string;
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingCartResponse {
  coupon: boolean;
  products: Product[];
}

export interface TaxShippingResponse {
  salesTax: number;
  shipping: number;
}

export interface PaymentMethodsResponse {
  customer: any; // not used; placeholder
  cards: PaymentMethod[];
}

export interface PaymentCustomer {
  default_source: string;
  id: string;
  name: string;
  object: string;
  // other unused properties
}

export interface PaymentMethod {
  id: string;
  address_line1: string;
  address_line2: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  last4: string;
  name: string;

  // these are unused
  object: string;
  address_line1_check: string;
  address_zip_check: string;
  country: string;
  cvc_check: string;
  dynamic_last4: string;
  funding: string;
  tokenization_method: string;
}

export interface Order {
  products: string[];
  fromVendors: User[];
  _id: string;
  shippingAddress: Address;
  customer: string;
  status: string;
  taxes: any;
  shippingFees: any;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  uniqueNumber: string;
  salesTax: number;
  shipping: number;
  total: number;
  charge: any;
}

export interface FullOrder {
  products: Product[];
  fromVendors: User[];
  _id: string;
  shippingAddress: Address;
  customer: string;
  status: string;
  taxes: any;
  shippingFees: any;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  uniqueNumber: string;
  salesTax: number;
  shipping: number;
  total: number;
  charge: any;
}

export interface OrdersResponse {
  docs: FullOrder[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: string;
  nextPage: string;
}

export interface OrderResponse {
  order: FullOrder;
}
