export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
}

export interface Pet {
  id: string;
  name: string;
  mood: 'happy' | 'neutral' | 'sad' | 'sleeping';
  level: number;
  xp: number;
  xp_to_next_level: number;
  evolution_stage: number;
  streak_days: number;
  last_fed_at: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'ecology' | 'social' | 'animals' | 'education';
  latitude: number;
  longitude: number;
  address: string;
  start_time: string;
  end_time: string | null;
  xp_reward: number;
  max_participants: number | null;
  image_url: string | null;
  participants_count?: number;
  is_joined?: boolean;
  is_completed?: boolean;
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xp_bonus: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  pet_name: string;
  pet_evolution_stage: number;
}

export interface CompleteEventResponse {
  participation: any;
  xp_earned: number;
  streak_bonus: number;
  pet: Pet;
  new_achievements: Achievement[];
}

export interface AuthResponse {
  user: User;
  pet: Pet;
  access_token: string;
}

export interface StatsResponse {
  events_completed: number;
  total_xp: number;
  streak_days: number;
  level: number;
  category_counts: Record<string, number>;
}

export interface DayActivity {
  day: string;
  date: string;
  count: number;
  xp: number;
}

export interface ActivityResponse {
  weekly_activity: DayActivity[];
  this_week_events: number;
  this_week_xp: number;
  category_breakdown: Record<string, number>;
}
