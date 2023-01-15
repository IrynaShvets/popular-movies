import ApiService from "./services/api.js";

const refs = {
    libraryId: document.getElementById("library-id"),
};
  
const BASE_URL_IMAGE_W500 = "https://image.tmdb.org/t/p/w500";
const BASE_URL_DEFAULTS = "https://i.gyazo.com/c43bcb8fc7e50c57740731c2c2e301ef.jpg";

const arrIds = JSON.parse(window.localStorage.getItem('todays-values'));
console.log(arrIds);

const apiService = new ApiService();

showFavoriteMovies();
function showFavoriteMovies() {

    for (let i = 0; i < arrIds.length; i++) {
        const element = arrIds[i];
        console.log(element)

        apiService.idMovie = element
        apiService.fetchMovieDetails()
    .then((data) => {
        console.log(data)

        if (!data || !data.id) {
          return;
        }

const markup = 
data.backdrop_path && data.backdrop_path !== null ?
`
        <li class="relative h-auto w-auto shadow-[10px_10px_8px_2px_rgba(0,0,0,0.3)]">
            <img src="${BASE_URL_IMAGE_W500}${data.backdrop_path}" alt="${data.title} loading='lazy'" class="mr-6 h-auto w-auto">
            
                <h4 class="absolute top-2 left-2 text-white">${data.original_title}</h4>
                <button id="delete-id" type="type" class="absolute bottom-2 left-2 text-white">Delete</button>
        </li>` :
        `<li class="relative h-auto w-auto shadow-[10px_10px_8px_2px_rgba(0,0,0,0.3)]">
            <img src="${BASE_URL_DEFAULTS}${data.backdrop_path}" alt="${data.title} loading='lazy'" class="mr-6 h-auto w-auto">
            
                <h4 class="absolute top-2 left-2 text-white">${data.original_title}</h4>
                <button id="delete-id" type="type" class="absolute bottom-2 left-2 text-white">Delete</button>
        </li>
        `;
        refs.libraryId.insertAdjacentHTML("beforeend", markup);
        
    }).catch((error) => console.log(error));
    }
}

