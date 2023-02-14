export interface WatchItem {
  rating: number;
  from_name: string;
  subject: string;
  date: string;
  data: string;
  id: number;
  school: string;
  height: string;
  weight: string;
  year: number;
  profile_picture_url: string;
  sport: string;
  position: string;
  account_type: string;
}

const messages: WatchItem[] = [
  {
    rating: 4,
    from_name: 'Matt Chorsey',
    subject: 'New event: Trip to Vegas',
    date: '9:32pm May 8, 2022',
    data: 'Testing 123.',
    id: 0,
    school: "Mater Dei",
    height: "6'2\"",
    weight: "210lbs",
    year: 2023,
    profile_picture_url: "player-1.jpeg",
    sport: "Football",
    position: "QB",
    account_type: "athlete"
  },
  {
    rating: 1,
    from_name: 'Lauren Ruthford',
    subject: 'Long time no chat',
    date: '6:12pm May 8, 2022',
    data: 'Testing 1234 Watchlist Item',
    id: 1,
    school: "Mater Dei",
    height: "6'2\"",
    weight: "210lbs",
    year: 2023,
    profile_picture_url: "player-2.jpeg",
    sport: "Football",
    position: "QB",
    account_type: "athlete"
  },
  {
    rating: 2,
    from_name: 'Jordan Firth',
    subject: 'Report Results',
    date: '4:55am May 8, 2022',
    data: 'Looking for the next generation of linebackers that are wiling to put in the work.  Still time...',
    id: 2,
    school: "Mater Dei",
    height: "6'2\"",
    weight: "210lbs",
    year: 2023,
    profile_picture_url: "player-3.jpeg",
    sport: "Football",
    position: "QB",
    account_type: "athlete"
  },
  {
    rating: 0,
    from_name: 'Bill Thomas',
    subject: 'The situation',
    date: '4:55pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: 3,
    school: "Mater Dei",
    height: "6'2\"",
    weight: "210lbs",
    year: 2023,
    profile_picture_url: "player-3.jpeg",
    sport: "Football",
    position: "QB",
    account_type: "athlete"
  },
  {
    rating: 4,
    from_name: 'Joanne Pollan',
    subject: 'Updated invitation: Swim lessons',
    date: '2:22pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: 4,
    school: "Mater Dei",
    height: "6'2\"",
    weight: "210lbs",
    year: 2023,
    profile_picture_url: "player-3.jpeg",
    sport: "Football",
    position: "QB",
    account_type: "athlete"
  },
  {
    rating: 3,
    from_name: 'Andrea Cornerston',
    subject: 'Last minute ask',
    date: '1:20pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: 5,
    school: "Mater Dei",
    height: "6'2\"",
    weight: "210lbs",
    year: 2023,
    profile_picture_url: "player-3.jpeg",
    sport: "Football",
    position: "QB",
    account_type: "athlete"
  },
  {
    rating: 3,
    from_name: 'Kenneth Davis',
    subject: 'Family Calendar - Version 1',
    date: '1:20pm May 6, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: 6,
    school: "El Modena",
    height: "6'2\"",
    weight: "180lbs",
    year: 2023,
    profile_picture_url: "player-2.jpeg",
    sport: "Football",
    position: "XB",
    account_type: "athlete"
  },
  {
    rating: 1,
    from_name: 'Kelly Richardson',
    subject: 'Placeholder Headhots',
    date: '12:00pm May 7, 2022',
    data: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: 7,
    school: "Mater Dei",
    height: "6'2\"",
    weight: "210lbs",
    year: 2023,
    profile_picture_url: "player-2.jpeg",
    sport: "Football",
    position: "QB",
    account_type: "athlete"
  }
];

export const getMessages = () => messages;

export const getMessage = (id: number) => messages.find(m => m.id === id);
