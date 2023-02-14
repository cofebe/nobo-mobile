export interface OrganizationProfile {
  organization_id: number;
  owner_user_id: number;
  organization_name: string;
  profile_picture: string;
  banner_picture: string;
  bio: string;
  city: string;
  country: string;
  state: string;
  sport: string;
  users: any;
}

export const OrganizationEmptyProfile = {
  organization_id: 0,
  owner_user_id: 0,
  organization_name: '',
  profile_picture: '',
  banner_picture: '',
  bio: '',
  city: '',
  country: '',
  state: '',
  sport: '',
  users: [],
};