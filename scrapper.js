const puppeteer = require('puppeteer');

async function scrape() {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({width: 1000, height: 1000})
  await page.goto('http://twitch.tv/');
  await page.waitFor(1000);

  const result = await page.evaluate(() => {
    let data = []; // Create an empty array that will store our data
    let elements = document.querySelectorAll('div.tw-mg-t-05'); // Select all Games

    for (var element of elements){ // Loop through each proudct
        let game = element.querySelector('h3').innerText // Select the title
        let viewers = element.querySelector('p').innerText; // Select the price

        data.push({game, viewers}); // Push an object with the data onto our array
    }

    return data; // Return our data array
  });

  browser.close();
  return result;
};

module.exports = {
  scrape: scrape
} 