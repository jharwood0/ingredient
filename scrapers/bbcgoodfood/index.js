const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

baseUrl = "https://www.bbcgoodfood.com/search?query=";

request(baseUrl, (err, res, body) => {
  if(err) return console.error(err);

  let $ = cheerio.load(body);
  $("article.node-recipe").each(function(i, e) {
    let recipe = $(this).children("h3.teaser-item__title").first();
    let url = recipe.children().first().attr("href");
    console.log(recipe.text().trim());
    console.log(url);
  });
});
