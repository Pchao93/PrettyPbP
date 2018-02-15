

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('root');
  start = false;
  speed = 8;
  timer;
  let games = await fetchGames('0115');
  let controls = createControls();
  let tableContainer = document.createElement('div');
  setUpBackground(root);
  tableContainer.classList.add('table-container');
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
      console.log('click!');
      tableContainer.innerHTML = null;
      tableContainer.appendChild(tabs);
      tableContainer.appendChild(controls);
      setBackground(game[1], game[2]);
      const newTabs = tabs.cloneNode(true);
      newTabs.addEventListener('click', (e) =>{
        console.log('also click');
        timer.pause();
        let pausePlayButton = document.querySelector('.pause-play');
        pausePlayButton.innerHTML = '<i class="far fa-play-circle"></i>';
        tableContainer.innerHTML = null;
        let headerTabsArray = createHeaderTabs(games, tableContainer, controls, root)
        headerTabsArray.forEach(headerTabs => {
          tableContainer.appendChild(headerTabs);
        });
        resetBackground();
        start = false;
      });
      tabs.parentNode.replaceChild(newTabs, tabs);
      runPlayByPlay(game[0], tableContainer);

    });
    return tabs;
  });
  return headerTabs;
};

const runPlayByPlay = function(gameId, tableContainer) {
  let rowsData;
  fetch(`/api/playbyplay/${gameId}`).then((res) =>{
    return res.json();
  })
  .then((res) => {
    rowsData = res.resultSets[0].rowSet;
    let table = createTable();
    tableContainer.appendChild(table);
    updateTable(table, rowsData).then(table => {

      tableContainer.appendChild(table);
    });
  });
};

const setBackground = function(team1, team2) {
  console.log('setup');
  const BACKGROUNDCOLORS = {
    'ATL': '#25282A',
    'BOS': '#BA9653', // '#C0C0C0'
    'BKN': '#000000',
    'CHA': '#00788C',
    'CHI': '#000000',
    'DAL': '#C4CED4',
    'DEN': '#5091CD',
    'DET': '#0C4C93',
    'HOU': '#CE1141',
    'IND': '#002D62',
    'LAC': '#ED174C',
    'LAL': '#FDB927',
    'MEM': '#6189B9',
    'MIA': '#000000',
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
    'SAS': '#000000',
    'TOR': '#000000',
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
  console.log('log');
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
  pausePlayButton.innerHTML = '<i class="far fa-play-circle"></i>';
  pausePlayButton.addEventListener('click', ()=> {
    if (!start) {
      start = true;
      pausePlayButton.innerHTML = '<i class="far fa-pause-circle"></i>'
    } else if (timer && timer.getStateRunning()) {
      timer.pause();
      pausePlayButton.innerHTML = '<i class="far fa-play-circle"></i>'
    } else if (timer){
      timer.start();
      pausePlayButton.innerHTML = '<i class="far fa-pause-circle"></i>'
    }
  }
);
  speedUpButton.innerHTML = '<i class="fas fa-forward"></i>';
  speedUpButton.addEventListener('click', ()=> {
    if (speed < 32) {
      timer.speedUp();
      speed *= 2;
    }
    // speedDisplay.innerHTML = `<span>Speed:</span> ${speed}`;
  });
  slowDownButton.innerHTML = '<i class="fas fa-backward"></i>';
  slowDownButton.addEventListener('click', ()=> {
    if (speed > 1) {
      timer.slowDown();


      speed /= 2;
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

  headerTabs = document.createElement('div');
  headerTabs.classList.add('header-tabs');
  headerTab1 = document.createElement('div');
  headerTab1.innerHTML = team1;
  headerTab1.classList.add('header-tab');
  headerTab1.style.background = TABCOLORS[team1];
  if (team1 === 'BKN') {
    headerTab1.style.color = '#000000';
  } else if (team1 === 'HOU') {
    headerTab1.style.color = '#CE1141'
  }
  headerTab2 = document.createElement('div');
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
    if (start) {
      let rowArray = rowsData[i];
      let newTime = calculateTimeOut(rowArray[6], rowArray[4]);


      let row = await sleeper((newTime - oldTime)/ speed)().then(() => {
        // console.log("happening!");

        return createRow(rowArray);
      });
      table.prepend(row);
        if (i === rowsData.length - 1) {
          timer(() => table.prepend(createFinalRow()), 250);
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

  row.appendChild(homeDescription);
  row.appendChild(gameTimeScore);
  row.appendChild(visitorDescription);
  return row;
};

const calculateTimeOut = function(timeString, period) {
  const timeArray = timeString.split(':');
  return (720000 + (720000 * (period - 1)) - (timeArray[0] * 60000) - (timeArray[1] * 1000));
};

function sleeper(time) {
  return function(x) {
    return new Promise(resolve => timer(() => resolve(x), time));
  };
}

// slow down and speed up methods by me
// inspired by Stackoverflow: https://stackoverflow.com/questions/3144711/find-the-time-left-in-a-settimeout
function timer(callback, delay) {
    let id, started, remaining = delay, running

    timer.start = function() {

        running = true
        started = new Date()
        id = setTimeout(callback, remaining)
    }

    timer.pause = function() {

        running = false
        clearTimeout(id)
        remaining -= new Date() - started
    }

    timer.getTimeLeft = function() {
        if (running) {
            timer.pause()
            timer.start()
        }

        return remaining
    }

    timer.getStateRunning = function() {
        return running
    }

    timer.speedUp = function() {
      timer.pause();
      remaining /= 2;
      timer.start()
    }

    timer.slowDown = function() {
      timer.pause();
      remaining *= 2;
      timer.start()
    }

    timer.start()
    return timer;
}
