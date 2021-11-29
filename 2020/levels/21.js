const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/, '');

/* *
input = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`;
/* */

const mealData = input.split('\n').
  map(str => {
    const [ingredients, allergens] = str.replace(')', '').split(' (contains ');
    return {
      i: ingredients.split(' '),
      a: allergens ? allergens.split(', ') : null
    };
  });

const allergenMapping = mealData.reduce((ret, meal) => {
  if (!meal.a) { return ret; }
  
  meal.a.forEach(allergen => {
    // New allergen -- could be in any of the ingredients of this meal
    if (ret[allergen] === undefined) {
      ret[allergen] = [...meal.i];

    // Known allergen: Cross off potential ingredients for that allergen
    // that are not in THIS meal.
    } else if (ret[allergen].length > 1) {
      ret[allergen] = ret[allergen].filter(ingredient => meal.i.indexOf(ingredient) > -1);
    }
  });
  return ret;
}, {});

// Compile a map of unsafe (not 100% safe) ingredients: {ingredientName:1}
const unsafeIngredientsMap = Object.keys(allergenMapping).reduce((ret, allergen) => {
  allergenMapping[allergen].forEach(ingredient => {
    ret[ingredient] = 1;
  });
  return ret;
}, {});

// Traverse all meals, then all ingredients and count the occurences of the 
// safe ones (i.e. the ones the keys of which arae not in unsafeIngredientsMap)
const part1 = mealData.reduce((ret, meal) => {
  meal.i.forEach(ingredient => {
    if (unsafeIngredientsMap[ingredient] === undefined) {
      ret++;
    }
  });
  return ret;
}, 0);

console.log('Part 1: ', part1);


// pt.2
let allergenKeys = Object.keys(allergenMapping);

// As long as we have unresolved mappings
while(allergenKeys.some(allergen => {
  // String: already resolved;  [] with length >1: cannot resolve yet 
  if (typeof allergenMapping[allergen] === 'string' || allergenMapping[allergen].length !== 1) {
    return false;
  }

  // This allergen only has one ingredient left --> Resolved!
  const resolvedIngredient = allergenMapping[allergen] = allergenMapping[allergen][0];

  // Exclude this allergen from future iterations
  allergenKeys = allergenKeys.filter(a => a !== allergen);
  
  // Remove the resolved ingredient from the lists of potential ingredients for all other allergens
  allergenKeys.forEach(a =>{
    allergenMapping[a] = allergenMapping[a].filter(ingr => ingr !== resolvedIngredient)
  });
  return true;
}));

// We now have an {allergen: ingredient} map. Sort they keys, then map keys to values.
const part2 = Object.keys(allergenMapping).
  sort((a, b) => a < b ? -1 : 1).
  map(allergen => allergenMapping[allergen]).
  join(',');

console.log('Part 2: ', part2);