const BASE_TILE_SIZE = 32;  // Base size of each tile
const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;
let TILE_SIZE = BASE_TILE_SIZE;  // Default tile size (will scale based on zoom)

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");
canvas.width = TILE_SIZE * GRID_WIDTH;
canvas.height = TILE_SIZE * GRID_HEIGHT;

const panel = document.getElementById("panel");

let tiles = {};
let selectedTile = null;
let placedTiles = Array.from({ length: GRID_HEIGHT }, () =>
  Array(GRID_WIDTH).fill(null)
);

let lastClickedCell = null;
let zoomFactor = 1;  // Initial zoom factor (1 is normal size)

// Load all icons
function loadTiles() {
  const total = 94;
  let loaded = 0;

  function onImageLoad() {
    loaded++;
    if (loaded === total * 2) {
      renderPanel();
      drawGrid();
    }
  }

  for (let i = 0; i < total; i++) {
    let normal = new Image();
    normal.src = `icons/${i}.png`;
    normal.onload = onImageLoad;
    tiles[i] = normal;

    let special = new Image();
    special.src = `icons/${i}s.png`;
    special.onload = onImageLoad;
    tiles[`${i}s`] = special;
  }
}

function renderPanel() {
  Object.entries(tiles).forEach(([key, img]) => {
    let div = document.createElement("div");
    div.className = "sprite";
    div.style.backgroundImage = `url(${img.src})`;
    div.dataset.key = key;

    div.onclick = () => {
      document.querySelectorAll(".sprite").forEach(d => d.classList.remove("selected"));
      div.classList.add("selected");
      selectedTile = key;
    };

    panel.appendChild(div);
  });
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update canvas size based on zoom factor
  canvas.width = TILE_SIZE * GRID_WIDTH;
  canvas.height = TILE_SIZE * GRID_HEIGHT;

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const tile = placedTiles[y][x];
      if (tile) {
        // Draw icons smaller than grid (based on zoom)
        ctx.drawImage(tiles[tile], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
      }
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
  const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
  if (x >= 0 && y >= 0 && x < GRID_WIDTH && y < GRID_HEIGHT) {
    if (selectedTile !== null) {
      placedTiles[y][x] = selectedTile;
      lastClickedCell = { x, y };
      drawGrid();
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Delete" && lastClickedCell) {
    const { x, y } = lastClickedCell;
    placedTiles[y][x] = null;
    drawGrid();
  }

  // Zoom in and out using +/- keys
  if (e.key === "+" || e.key === "=") {
    zoomIn();
  } else if (e.key === "-" && zoomFactor > 0.5) {
    zoomOut();
  }
});

function zoomIn() {
  zoomFactor *= 1.1;
  TILE_SIZE = BASE_TILE_SIZE * zoomFactor;
  drawGrid();
}

function zoomOut() {
  zoomFactor /= 1.1;
  TILE_SIZE = BASE_TILE_SIZE * zoomFactor;
  drawGrid();
}

loadTiles();
