const mongoose = require("mongoose");
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
const { Recipe } = require("./models/recipe");
const { User } = require("./models/user");

mongoose.connect("mongodb://localhost:27017/Mams", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection failed:", err));

app.get("/", async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    const randomRecipes = getRandomRecipes(allRecipes, 2);

    const user = await User.findOne(); // example: get first user

    res.render("home", { recipes: randomRecipes, user: user });
  } catch (err) {
    res.status(500).send("Error loading home page");
  }
});


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


app.get("/recipeViewed/:title", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ title: req.params.title });
    if (!recipe) return res.status(404).send("Recipe not found");

    const user = await User.findOne();
    user.lastViewed = recipe; // If you want to track last viewed

    res.render("recipeViewed", { recipe, user });
  } catch (err) {
    res.status(500).send("Error loading recipe");
  }
});
