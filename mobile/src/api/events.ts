import client from './client';
import { Event, EventCreateData, CompleteEventResponse } from '../types';

export const getEvents = (category?: string) =>
  client.get<{ events: Event[]; count: number }>('/api/v1/events', {
    params: category ? { category } : undefined,
  });

export const getPopularEvent = () =>
  client.get<Event>('/api/v1/events/popular');

export const getEventDetail = (id: string) =>
  client.get<Event>(`/api/v1/events/${id}`);

export const joinEvent = (id: string) =>
  client.post<{ participation: any }>(`/api/v1/events/${id}/join`);

export const completeEvent = (id: string) =>
  client.post<CompleteEventResponse>(`/api/v1/events/${id}/complete`);

export const createEvent = (data: EventCreateData) =>
  client.post<{ id: string; title: string; qr_code: string; status: string }>('/api/v1/events', data);

export const getEventQR = (id: string) =>
  client.get<{ qr_code: string; event_id: string; title: string }>(`/api/v1/events/${id}/qr`);

export const verifyQR = (eventId: string, qrCode: string) =>
  client.post<CompleteEventResponse>(`/api/v1/events/${eventId}/verify-qr`, { qr_code: qrCode });
