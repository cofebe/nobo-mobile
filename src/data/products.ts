export interface Products {
  docs: Product[];
}

export interface Product {
  tradeOffers: {
    incoming: any[];
    outgoing: any[];
  };
  attributes: {
    id: string;
    value: string;
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
  };
  action: string;
  name: string;
  brand: string;
  description: string;
  receipt: string;
  price: number;
  retailPrice: number;
  category: {
    parent: string;
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  parentCategory: {
    parent: any;
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  potentialTradeItems: any[];
  createdAt: string;
  updatedAt: string;
  image: string;
  link: string;
}
