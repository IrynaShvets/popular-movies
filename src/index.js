import LoadMoreBtn from "./helpers/loadMore.js";
import ApiService from "./services/api.js";
import scroll from "./helpers/scroll.js";
import appendValueToStorage from "./helpers/localStorage.js";
import { genres } from "./helpers/genres.js";

const refs = {
  listMovie: document.getElementById("listMovie"),
  closeModalBtn: document.getElementById("close-modal-id"),
  modal: document.getElementById("modal"),
  overviewId: document.getElementById("overview-id"),
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
  selector1: "[load-more1]",
  hidden: true,
});

function searchPagePrev() {
  if (apiService.currentPage > 1) {
    apiService.decrementPage();
    onSearchForm();
  }
}
function searchPageNext() {
  apiService.incrementPage();
  onSearchForm();
}

function popularPagePrev() {
  if (apiService.currentPage > 1) {
    apiService.decrementPage();
    appendMoviesMarkup();
  }
}
function popularPageNext() {
  apiService.incrementPage();
  appendMoviesMarkup();
}

function yearPagePrev() {
  if (apiService.currentPage > 1) {
    apiService.decrementPage();
    getMoviesOfSelectedYear();
  }
}
function yearPageNext() {
  apiService.incrementPage();
  getMoviesOfSelectedYear();
}

function genrePagePrev() {
  if (apiService.currentPage > 1) {
    apiService.decrementPage();
    getMoviesOfSelectedGenre();
  }
}
function genrePageNext() {
  apiService.incrementPage();
  getMoviesOfSelectedGenre();
}

refs.searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  apiService.resetPage();
  onSearchForm();
});

appendMoviesMarkup();

async function appendMoviesMarkup() {
  await apiService
    .fetchPopularMovie()
    .then((movies) => {
      const data = movies.results;

      if (data.length === 0) {
        loadMoreBtn.hide();
        loadMoreBtn.hide1();
        loadMoreBtn.refs.button.removeEventListener("click", popularPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", popularPagePrev);

        const markup = `<span id="message" class="text-red-500 grow-0">Sorry, but nothing was found for your request.</span>`;
        refs.searchContainer.insertAdjacentHTML("beforeend", markup);
        setTimeout(() => {
          document.getElementById("message").remove();
        }, 4000);
      }

      if (data.length >= 20) {
        loadMoreBtn.show();
        loadMoreBtn.show1();

        loadMoreBtn.refs.button.removeEventListener("click", searchPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", searchPagePrev);
        loadMoreBtn.refs.button.removeEventListener("click", yearPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", yearPagePrev);
        loadMoreBtn.refs.button.removeEventListener("click", genrePageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", genrePagePrev);

        loadMoreBtn.refs.button.addEventListener("click", popularPageNext);
        loadMoreBtn.refs1.button.addEventListener("click", popularPagePrev);

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

async function onSearchForm() {
  if (refs.searchQueryInput.value === "") {
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

  await apiService
    .fetchSearchMovies()
    .then((movies) => {
      const data = movies.results;

      if (data.length === 0 || movies.total_pages === movies.page) {
        loadMoreBtn.hide();
        loadMoreBtn.hide1();

        loadMoreBtn.refs.button.removeEventListener("click", searchPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", searchPagePrev);

        if (data.length === 0) {
          const markup = `
     <span id="message" class="text-red-500 grow-0">Sorry, but nothing was found for your request.</span>
 `;
          refs.searchContainer.insertAdjacentHTML("beforeend", markup);
          setTimeout(() => {
            document.getElementById("message").remove();
          }, 4000);
          refs.searchQueryInput.value = "";
        }
        return;
      }

      if (data.length >= 1 || movies.total_pages === movies.page) {
        loadMoreBtn.show();
        loadMoreBtn.show1();
        loadMoreBtn.refs.button.removeEventListener("click", popularPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", popularPagePrev);
        loadMoreBtn.refs.button.removeEventListener("click", yearPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", yearPagePrev);
        loadMoreBtn.refs.button.removeEventListener("click", genrePageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", genrePagePrev);

        loadMoreBtn.refs.button.addEventListener("click", searchPageNext);
        loadMoreBtn.refs1.button.addEventListener("click", searchPagePrev);

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

  document.querySelector("#genresId").addEventListener("change", renderMarkupGenres);
  document.querySelector("#genresId").removeEventListener("change", renderMarkupGenres, true);
  
  function renderMarkupGenres(event) {
  event.preventDefault();
  apiService.resetPage();
  let genre = event.target.value;
  apiService.genre = genre;
  getMoviesOfSelectedGenre();
}

  document.querySelector("#yearsId").addEventListener("change", renderMarkupYears);
  document.querySelector("#yearsId").removeEventListener("change", renderMarkupYears, true);
  
  function renderMarkupYears(event) {
  event.preventDefault();
  apiService.resetPage();
  let year = event.target.value;
  apiService.year = Number(year);
  getMoviesOfSelectedYear();
}

async function getMoviesOfSelectedYear() {
  await apiService
    .fetchMoviesOfSelectedYear()
    .then((movies) => {
      const data = movies.results;

      if (data.length === 0) {
        loadMoreBtn.hide();
        loadMoreBtn.hide1();

        loadMoreBtn.refs.button.removeEventListener("click", yearPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", yearPagePrev);
        return;
      }

        loadMoreBtn.show();
        loadMoreBtn.show1();
        loadMoreBtn.refs.button.removeEventListener("click", popularPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", popularPagePrev);
        loadMoreBtn.refs.button.removeEventListener("click", searchPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", searchPagePrev);
        loadMoreBtn.refs.button.removeEventListener("click", genrePageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", genrePagePrev);

        loadMoreBtn.refs.button.addEventListener("click", yearPageNext);
        loadMoreBtn.refs1.button.addEventListener("click", yearPagePrev);

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
    })
    .catch((error) => console.log(error))
    .finally(() => {
      scroll();
    });
}

async function getMoviesOfSelectedGenre() {
  await apiService
    .fetchMoviesOfSelectedGenre()
    .then((movies) => {
      const data = movies.results;

      if (data.length === 0) {
        loadMoreBtn.hide();
        loadMoreBtn.hide1();

        loadMoreBtn.refs.button.removeEventListener("click", genrePageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", genrePagePrev);
        return;
      }

        loadMoreBtn.show();
        loadMoreBtn.show1();
        loadMoreBtn.refs.button.removeEventListener("click", popularPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", popularPagePrev);
        loadMoreBtn.refs.button.removeEventListener("click", searchPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", searchPagePrev);
        loadMoreBtn.refs.button.removeEventListener("click", yearPageNext);
        loadMoreBtn.refs1.button.removeEventListener("click", yearPagePrev);

        loadMoreBtn.refs.button.addEventListener("click", genrePageNext);
        loadMoreBtn.refs1.button.addEventListener("click", genrePagePrev);

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
    })
    .catch((error) => console.log(error))
    .finally(() => {
      scroll();
    });
}

selectedYears();
function selectedYears() {
  let startYear = 1907;
  let endYear = new Date().getFullYear();
  const yearsList = () => {
    let str = `<option value="" selected>All years</option>`;
    for (let i = endYear; i >= startYear; i -= 1) {
      str += `<option value="${i}">${i}</option>`;
    }
    return str;
  };
  document.querySelector("#yearsId").innerHTML = yearsList();
}

selectedGenres();
function selectedGenres() {
  const genresList = () => {
    let select = `<option value="" selected>All genres</option>`;
    genres.map(el => {
      select += `<option value="${el.id}">${el.name}</option>`;
    })
    return select;
  };
  document.querySelector("#genresId").innerHTML = genresList();
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
        console.log(data);
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

refs.favoriteBtn.addEventListener("click", onFavoriteAttribute);
refs.favoriteBtn.removeEventListener("click", onFavoriteAttribute, true);

function onFavoriteAttribute() {
  let getAtrToFavoriteBtn = refs.favoriteBtn.getAttribute("current-Id");
  if (getAtrToFavoriteBtn > 0) {
    appendValueToStorage("todays-values", getAtrToFavoriteBtn);
  }
}

refs.closeModalBtn.addEventListener("click", onToggle);
refs.closeModalBtn.removeEventListener("click", onToggle, true);

function onToggle() {
  refs.modal.classList.toggle("hidden");
  refs.modal.classList.remove("animate-fade-in");
}

function clearMovie() {
  refs.listMovie.innerHTML = "";
}
