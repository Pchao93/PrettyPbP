const express = require('express');
const app = express();
// const http = require('http').Server(app)
const path = require('path');
const fetch = require('node-fetch');
const PORT = 8000;

app.use(express.static('public'));


app.get('/', (req, res) => {


  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/highlights/:gameId/:eventId', async (req, res) => {
  let highlightURL = await grabHighlight(req.params.gameId, req.params.eventId);
  // let highlightURL = await grabHighlight(0021700833, 4);

  res.send(highlightURL);

});

const {Builder, By, Key, until} = require('selenium-webdriver');

async function grabHighlight(gameId, eventId) {
  // console.log("BIN", process.env.GOOGLE_CHROME_BIN);
  // console.log("SHIM", process.env.GOOGLE_CHROME_SHIM);
  // chrome_bin = process.env.GOOGLE_CHROME_SHIM;
  //
  // chrome_opts = chrome_bin ? {
  //   // "chromeOptions": {
  //   //   "binary": chrome_bin,
  //   //   'binary_location': chrome_bin,
  //   // },
  //   'chrome_options': {
  //     // 'binary_location': chrome_bin,
  //     'binary': './',
  //   },
  // } : {}
// .setChromeOptions(chrome_opts)

  console.log("I get this far right?");
  let driver = await new Builder().withCapabilities({
    'browserName': 'chrome',
    'binary': process.env.GOOGLE_CHROME_SHIM,
  }).build(); //;forBrowser('chrome').build();
  console.log(driver);
  let video;
  let src;
  try {
    console.log("try");
    await driver.get(`https://stats.nba.com/events/?flag=1&GameID=${gameId}&GameEventID=${eventId}&Season=2017-18&sct=plot`);
    await driver.wait(until.elementLocated(By.id('statsPlayer_embed_statsPlayer')), 10000);
    video = await driver.findElement(By.id('statsPlayer_embed_statsPlayer')) //.sendKeys('webdriver', Key.RETURN);
    console.log("something bit");
    if (video) {
      src = await video.getAttribute('src').then(async (result) => {
        while (!result || result === 'https://s.cdn.turner.com/xslo/cvp/assets/video/blank.mp4') {
          result = await video.getAttribute('src').then(result2 => result2);
        }
        return result;
      });
    }
    console.log(src);
  } finally {
    await driver.quit();

    console.log('src', src);
    return src;

  }
};



app.get('/api/playbyplay/:gameId', (req, res) => {
  let results;
  console.log('hitting backend');
  fetch(`http://stats.nba.com/stats/playbyplayv2/?GameID=${req.params.gameId}&StartPeriod=1&EndPeriod=14`,
    {
      headers:
        {
          "Dnt": "1",
          "Accept-Language": "en",
          "cache-control":"max-age=0",
          "Accept-Encoding": "Accepflate, gzip, deflate, sdch",
          Referer: 'http://stats.nba.com/',
          connection: 'keep-alive',
          host: 'stats.nba.com',
          'accept-language':'he-IL,he;q=0.8,en-US;q=0.6,en;q=0.4',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
          Accept: '*/*',


        }})
    .then(function(response) {
      console.log('responded');
        return response.text();
    }).then(function(body) {
      // console.log(body);
      results = JSON.parse(body);
        // console.log(typeof body);
        // console.log(body.length);
        // console.log(JSON.parse(body));
        res.send(results);
    });

});

// http://data.nba.net/10s/prod/v1/20180212/scoreboard.json

app.get('/api/games/:date', (req, res) => {
  let results;


  fetch(`http://data.nba.net/10s/prod/v1/2018${req.params.date}/scoreboard.json`)
    .then(function(response) {

        return response.text();
    }).then(function(body) {
      // console.log(body);
      results = JSON.parse(body);
        // console.log(typeof body);
        // console.log(body.length);
        // console.log(JSON.parse(body));

        res.send(results);
    });

});

app.listen(process.env.PORT || PORT);

// , () => {
//   console.log(__dirname);
//   console.log(`listening on ${PORT}`);
// });
