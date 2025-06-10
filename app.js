const express = require("express");
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");
var recipes = [
  {
    title: "Cheesecake",
    img: "/images/Cheesecake.jpeg",
    url: "/recipes/cheesecake",
    ingrediants: [
      "Salt",
      "Pepper"
    ],
    description:"asdsdasasdasdasda"
  },
  {
    title: "Banana Tart",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
        ingrediants: [
      "Salt",
      "Pepper"
    ],
    description:"asdsdasasdasdasda"
  },
  {
    title: "Banana Tart2",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
        ingrediants: [
      "Sugar",
      "Banana"
    ],
    description:"asdsdasasdasdasda"
  },
  {
    title: "Banana Tart2",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
        ingrediants: [
      "Sugar",
      "Banana"
    ],
    description:"asdsdasasdasdasda"
  },
  {
    title: "Banana Tart2",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
        ingrediants: [
      "Sugar",
      "Banana"
    ],
    description:"asdsdasasdasdasda"
  },
  {
    title: "Banana Tart2",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
        ingrediants: [
      "Sugar",
      "Banana"
    ],
    description:"asdsdasasdasdasda"
  },
  {
    title: "Banana Tart2",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
        ingrediants: [
      "Sugar",
      "Banana"
    ],
    description:"asdsdasasdasdasda"
  },
  {
    title: "Banana Tart2",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
        ingrediants: [
      "Sugar",
      "Banana"
    ],
    description:"asdsdasasdasdasda"
  },
  {
    title: "Banana Tart2",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
        ingrediants: [
      "Sugar",
      "Banana"
    ],
    description:"asdsdasasdasdasda"
  },
  {
    title: "Banana Tart2",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
        ingrediants: [
      "Sugar",
      "Banana"
    ],
    description:"asdsdasasdasdasda"
  },
  {
    title: "Banana Tart2",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
        ingrediants: [
      "Sugar",
      "Banana"
    ],
    description:"asdsdasasdasdasda"
  },
  {
    title: "Banana Tart2",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
        ingrediants: [
      "Sugar",
      "Banana"
    ],
    description:"asdsdasasdasdasda"
  }
];
const fakeUser = {
    name: "3azima",
    img: "/images/azima.jpeg",
    email: "asd@gmail.com",
    password:"12345",
    phone:"0123456789",
    favs:[
    {
    title: "Cheesecake",
    img: "/images/Cheesecake.jpeg",
    url: "/recipes/cheesecake",
    },
    {
    title: "Banana Tart",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
    }
  ],
  admin:false,
  adds:[
        {
    title: "Banana Tart",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
    }
  ],
  lastViewed:{}
};
const fakeUser2 = {
  name: "John Doe",
  img: "/images/profile-pic.jpg",
  email: "asd@gmail.com",
  password:"12345",
  phone:"0123456789",
  favs:[],
  adds:[],
  lastViewed:
    recipes[0]
  ,
  admin:true
};

function getRandomRecipes(arr,x) {
  const newArr = [];
  for (var i = 0; i < x; i++) {
    let n;
    do {
      n = arr[Math.floor(Math.random() * arr.length)];
    } while (newArr.includes(n));
    newArr.push(n);
  }
  return newArr;
}

app.get("/", (req, res) => {
  const randomRecipes = getRandomRecipes(recipes,2);
  res.render("home", { recipes: randomRecipes,user:fakeUser });
});
app.get("/profile", (req, res) => {
  const randomRecipes = getRandomRecipes(recipes,1);
  res.render("profile", { recipes: randomRecipes,user: fakeUser });
});
app.get('/recipes', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedRecipes = recipes.slice(startIndex, endIndex);

  const totalPages = Math.ceil(recipes.length / limit);

  res.render('recipes', {
    recipes: paginatedRecipes,
    currentPage: page,
    totalPages: totalPages,
    user: fakeUser2
  });
});
app.get("/recipeViewed/:title", (req, res) => {
  const recipetitle = req.params.title;
  const recipe = recipes.find(r => r.title == recipetitle);
  if (!recipe) {
    return res.status(404).send("Recipe not found");
  }
  fakeUser.lastViewed = recipe;
  res.render("recipeViewed", { recipe: recipe,user: fakeUser });
});
app.get("/signLogin", (req, res) => {
  res.render("signLogin",{user: null });
});
app.get("/forgotPass", (req, res) => {
  res.render("forgotPass",{user: null,sent: false,verified: false });
});
app.get("/adminDashboard", (req, res) => {
  res.render("adminDashboard", {user:fakeUser2 });
});
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
