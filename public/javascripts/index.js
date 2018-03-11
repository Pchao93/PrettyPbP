import {playbyplays} from "./games"

document.addEventListener('DOMContentLoaded', async () => {
  '<i class="fas fa-basketball-ball"></i>'
  '<i class="fas fa-arrow-left"></i>'
  const root = document.getElementById('root');
  window._data = {};
  window._data.start = false;
  window._data.speed = 8;
  window._data.timer;
  let games = await fetchGames('0115');
  let controls = createControls();
  let tableContainer = document.createElement('div');
  tableContainer.classList.add("table-container")
  setUpBackground(root);
  // let tableHeader = document.createElement('h1')
  // tableHeader.innerHTML = "Select a game from January 15th, 2018"
  // tableHeader.classList.add('table-header');
  // tableContainer.classList.add('table-container');
  // tableContainer.appendChild(tableHeader);
  let tableHeader = document.createElement('h1');
  tableHeader.innerHTML = "Mon Jan 15 2018";
  tableHeader.classList.add('table-header');
  tableContainer.appendChild(tableHeader);
  let headerTabsArray = createHeaderTabs(games, tableContainer, controls, root);
  headerTabsArray.forEach(headerTabs => {
    tableContainer.appendChild(headerTabs);
  });
  root.appendChild(tableContainer);
});

const createHeaderTabs = function(games, tableContainer, controls, root) {
  let headerTabs = games.map((game) => {
    let tabs = createTabs(game[1], game[2]);
    tabs.addEventListener('click', ()=>{
      let backArrow = document.createElement('div');
      backArrow.classList.add('back-arrow', 'white');
      backArrow.innerHTML = '<i class="fas fa-arrow-left"></i>'
      // console.log('click!');
      tableContainer.innerHTML = null;
      tableContainer.appendChild(tabs);
      tableContainer.appendChild(controls);
      tableContainer.appendChild(backArrow)

      setBackground(game[1], game[2]);
      const newTabs = tabs.cloneNode(true);
      backArrow.addEventListener('click', (e) =>{
        // console.log('also click');
        window.pause();
        let pausePlayButton = document.querySelector('.pause-play');
        pausePlayButton.innerHTML = '<i class="fas fa-play"></i>';
        tableContainer.innerHTML = null;
        let tableHeader = document.createElement('h1');
        tableHeader.innerHTML = "Mon Jan 15 2018";
        tableHeader.classList.add('table-header');
        tableContainer.appendChild(tableHeader);
        let headerTabsArray = createHeaderTabs(games, tableContainer, controls, root)
        headerTabsArray.forEach(headerTabs => {
          tableContainer.appendChild(headerTabs);
        });
        resetBackground();
        window._data.start = false;
        window._data.speed = 8;
      });
      newTabs.classList.add('show');
      tabs.parentNode.replaceChild(newTabs, tabs);
      runPlayByPlay(game[0], tableContainer);

    });
    return tabs;
  });
  return headerTabs;
};

const runPlayByPlay = function(gameId, tableContainer) {
  let rowsData;
  // fetch(`/api/playbyplay/${gameId}`).then((res) =>{
    // return res.json();
  // })
  // .then((res) => {
    // rowsData = res.resultSets[0].rowSet;
    rowsData = playbyplays[gameId].resultSets[0].rowSet;
    // console.log(playbyplays[gameId].resultSets[0].rowSet);
    let table = createTable();
    tableContainer.appendChild(table);
    updateTable(table, rowsData, gameId).then(table => {

      tableContainer.appendChild(table);
    });
  // });
};

const setBackground = function(team1, team2) {
  // console.log('setup');
  const BACKGROUNDCOLORS = {
    'ATL': '#25282A',
    'BOS': '#BA9653', // '#C0C0C0'
    'BKN': '#25282A',
    'CHA': '#00788C',
    'CHI': '#25282A',
    'DAL': '#C4CED4',
    'DEN': '#5091CD',
    'DET': '#0C4C93',
    'HOU': '#CE1141',
    'IND': '#002D62',
    'LAC': '#ED174C',
    'LAL': '#FDB927',
    'MEM': '#6189B9',
    'MIA': '#25282A',
    'MIL': '#EEE1C6',
    'MIN': '#7AC143',
    'NOP': '#C8102E',
    'NYK': '#006BB6',
    'OKC': '#F05133',
    'ORL': '#C2CCD2',
    'PHI': '#ED174C',
    'PHX': '#1D1160',
    'POR': '#C4CED4',
    'SAC': '#63727A',
    'SAS': '#25282A',
    'TOR': '#25282A',
    'UTA': '#00471B',
    'WAS': '#E31837',
    'GSW': '#FFCD34',
    'CLE': '#041E42',
  };
  let leftBackground = document.querySelector('.left-background');

  leftBackground.style.background = BACKGROUNDCOLORS[team1];

  let rightBackground = document.querySelector('.right-background');

  rightBackground.style.background = BACKGROUNDCOLORS[team2];


};
const setUpBackground = function(root) {
  let leftBackground = document.createElement('div')
  leftBackground.classList.add('left-background');

  let rightBackground = document.createElement('div')
  rightBackground.classList.add('right-background');
  root.appendChild(leftBackground);
  root.appendChild(rightBackground);
}


const resetBackground = function() {
  // console.log('log');
  let leftBackground = document.querySelector('.left-background');
  leftBackground.style.background = null;
  let rightBackground = document.querySelector('.right-background');
  rightBackground.style.background = null;
}

async function fetchGames(date) {
  let games = [];
  await fetch(`/api/games/${date}`)
    .then(res => {
      return res.json()
    })
    .then(res => {
      res.games.forEach(game => games.push([game.gameId, game.vTeam.triCode, game.hTeam.triCode]))
    });
  return games;
}

const createControls = function() {
  let container = document.createElement('div');
  container.classList.add('controls-container');
  let pausePlayButton = document.createElement('div');
  pausePlayButton.classList.add('pause-play');
  let speedUpButton = document.createElement('div');
  speedUpButton.classList.add('speed-up');
  let slowDownButton = document.createElement('div');
  slowDownButton.classList.add('slow-down');
  pausePlayButton.innerHTML = '<i class="fas fa-play"></i>';
  pausePlayButton.addEventListener('click', ()=> {
    if (!window._data.start) {
      window._data.start = true;
      pausePlayButton.innerHTML = '<i class="fas fa-pause"></i>'
    } else if (window.timer && window.getStateRunning()) {
      window.pause();
      pausePlayButton.innerHTML = '<i class="fas fa-play"></i>'
    } else if (window.timer){
      window.start();
      pausePlayButton.innerHTML = '<i class="fas fa-pause"></i>'
    }
  }
);
  speedUpButton.innerHTML = '<i class="fas fa-forward"></i>';
  speedUpButton.addEventListener('click', ()=> {
    if (window._data.speed < 32) {
      window.speedUp();
      window._data.speed *= 2;
    }
    // speedDisplay.innerHTML = `<span>Speed:</span> ${window._data.speed}`;
  });
  slowDownButton.innerHTML = '<i class="fas fa-backward"></i>';
  slowDownButton.addEventListener('click', ()=> {
    if (window._data.speed > 1) {
      window.slowDown();


      window._data.speed /= 2;
    }
    // speedDisplay.innerHTML = `<span>Speed:</span> ${speed}`;
  });
  // speedDisplay.innerHTML = `<span>Speed:</span> ${speed}`;

  container.appendChild(slowDownButton);
  container.appendChild(pausePlayButton);
  container.appendChild(speedUpButton);
  // container.appendChild(speedDisplay);

  return container;
};

const createTabs= function(team1, team2) {

  const TABCOLORS = {
    'ATL': '#E03A3E',
    'BOS': '#008248',
    'BKN': '#FFFFFF',
    'CHA': '#1D1160',
    'CHI': '#CE1141',
    'DAL': '#007DC5',
    'DEN': '#FDB927',
    'DET': '#E01E38',
    'HOU': '#FFFFFF',
    'IND': '#FDBB30',
    'LAC': '#006BB6',
    'LAL': '#552583',
    'MEM': '#00285E',
    'MIA': '#98002E',
    'MIL': '#00471B',
    'MIN': '#002B5C',
    'NOP': '#0C2340',
    'NYK': '#F58426',
    'OKC': '#007AC1',
    'ORL': '#0B77BD',
    'PHI': '#006BB6',
    'PHX': '#E56020',
    'POR': '#E13A3E',
    'SAC': '#5A2D81',
    'SAS': '#C4CED4',
    'TOR': '#CD1141',
    'UTA': '#0C2340',
    'WAS': '#002B5C',
    'GSW': '#243E90',
    'CLE': '#6F2633',

  };

  let headerTabs = document.createElement('div');
  headerTabs.classList.add('header-tabs');
  let headerTab1 = document.createElement('div');
  headerTab1.innerHTML = team1;
  headerTab1.classList.add('header-tab');
  headerTab1.style.background = TABCOLORS[team1];
  if (team1 === 'BKN') {
    headerTab1.style.color = '#000000';
  } else if (team1 === 'HOU') {
    headerTab1.style.color = '#CE1141'
  }
  let headerTab2 = document.createElement('div');
  headerTab2.classList.add('header-tab');
  headerTab2.innerHTML = team2;
  headerTab2.style.background= TABCOLORS[team2];
  if (team2 === 'BKN') {
    headerTab2.style.color = '#000000';
  } else if (team2 === 'HOU') {
    headerTab2.style.color = '#CE1141'
  }
  headerTabs.appendChild(headerTab1);
  headerTabs.appendChild(headerTab2);
  return headerTabs;
}

const createTable = function() {
  let table = document.createElement('table');
  table.classList.add('pbp-table');
  return table;
};

async function updateTable(table, rowsData) {
  let oldTime = 0;
  let i = 0;
  while (i < rowsData.length) {
    // console.log(timer);
    if (window._data.start) {
      let rowArray = rowsData[i];
      let newTime = calculateTimeOut(rowArray[6], rowArray[4]);


      let row = await sleeper((newTime - oldTime)/ window._data.speed)().then(() => {
        // console.log("happening!");

        return createRow(rowArray);
      });
      table.prepend(row);
        if (i === rowsData.length - 1) {
          window.timer(() => table.prepend(createFinalRow()), 250);
        }
      oldTime = newTime;
      i++;
    } else {
      await sleeper(500)();
    }
  };

  return table;
}

const createFinalRow = function() {
  const rowArray = Array(11).fill('');
  rowArray[6] = 'Final';
  return createRow(rowArray);
};

const createRow = function(rowArray) {
  let row = document.createElement('tr');
  row.classList.add('pbp-table-row');
  let gameTime = document.createElement('span');
  gameTime.classList.add('game-time');
  if (rowArray[7] === null && rowArray[9] === null && rowArray[6] === '12:00') {
    gameTime.innerHTML = `<span class="quarter-label">Q${rowArray[4]}</span>`;
    'Q' + rowArray[4];
  } else {
    gameTime.innerHTML = rowArray[6];
  }
  let score = document.createElement('span');
  score.classList.add('game-score');

  score.innerHTML = rowArray[10];

  // updateScores(rowArray[10]);

  let gameTimeScore = document.createElement('td');
  gameTimeScore.classList.add('pbp-table-cell-time-score');
  gameTimeScore.classList.add('time-score');

  gameTimeScore.appendChild(gameTime);
  gameTimeScore.appendChild(score);

  let homeDescription = document.createElement('td');
  homeDescription.classList.add('pbp-table-cell');

  homeDescription.innerHTML = rowArray[7];
  let visitorDescription = document.createElement('td');
  visitorDescription.innerHTML = rowArray[9];
  visitorDescription.classList.add('pbp-table-cell');
  row.appendChild(visitorDescription);
  row.appendChild(gameTimeScore);
  row.appendChild(homeDescription);

  row.addEventListener('click', (e) => {
    // row.removeEventListener(e.type, arguments.callee)
    // videoEventHandler(row, rowArray)
  });
  return row;
};

const videoEventHandler = async function(row, rowArray) {
  let loadingDiv = document.createElement('div');
  loadingDiv.classList.add('loading-div');
  loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
  row.parentNode.insertBefore(loadingDiv, row.nextSibling);
  let video = document.createElement('video');


  row.addEventListener('click', (e)=> {
    // row.removeEventListener(e.type, arguments.callee)
    e.preventDefault();
    video.parentNode.removeChild(video);
    window.play();
    pausePlayButton.innerHTML = '<i class="fas fa-pause"></i>'

    row.addEventListener('click', (e) => {
      // row.removeEventListener(e.type, arguments.callee);
      // videoEventHandler(row, rowArray);
    });
  });
  window.pause();
  let pausePlayButton = document.querySelector('.pause-play')
  pausePlayButton.innerHTML = '<i class="fas fa-play"></i>'
  row.parentNode.replaceChild(video, loadingDiv);
  fetch(`/api/highlights/${rowArray[0]}/${rowArray[1]}`)
    .then(res => {
      console.log(res);
      return res.text()
    })
    .then(res => {


      createVideo(video, res, row)
      row.parentNode.replaceChild(video, loadingDiv);
      // video.parentNode.insertBefore(closeButton, video.nextSibling);
    });
}

const createVideo = function(video, res, row) {
  video.setAttribute('src', res);
  video.setAttribute('autoplay', true);
  video.setAttribute('controls', true);

  video.setAttribute('loop', true);
  video.classList.add('highlight-video');
  // closeButton = document.createElement('button')
  // closeButton.innerHTML = 'x';
  // closeButton.classList.add('close-button');

  // return closeButton;
  // video.parentNode.insertBefore(closeButton, video.nextSibling);


}

const calculateTimeOut = function(timeString, period) {
  const timeArray = timeString.split(':');
  return (720000 + (720000 * (period - 1)) - (timeArray[0] * 60000) - (timeArray[1] * 1000));
};

function sleeper(time) {
  return function(x) {
    return new Promise(resolve => window.timer(() => resolve(x), time));
  };
}

// slow down and speed up methods by me
// inspired by Stackoverflow: https://stackoverflow.com/questions/3144711/find-the-time-left-in-a-settimeout
function timer(callback, delay) {
    let id, started, remaining = delay, running

    window.start = function() {

        running = true
        started = new Date()
        id = setTimeout(callback, remaining)
    }

    window.pause = function() {

        running = false
        clearTimeout(id)
        remaining -= new Date() - started
    }

    window.getTimeLeft = function() {
        if (running) {
            pause()
            start()
        }

        return remaining
    }

    window.getStateRunning = function() {
        return running
    }

    window.speedUp = function() {
      // pause();
      remaining /= 2;
      start()
    }

    window.slowDown = function() {
      pause();
      remaining *= 2;
      start()
    }

    window.start()
    return timer;
}
window.timer = timer
