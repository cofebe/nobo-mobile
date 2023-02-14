export interface FeedItem {
  rating: number;
  from_name: string;
  subject: string;
  date: string;
  data: string;
  post_id: number;
  user_id: number;
  school: string;
  height: string;
  weight: string;
  year: string;
  profile_image: string;
  sport: string;
  position: string;
  account_type: string;
  comment_count?: number;
  like_count?: number;
  liked_post?: boolean;
  photo_url?: string;
  video_url?: string;
  location?: string;
  is_followed?: boolean;
  is_connected?: boolean;
  is_promoted?: boolean;
}

export interface Comment {
  user_id: number;
  from_name: string;
  profile_image: string;
  account_type: string;
  comment_id: number;
  post_id: number;
  message: string;
  image_url: string;
  video_url: string;
  timestamp: string;
}

export interface LikeItem {
  rating: number;
  from_name: string;
  user_id: number;
  school: string;
  height: string;
  weight: string;
  year: string;
  profile_image: string;
  sport: string;
  position: string;
  account_type: string;
  is_followed?: boolean;
  is_connected?: boolean;
}

const messages: FeedItem[] = [
  {
    rating: 4,
    from_name: 'Matt Chorsey',
    subject: 'New event: Trip to Vegas',
    date: '9:32pm May 8, 2022',
    data: 'Excited to have won 1st in the QB Throw to Win tournament this past weekend.',
    post_id: 0,
    user_id: 0,
    school: 'Mater Dei',
    height: '6\'2"',
    weight: '210lbs',
    year: '2023',
    profile_image: 'player-1.jpeg',
    sport: 'Football',
    position: 'QB',
    account_type: 'athlete',
    comment_count: 0,
    like_count: 0,
  },
  {
    rating: 1,
    from_name: 'Lauren Ruthford',
    subject: 'Long time no chat',
    date: '6:12pm May 8, 2022',
    data: 'Excited to have won 1st in the QB Throw to Win tournament this past weekend.',
    post_id: 1,
    user_id: 0,
    school: 'Mater Dei',
    height: '6\'2"',
    weight: '210lbs',
    year: '2023',
    profile_image: 'player-2.jpeg',
    sport: 'Football',
    position: 'QB',
    account_type: 'athlete',
    comment_count: 0,
    like_count: 0,
  },
  {
    rating: 2,
    from_name: 'Jordan Firth',
    subject: 'Report Results',
    date: '4:55am May 8, 2022',
    data: 'Looking for the next generation of linebackers that are wiling to put in the work.  Still time...',
    post_id: 2,
    user_id: 0,
    school: 'Mater Dei',
    height: '6\'2"',
    weight: '210lbs',
    year: '2023',
    profile_image: 'player-3.jpeg',
    sport: 'Football',
    position: 'QB',
    account_type: 'athlete',
    comment_count: 0,
    like_count: 0,
  },
  {
    rating: 0,
    from_name: 'Bill Thomas',
    subject: 'The situation',
    date: '4:55pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    post_id: 3,
    user_id: 0,
    school: 'Mater Dei',
    height: '6\'2"',
    weight: '210lbs',
    year: '2023',
    profile_image: 'player-3.jpeg',
    sport: 'Football',
    position: 'QB',
    account_type: 'athlete',
    comment_count: 0,
    like_count: 0,
  },
  {
    rating: 4,
    from_name: 'Joanne Pollan',
    subject: 'Updated invitation: Swim lessons',
    date: '2:22pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    post_id: 4,
    user_id: 0,
    school: 'Mater Dei',
    height: '6\'2"',
    weight: '210lbs',
    year: '2023',
    profile_image: 'player-3.jpeg',
    sport: 'Football',
    position: 'QB',
    account_type: 'athlete',
    comment_count: 0,
    like_count: 0,
  },
  {
    rating: 3,
    from_name: 'Andrea Cornerston',
    subject: 'Last minute ask',
    date: '1:20pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    post_id: 5,
    user_id: 0,
    school: 'Mater Dei',
    height: '6\'2"',
    weight: '210lbs',
    year: '2023',
    profile_image: 'player-3.jpeg',
    sport: 'Football',
    position: 'QB',
    account_type: 'athlete',
    comment_count: 0,
    like_count: 0,
  },
  {
    rating: 3,
    from_name: 'Kenneth Davis',
    subject: 'Family Calendar - Version 1',
    date: '1:20pm May 6, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    post_id: 6,
    user_id: 0,
    school: 'El Modena',
    height: '6\'2"',
    weight: '180lbs',
    year: '2023',
    profile_image: 'player-2.jpeg',
    sport: 'Football',
    position: 'XB',
    account_type: 'athlete',
    comment_count: 0,
    like_count: 0,
  },
  {
    rating: 1,
    from_name: 'Kelly Richardson',
    subject: 'Placeholder Headhots',
    date: '12:00pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    post_id: 7,
    user_id: 0,
    school: 'Mater Dei',
    height: '6\'2"',
    weight: '210lbs',
    year: '2023',
    profile_image: 'player-2.jpeg',
    sport: 'Football',
    position: 'QB',
    account_type: 'athlete',
    comment_count: 0,
    like_count: 0,
  },
];

export const getMessages = () => messages;

export const getMessage = (id: number) =>
  messages.find((m) => m.post_id === id);
