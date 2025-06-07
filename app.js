const express = require("express");
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

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
  adds:[
        {
    title: "Banana Tart",
    img: "/images/Banana Tart.jpeg",
    url: "/recipes/banana-tart",
    }
  ]
};
const fakeUser2 = {
  name: "John Doe",
  img: "/images/profile-pic.jpg",
  email: "asd@gmail.com",
  password:"12345",
  phone:"0123456789",
  favs:[],
  adds:[]
};
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
  res.render("home", { recipes: randomRecipes,user:null });
});
app.get("/profile", (req, res) => {
  const randomRecipes = getRandomRecipes(recipes,1);
  res.render("profile", { recipes: randomRecipes,user: fakeUser2 });
});
app.get("/recipes", (req, res) => {
  res.render("recipes", { recipes: recipes,user: null });
});
app.get("/signLogin", (req, res) => {
  res.render("signLogin",{user: null });
});
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
