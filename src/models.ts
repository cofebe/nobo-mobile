export interface LoginResponse {
  token: string;
  user: User;
  error: string;
}

export interface SignUpResponse {
  success: string;
  user: User;
  token: string;
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
  phoneNumber: string;
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

export interface CreateProductRequest {
  attributes: {
    id: string;
    value: string | string[];
  }[];
  images: {
    url: string;
    originalName: string;
  }[];
  action: 'sell' | 'trade';
  name: string;
  brand: string;
  description: string;
  receipt: string;
  price: string;
  retailPrice: string;
  category: string | null;
  group: string;
  parentCategory: string | null;
  potentialTradeItems?: {
    designer?: string;
    productName?: string;
    notes?: string;
  }[];
  openToAllLuxuryOptions?: boolean;
}

export interface CreateProductResponse {
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
  giveaway: null | {
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
  vendor: string;
  action: string;
  name: string;
  brand: string;
  description: string;
  receipt: string;
  price: number;
  retailPrice: number;
  category: string;
  parentCategory: string;
  potentialTradeItems?: {
    _id: string;
  }[];
  openToAllLuxuryOptions?: boolean;
  createdAt: string;
  updatedAt: string;
  image: string;
  link: string;
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
  category: Category;
  parentCategory: Category;
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
  shipmentInfo: {
    from_address: {
      carrier_facility: null;
      city: string;
      company: string;
      created_at: string;
      email: string;
      id: string;
      federal_tax_id: null;
      mode: string;
      name: string;
      object: string;
      phone: string;
      residential: boolean;
      state_tax_id: null;
      street1: string;
      street2: null;
      updated_at: string;
      zip: string;
    };
  };
  summary: {
    coupon: number;
    discount: number;
    earnings: number;
    theNOBOfee: number;
  };
}

export interface FileUploadResponse {
  originalName: string;
  url: string;
}

export interface ShoppingCartResponse {
  coupon:  Coupon | boolean;
  products: Product[];
}

export interface Coupon {
  active: boolean;
  code: string;
  createdAt: string;
  discount: number;
  multi: boolean;
  type: string;
  updatedAt: string;
  user: string;
  _id: string;
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
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
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
  charge: {
    amount: number;
    amount_captured: number;
    amount_refunded: number;
    application: any;
    application_fee_amount: any;
    application_fee: any;
    balance_transaction: string;
    billing_details: any;
    calculated_statement_descriptor: string;
    captured: boolean;
    created: number;
    currency: string;
    customer: string;
    description: string;
    destination: any;
    disputed: any;
    failure_balance_transaction: any;
    failure_code: any;
    failure_message: any;
    id: string;
    livemode: boolean;
    object: string;
    on_behalf_of: any;
    order: any;
    outcome: any;
    paid: boolean;
    payment_intent: any;
    payment_method: string;
    payment_method_details: {
      card: {
        brand: string;
        checks: any;
        country: string;
        exp_month: number;
        exp_year: number;
        fingerprint: string;
        funding: string;
        installments: any;
        last4: number;
        mandate: any;
        network: string;
        network_token: { used: boolean };
        three_d_secure: any;
        wallet: any;
      };
      type: string;
    };

    receipt_email: any;
    receipt_number: any;
    receipt_url: string;
    refunded: boolean;
    refunds: any;
    review: any;
    shipping: any;
    source: any;
    source_transfer: any;
    statement_descriptor_suffix: any;
    status: string;
    transfer_data: any;
    transfer_group: any;
  };
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

export interface ItemAttributesWithValues extends ItemAttributes {
  value: string;
}

export interface ItemHideIf {
  category: string[];
}

export interface TradesResponse {
  sent: Trade[];
  received: Trade[];
}
export interface RewardsResponse {
  points: number;
  coupons: {
    USD_5_OFF: {
      type: string;
      active: boolean;
      multi: boolean;
      _id: string;
      code: string;
      user: string;
      discount: string;
      createdAt: string;
      updatedAt: string;
    };
    USD_10_OFF: {
      type: string;
      active: boolean;
      multi: boolean;
      _id: string;
      code: string;
      user: string;
      discount: string;
      createdAt: string;
      updatedAt: string;
    };
    USD_15_OFF: {
      type: string;
      active: boolean;
      multi: boolean;
      _id: string;
      code: string;
      user: string;
      discount: string;
      createdAt: string;
      updatedAt: string;
    };
  };
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
  parent: Category | null;
  updatedAt: string;
  _id: string;
}

export interface BrandsResponse {
  brands: Brand[];
}

export interface CategoriesResponse {
  Categories: Category[];
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

// signup type
export interface SignUpType {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  comfirmPassword: string;
}

// response type from experiencePrefrences
export interface ExperienceResponse {
  currentUser: User;
  passwordError?: string;
}

// response type from profile pic upload
export interface ProfilPicResponse {
  url: string;
}

export interface ProfileResponse {
  user: User;
}

export interface PostResponse {
  success: boolean;
}

export interface UserAccData {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  saleSchedule: [];
  experiencePreferences: string;
  currentPassword: string;
  newPassword: string;
  profileBg?: string;
  avatar?: string;
  blurbText?: string;
}

export interface OfferedStatus {
  buyer: string;
  createdAt: string;
  offeredPrice: number;
  product: any;
  seller: string;
  status: string;
  updatedAt: string;
  _id: string;
}

export interface UnreadNotificationCountResponse {
  unread: number;
  token: string;
}

export interface deleteCommentResponse {
  comment: [];
  createdAt: string;
  feedText: string;
  images: [];
  likes: string[];
  template: string;
  updatedAt: string;
  __v3: string;
  _id: string;
}
