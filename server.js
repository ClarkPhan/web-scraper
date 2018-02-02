// Dependencies
var logger = require("morgan");
var express = require("express");
var mongojs = require("mongojs");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Scrapper
var scrapper = require('./scrapper.js');

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Database configuration
var databaseUrl = process.env.MONGODB_URI || "localhost:27017/twitchData";
var collections = ["scrapedData"];

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route
app.get("/", function(req, res) {
  db.scrapedData.find(function(err, data) {
    if (err) throw err;
    var hbsObject = {
       data: data
    };
    console.log(data);
    res.render("index", hbsObject);
  });
});

// Scrape route (scrapes data and sends back res)
app.get("/scrape", function(req,res) {
  // Cleans collection before inserting data
  db.scrapedData.remove(function(err, data){
    if (err) throw err;
  })
  scrapper.scrape().then((data) => {
    console.log(data); // Success!
    var dt = new Date();
    // Convert time to PST
    dt.setUTCHours(dt.getUTCHours() - 8);
    for(var i = 0; i < data.length; i++){
      db.scrapedData.insert({
        game: data[i].game,
        viewers: data[i].viewers,
        imageSrc: data[i].img,
        date_created: dt.toUTCString()
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
