import { OrganizationProfile } from './organization'

export interface Profile {
  user_id: number;
  user_type: Value;
  basic_user_profile: BasicUserProfile;
  athlete_user_profile: AthleteUserProfile;
  coach_user_profile?: CoachUserProfile;
  trainer_user_profile?: TrainerUserProfile;
  organization_profile?: OrganizationProfile;
  profile_picture_url?: String;
  social_data: any;
}

export interface AthleteUserProfile {
  city: Value;
  class: Value;
  height: Value;
  highlights: {};
  other_sports: Value;
  primary_position: Value;
  primary_sport: Value;
  rating: any;
  school: Value;
  social_links: Value;
  team: Value;
  weight: Value;
  gpa: Value;
  sat: Value;
  act: Value;
  athlete_awards: [];
  athlete_experiences: [];
}

export interface BasicUserProfile {
  city: Value;
  bio: Value;
  class_year: Value;
  country: Value;
  end_year: Value;
  first_name: Value;
  instagram_handle: Value;
  last_name: Value;
  profile_image: Value;
  school: Value;
  start_year: Value;
  state: Value;
  timezone: Value;
  twitter_handle: Value;
}

export interface CoachUserProfile {
  city: Value;
  school: Value;
  social_links: Value;
  coaching_experience: [];
  playing_experience: [];
  position: Value;
}

export interface TrainerUserProfile {
  city: Value;
  school: Value;
  social_links: Value;
  training_experience: [];
  playing_experience: [];
  position: Value;
}

export interface AthleteMeasurements {
  wingspan: Value;
  vertical: Value;
  squat: Value;
  shuttle_time: Value;
  yard_dash: Value;
  cone_drill: Value;
}

export interface AthleteAcademics {
  gpa: Value;
  sat: Value;
  act: Value;
}

export interface AthleteHighlights {
  hudle: Value;
  sports: Value;
}

export interface UpdateAthleteProfileRequest {
  basic_user_profile: BasicUserProfile;
  athlete_user_profile: AthleteUserProfile;
}

export interface UpdateCoachProfileRequest {
  basic_user_profile: BasicUserProfile;
  coach_user_profile: CoachUserProfile;
}

export interface UpdateTrainerProfileRequest {
  basic_user_profile: BasicUserProfile;
  trainer_user_profile: TrainerUserProfile;
}

export interface UpdatePR {
  basic_user_profile: BasicUserProfile;
}

export interface Value {
  String: string;
  Valid?: boolean;
}

const searchResults: Profile[] = [
  {
    user_id: 1,
    user_type: {
      String: 'athlete',
    },
    basic_user_profile: {
      city: {
        String: 'Corona',
      },
      class_year: {
        String: '2023',
      },
      country: {
        String: 'USA',
      },
      end_year: {
        String: '2024',
      },
      first_name: {
        String: 'Matt',
      },
      instagram_handle: {
        String: 'https://instagram.com',
      },
      last_name: {
        String: 'Chorsey',
      },
      profile_image: {
        String: '',
      },
      school: {
        String: 'UCLA',
      },
      start_year: {
        String: '2022',
      },
      state: {
        String: 'California',
      },
      bio: {
        String:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nunc nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nunc vel tincidunt lacinia, nunc nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.',
      },
      timezone: {
        String: '',
      },
      twitter_handle: {
        String: 'https://twitter.com',
      },
    },
    athlete_user_profile: {
      city: {
        String: '',
      },
      class: {
        String: '',
      },
      height: {
        String: '76',
      },
      highlights: {},
      other_sports: {
        String: '',
      },
      primary_position: {
        String: 'QB',
      },
      primary_sport: {
        String: '',
      },
      rating: 3,
      school: {
        String: '',
      },
      social_links: {
        String: '',
      },
      team: {
        String: '',
      },
      weight: {
        String: '150',
      },
      gpa: {
        String: '3.5',
      },
      sat: {
        String: '1200',
      },
      act: {
        String: '30',
      },
      athlete_awards: [],
      athlete_experiences: [],
    },
    social_data: {},
  },
];

export const getMessages = () => searchResults;

export const getMessage = (id: number) =>
  searchResults.find((m) => m.user_id === id);
