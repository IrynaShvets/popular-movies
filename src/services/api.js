const API_KEY = "d3c00761eff125b45afbcd52d8235bc7";
const BASE_URL = "https://api.themoviedb.org/3/";

export default class ApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = "";
    this.movie_id = null;
    this.genre = '';
    this.year = '';
  }

  async fetchPopularMovie() {
    const url = `${BASE_URL}movie/popular?api_key=${API_KEY}&page=${this.page}`;
    try {
      const response = await axios({
        method: "get",
        timeout: 2000,
        headers: { "Content-Type": "application/json" },
        url,
      });
      const movies = await response.data;
      return movies;
    } catch (error) {
      return error;
    }
  }

  async fetchMovieDetails() {
    const url = `${BASE_URL}movie/${this.movie_id}?api_key=${API_KEY}`;
    try {
      const response = await axios({
        method: "get",
        timeout: 1000,
        headers: { "Content-Type": "application/json" },
        url,
      });
      const movie = await response.data;
      return movie;
    } catch (error) {
      return error;
    }
  }

  async fetchSearchMovies() {
    const url = `${BASE_URL}search/movie?api_key=${API_KEY}&query=${this.searchQuery}&page=${this.page}`;
    try {
      const response = await axios({
        method: "get",
        timeout: 1000,
        headers: { "Content-Type": "application/json" },
        url,
      });
      const movies = await response.data;
      return movies;
    } catch (error) {
      return error;
    }
  }

  async fetchMoviesOfSelectedYear() {
    try {
      const url = `${BASE_URL}discover/movie?api_key=${API_KEY}&primary_release_year=${this.year}&page=${this.page}`;
      const response = await axios.get(url);
      const movies = await response.data;
      return movies;
    } catch (error) {
      return error;
    }
  }

  async fetchMoviesOfSelectedGenre() {
    try {
      const url = `${BASE_URL}discover/movie?api_key=${API_KEY}&with_genres=${this.genre}&page=${this.page}`;
      const response = await axios.get(url);
      const movies = await response.data;
      return movies;
    } catch (error) {
      return error;
    }
  }

  incrementPage() {
    this.page += 1;
  }

  decrementPage() {
    this.page -= 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get idMovie() {
    return this.movie_id;
  }

  set idMovie(newId) {
    this.movie_id = newId;
  }

  get currentPage() {
    return this.page;
  }
}
