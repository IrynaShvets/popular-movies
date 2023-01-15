import LoadMoreBtn from "./helpers/loadMore.js";
import ApiService from "./services/api.js";
import scroll from "./helpers/scroll.js";
import appendValueToStorage from "./helpers/localStorage.js";

const refs = {
  listMovie: document.getElementById("listMovie"),
  btnSeeMore: document.getElementById("btnSeeMore"),
  btnCast: document.getElementById("btnCast"),
  closeModalBtn: document.getElementById("close-modal-id"),
  modal: document.getElementById("modal"),
  overviewId: document.getElementById("overview-id"),
  loadMoreId: document.getElementById("load-more-id"),
  searchForm: document.getElementById("search-form"),
  searchQueryInput: document.querySelector('[name="searchQuery"]'),
  searchContainer: document.getElementById("search-container"),
  modalBackdrop: document.querySelector('.modal-backdrop'),
  favoriteBtn: document.getElementById('favorite-btn'),
  loaderId: document.getElementById("loader-id"),
  
};

const BASE_URL_IMAGE = "https://image.tmdb.org/t/p/original";
const BASE_URL_IMAGE_W500 = "https://image.tmdb.org/t/p/w500";
const BASE_URL_DEFAULTS = "https://i.gyazo.com/c43bcb8fc7e50c57740731c2c2e301ef.jpg";


const apiService = new ApiService();

const loadMoreBtn = new LoadMoreBtn({
  selector: "[load-more]",
  hidden: true,
});

refs.searchForm.addEventListener("submit", onSearchForm);

appendMoviesMarkup();

async function appendMoviesMarkup() {
  
  await apiService
    .fetchPopularMovie()
    .then((movies) => {
      const data = movies.results;

      if (data.length === 0) {
        loadMoreBtn.hide();
        loadMoreBtn.refs.button.removeEventListener("click", appendMoviesMarkup);
        const markup = `<span id="message" class="text-red-500 grow-0">Sorry, but nothing was found for your request.</span>`;
        refs.searchContainer.insertAdjacentHTML("beforeend", markup);
        setTimeout(() => {
          document.getElementById("message").remove();
        }, 4000);
      }

      if (data.length >= 20) {
        apiService.incrementPage();
        loadMoreBtn.show();
        loadMoreBtn.refs.button.addEventListener("click", appendMoviesMarkup);
        clearMovie();
        data
          .map(({ title, backdrop_path, id }) => {
              const markup = backdrop_path && backdrop_path !== null   
              ? `<li movie-id=${id} id="modalid" class="h-full">
                    <img src="${BASE_URL_IMAGE}${backdrop_path}" alt="${title} loading='lazy'" class="rounded-t-lg block w-full h-auto object-cover">
                    <div class="p-5 bg-gradient-to-r from-pink-200 to-sky-200 rounded-b-lg">
                        <p class="text-xl text-slate-600">${title}</p>
                    </div>
                </li>`
              : `<li movie-id=${id} id="modalid" class="h-auto">  
                    <img src="${BASE_URL_DEFAULTS}" alt="${title}" loading='lazy' class="rounded-t-lg block w-full h-auto object-cover">
                    <div class="p-5 bg-gradient-to-r from-pink-200 to-sky-200 rounded-b-lg">
                        <p class="text-xl text-slate-600">${title}</p>
                    </div>
                </li>`;
               refs.listMovie.insertAdjacentHTML("beforeend", markup);
          })
          .join("");
      }
    })
    .catch((error) => console.log(error))
    .finally(() => {
     scroll();
    });
}

async function onSearchForm(e) {
  e.preventDefault();
  
  if (refs.searchQueryInput.value === "") {
   e.currentTarget.reset();
    const markup = `
     <span id="message" class="text-red-500 grow-0">You have not entered anything. Please enter a value.</span>
 `;
        refs.searchContainer.insertAdjacentHTML("beforeend", markup);
        setTimeout(() => {
          document.getElementById("message").remove();
        }, 4000);
    return;
  }

  apiService.query = refs.searchQueryInput.value.trim();
  apiService.resetPage();
  
  await apiService
    .fetchSearchMovies()
    .then((movies) => {
      const data = movies.results;
      
      if (movies.total_pages === movies.page) {
        loadMoreBtn.hide()
        loadMoreBtn.refs.button.removeEventListener("click", onSearchForm);
      } else {
        loadMoreBtn.show();
        loadMoreBtn.refs.button.addEventListener("click", onSearchForm);
      }
       
      console.log(data);
      if (data.length === 0) {
        loadMoreBtn.hide();
        loadMoreBtn.refs.button.removeEventListener("click", onSearchForm);

       const markup = `
     <span id="message" class="text-red-500 grow-0">Sorry, but nothing was found for your request.</span>
 `;
        refs.searchContainer.insertAdjacentHTML("beforeend", markup);
        setTimeout(() => {
          document.getElementById("message").remove();
        }, 4000);
        refs.searchQueryInput.value = "";
      }

        loadMoreBtn.show();
        loadMoreBtn.refs.button.addEventListener("click", onSearchForm);
          clearMovie();
          
          data
            .map((movie) => {
              const markup =
              movie.backdrop_path && movie.backdrop_path !== null
                  ? `<li movie-id=${movie.id} id="modalid" class="h-auto">
                        <img src="${BASE_URL_IMAGE}${movie.backdrop_path}" alt="${movie.title} loading='lazy'" class="rounded-t-lg">
                        <div class="p-5 bg-gradient-to-r from-pink-200 to-sky-200 rounded-b-lg">
                            <p class="text-xl text-slate-600">${movie.title}</p>
                        </div>
                    </li>`
                  : `<li movie-id=${movie.id} id="modalid" class="h-auto">
                        <img src="${BASE_URL_DEFAULTS}" alt="${movie.title}" loading='lazy' class="rounded-t-lg">
                        <div class="p-5 bg-gradient-to-r from-pink-200 to-sky-200 rounded-b-lg">
                            <p class="text-xl text-slate-600">${movie.title}</p>
                        </div>
                    </li>`;
              refs.listMovie.insertAdjacentHTML("beforeend", markup);
            }).join("");
    })
    .catch((error) => console.log(error))
    .finally(() => {
      
      scroll();
    });
}
    document.querySelectorAll("#listMovie").forEach(i => i.addEventListener(
        "click",
        e => {
          onToggle();
          refs.overviewId.innerHTML = "";
          const currentItem = e.target.parentNode;
          console.log(currentItem)

          const currentId = currentItem.getAttribute("movie-id")
          console.log(currentId)
          apiService.idMovie = currentId;

    apiService.fetchMovieDetails()
    .then((data) => {
    
      if (!data || !data.id) {
        return;
      }
      const genres = data.genres.map(el => el.name).join(", ");
      document.getElementById("modal-title").textContent = `${data.title}`;


      const markup =
              data.backdrop_path && data.backdrop_path !== null    
                  ? `<div class="flex p-6">
                  <img src="${BASE_URL_IMAGE_W500}${data.backdrop_path}" alt="${data.title} loading='lazy'" class="rounded mr-6">
                  <div>
                    <h4 class="mb-4 text-slate-500 text-lg leading-relaxed"><span class="font-semibold">Original title:</span> ${data.original_title}</h4>
                    <p class="my-4 text-slate-500 text-lg leading-relaxed"><span class="font-semibold">Release date:</span> ${data.release_date}.</p>
                    <p class="my-4 text-slate-500 text-lg leading-relaxed"><span class="font-semibold">Genres of cinema:</span> ${genres}.</p>
                    <p class="my-4 text-slate-500 text-lg leading-relaxed"><span class="font-semibold">Tagline:</span> ${data.tagline}.</p>
                  </div>
                  </div>
                  <p class="p-6 text-slate-500 text-lg leading-relaxed">${data.overview}</p>`
                  : `<div class="flex p-6">
                  <img src="${BASE_URL_DEFAULTS}" alt="${data.title} loading='lazy'" class="rounded mr-6 w-60">
                  <div>
                    <h4 class="mb-4 text-slate-500 text-lg leading-relaxed"><span class="font-semibold">Original title:</span> ${data.original_title}</h4>
                    <p class="my-4 text-slate-500 text-lg leading-relaxed"><span class="font-semibold">Release date:</span> ${data.release_date}.</p>
                    <p class="my-4 text-slate-500 text-lg leading-relaxed"><span class="font-semibold">Genres of cinema:</span> ${genres}.</p>
                    <p class="my-4 text-slate-500 text-lg leading-relaxed"><span class="font-semibold">Tagline:</span> ${data.tagline}.</p>
                  </div>
                  </div>
                  <p class="p-6 text-slate-500 text-lg leading-relaxed">${data.overview}</p>`;
     
      refs.overviewId.insertAdjacentHTML("beforeend", markup);
      
      const setAtrToFavoriteBtn = refs.favoriteBtn.setAttribute("current-Id", currentId)
      const getAtrToFavoriteBtn = refs.favoriteBtn.getAttribute("current-Id")
    
      refs.favoriteBtn.removeEventListener("click", () => {
        appendValueToStorage('todays-values', getAtrToFavoriteBtn);
      });
       refs.favoriteBtn.addEventListener("click", () => {
        appendValueToStorage('todays-values', getAtrToFavoriteBtn);
      });
           
    })
    .catch((error) => console.log(error));
    }));

refs.closeModalBtn.addEventListener("click", onToggle);
refs.closeModalBtn.removeEventListener("click", onToggle, true);

function onToggle() {
  refs.modal.classList.toggle("hidden");
  refs.modal.classList.remove('animate-fade-in');
}

function clearMovie() {
  refs.listMovie.innerHTML = "";
}
