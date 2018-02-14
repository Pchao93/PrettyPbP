play = false

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  speed = 4;
  scores = [0, 0];
  let gameId = '0021700494';
  fetch(`/api/playbyplay/${gameId}`).then((res) =>{
    return res.json();
  })
  .then((res) => {
    let headerTabs = createTabs('GSW', 'CLE');
    let controls = createControls();
    let tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');
    tableContainer.appendChild(headerTabs);
    tableContainer.appendChild(controls);
    let leftBackground = document.createElement('div')
    leftBackground.classList.add('left-background');
    let rightBackground = document.createElement('div')
    rightBackground.classList.add('right-background');
    let basketballBackground = document.createElement('div')
    basketballBackground.classList.add('basketball-background');

    root.appendChild(leftBackground);
    root.appendChild(rightBackground);
    root.appendChild(basketballBackground);
    root.appendChild(tableContainer);
    let rowsData = res.resultSets[0].rowSet;
    let table = createTable();
    tableContainer.appendChild(table)
    sleeper(1000)().then(()=> {
      updateTable(table, rowsData).then(table => {
        console.log('first', table);
        tableContainer.appendChild(table)
      });
    })





    // root.appendChild(table);
  });
});

const createControls = function() {
  let container = document.createElement('div');
  container.classList.add('controls-container');
  let pausePlayButton = document.createElement('div');
  pausePlayButton.classList.add('pause-play');
  let speedUpButton = document.createElement('div');
  speedUpButton.classList.add('speed-up');
  let slowDownButton = document.createElement('div');
  slowDownButton.classList.add('slow-down');
  // let speedDisplay = document.createElement('div');
  // speedDisplay.classList.add('speed-display');
  pausePlayButton.innerHTML = '<i class="far fa-play-circle"></i>';
  pausePlayButton.addEventListener('click', ()=> {
    play = !play;
    if (play) {
      pausePlayButton.innerHTML = '<i class="far fa-pause-circle"></i>'
    } else {
      pausePlayButton.innerHTML = '<i class="far fa-play-circle"></i>'
    }
  }
);
  speedUpButton.innerHTML = '<i class="fas fa-forward"></i>';
  speedUpButton.addEventListener('click', ()=> {
    if (speed < 32) {
      speed *= 2;
    }
    // speedDisplay.innerHTML = `<span>Speed:</span> ${speed}`;
  });
  slowDownButton.innerHTML = '<i class="fas fa-backward"></i>';
  slowDownButton.addEventListener('click', ()=> {
    if (speed > 1) {
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
  headerTabs = document.createElement('div');
  headerTabs.classList.add('header-tabs');
  headerTab1 = document.createElement('div');
  headerTab1.innerHTML = team1;
  headerTab1.classList.add('header-tab');
  headerTab1.style.background= '#243E90'
  headerTab2 = document.createElement('div');
  headerTab2.classList.add('header-tab');
  headerTab2.innerHTML = team2;
  headerTab2.style.background= '#6F2633'
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
    console.log('loop');
    while (!play) {
      console.log("before");
      await sleeper(500)();
      console.log("after");
    }
    let rowArray = rowsData[i];
    let newTime = calculateTimeOut(rowArray[6], rowArray[4]) / speed
    let row = await sleeper(newTime - oldTime)().then(() => createRow(rowArray));
    table.prepend(row);
    console.log('row');
      if (i === rowsData.length - 1) {
        setTimeout(() => table.prepend(createFinalRow()), 250);
      }
    oldTime = newTime;
    i++;
  };
  console.log(table);
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
    return new Promise(resolve => setTimeout(() => resolve(x), time));
  };
}

window.calculateTimeOut = calculateTimeOut;
