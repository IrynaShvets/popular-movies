import ApiService from "./services/api.js";

const refs = {
    libraryId: document.getElementById("library-id"),
};
  
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

const markup = `
        <div class="">
        <img src="https:image.tmdb.org/t/p/w500/${data.backdrop_path}" alt="${data.title} loading='lazy'" class="rounded mr-6">
        <div>
          <h4 class="mb-4 text-slate-500 text-lg leading-relaxed"><span class="font-semibold">Original title:</span> ${data.original_title}</h4>
          <p class="my-4 text-slate-500 text-lg leading-relaxed"><span class="font-semibold">Release date:</span> ${data.release_date}.</p>
         
          <p class="my-4 text-slate-500 text-lg leading-relaxed"><span class="font-semibold">Tagline:</span> ${data.tagline}.</p>
        </div>
        <button id="delete-id" type="type" class="">Delete</button>
        </div>
                      `;
        refs.libraryId.insertAdjacentHTML("beforeend", markup);
        
    }).catch((error) => console.log(error));
    }
}

