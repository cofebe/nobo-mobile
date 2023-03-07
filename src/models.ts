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
  reviews: string[];
  role: string;
  salesSchedule: string[];
  sellCloset: number;
  shippingAddress: Address[];
  tradeCloset: number;
  unfinishedOnboardActivity: string;
  updatedAt: string;
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

export interface PaymentMethodRequest {
  token: PaymentMethodRequest_Token;
}

export interface PaymentMethodRequest_Token {
  id: string;
  object: string;
  card: PaymentMethod;
  //client_id: string;
  created: string;
  livemode: boolean;
  type: string;
  used: false;
}
