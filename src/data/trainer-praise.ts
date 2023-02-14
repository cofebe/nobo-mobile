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
    fromName: 'Lincoln Riley',
    subject: 'New event: Trip to Vegas',
    date: '9:32pm May 8, 2022',
    data: "This trainer is hard core, he get's the players ready to go to battle!",
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
