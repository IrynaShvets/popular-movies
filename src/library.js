import ApiService from "./services/api.js";

const refs = {
  libraryId: document.getElementById("library-id"),
};

const BASE_URL_IMAGE_W500 = "https://image.tmdb.org/t/p/original";
const BASE_URL_DEFAULTS =
  "https://i.gyazo.com/c43bcb8fc7e50c57740731c2c2e301ef.jpg";

const arrIds = JSON.parse(window.localStorage.getItem("todays-values"));

const apiService = new ApiService();

showFavoriteMovies();
function showFavoriteMovies() {
  for (let i = 0; i < arrIds?.length; i++) {
    const element = arrIds[i];

    apiService.idMovie = element;
    apiService
      .fetchMovieDetails()
      .then((data) => {
        if (!data || !data.id) {
          return;
        }

        const markup =
          data.backdrop_path && data.backdrop_path !== null
            ? `
        <li class="relative w-[350px] h-[220px] shadow-[10px_10px_8px_2px_rgba(0,0,0,0.3)]">
            <img src="${BASE_URL_IMAGE_W500}${data.backdrop_path}" alt="${data.title} loading='lazy'" class="mr-6 w-[350px] h-[220px]">
            <h4 class="absolute top-2 left-2 text-white">${data.original_title}</h4>
            <button id="deleteId" type="button">Delete</button>
        </li>`
            : `<li class="relative w-[350px] h-[220px] shadow-[10px_10px_8px_2px_rgba(0,0,0,0.3)]">
            <img src="${BASE_URL_DEFAULTS}${data.backdrop_path}" alt="${data.title} loading='lazy'" class="mr-6 w-[350px] h-[220px]">
            <h4 class="absolute top-2 left-2 text-white">${data.original_title}</h4>
            <button id="deleteId" type="button">Delete</button>
        </li>
        `;
        refs.libraryId.insertAdjacentHTML("beforeend", markup);
      })
      .catch((error) => console.log(error));
  }
}
