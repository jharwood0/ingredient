const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

baseUrl = "https://www.bbcgoodfood.com/search?query=";

request(baseUrl, (err, res, body) => {
  if(err) return console.error(err);

  let $ = cheerio.load(body);
  $("article.node-recipe").each(() => {
    console.log("recipe");
  });
});
