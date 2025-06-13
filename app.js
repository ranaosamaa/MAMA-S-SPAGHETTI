const mongoose = require("mongoose");
const express = require('express');
const userRoutes = require('./routes/users');
const { Recipe } = require("./models/recipe");
const { User } = require("./models/user");

const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/users', userRoutes);
app.set('view engine', 'ejs');


mongoose.connect("mongodb://localhost:27017/Mams", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection failed:", err));


// home
app.get("/", async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    const { getRandomRecipes } = require('./utils/helpers');
    const user = await User.findOne(); // example: get first user

    res.render("home", { recipes: randomRecipes, user: user });
  } catch (err) {
    res.status(500).send("Error loading home page");
  }
});

//profile
app.get("/profile", async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    const randomRecipes = getRandomRecipes(allRecipes, 1);

    const user = await User.findOne(); // Change this logic later to match logged-in user

    res.render("profile", { recipes: randomRecipes, user: user });
  } catch (err) {
    res.status(500).send("Error loading profile");
  }
});

// recipes
app.get("/recipes", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;

  try {
    const total = await Recipe.countDocuments();
    const recipes = await Recipe.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);
    const user = await User.findOne();

    res.render("recipes", {
      recipes,
      currentPage: page,
      totalPages,
      user,
    });
  } catch (err) {
    res.status(500).send("Error loading recipes");
  }
});

//one recipe
app.get("/recipeViewed/:title", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ title: req.params.title });
    if (!recipe) return res.status(404).send("Recipe not found");

    // to track last viewed
    const user = await User.findOne();
    user.lastViewed = recipe;
    await user.save();

    res.render("recipeViewed", { recipe, user });
  } catch (err) {
    res.status(500).send("Error loading recipe");
  }
});

