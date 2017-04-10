const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const baseUrl = "https://www.bbcgoodfood.com";

function parseRecipe(url){
  request(baseUrl + url, function(err, res, body) {
    if(err) return console.error(err);

    let $ = cheerio.load(body);

    /* Needed:
    *   name
    *   ingredients: ["",""]
    *   nutrition: {"kcal, fat, saturates, carbs, sugars, fibre, protein, salt"}
    *   prep_time
    *   cook_time
    *   skill
    *   serving
    *   steps: ["",""]
    */
    let recipe = {};
    /* name */
    recipe.name = $("h1.recipe-header__title").text().trim();
    /* prep time */
    recipe.prep_time = "";
    $("span.recipe-details__cooking-time-prep").each(function(){
      recipe.prep_time += ($(this).text());
    });
    recipe.prep_time = recipe.prep_time.replace("Prep: ", "").trim();
    /* cook time */
    recipe.cook_time = "";
    $("span.recipe-details__cooking-time-cook").each(function(){
      recipe.cook_time += ($(this).text());
    });
    recipe.cook_time = recipe.cook_time.replace("Cook: ", "").trim();
    /* skill */
    recipe.skill = $("section.recipe-details__item.recipe-details__item--skill-level").find("span.recipe-details__text").text().trim();
    /* serving */
    recipe.serving = $("section.recipe-details__item.recipe-details__item--servings").find("span.recipe-details__text").text().trim();
    /* nutrition */
    // TODO: convert this to json
    recipe.nutrition = "";
    $("ul.nutrition").children().each(function(){
      $(this).children().each(function(){
        recipe.nutrition += $(this).text().trim() + " ";
      });
    });
    /* ingredients */
    recipe.ingredients = [];
    let ignores = [];
    $("a.ingredients-ingredients-list__glossary-link").each(function(){
      print($(this));
      ignores.push($(this).text());
    });
    console.log(ignores);
    $("div.ingredients-list__content").find("li.ingredients-list__item").each(function(){
      if($(this).children().length != 0){
        console.log("Special thing");
      }
      recipe.ingredients.push($(this).text());
    });
    let parsedIngredients = [];
    for(ingredient of recipe.ingredients){
      for(ignore of ignores){
        console.log()
        parsedIngredients.push(ingredient.replace(ignore, ""));
      }
    }
    recipe.ingredients = parsedIngredients;
    console.log(recipe);
  });
}

function visitPage(url){
  request(url, (err, res, body) => {
    if(err) return console.error(err);

    let $ = cheerio.load(body);

    /* get all recipes for that page of results */
    $("article.node-recipe").each(function(i, e) {
      let recipe = $(this).children("h3.teaser-item__title").first();
      let url = recipe.children().first().attr("href");
      parseRecipe(url);
    });

    /* parse 'nextpage' button and visit it */
    let url = $("ul.pager").children().last().children().first().attr("href");
    if(url != undefined){
      visitPage(baseUrl + url);
    }else{
      console.log("Done!");
    }
  });
}

/* Parse first page */
visitPage(baseUrl + "/search?query=");
