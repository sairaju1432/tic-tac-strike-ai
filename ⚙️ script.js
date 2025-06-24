let grid = Array(9).fill('');
const human = 'X';
const bot = 'O';

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', () => {
    if (grid[cell.id] === '') {
      makeMove(cell.id, human);
      if (!checkWin(grid, human) && !isFull()) {
        const move = findBestMove();
        makeMove(move, bot);
      }
    }
  });
});

function makeMove(pos, player) {
  grid[pos] = player;
  const cell = document.getElementById(pos);
  cell.innerText = player;
  cell.classList.add('disabled');
  if (checkWin(grid, player)) {
    setTimeout(() => alert(`${player} wins!`), 100);
  } else if (isFull()) {
    setTimeout(() => alert('Draw!'), 100);
  }
}

function checkWin(b, p) {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return combos.some(line => line.every(i => b[i] === p));
}

function isFull() {
  return grid.every(cell => cell !== '');
}

function startGame() {
  grid.fill('');
  document.querySelectorAll('.cell').forEach(cell => {
    cell.innerText = '';
    cell.classList.remove('disabled');
  });
}

function findBestMove() {
  return mini(grid, bot).index;
}

function mini(b, player) {
  const open = b.map((val, i) => val === '' ? i : null).filter(v => v !== null);
  if (checkWin(b, human)) return {score: -10};
  if (checkWin(b, bot)) return {score: 10};
  if (open.length === 0) return {score: 0};

  const moves = open.map(i => {
    let boardCopy = [...b];
    boardCopy[i] = player;
    let result = mini(boardCopy, player === bot ? human : bot);
    return {index: i, score: result.score};
  });

  return player === bot
    ? moves.reduce((a, b) => a.score > b.score ? a : b)
    : moves.reduce((a, b) => a.score < b.score ? a : b);
}
