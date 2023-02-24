export interface NoboProfile {
  profileBg: string;
  emailVerified: string;
  blocked: boolean;
  favorites: string[];
  followers: string[];
  following: string[];
  favoriteBrands: string[];
  blurbText: string;
  reviews: any;
  cache: any;
  wpID: number;
  firstName: string;
  lastName: string;
  memberSince: string;
  displayName: string;
  avatar: string;
  experiencePreferences: string;
  orders: string;
  tradeCloset: number;
  sellCloset: number;
}

export const emptyProfile = {
  profileBg: "",
  emailVerified: "",
  blocked: false,
  favorites: [],
  followers: [],
  following: [],
  favoriteBrands: [],
  blurbText: "",
  reviews: [],
  cache: [],
  wpID: 0,
  firstName: "",
  lastName: "",
  memberSince: "",
  displayName: "",
  avatar: "",
  experiencePreferences: "",
  orders: "",
  tradeCloset: 0,
  sellCloset: 0,
}