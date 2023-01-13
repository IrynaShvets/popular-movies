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
  searchContainer: document.getElementById("search-container"),
  modalBackdrop: document.querySelector('.modal-backdrop'),
};

const apiService = new ApiService();
console.log(apiService)
const loadMoreBtn = new LoadMoreBtn({
  selector: "[load-more]",
  hidden: true,
});

// let toggleMarkup = true;

refs.searchForm.addEventListener("submit", onSearchForm);
loadMoreBtn.refs.button.addEventListener("click", appendMoviesMarkup);

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
        const markup = `<span id="message" class="text-red-500 grow-0">Sorry, but nothing was found for your request.</span>`;
        refs.searchContainer.insertAdjacentHTML("beforeend", markup);
        setTimeout(() => {
          document.getElementById("message").remove();
        }, 4000);
      }

      if (data.length >= 20 || data.length >= 1) {
        loadMoreBtn.show();
        clearMovie();
        data
          .map(({ title, backdrop_path, id }) => {
              const markup = backdrop_path && backdrop_path !== null
              ? `<li movie-id=${id} id="modalid" class="h-auto">
                    <img src="https://image.tmdb.org/t/p/original/${backdrop_path}" alt="${title} loading='lazy'" class="rounded-t-lg">
                    <div class="p-5 bg-gradient-to-r from-pink-200 to-sky-200 rounded-b-lg">
                        <p class="text-xl text-slate-600">${title}</p>
                    </div>
                </li>`
              : `<li movie-id=${id} id="modalid" class="h-auto">
                    <img src="https://i.gyazo.com/c43bcb8fc7e50c57740731c2c2e301ef.jpg" alt="${title}" loading='lazy' class="rounded-t-lg">
                    <div class="p-5 bg-gradient-to-r from-pink-200 to-sky-200 rounded-b-lg">
                        <p class="text-xl text-slate-600">${title}</p>
                    </div>
                </li>`;
               refs.listMovie.insertAdjacentHTML("beforeend", markup);
              // var els = document.querySelectorAll('#modalid');
              //   for (var i=0; i < els.length; i++) {
              //       els[i].setAttribute("movie-id", `${id}`);
              // }
             // document.querySelectorAll("#modalid").setAttribute("movie-id", id);
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
  apiService.query = refs.searchQueryInput.value.trim();
  apiService.resetPage();
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

  await apiService
    .fetchSearchMovies()
    .then((movies) => {
      const data = movies.results;
      movies.total_pages === movies.page
        ? loadMoreBtn.hide()
        : loadMoreBtn.show();
      console.log(data);
      if (data.length === 0 && data.length !== "") {
        loadMoreBtn.hide();

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
          clearMovie();
          
          data
            .map((movie) => {
              const markup =
              movie.backdrop_path && movie.backdrop_path !== null
                  ? `<li id="modalid" class="h-auto">
                        <img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" alt="${movie.title} loading='lazy'" class="rounded-t-lg">
                        <div class="p-5 bg-gradient-to-r from-pink-200 to-sky-200 rounded-b-lg">
                            <p class="text-xl text-slate-600">${movie.title}</p>
                        </div>
                    </li>`
                  : `<li id="modalid" class="h-auto">
                        <img src="https://i.gyazo.com/c43bcb8fc7e50c57740731c2c2e301ef.jpg" alt="${movie.title}" loading='lazy' class="rounded-t-lg">
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
          refs.modal.classList.toggle("hidden");
          refs.overviewId.innerHTML = "";
          const currentItem = e.target.parentNode;
          const currentId = currentItem.getAttribute("movie-id")
          apiService.idMovie = currentId;

    apiService.fetchMovieDetails()
    .then((data) => {
    
      if (data === "") {
        return;
      }
      if (!data || !data.id) {
        return;
      }
      
      const genres = data.genres.map(el => el.name)
      console.log(genres)
      document.getElementById("modal-title").textContent = `${data.title}`;
      const markup = `
      <img src="https://image.tmdb.org/t/p/w500/${data.backdrop_path}" alt="${data.title} loading='lazy'" class="rounded-t-lg">
                        <p class="my-4 text-slate-500 text-lg leading-relaxed">${data.overview}</p>
                    `;
      refs.overviewId.insertAdjacentHTML("beforeend", markup);
    })
    .catch((error) => console.log(error));
    }));

refs.closeModalBtn.addEventListener("click", () => {
  refs.modal.classList.toggle("hidden");
});

function clearMovie() {
  refs.listMovie.innerHTML = "";
}

function toggleMarkup() {
  // 
}

