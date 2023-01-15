import LoadMoreBtn from "./helpers/loadMore.js";
import ApiService from "./services/api.js";
import scroll from "./helpers/scroll.js";
import appendValueToStorage from "./helpers/localStorage.js";

const refs = {
  listMovie: document.getElementById("listMovie"),
  closeModalBtn: document.getElementById("close-modal-id"),
  modal: document.getElementById("modal"),
  overviewId: document.getElementById("overview-id"),
  loadMoreId: document.getElementById("load-more-id"),
  searchForm: document.getElementById("search-form"),
  searchQueryInput: document.querySelector('[name="searchQuery"]'),
  searchContainer: document.getElementById("search-container"),
  modalBackdrop: document.querySelector(".modal-backdrop"),
  favoriteBtn: document.getElementById("favorite-btn"),
  loaderId: document.getElementById("loader-id"),
};

const BASE_URL_IMAGE = "https://image.tmdb.org/t/p/original";
const BASE_URL_IMAGE_W500 = "https://image.tmdb.org/t/p/w500";
const BASE_URL_DEFAULTS =
  "https://i.gyazo.com/c43bcb8fc7e50c57740731c2c2e301ef.jpg";

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
        loadMoreBtn.refs.button.removeEventListener(
          "click",
          appendMoviesMarkup
        );
        const markup = `<span id="message" class="text-red-500 grow-0">Sorry, but nothing was found for your request.</span>`;
        refs.searchContainer.insertAdjacentHTML("beforeend", markup);
        setTimeout(() => {
          document.getElementById("message").remove();
        }, 4000);
      }

      if (data.length >= 20) {
        loadMoreBtn.show();
        loadMoreBtn.refs.button.removeEventListener("click", onSearchForm);
        loadMoreBtn.refs.button.addEventListener("click", appendMoviesMarkup);

        clearMovie();
        data
          .map(({ title, backdrop_path, id }) => {
            const markup =
              backdrop_path && backdrop_path !== null
                ? `<li movie-id=${id} id="modalid" class="relative w-[550px] h-[370px]">
                    <img src="${BASE_URL_IMAGE}${backdrop_path}" alt="${title} loading='lazy'" class="rounded block w-[550px] h-[370px]">
                    <p class="absolute left-2 bottom-2 text-xl text-slate-200">${title}</p>
                </li>`
                : `<li movie-id=${id} id="modalid" class="relative w-[550px] h-[370px]">  
                    <img src="${BASE_URL_DEFAULTS}" alt="${title}" loading='lazy' class="rounded block w-[550px] h-[370px]">
                    <p class="absolute left-2 bottom-2 text-xl text-slate-200">${title}</p>
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
  apiService.resetPage();
  apiService.query = refs.searchQueryInput.value.trim();

  await apiService
    .fetchSearchMovies()
    .then((movies) => {
      const data = movies.results;

      if (movies.total_pages === movies.page) {
        loadMoreBtn.hide();
        loadMoreBtn.refs.button.removeEventListener("click", onSearchForm);
      } else {
        loadMoreBtn.show();
        loadMoreBtn.refs.button.removeEventListener(
          "click",
          appendMoviesMarkup
        );
        loadMoreBtn.refs.button.addEventListener("click", onSearchForm);
      }

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
        return;
      }

      if (data.length >= 1) {
        loadMoreBtn.show();
        loadMoreBtn.refs.button.removeEventListener(
          "click",
          appendMoviesMarkup
        );
        apiService.resetPage();
        loadMoreBtn.refs.button.addEventListener("click", onSearchForm);
        clearMovie();

        data
          .map((movie) => {
            const markup =
              movie.backdrop_path && movie.backdrop_path !== null
                ? `<li movie-id=${movie.id} id="modalid" class="relative w-[550px] h-[370px]">
              <img src="${BASE_URL_IMAGE}${movie.backdrop_path}" alt="${movie.title} loading='lazy'" class="rounded block w-[550px] h-[370px]">
              <p class="absolute left-2 bottom-2 text-xl text-slate-200">${movie.title}</p>
              </li>`
                : `<li movie-id=${movie.id} id="modalid" class="relative w-[550px] h-[370px]">  
              <img src="${BASE_URL_DEFAULTS}" alt="${movie.title}" loading='lazy' class="rounded block w-[550px] h-[370px]">
              <p class="absolute left-2 bottom-2 text-xl text-slate-200">${movie.title}</p>
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
document.querySelectorAll("#listMovie").forEach((i) =>
  i.addEventListener("click", (e) => {
    onToggle();
    refs.overviewId.innerHTML = "";
    const currentItem = e.target.parentNode;
    const currentId = currentItem.getAttribute("movie-id");
    apiService.idMovie = currentId;

    apiService
      .fetchMovieDetails()
      .then((data) => {
        if (!data || !data.id) {
          return;
        }
        const genres = data?.genres?.map((el) => el.name).join(", ");
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
        refs.favoriteBtn.setAttribute("current-Id", currentId);
      })
      .catch((error) => console.log(error));
  })
);

refs.favoriteBtn.addEventListener("click", () => {
  let getAtrToFavoriteBtn = refs.favoriteBtn.getAttribute("current-Id");
  if (getAtrToFavoriteBtn > 0) {
    appendValueToStorage("todays-values", getAtrToFavoriteBtn);
  }
});

refs.closeModalBtn.addEventListener("click", onToggle);
refs.closeModalBtn.removeEventListener("click", onToggle, true);

function onToggle() {
  refs.modal.classList.toggle("hidden");
  refs.modal.classList.remove("animate-fade-in");
}

function clearMovie() {
  refs.listMovie.innerHTML = "";
}
