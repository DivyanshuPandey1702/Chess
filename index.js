let turn = 1;
let highlighted = 0;
let nextMoves = null;
let curMove;

const generateBoard = () => {
  let board = "";
  let color = true;
  for (let i = 0; i < 8; i++) {
    let s = "<ul>";
    for (let j = 0; j < 8; j++) {
      let t = `<li id='${i + "" + j}' class='tile ${
        color ? "tile-color-white" : "tile-color-black"
      }' data-x='${i}' data-y='${j}'></li>`;
      color = !color;
      s = s + t;
    }
    color = !color;
    s = s + "</ul>";
    board = board + s;
  }
  document.getElementById("board").innerHTML = board;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let tile = document.getElementById(`${i + "" + j}`);
      tile.onclick = (e) => check(e);
    }
  }
  const black = ["rd", "nd", "bd", "qd", "kd", "bd", "nd", "rd"];
  const white = ["rl", "nl", "bl", "ql", "kl", "bl", "nl", "rl"];
  for (let i = 0; i < 16; i++) {
    let tile;
    if (i < 8) tile = getTile(0, i);
    else tile = getTile(1, i - 8);
    const image = document.createElement("img");
    image.src = "./images/" + (i < 8 ? black[i] : "pd") + ".png";
    tile.appendChild(image);
  }
  for (let i = 0; i < 16; i++) {
    let tile;
    if (i < 8) tile = getTile(6, i);
    else tile = getTile(7, i - 8);
    const image = document.createElement("img");
    image.src = "./images/" + (i > 7 ? white[i - 8] : "pl") + ".png";
    tile.appendChild(image);
  }
};

const getTile = (x, y) => {
  return document.getElementById(`${x + "" + y}`);
};

const getTileType = (tile) => {
  return tile.src.substr(-6, 2);
};

const getX = (tile) => {
  return parseInt(tile.getAttribute("data-x"));
};

const getY = (tile) => {
  return parseInt(tile.getAttribute("data-y"));
};

const getPieceColor = (piece) => {
  return piece.substr(1, 1);
};

const getPieceType = (piece) => {
  return piece.substr(0, 1);
};

const getPiece = (tile) => {
  if (tile.tagName === "IMG") return tile.parentElement;
  return tile;
};

const hasPiece = (tile) => {
  if (tile.tagName === "IMG") {
    return tile.parentElement;
  } else if (
    tile.childNodes.length === 1 &&
    tile.childNodes[0].tagName === "IMG"
  ) {
    return tile;
  }
  return null;
};

// Get Pawn Moves
const getMovesPawn = (color, x, y) => {
  let moves = [];
  if (color === "l") {
    if (x - 1 >= 0) {
      if (hasPiece(getTile(x - 1, y)) === null)
        moves.push({ xi: x - 1, yi: y });
      if (y - 1 >= 0)
        if (hasPiece(getTile(x - 1, y - 1)))
          moves.push({ xi: x - 1, yi: y - 1 });
      if (y + 1 < 8)
        if (hasPiece(getTile(x - 1, y + 1)))
          moves.push({ xi: x - 1, yi: y + 1 });
      if (x === 6 && hasPiece(getTile(x - 1, y)) === null)
        moves.push({ xi: x - 2, yi: y });
    }
  } else {
    if (x + 1 < 8) {
      if (hasPiece(getTile(x + 1, y)) === null)
        moves.push({ xi: x + 1, yi: y });
      if (y - 1 >= 0)
        if (hasPiece(getTile(x + 1, y - 1)))
          moves.push({ xi: x + 1, yi: y - 1 });
      if (y + 1 < 8)
        if (hasPiece(getTile(x + 1, y + 1)))
          moves.push({ xi: x + 1, yi: y + 1 });
      if (x === 1 && hasPiece(getTile(x + 1, y)) === null)
        moves.push({ xi: x + 2, yi: y });
    }
  }
  return moves;
};

const getMovesRook = (x, y) => {
  let moves = [];
  let i = x - 1,
    j = y;
  while (i >= 0) {
    moves.push({ xi: i, yi: j });
    if (hasPiece(getTile(i, j))) break;
    i--;
  }
  i = x + 1;
  while (i < 8) {
    moves.push({ xi: i, yi: j });
    if (hasPiece(getTile(i, j))) break;
    i++;
  }
  i = x;
  j = y - 1;
  while (j >= 0) {
    moves.push({ xi: i, yi: j });
    if (hasPiece(getTile(i, j))) break;
    j--;
  }
  j = y + 1;
  while (j < 8) {
    moves.push({ xi: i, yi: j });
    if (hasPiece(getTile(i, j))) break;
    j++;
  }
  return moves;
};

const getMovesKnight = (x, y) => {
  let moves = [];
  if (x - 2 >= 0 && y - 1 >= 0) moves.push({ xi: x - 2, yi: y - 1 });
  if (x - 2 >= 0 && y + 1 < 8) moves.push({ xi: x - 2, yi: y + 1 });
  if (x + 2 < 8 && y - 1 >= 0) moves.push({ xi: x + 2, yi: y - 1 });
  if (x + 2 < 8 && y + 1 < 8) moves.push({ xi: x + 2, yi: y + 1 });
  if (x - 1 >= 0 && y - 2 >= 0) moves.push({ xi: x - 1, yi: y - 2 });
  if (x + 1 < 8 && y - 2 >= 0) moves.push({ xi: x + 1, yi: y - 2 });
  if (x - 1 >= 0 && y + 2 < 8) moves.push({ xi: x - 1, yi: y + 2 });
  if (x + 1 < 8 && y + 2 < 8) moves.push({ xi: x + 1, yi: y + 2 });
  return moves;
};

const getMovesBishop = (x, y) => {
  let moves = [];
  let i = x - 1,
    j = y - 1;
  while (i >= 0 && j >= 0) {
    moves.push({ xi: i, yi: j });
    if (hasPiece(getTile(i, j))) break;
    i--;
    j--;
  }
  i = x + 1;
  j = y + 1;
  while (i < 8 && j < 8) {
    moves.push({ xi: i, yi: j });
    if (hasPiece(getTile(i, j))) break;
    i++;
    j++;
  }
  i = x - 1;
  j = y + 1;
  while (i >= 0 && j < 8) {
    moves.push({ xi: i, yi: j });
    if (hasPiece(getTile(i, j))) break;
    i--;
    j++;
  }
  i = x + 1;
  j = y - 1;
  while (i < 8 && j >= 0) {
    moves.push({ xi: i, yi: j });
    if (hasPiece(getTile(i, j))) break;
    i++;
    j--;
  }
  return moves;
};

const getMovesKing = (x, y) => {
  let moves = [];
  if (x - 1 >= 0 && y - 1 >= 0) moves.push({ xi: x - 1, yi: y - 1 });
  if (x - 1 >= 0) moves.push({ xi: x - 1, yi: y });
  if (x - 1 >= 0 && y + 1 < 8) moves.push({ xi: x - 1, yi: y + 1 });
  if (x + 1 < 8) moves.push({ xi: x + 1, yi: y });
  if (x + 1 < 8 && y + 1 < 8) moves.push({ xi: x + 1, yi: y + 1 });
  if (x + 1 < 8 && y - 1 >= 0) moves.push({ xi: x + 1, yi: y - 1 });
  if (y - 1 >= 0) moves.push({ xi: x, yi: y - 1 });
  if (y + 1 < 8) moves.push({ xi: x, yi: y + 1 });
  return moves;
};

const getMovesQueen = (x, y) => {
  let moves = [...getMovesRook(x, y), ...getMovesBishop(x, y)];
  return moves;
};

// Get Moves
const getMoves = (piece, x, y) => {
  let color = getPieceColor(piece);
  let type = getPieceType(piece);
  let moves = [];
  switch (type) {
    case "p":
      moves = getMovesPawn(color, x, y);
      break;
    case "r":
      moves = getMovesRook(x, y);
      break;
    case "n":
      moves = getMovesKnight(x, y);
      break;
    case "b":
      moves = getMovesBishop(x, y);
      break;
    case "q":
      moves = getMovesQueen(x, y);
      break;
    case "k":
      moves = getMovesKing(x, y);
  }
  return moves;
};

const highlightNextPossibleMoves = (x, y, color, moves) => {
  highlighted = 1;
  nextMoves = [];
  let tile = getTile(x, y);
  curMove = tile;
  tile.className = "tile tile-color-cur";
  for (const move of moves) {
    tile = getTile(move.xi, move.yi);
    if (hasPiece(tile)) {
      if (getPieceColor(getTileType(tile.childNodes[0])) === color) {
        tile.className = "tile tile-color-red";
      } else {
        tile.className = "tile tile-color-green";
        nextMoves.push(move);
      }
    } else {
      tile.className = "tile tile-color-green";
      nextMoves.push(move);
    }
  }
};

const removeHighlight = () => {
  highlighted = 0;
  curMove = null;
  nextMoves = null;
  let color = 1;
  let i = 0;
  let tiles = document.getElementsByTagName("li");
  for (const tile of tiles) {
    tile.className = `tile ${color ? "tile-color-white" : "tile-color-black"}`;
    color = !color;
    i++;
    if (i == 8) {
      i = 0;
      color = !color;
    }
  }
};

const checkWin = () => {
  let tiles = document.getElementsByTagName("li");
  let c = 0;
  for (let tile of tiles) {
    let tempTile = hasPiece(tile);
    if (
      hasPiece(tile) &&
      getPieceType(getTileType(tempTile.childNodes[0])) === "k"
    )
      c++;
  }
  return c < 2;
};

const check = (e) => {
  let tile = getPiece(e.path[0]);
  let move = { xi: getX(tile), yi: getY(tile) };
  let nxtmov = { xi: -1, yi: -1 };
  if (
    nextMoves !== null &&
    nextMoves.find((cur) => {
      if (move.xi === cur.xi && move.yi === cur.yi) nxtmov = cur;
      return move.xi === cur.xi && move.yi === cur.yi;
    })
  ) {
    let nextTile = getTile(nxtmov.xi, nxtmov.yi);
    let child = document.createElement("img");
    child.src = curMove.childNodes[0].src;
    curMove.removeChild(curMove.childNodes[0]);
    nextTile.textContent = "";
    nextTile.appendChild(child);
    if (checkWin()) {
      alert(`${turn === 1 ? "White" : "Black"} won the game.`);
      turn = 1;
      removeHighlight();
      generateBoard();
      return;
    }
    if (turn === 1) turn = 0;
    else turn = 1;
    removeHighlight();
  } else {
    removeHighlight();
    if (hasPiece(tile)) {
      let piece, x, y;
      piece = getTileType(tile.childNodes[0]);
      x = getX(tile);
      y = getY(tile);
      let color = getPieceColor(piece);
      let moves = getMoves(piece, x, y);
      if ((turn === 1 && color === "l") || (turn === 0 && color === "d"))
        highlightNextPossibleMoves(x, y, color, moves);
    }
  }
};

generateBoard();
