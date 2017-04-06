const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

function parseNextPage($, callback){
  let url = $("ul.pager").children().last().children().first().attr("href");
  callback(url);
}

function parseResultPage($){
  /* find all recipes in result page */
  $("article.node-recipe").each(function(i, e) {
    let recipe = $(this).children("h3.teaser-item__title").first();
    let url = recipe.children().first().attr("href");
    parseRecipe(url);
  });
}

function parseRecipe(url){
  console.log(url);
}

function visitPage(url){
  request(url, (err, res, body) => {
    if(err) return console.error(err);

    let $ = cheerio.load(body);

    /* get all recipes for that page of results */
    parseResultPage($);

    /* parse 'nextpage' button and visit it */
    parseNextPage($, (nextUrl) => {
      if(nextUrl != undefined){
        visitPage(baseUrl + nextUrl)
      }
    });
  });
}

baseUrl = "https://www.bbcgoodfood.com";

/* Parse first page */
let finished = false;
let url = baseUrl + "/search?query=";

visitPage(url);
