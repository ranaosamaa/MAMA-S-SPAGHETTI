function getRandomRecipes(recipes, count) {
  const shuffled = recipes.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

module.exports = { getRandomRecipes };
