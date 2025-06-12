const mongoose = require('mongoose');
exports.Recipe = mongoose.model('Recipe', recipeSchema);


const recipeSchema = new mongoose.Schema({
     image: {
        type: String,
        required: true,
    },
     title:{
        type: String,
        required: true,
    },
     ingredients: {
        type: [String],
        required: true,
    },
     description:{
        type: String,
        required: true,
    }
});
recipeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
recipeSchema.set('toJSON', {
    virtuals: true,
});
exports.recipe = mongoose.model('recipe', recipeSchema);
exports.recipeSchema = recipeSchema;
