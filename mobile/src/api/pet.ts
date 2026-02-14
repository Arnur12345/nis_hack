import client from './client';
import { Pet } from '../types';

export const getPet = () =>
  client.get<{ pet: Pet }>('/api/v1/pet');

export const updatePetName = (name: string) =>
  client.put<{ pet: Pet }>('/api/v1/pet', { name });
