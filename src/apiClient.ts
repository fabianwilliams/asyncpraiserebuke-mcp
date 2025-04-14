import axios from 'axios';
import type { BusinessDirectoryEntry } from './types.js';

const apiKey = process.env.REVIEW_API_KEY!;
const baseUrl = process.env.REVIEW_API_BASE_URL!;

export const fetchReviews = async () => {
  const res = await axios.post(`${baseUrl}/reviews`, {}, {
    headers: { 'X-API-Key': apiKey }
  });
  return res.data;
};

export const fetchTopRated = async () => {
  const res = await axios.post(`${baseUrl}/reviews/top`, {}, {
    headers: { 'X-API-Key': apiKey }
  });
  return res.data;
};

export const searchReviews = async (place: string) => {
  const res = await axios.post(`${baseUrl}/reviews/search`, { place }, {
    headers: { 'X-API-Key': apiKey }
  });
  return res.data;
};

export const searchBusinessDirectory = async (name: string) => {
  const res = await axios.post(`${baseUrl}/business/search`, { name });
  return res.data as BusinessDirectoryEntry[];
};

export const logBusinessEmail = async (entry: Omit<BusinessDirectoryEntry, 'id' | 'source' | 'validated' | 'submittedAt' | 'submittedBy'>) => {
  const res = await axios.post(`${baseUrl}/business/log`, entry);
  return res.data as string;
};
