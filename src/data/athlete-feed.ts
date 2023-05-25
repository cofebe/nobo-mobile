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
