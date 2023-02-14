export interface TrainerProfile {
  fromName: string;
  subject: string;
  position: string;
  date: string;
  data: string;
  id: number;
  school: string;
  profilePic: string;
  bannerPic: string;
  sport: string;
  city: string;
  country: string;
  playing_experience?: string[];
  training_experience?: string[];
  socialLinks?: string;
  followedUser?: boolean;
}

export interface Follow {
  user_id: number;
  user_id_followed: number;
}

export const emptyProfile = {
  fromName: '',
  subject: '',
  position: '',
  date: '9:32pm May 8, 2022',
  data: '',
  id: 0,
  school: '',
  profilePic: '',
  bannerPic: '',
  sport: '',
  city: '',
  country: '',
  socialLinks: '',
};

const athleteProfiles: TrainerProfile[] = [
  {
    fromName: 'Nick Saban',
    subject: '',
    position: 'Head Coach',
    date: '9:32pm May 8, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: 0,
    school: 'Mater Dei',
    profilePic: 'player-1.jpeg',
    bannerPic: 'banner-1.jpeg',
    sport: 'Football',
    city: 'Santa Ana',
    country: 'United States',
  },
  {
    fromName: 'Lauren Ruthford',
    subject: 'Long time no chat',
    position: 'Head Coach',
    date: '6:12pm May 8, 2022',
    data: 'Excited to have won 1st in the QB Throw to Win tournament this past weekend.',
    id: 1,
    school: 'Mater Dei',
    profilePic: 'player-2.jpeg',
    bannerPic: 'banner-1.jpeg',
    sport: 'Football',
    city: 'Santa Ana',
    country: 'United States',
  },
  {
    fromName: 'Jordan Firth',
    subject: 'Report Results',
    position: 'Head Coach',
    date: '4:55am May 8, 2022',
    data: 'Looking for the next generation of linebackers that are wiling to put in the work.  Still time...',
    id: 2,
    school: 'Mater Dei',
    profilePic: 'player-3.jpeg',
    bannerPic: 'banner-1.jpeg',
    sport: 'Football',
    city: 'Santa Ana',
    country: 'United States',
  },
  {
    fromName: 'Bill Thomas',
    subject: 'The situation',
    position: 'Head Coach',
    date: '4:55pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: 3,
    school: 'Mater Dei',
    profilePic: 'player-3.jpeg',
    bannerPic: 'banner-1.jpeg',
    sport: 'Football',
    city: 'Santa Ana',
    country: 'United States',
  },
  {
    fromName: 'Joanne Pollan',
    subject: 'Updated invitation: Swim lessons',
    position: 'Head Coach',
    date: '2:22pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: 4,
    school: 'Mater Dei',
    profilePic: 'player-3.jpeg',
    bannerPic: 'banner-1.jpeg',
    sport: 'Football',
    city: 'Santa Ana',
    country: 'United States',
  },
  {
    fromName: 'Andrea Cornerston',
    subject: 'Last minute ask',
    position: 'Head Coach',
    date: '1:20pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: 5,
    school: 'Mater Dei',
    profilePic: 'player-3.jpeg',
    bannerPic: 'banner-1.jpeg',
    sport: 'Football',
    city: 'Santa Ana',
    country: 'United States',
  },
  {
    fromName: 'Kenneth Davis',
    subject: 'Family Calendar - Version 1',
    position: 'Head Coach',
    date: '1:20pm May 6, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: 6,
    school: 'El Modena',
    profilePic: 'player-2.jpeg',
    bannerPic: 'banner-1.jpeg',
    sport: 'Football',
    city: 'Santa Ana',
    country: 'United States',
  },
  {
    fromName: 'Kelly Richardson',
    subject: 'Placeholder Headhots',
    position: 'Head Coach',
    date: '12:00pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: 7,
    school: 'Mater Dei',
    profilePic: 'player-2.jpeg',
    bannerPic: 'banner-1.jpeg',
    sport: 'Football',
    city: 'Santa Ana',
    country: 'United States',
  },
];

export const getProfileSummaries = () => athleteProfiles;

export const getProfileSummary = (id: number) =>
  athleteProfiles.find((m) => m.id === id);
