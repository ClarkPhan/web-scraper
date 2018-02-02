const puppeteer = require('puppeteer');

async function scrape() {
  // Launch browser, open new page, and goes to twitch
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({width: 1000, height: 1000})
  await page.goto('http://twitch.tv/');

  await page.waitFor(1000);
  
  // After waiting for a second for html elements to be dynamically generated, get result
  const result = await page.evaluate(() => {
    let data = []; // Create an empty array that will store our data
    let elements = document.querySelectorAll('div.tw-mg-t-05'); // Select all Games
    let i = 0;
    for (var element of elements){ // Loop through each game card
        let game = element.querySelector('h3').innerText // Select the game title
        let viewers = element.querySelector('p').innerText; // Select the num of viewers
        let img = element.parentNode.previousSibling.querySelector('img').src; // Select img of game
        data.push({game, viewers, img}); // Push an object with the data onto our array
    }
    
    return data; // Return our data array
  });

  browser.close();
  return result;
};

module.exports = {
  scrape: scrape
} 