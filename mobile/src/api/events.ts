import client from './client';
import { Event, CompleteEventResponse } from '../types';

export const getEvents = (category?: string) =>
  client.get<{ events: Event[]; count: number }>('/api/v1/events', {
    params: category ? { category } : undefined,
  });

export const getEventDetail = (id: string) =>
  client.get<Event>(`/api/v1/events/${id}`);

export const joinEvent = (id: string) =>
  client.post<{ participation: any }>(`/api/v1/events/${id}/join`);

export const completeEvent = (id: string) =>
  client.post<CompleteEventResponse>(`/api/v1/events/${id}/complete`);
