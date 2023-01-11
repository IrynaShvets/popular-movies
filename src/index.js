import LoadMoreBtn from "./helpers/loadMore.js";
import ApiService from "./services/api.js";
import scroll from "./helpers/scroll.js";

const refs = {
  listMovie: document.getElementById("listMovie"),
  btnSeeMore: document.getElementById("btnSeeMore"),
  btnCast: document.getElementById("btnCast"),
  openModalBtn: document.getElementById("open-modal-id"),
  closeModalBtn: document.getElementById("close-modal-id"),
  modal: document.getElementById("modal"),
  overviewId: document.getElementById("overview-id"),
  loadMoreId: document.getElementById("load-more-id"),
};

const apiService = new ApiService();

const loadMoreBtn = new LoadMoreBtn({
  selector: "[load-more]",
  hidden: true,
});

appendMoviesMarkup();
async function appendMoviesMarkup() {
  await apiService
    .fetchPopularMovie()
    .then((movie) => {
      const data = movie.results;
      console.log(data);
      if (data === "") {
        return;
      }
      if (data.length === 0) {
        loadMoreBtn.hide();
        return;
      } else if (data.length >= 20) {
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

loadMoreBtn.refs.button.addEventListener("click", appendMoviesMarkup);
refs.loadMoreId.addEventListener("click", appendMoviesMarkup);

if (refs.openModalBtn) {
  refs.openModalBtn.addEventListener("click", toggleModal);
}
refs.closeModalBtn.addEventListener("click", toggleModal);

function toggleModal() {
  refs.modal.classList.toggle("hidden");
}

appendMoviesDetails();
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
