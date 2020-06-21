import axios from 'axios';

const TheMovieDBService = axios.create({
  baseURL: process.env.TMDB_URL_BASE,
  headers: {'Authorization': 'Bearer '+ process.env.TMDB_TOKEN}
});

export default TheMovieDBService;
