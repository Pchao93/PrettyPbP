## PrettyPbP - A new way to present play by play data for the NBA

### Background and Overview

PrettyPbP is a better way to go over play by play data for the NBA. [Traditional views](https://stats.nba.com/game/0021700833/playbyplay/), while perfect for statisticians, strip away a sense of pace and flow for the typical fan. PrettyPbP aims to provide a visually appealing play-by-play record for fans that mimics the actual timeline of the game.

Currently, such play-by-plays are either followed live, where the events are updated as they happen, or are parsed for advanced statistics by analysts. PrettyPbP aims to expand the audience of this format by making it visually appealing. Play-by-play recaps involve less time than actually rewatching the game, while also providing more context that highlight compilations. 

Play-by-Plays list out each discrete event in an NBA game, with a time-stamp, description, updated score, and possibly a video link. 

Users can decide what game they wish to view, as well as the speed at which they would like to watch. 

Additionally, users are able to pause and play the feed, and choose if they would like to include video clips of each play. 

### Functionality & MVP  

In PrettyPbP, users will be able to:

- [ ] Create asteroids of custom size, color, and velocity vector
- [ ] Hear sounds on collisions
- [ ] Randomly seed the initial state for demoing or exploration purposes
- [ ] Start, pause, restart, and reset the simulation
- [ ] Select from a list of 'instruments' that will serve as the bases for sound events.

In addition, this project will include:

- [ ] An About modal describing the basic functionality
- [ ] A Details modal delving into the specific implementation of Markov chains

### Wireframes

![wireframes](https://i.imgur.com/IbQmMI0.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript for overall structure and logic,
- `D3` for DOM manipulation and rendering,
- Webpack to bundle and serve up the various scripts.

In addition to the webpack entry file, there will be up to three scripts involved in this project:

`table.js`: this script will handle the logic for creating and updating the necessary DOM elements.

`box_score.js`: this script will handle the updating of the box-score based on the incomming play-by-play data

`highlights.js` (Bonus): this script will handle finding the highlight associated with a specific play. 

### Implementation Timeline

**Over the weekend**:
- [x] Read up on NBA API, figure out different webpoints that will need to be accessed
- [x] Set up simple server to make API requests from browser. 

**Day 1**: Setup all necessary Node modules, including getting webpack up and running.  Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and the parsing of data for the required NBA endpoints.  Learn the basics of the NBA stats API.  Goals for the day:

- [ ] Get `webpack` serving files and frame out index.html
- [ ] Learn enough NBA stats play by play API to render a static but properly formatted table to the site along with other relevant information.
- [ ] Write basic box-score functionality that can read the play by play log to generate and update content. 

**Day 2**: Dedicate this day to making sure the format of the data is properly styled.  First, build out each row to adequately present the most important information about each play.  Then, build out the entire table to organize and arrange the data to express which team the play was for. Goals for the day:

- [ ] Investigate the NBA's "moments" API for attaching highlight clips to plays
- [ ] Create layout for table data, as well as optional extra elements. 
- [ ] Style data to make sure final play-by-play table is appealing when generated.

**Day 3**: Create the interactive backend. Goals for the day:

- [ ] Add options for selecting different games
- [ ] Create pause/play/change speed controls. 
- [ ] Add settings for inclusion of box score
- [ ] Develop scripts for finding appropriate highlight clip for each play

**Day 4**: Implement logic for creating play by play display row by row. Style the frontend, making it polished and professional. Goals for the day:

- [ ] Have styled inputs and data display
- [ ] Add animations and transitions for updated views




### Bonus features

There are many directions in which this project could evolve.

- [ ] Add interactive highlights for each play-by-play row, the best of both worlds. 
- [ ] Implement Advanced statistics using public data
- [ ] Implement live play-by-play with paid data
- [ ] Add visualizations of data that are updated throughout the game. 
- [ ] Allow users to select games from past seasons. 