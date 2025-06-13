
require('dotenv').config();
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/users');
const { Recipe } = require("./models/recipe");
const { User } = require("./models/user");
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');




const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'yourSuperSecretKey', 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB || "mongodb://localhost:27017/Mama-s-spaghetti"
  }),
  cookie: { secure: false,
           httpOnly: true,
          sameSite: 'lax',
           maxAge: 1000 * 60 * 60  
          }
}));
app.set('view engine', 'ejs');

app.use('/api/users', userRoutes);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/users', userRoutes);
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/Mama-s-spaghetti", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection failed:", err));


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    req.session.userId = user._id;
    res.send("Logged in!");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Logout failed");
    res.send("Logged out!");
  });
});

app.use(async (req, res, next) => {
  if (req.session.userId) {
    res.locals.user = await User.findById(req.session.userId);
  } else {
    res.locals.user = null;
  }
  next();
});


app.get("/", async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    const { getRandomRecipes } = require('./utils/helpers');
    const user = await User.findOne(); 

    res.render("home", { recipes: randomRecipes, user: user });
  } catch (err) {
    res.status(500).send("Error loading home page");
  }
});

app.get("/profile", async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    const randomRecipes = getRandomRecipes(allRecipes, 1);

    const user = await User.findOne(); 

    res.render("profile", { recipes: randomRecipes, user: user });
  } catch (err) {
    res.status(500).send("Error loading profile");
  }
});


app.get("/recipes", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;

 try {
    const [total, recipes, user] = await Promise.all([
      Recipe.countDocuments(),
      Recipe.find().skip((page - 1) * limit).limit(limit),
      User.findOne()
    ]);

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
    const [recipe, user] = await Promise.all([
      Recipe.findOne({ title: req.params.title }),
      User.findOne()
    ]);

    if (!recipe) return res.status(404).send("Recipe not found");

    user.lastViewed = recipe;
    await user.save();

    res.render("recipeViewed", { recipe, user });
  } catch (err) {
    res.status(500).send("Error loading recipe");
  }
});

