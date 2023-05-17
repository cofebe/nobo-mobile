export interface LoginResponse {
  token: string;
  user: User;
  error: string;
}
export interface SignUpResponse {
  success: boolean;
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
  reviews: UserReview[];
  role: string;
  salesSchedule: string[];
  sellCloset: number;
  shippingAddress: Address[];
  tradeCloset: number;
  unfinishedOnboardActivity: string;
  updatedAt: string;
}
export interface SignUpUser {
  exist: number;
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
  notes: string;
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
    experiencePreferences: string;
    orders: number;
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

export interface ProductCategory {
  parent: string;
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileUploadResponse {
  originalName: string;
  url: string;
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

export interface Trade {
  salesTax: {
    initiator: {
      order_total_amount: number;
      shipping: number;
      taxable_amount: number;
      amount_to_collect: number;
      rate: number;
      has_nexus: boolean;
      freight_taxable: boolean;
      tax_source: string;
      jurisdictions: {
        country: string;
        state: string;
        county: string;
      };
    };
    recipient: {
      order_total_amount: number;
      shipping: number;
      taxable_amount: number;
      amount_to_collect: number;
      rate: number;
      has_nexus: boolean;
      freight_taxable: boolean;
      tax_source: string;
      jurisdictions: {
        country: string;
        state: string;
        county: string;
      };
    };
  };
  shippingAddress: {
    initiator: Address;
  };
  paymentMethod: {
    initiator: string;
  };
  status: string;
  _id: string;
  recipient: string;
  products: {
    offered: string | Product;
    requested: string | Product;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TradesResponse {
  sent: Trade[];
  received: Trade[];
}

export interface CategoriesResponse {
  docs: Category[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: string;
  page: number;
  pagingCounter: number;
  prevPage: string;
  totalDocs: number;
  totalPages: number;
}

export interface Category {
  createdAt: string;
  description: string;
  name: string;
  parent: CategoryParent | null;
  updatedAt: string;
  _id: string;
}

export interface CategoryParent {
  createdAt: string;
  description: string;
  name: string;
  parent: string | null;
  updatedAt: string;
  _id: string;
}

export interface BrandsResponse {
  brands: Brand[];
}

export interface Brand {
  _id: string;
  name: string;
  url: string;
}

export interface Notification {
  createdAt: string;
  image: string;
  message: string;
  nid: number;
  readStatus: boolean;
  updatedAt: string;
  user: string;
  other: {
    userId: string;
  };
  _id: string;
}

export interface ItemAttributes {
  id: string;
  type: string;
  name: string;
  hint?: string;
  options?: (string | number)[];
  required?: boolean;
  visible: string[] | string;
  hideIf?: ItemHideIf;
  showIf?: ItemShowIf;
}

export interface ItemHideIf {
  category: string[];
}

export interface ItemShowIf {
  key: string;
  value: string;
}

export interface MessageUser {
  avatar: string;
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  sellCloset: number;
  tradeCloset: number;
  _id: string;
}

export interface Message {
  createdAt: string;
  from: MessageUser;
  message: string;
  receiverDidRead: boolean;
  updatedAt: string;
  _id: string;

  // these are extra for the code
  previousUserId: string | undefined;
  previousCreatedAt: Date | undefined;
  newSection: boolean;
  date: Date;
}

export interface Conversation {
  createdAt: string;
  inReferenceTo: string;
  initiator: MessageUser;
  messages: Message[];
  order: any;
  product: Product;
  recipient: MessageUser;
  updatedAt: string;
  _id: string;
}

export interface SignUpType {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  comfirmPassword: string;
}
