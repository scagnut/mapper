const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const ICON_SIZE = 28;
const MAP_WIDTH = 100;
const MAP_HEIGHT = 100;

let scale = 1;
let originX = 0;
let originY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };

const player = { x: 10, y: 10 };
let selectedSprite = null;
let placedTiles = [];

const tiles = [];

function loadTiles() {
  const total = 94;
  let loaded = 0;
  for (let i = 0; i < total; i++) {
    const img = new Image();
    img.src = `icons/${i}.png`;
    img.onload = () => {
      if (++loaded === total * 2) {
        initializePanel();
        draw();
      }
    };
    tiles.push(img);

    const imgS = new Image();
    imgS.src = `icons/${i}s.png`;
    imgS.onload = () => {
      if (++loaded === total * 2) {
        initializePanel();
        draw();
      }
    };
    tiles.push(imgS);
  }
}
loadTiles();

function initializePanel() {
  const spritePanel = document.getElementById("sprites");
  tiles.forEach((tile, index) => {
    const div = document.createElement("div");
    div.className = "sprite";
    div.style.backgroundImage = `url('${tile.src}')`;
    div.dataset.index = index;
    div.addEventListener("click", () => {
      document.querySelectorAll('.sprite').forEach(s => s.classList.remove('selected'));
      div.classList.add("selected");
      selectedSprite = index;
    });
    spritePanel.appendChild(div);
  });
}

function draw() {
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, originX, originY);
  ctx.clearRect(-originX / scale, -originY / scale, canvas.width / scale, canvas.height / scale);

  // Draw grid
  for (let x = 0; x <= MAP_WIDTH; x++) {
    ctx.beginPath();
    ctx.moveTo(x * TILE_SIZE, 0);
    ctx.lineTo(x * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
  }
  for (let y = 0; y <= MAP_HEIGHT; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * TILE_SIZE);
    ctx.lineTo(MAP_WIDTH * TILE_SIZE, y * TILE_SIZE);
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
  }

  // Draw placed tiles
  placedTiles.forEach(tile => {
    const x = tile.x * TILE_SIZE + (TILE_SIZE - ICON_SIZE) / 2;
    const y = tile.y * TILE_SIZE + (TILE_SIZE - ICON_SIZE) / 2;
    ctx.drawImage(tiles[tile.sprite], x, y, ICON_SIZE, ICON_SIZE);
  });

  // Draw player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

  ctx.restore();
}

function getTileAt(x, y) {
  return placedTiles.findIndex(tile => tile.x === x && tile.y === y);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") player.y--;
  if (e.key === "ArrowDown") player.y++;
  if (e.key === "ArrowLeft") player.x--;
  if (e.key === "ArrowRight") player.x++;

  if (e.key === " " && selectedSprite !== null) {
    const existing = getTileAt(player.x, player.y);
    if (existing >= 0) placedTiles[existing].sprite = selectedSprite;
    else placedTiles.push({ x: player.x, y: player.y, sprite: selectedSprite });
  }

  if (e.key === "Delete") {
    const index = getTileAt(player.x, player.y);
    if (index >= 0) placedTiles.splice(index, 1);
  }

  draw();
});

// Zoom with mouse wheel
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  const wheel = e.deltaY < 0 ? 1.1 : 0.9
::contentReference[oaicite:0]{index=0}
 
