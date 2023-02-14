export interface AthleteProfile {
  rating: number;
  fromName: string;
  firstName?: string;
  lastName?: string;
  subject: string;
  date: string;
  data: string;
  id: number;
  school: string;
  height: string;
  weight: string;
  year: number;
  profilePic: string;
  bannerPic: string;
  sport: string;
  position: string;
  highlights: any[];
  stats: any[];
  academics: object;
  offers: string[];
  awards: any[];
  measurements: object;
  experiences?: string[];
  city: string;
  country?: string;
  state?: string;
  socialLinks?: string;
  followedUser?: boolean;
  otherSports?: string[];
  gpa?: string;
  sat?: string;
  act?: string;
  extraCurriculars?: string[];
}

export const emptyProfile = {
  rating: 0,
  fromName: '',
  subject: '',
  date: '9:32pm May 8, 2022',
  data: '',
  id: 0,
  school: '',
  height: '',
  weight: '',
  year: 2022,
  profilePic: '',
  bannerPic: '',
  sport: '',
  position: '',
  highlights: [],
  stats: [],
  academics: {},
  offers: [],
  awards: [],
  measurements: {},
  city: '',
  country: '',
  socialLinks: '',
  otherSports: [],
};

export interface Follow {
  user_id: number;
  user_id_followed: number;
}

