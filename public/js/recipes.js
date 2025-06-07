var searchinp = document.getElementById("searcher");
var ingsearchinp = document.getElementById("ingSearcher");
var displayer = document.querySelector(".recipes .row");

const recipes = [
  {
    title: "Cheesecake",
    img: "/images/Cheesecake.jpeg",
    url: "/recipes/cheesecake",
    ingrediants: "Salt Pepper",
  },
  {
    title: "Banana Tart",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
    ingrediants: "Sugar Banana",
  },
  {
    title: "Banana Tart",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
    ingrediants: "Salt Pepper",
  }
];

function applyFilters() {
  const val = searchinp.value.toLowerCase();
  const intval = ingsearchinp.value.toLowerCase();

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(val) &&
    r.ingrediants.toLowerCase().includes(intval)
  );

  updateDisplay(filtered);
}

searchinp.addEventListener("input", applyFilters);
ingsearchinp.addEventListener("input", applyFilters);

function updateDisplay(filteredRecipes) {
  displayer.innerHTML = "";

  filteredRecipes.forEach((recipe) => {
    displayer.innerHTML += `
      <div class="col-xl-4 col-md-6 recipe-card">
        <div class="inner">
          <div class="card shadow">
            <div class="img-box overflow-hidden">
              <img src="${recipe.img}" alt="${recipe.title}">
            </div>
            <div class="card-body">
              <a href="${recipe.url}" class="text-black text-decoration-none d-flex justify-content-between">
                <h5 class="card-title">${recipe.title}</h5>
                <span>View Recipe <i class="fa-solid fa-arrow-right"></i></span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
  });
}
