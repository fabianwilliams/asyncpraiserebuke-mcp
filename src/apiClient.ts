import axios from 'axios';

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
