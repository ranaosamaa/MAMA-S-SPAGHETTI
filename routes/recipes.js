const express = require('express');
const router = express.Router();
const recipeController = require('../controller/recipeController');
const { authMiddleware, adminOnly } = require('../middleware/errorHandler');
const upload = require('../middleware/upload');


router.post('/addRecipe', authMiddleware, upload.single('image'), recipeController.addRecipe);
router.post('/', authMiddleware, upload.single('image'), recipeController.createRecipe);
router.put('/:id', authMiddleware, upload.single('image'), recipeController.editRecipe);
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);
router.delete('/admin/:id', adminOnly, recipeController.adminDeleteRecipe);
router.get('/', recipeController.getAllRecipes);
router.get('/search', recipeController.searchRecipeByTitle );
router.get('/:id', recipeController.getRecipeById);

module.exports = router;