const player = document.getElementById('player');
const game = document.getElementById('game');
const message = document.getElementById('message');

let level = 0;
const totalLevels = 5;
const playerSpeed = 10;

const levels = [
  // Format: {obstacles: [...], pits: [...], flag: {...}}
  {
    obstacles: [{x: 200, y: 200}],
    pits: [{x: 300, y: 100}],
    flag: {x: 550, y: 350}
  },
  {
    obstacles: [{x: 150, y: 150}, {x: 200, y: 250}],
    pits: [{x: 350, y: 200}, {x: 100, y: 300}],
    flag: {x: 500, y: 50}
  },
  // Add more levels up to 5
];

function createLevel() {
  game.querySelectorAll('.obstacle, .pit, .flag').forEach(el => el.remove());
  const current = levels[level];

  current.obstacles.forEach(pos => {
    const spike = document.createElement('div');
    spike.className = 'obstacle';
    spike.style.left = pos.x + 'px';
    spike.style.top = pos.y + 'px';
    game.appendChild(spike);
  });

  current.pits.forEach(pos => {
    const pit = document.createElement('div');
    pit.className = 'pit';
    pit.style.left = pos.x + 'px';
    pit.style.top = pos.y + 'px';
    game.appendChild(pit);
  });

  const flag = document.createElement('div');
  flag.className = 'flag';
  flag.style.left = current.flag.x + 'px';
  flag.style.top = current.flag.y + 'px';
  game.appendChild(flag);

  player.style.top = '10px';
  player.style.left = '10px';
  message.textContent = `Level ${level + 1}`;
}

function getRect(el) {
  return el.getBoundingClientRect();
}

function checkCollision() {
  const playerRect = getRect(player);
  const spikes = [...document.querySelectorAll('.obstacle')];
  const pits = [...document.querySelectorAll('.pit')];
  const flag = document.querySelector('.flag');

  for (let spike of spikes) {
    if (isColliding(playerRect, getRect(spike))) {
      message.textContent = 'Game Over. Hit a spike!';
      resetGame();
    }
  }

  for (let pit of pits) {
    if (isColliding(playerRect, getRect(pit))) {
      message.textContent = 'Game Over. Fell in a pit!';
      resetGame();
    }
  }

  if (flag && isColliding(playerRect, getRect(flag))) {
    level++;
    if (level >= totalLevels) {
      message.textContent = 'You Win!';
    } else {
      message.textContent = 'Next Level!';
      setTimeout(createLevel, 1000);
    }
  }
}

function isColliding(r1, r2) {
  return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

document.addEventListener('keydown', (e) => {
  const style = window.getComputedStyle(player);
  let top = parseInt(style.top);
  let left = parseInt(style.left);

  switch (e.key.toLowerCase()) {
    case 'w': top -= playerSpeed; break;
    case 's': top += playerSpeed; break;
    case 'a': left -= playerSpeed; break;
    case 'd': left += playerSpeed; break;
  }

  player.style.top = `${Math.max(0, Math.min(game.clientHeight - 20, top))}px`;
  player.style.left = `${Math.max(0, Math.min(game.clientWidth - 20, left))}px`;

  checkCollision();
});

function resetGame() {
  level = 0;
  setTimeout(createLevel, 1500);
}

createLevel();
