const refs = {
  message: document.getElementById("message"),
};

export default function appendValueToStorage(key, value) {
  try {
    let values = JSON.parse(localStorage.getItem(key));
    if (values === null || values === "" || values === [""]) {
      values = [];
    }

    if (values.includes(value)) {
      const markup = `<div id="message" class="flex text-white px-6 py-4 border-0 rounded fixed top-7 right-60 w-96 h-20 mb-4 bg-red-500 z-[102]">
          <span class="text-xl inline-block mr-5 align-middle">
            <i class="fas fa-bell"></i>
          </span>
          <span class="inline-block align-middle mr-8">
            <b>This movie is already in the library.</b> 
          </span>
          <button class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none" onclick="closeAlert(event)">
            <span>×</span>
          </button>
        </div>`;

      setTimeout(() => {
        document
          .querySelector("body")
          .insertAdjacentHTML("beforebegin", markup);
      }, 0);
      
    } else {
      values.push(value);

      localStorage.setItem(key, JSON.stringify(values));

      const markup = `<div id="message" class="flex text-white px-6 py-4 border-0 rounded fixed top-7 right-60 w-96 h-20 mb-4 bg-lime-500 z-[102]">
      <span class="text-xl inline-block mr-5 align-middle">
        <i class="fas fa-bell"></i>
      </span>
      <span class="inline-block align-middle mr-8">
        <b>Your favorite movie has been successfully added to your library.</b> 
      </span>
      <button class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none" onclick="closeAlert(event)">
        <span>×</span>
      </button>
    </div>`;

      setTimeout(() => {
        document
          .querySelector("body")
          .insertAdjacentHTML("beforebegin", markup);
      }, 0);
    }
  } catch (error) {
    console.error(error);
  }
}
