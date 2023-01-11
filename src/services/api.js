const API_KEY = "d3c00761eff125b45afbcd52d8235bc7";
const BASE_URL = "https://api.themoviedb.org/3/";
const BASE_URL_IMAGE = "https://image.tmdb.org/t/p/original";

export default class ApiService {
    constructor() {
        this.page = 1;
    }

    async fetchPopularMovie() {
        try {
          const response = await axios.get(
            `${BASE_URL}movie/popular?api_key=${API_KEY}&page=${this.page}`
          );
          const movies = await response.data;
          this.incrementPage();
          return movies;
        } catch (error) {
          console.log(error);
        }
      };

      async fetchMovieDetails() {
          const url = `${BASE_URL}movie/157336?api_key=${API_KEY}`;
        
          try {
            const response = await axios.get(url);
            const movie = await response.data;
            return movie;
          } catch (error) {
            console.log(error);
          }
        }
      
    incrementPage() {
        this.page += 1;
    }
    
}