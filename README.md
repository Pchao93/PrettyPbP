![PrettyPbP logo](https://s3-us-west-1.amazonaws.com/experience.images/PrettyPbP-logo-black.png)

[PrettyPbP Live Demo](https://pretty-pbp.herokuapp.com/)

PrettyPbP is a new way to take in play by play data for the NBA. [Traditional views](https://stats.nba.com/game/0021700833/playbyplay/), while perfect for statisticians, strip away a sense of pace and flow for the typical fan. PrettyPbP aims to provide a visually appealing play-by-play record for fans that mimics the actual timeline of the game. All data is obtained from the NBA's website. This project is not affiliated with the NBA

![Site Demo](https://media.giphy.com/media/5BQ6f2OfIieuFeVErP/giphy.gif)

NOTE: As of late 2017, the NBA has chosen to restrict access to their API from the majority of cloud server providers. Until this decision has changed, some PrettyPbP features will only be available on your local machine, and the live link should be considered a demo.

## Contents
[Live Features](#features---live-demo) | [Local Features](#features---local-only) | [Technologies Used](#technologies-used) | [Highlighted Features](#highlighted-features) | [Project Plan](#project-plan)

## Features - Live Demo
  * Matchups
    * Users can see the set of NBA games that occur on the day of their selection. On the demo site, these matchups are selected from the games occurring on January 18th, 2018.
  * Play by Plays
    * Clicking on a matchup takes users to a new view with a new color scheme dynamically chosen based on team colors. 
    * Users are given Pause/Play and SpeedUp/SlowDown buttons to control the pace of the play by play between 2x and 32x speed, as scaled from actual game time. 

## Features - Local Only
  * Matchups
    * Users can choose specific dates in the NBA season to generate new selections of NBA matchups. 
  * Highlights
    * Clicking on a specific play in the play by play feed searches for a highlight video specific to the play, displaying it below the user's video feed. 

## Technologies Used
 * Backend
   * Routing and Controllers: Express JS/Flask
   * Hosting and Deployment: Heroku, Vultr, Raspberry Pi 3
   * Game and Play by Play data: stats.nba API
   * Highlight videos: Selenium Webdriver
 * Frontend
   * DOM Manipulation with vanilla JavaScript.
   * API calls with vanilla JavaScript.
   * Styling done with vanilla CSS

## Highlighted Features

#### Highlight Videos
   This app uses Selenium's automation library to scrape the NBA's website for highlight footage based on information obtained in 

   ```
     async function grabHighlight(gameId, eventId) {
      let builder = new Builder().forBrowser('chrome').build();
      let video;
      let src;
      try {
        await driver.get(`https://stats.nba.com/events/?flag=1&GameID=${gameId}&GameEventID=${eventId}&Season=2017-18&sct=plot`);
        await driver.wait(until.elementLocated(By.id('statsPlayer_embed_statsPlayer')), 10000);
        video = await driver.findElement(By.id('statsPlayer_embed_statsPlayer'))
        if (video) {
          src = await video.getAttribute('src').then(async (result) => {
            while (!result || result === 'https://s.cdn.turner.com/xslo/cvp/assets/video/blank.mp4') {
              result = await video.getAttribute('src').then(result2 => result2);
            }
            return result;
          });
        }
      } finally {
        await driver.quit();
        return src;
      }
    }; 
  ```

   ![Highlight Demo](https://media.giphy.com/media/1eEArLyGU2Id9klIzi/giphy.gif)

#### Scaled PlaybyPlay

  The collection button is the component that gives users both convenience and full autonomy over their collections. The button either displays the default collection option ("want to play") for easy addition, or shows the current played status of the game. Changes made with this button or the accompanying dropdown menu occur immediately, and the backend CollectionGame model handles the logic for allowing a game to appear in only one default collection.

  ![Speed Control Demo](https://media.giphy.com/media/xFoNbjAT7BGJ5gcNLU/giphy.gif)

## Project Plan

Future updates to the app will include:
  * Finding hosting service that is compatible with the NBA API
  * Provide live boxscore that updates with each play
  * Icons denoting each kind of play (scored basket, rebout, steal, etc.)
