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
        <li dataId="${data.id}" id="itemId" class="relative w-[350px] h-[260px] shadow-[10px_10px_8px_2px_rgba(0,0,0,0.3)] hover:scale-[1.05] hover:transition hover:duration-700 hover:ease-in-out">
            <img src="${BASE_URL_IMAGE_W500}${data.backdrop_path}" alt="${data.title} loading='lazy'" class="mr-6 w-[350px] h-[220px]">
            <h4 class="absolute top-2 left-2 text-white">${data.original_title}</h4>
            <button dataId="${data.id}" id="closeId" type="button" class="w-[350px] h-[40px] p-2 bg-indigo-200 hover:bg-indigo-500 text-gray-800 hover:text-white transition-colors">Delete with library</button>
        </li>`
            : `<li dataId="${data.id}" id="itemId" class="relative w-[350px] h-[260px] shadow-[10px_10px_8px_2px_rgba(0,0,0,0.3)] hover:scale-[1.05] hover:transition hover:duration-700 hover:ease-in-out">
            <img src="${BASE_URL_DEFAULTS}${data.backdrop_path}" alt="${data.title} loading='lazy'" class="mr-6 w-[350px] h-[220px]">
            <h4 class="absolute top-2 left-2 text-white">${data.original_title}</h4>
            <button dataId="${data.id}" id="closeId" type="button" class="w-[350px] h-[40px] p-2 bg-indigo-200 hover:bg-indigo-500 text-gray-800 hover:text-white transition-colors">Delete with library</button>
        </li>
        `;
        refs.libraryId.insertAdjacentHTML("beforeend", markup);

        window.onclick = (e) => {
          if (e.target.tagName === "BUTTON") {
            const newMovie = arrIds.findIndex((el) => el === data.id);
            arrIds.splice(newMovie, 1);
            e.target.parentNode.remove();
            window.localStorage.setItem(
              "todays-values",
              JSON.stringify(arrIds)
            );
          }
        };
      })
      .catch((error) => console.log(error));
  }
}
