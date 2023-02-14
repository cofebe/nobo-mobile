export interface PraiseItem {
  rating: number;
  fromName: string;
  subject: string;
  date: string;
  data: string;
  id: number;
  school: string;
  height: string;
  weight: string;
  year: number;
  profilePic: string;
  sport: string;
  position: string;
}

const praises: PraiseItem[] = [
  {
    rating: 4,
    fromName: 'Matt Chorsey',
    subject: 'New event: Trip to Vegas',
    date: '9:32pm May 8, 2022',
    data: "This athlete is the most awesome example of excellence in this sport at this level.  I can't wait to see what they'll accomplish next!",
    id: 0,
    school: "Mater Dei",
    height: "6'2\"",
    weight: "210lbs",
    year: 2023,
    profilePic: "player-1.jpeg",
    sport: "Football",
    position: "QB",
  },
];

export const getPraises = () => praises;

export const getPraise = (id: number) => praises.find(p => p.id === id);
