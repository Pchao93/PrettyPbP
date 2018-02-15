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



app.get('/api/playbyplay/:gameId', (req, res) => {
  let results;
  fetch(`http://stats.nba.com/stats/playbyplayv2/?GameID=${req.params.gameId}&StartPeriod=1&EndPeriod=14`,
    {
      headers:
        {
          "Dnt": "1",
          "Accept-Language": "en",
          "Accept-Encoding": "gzip, deflate, sdch",
          Referer: 'http://stats.nba.com/',
          connection: 'keep-alive',
          host: 'stats.nba.com',
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
          Accept: '*/*',


        }})
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

app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`);
});
