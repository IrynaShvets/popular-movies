const API_KEY = "d3c00761eff125b45afbcd52d8235bc7";
const BASE_URL = "https://api.themoviedb.org/3/";

export default class ApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = "";
    this.movie_id = null;
  }

  async fetchPopularMovie() {
    const url = `${BASE_URL}movie/popular?api_key=${API_KEY}&page=${this.page}`;
    console.log(url);
    try {
      const response = await axios({
        method: "get",
        timeout: 2000,
        headers: { "Content-Type": "application/json" },
        url,
      });
      const movies = await response.data;
      this.incrementPage();
      return movies;
    } catch (error) {
      console.error(error);
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
      console.error(error);
    }
  }

  async fetchSearchMovies() {
    const url = `${BASE_URL}search/movie?api_key=${API_KEY}&query=${this.searchQuery}&page=${this.page}`;
    console.log(url);
    try {
      const response = await axios({
        method: "get",
        timeout: 1000,
        headers: { "Content-Type": "application/json" },
        url,
      });
      const movies = await response.data;
      this.incrementPage();
      return movies;
    } catch (error) {
      console.error(error);
    }
  }

  async incrementPage() {
    this.page += 1;
  }

  async resetPage() {
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
}
