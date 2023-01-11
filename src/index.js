const refs = {
  listMovie: document.getElementById("listMovie"),
  btnSeeMore: document.getElementById("btnSeeMore"),
  btnCast: document.getElementById("btnCast"),
  openModalBtn: document.getElementById("open-modal-id"),
  closeModalBtn: document.getElementById("close-modal-id"),
  modal: document.getElementById("modal"),
  overviewId: document.getElementById("overview-id"),
};

const API_KEY = "d3c00761eff125b45afbcd52d8235bc7";
const BASE_URL = "https://api.themoviedb.org/3/";
const BASE_URL_IMAGE = "https://image.tmdb.org/t/p/original";

const fetchPopularMovie = async () => {
  try {
    const response = await fetch(`${BASE_URL}movie/popular?api_key=${API_KEY}`);
    const movies = await response.json();
    return movies;
  } catch (error) {
    console.log(error);
  }
};

appendMoviesMarkup();

async function appendMoviesMarkup() {
  fetchPopularMovie()
    .then((movie) => {
      const data = movie.results;
      if (data === "") {
        return;
      }
      console.log(data);
      data.map(({ title, backdrop_path }) => {
        console.log(title);

        const markup = `<li class="h-auto">
                    <img src="https://image.tmdb.org/t/p/original/${backdrop_path}" alt="${title}" class="rounded-t-lg">
                    <div class="p-5 bg-gradient-to-r from-pink-200 to-sky-200 rounded-b-lg">
                        <p class="text-xl text-slate-600">${title}</p>
                        <button type="button" class="bg-pink-700 rounded-lg px-4 py-2 uppercase text-white outline-none focus:outline-none ease-linear transition-all duration-1500 shadow hover:shadow-lg" id="open-modal-id">See more</button>
                        <button type="button" class="bg-sky-700 rounded-lg px-4 py-2 uppercase text-white">Cast</button>
                    </div>
                </li>`;
               
                refs.openModalBtn.setAttribute("id", "open-modal-id");
        refs.listMovie.insertAdjacentHTML("beforeend", markup);
      });
    })
    .catch((error) => console.log(error));
}

if (refs.openModalBtn) {
  refs.openModalBtn.addEventListener("click", toggleModal);
}
refs.closeModalBtn.addEventListener("click", toggleModal);

function toggleModal() {
  refs.modal.classList.toggle("hidden");
}

async function fetchMovieDetails() {
  const url = `${BASE_URL}movie/157336?api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const movie = await response.json();
    return movie;
  } catch (error) {
    console.log(error);
  }
}

appendMoviesDetails();

async function appendMoviesDetails() {
  fetchMovieDetails()
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
