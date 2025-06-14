const { User } = require('../models/user');
const express = require('express');
const multer = require('multer');
const { Recipe } = require('../models/recipe');
const mongoose = require('mongoose');


//delete
exports.deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

    if (!deletedRecipe) {
      return res.status(404).send('Recipe not found');
    }

    await User.findByIdAndUpdate(
        req.user.userId,
      { $pull: { adds: { title: deletedRecipe.title } }}
    );


    res.redirect('/recipes');
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.status(500).send('Error deleting recipe');
  }
};


//edit
exports.editRecipe = async (req, res) => {
  try {
    const { RecipeName, Ingredients, RecipeDescription } = req.body;
    const recipeId = req.params.id;

    const ingredientsArray = Ingredients.split(',').map(item => item.trim());
    if (!RecipeName || !Ingredients || !RecipeDescription) {
      return res.status(400).send('All fields are required.');
    }

     const existing = await Recipe.findOne({ title: RecipeName });
    if (existing && existing._id.toString() !== recipeId) {
      return res.status(400).send('Another recipe with this title already exists.');
    }


    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      {
        title: RecipeName,
        ingrediants: ingredientsArray,
        description: RecipeDescription,
        url: '/recipes/' + RecipeName.toLowerCase().replace(/\s+/g, '-')
      },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).send('Recipe not found');
    }

    // Update recipe in local array
    const index = recipes.findIndex(r => r._id.toString() === recipeId);
    if (index !== -1) {
      recipes[index] = updatedRecipe;
    }

    res.redirect('/profile');
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.status(500).send('Error updating recipe');
  }
};


//create
exports.addRecipe, upload.single('RecipeImg'), async (req, res) => {
  try {
    const { RecipeName, Ingredients, RecipeDescription } = req.body;
    
    if (!req.file) {
      return res.status(400).send('Image is required');
    }

    const ingredientsArray = Ingredients.split(',').map(item => item.trim());

    const newRecipe = await Recipe.create({
      title: RecipeName,
      img: '/images/' + req.file.filename,
      ingrediants: ingredientsArray,
      description: RecipeDescription,
      url: '/recipes/' + RecipeName.toLowerCase().replace(/\s+/g, '-')
    });

    // Update user's adds array
    await User.findOneAndUpdate(
      { email: fakeUser2.email },
      { 
        $push: { 
          adds: {
            title: RecipeName,
            img: '/images/' + req.file.filename,
            url: '/recipes/' + RecipeName.toLowerCase().replace(/\s+/g, '-')
          }
        }
      }
    );

    // Add to local recipes array
    recipes.push({
      title: RecipeName,
      img: '/images/' + req.file.filename,
      url: '/recipes/' + RecipeName.toLowerCase().replace(/\s+/g, '-'),
      ingrediants: ingredientsArray,
      description: RecipeDescription
    });

    res.redirect('/profile');
  } catch (err) {
    console.error('Error adding recipe:', err);
    res.status(500).send('Error adding recipe');
  }
};




// Admin
exports.adminDeleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndRemove(req.params.id);
    if (!recipe) return res.status(404).send('Recipe not found');
    res.send({ success: true, message: 'Admin deleted recipe' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};



// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.send(recipes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};



// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Recipe ID');
  }

  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).send('Recipe not found');

  res.send(recipe);
};



// Search recipe by title
exports.searchRecipeByTitle = async (req, res) => {
  const title = req.query.title;
  if (!title) return res.status(400).send('Title is required');

  const recipe = await Recipe.findOne({ title: new RegExp(title, 'i') });
  if (!recipe) return res.status(404).send('Recipe not found');

  res.send(recipe);
};