import LoadMoreBtn from "./helpers/loadMore.js";
import ApiService from "./services/api.js";
import scroll from "./helpers/scroll.js";

const refs = {
  listMovie: document.getElementById("listMovie"),
  btnSeeMore: document.getElementById("btnSeeMore"),
  btnCast: document.getElementById("btnCast"),
// openModalBtn: document.getElementById("open-modal-id"),
  closeModalBtn: document.getElementById("close-modal-id"),
  modal: document.getElementById("modal"),
  overviewId: document.getElementById("overview-id"),
  loadMoreId: document.getElementById("load-more-id"),
  searchForm: document.getElementById("search-form"),
  searchQueryInput: document.querySelector('[name="searchQuery"]'),
};

const apiService = new ApiService();

const loadMoreBtn = new LoadMoreBtn({
  selector: "[load-more]",
  hidden: true,
});

let toggle = true;

 appendMoviesMarkup();
async function appendMoviesMarkup() {
  await apiService
    .fetchPopularMovie()
    .then((movies) => {
      const data = movies.results;
     
      if (data === "") {
        return;
      }
      if (data.length === 0) {
        loadMoreBtn.hide();
        alert("Нічого не знайдено");
        
      }

      if (data.length >= 20) {
        loadMoreBtn.show();
        clearMovie();
        data
          .map(({ title, backdrop_path }) => {
            if (backdrop_path && backdrop_path !== null) {
              const markup = `<li class="h-auto">
                    <img src="https://image.tmdb.org/t/p/original/${backdrop_path}" alt="${title}" class="rounded-t-lg">
                    <div class="p-5 bg-gradient-to-r from-pink-200 to-sky-200 rounded-b-lg">
                        <p class="text-xl text-slate-600">${title}</p>
                        <button type="button" class="bg-pink-700 rounded-lg px-4 py-2 uppercase text-white outline-none focus:outline-none ease-linear transition-all duration-1500 shadow hover:shadow-lg" id="open-modal-id">See more</button>
                        <button type="button" id="cast" class="bg-sky-700 rounded-lg px-4 py-2 uppercase text-white">Cast</button>
                    </div>
                </li>`;
              refs.listMovie.insertAdjacentHTML("beforeend", markup);
            }
          })
          .join("");
      }
    })
    .catch((error) => console.log(error))
    .finally(() => {
      scroll();
    });
}



refs.searchForm.addEventListener("submit", onSearchForm);

async function onSearchForm(e) {
  e.preventDefault();
  apiService.query = refs.searchQueryInput.value.trim();

  if (apiService === "") {
    return;
  }

  await apiService
    .fetchSearchMovies()
    .then((movies) => {
     
      movies.total_pages === movies.page ? loadMoreBtn.hide() : loadMoreBtn.show();;
      console.log(movies.results);
      if (movies.results.length === 0) {
     loadMoreBtn.hide();
     alert("Нічого не знайдено");
      }
      
      loadMoreBtn.show();
        clearMovie();
        movies.results.map(({ title, backdrop_path }) => {
          
              const markup = 
               (backdrop_path && backdrop_path !== null) ?
              (`<li class="h-auto">
                    <img src="https://image.tmdb.org/t/p/original/${backdrop_path}" alt="${title}" class="rounded-t-lg">
                    <div class="p-5 bg-gradient-to-r from-pink-200 to-sky-200 rounded-b-lg">
                        <p class="text-xl text-slate-600">${title}</p>
                        <button type="button" class="bg-pink-700 rounded-lg px-4 py-2 uppercase text-white outline-none focus:outline-none ease-linear transition-all duration-1500 shadow hover:shadow-lg" id="open-modal-id">See more</button>
                        <button type="button" id="cast" class="bg-sky-700 rounded-lg px-4 py-2 uppercase text-white">Cast</button>
                    </div>
                </li>`) :
              (`<li class="h-auto">
                    <img src="https://i.gyazo.com/c43bcb8fc7e50c57740731c2c2e301ef.jpg" alt="${title}" class="rounded-t-lg">
                    <div class="p-5 bg-gradient-to-r from-pink-200 to-sky-200 rounded-b-lg">
                        <p class="text-xl text-slate-600">${title}</p>
                        <button type="button" class="bg-pink-700 rounded-lg px-4 py-2 uppercase text-white outline-none focus:outline-none ease-linear transition-all duration-1500 shadow hover:shadow-lg" id="open-modal-id">See more</button>
                        <button type="button" id="cast" class="bg-sky-700 rounded-lg px-4 py-2 uppercase text-white">Cast</button>
                    </div>
                </li>`);
              refs.listMovie.insertAdjacentHTML("beforeend", markup);
            
          })
          .join("");
      
    })
    .catch((error) => console.log(error))
    .finally(() => {
      scroll();
    });
}


loadMoreBtn.refs.button.addEventListener("click", appendMoviesMarkup);

refs.loadMoreId.addEventListener("click", appendMoviesMarkup);

if (document.getElementById("open-modal-id")) {
  document.getElementById("open-modal-id").addEventListener("click", toggleModal);
}
refs.closeModalBtn.addEventListener("click", toggleModal);

function toggleModal() {
  refs.modal.classList.toggle("hidden");
}


async function appendMoviesDetails() {
  await apiService
    .fetchMovieDetails()
    .then((data) => {
      console.log(data);
      if (data === "") {
        return;
      }
      const markup = `<li class="h-auto">
                        <p class="my-4 text-slate-500 text-lg leading-relaxed">${data.overview}</p>
                    </li>`;
      refs.overviewId.insertAdjacentHTML("beforeend", markup);
    })
    .catch((error) => console.log(error));
}

function clearMovie() {
  refs.listMovie.innerHTML = "";
}
