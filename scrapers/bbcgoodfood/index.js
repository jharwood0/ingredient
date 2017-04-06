const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const baseUrl = "https://www.bbcgoodfood.com";

function parseRecipe(url){
  console.log(url);
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
