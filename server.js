// Dependencies
var express = require("express");
var mongojs = require("mongojs");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Scrapper
var scrapper = require('./scrapper.js');

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "twitchData";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Scrape route (scrapes data and sends back res)
app.get("/scrape", function(req,res) {
  // Drop collection before inserting data
  db.scrapedData.drop(function(err, data){
    if (err) throw err;
  })
  scrapper.scrape().then((data) => {
    console.log(data); // Success!
    for(var i = 0; i < data.length; i++){
      db.scrapedData.insert({
        game: data[i].game,
        viewers: data[i].viewers
      })
    }
  });
  res.send("Done Scrape");    
})

// all route (displays all scraped data)
app.get('/all',function(req, res) {
  db.scrapedData.find(function(err,data) {
    if (err) throw err;
    res.json(data);
  });
  
})
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
