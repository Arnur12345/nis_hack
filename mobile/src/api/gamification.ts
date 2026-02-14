import client from './client';
import { LeaderboardEntry, Achievement, StatsResponse } from '../types';

export const getLeaderboard = () =>
  client.get<{ leaderboard: LeaderboardEntry[] }>('/api/v1/leaderboard');

export const getAchievements = () =>
  client.get<{ earned: Achievement[]; available: Achievement[] }>('/api/v1/achievements');

export const getStats = () =>
  client.get<StatsResponse>('/api/v1/profile/stats');
