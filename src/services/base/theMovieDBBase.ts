import axios from 'axios';

const TheMovieDBBase = axios.create({
  baseURL: process.env.TMDB_URL_BASE,
  headers: {'Authorization': 'Bearer '+ process.env.TMDB_TOKEN}
});

export default TheMovieDBBase;
