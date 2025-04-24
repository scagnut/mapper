const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;
const player = { x: 10, y: 10 };

const tiles = [];
for (let i = 0; i < 93; i++) {
    let img = new Image();
    img.src = `icons/${i}.png`; // Adjust path for your PNG tiles
    tiles.push(img);
}

// Randomized map generation
const mapGrid = Array.from({ length: MAP_HEIGHT }, () =>
    Array.from({ length: MAP_WIDTH }, () => Math.floor(Math.random() * tiles.length))
);

// Draw the map
function drawMap() {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            ctx.drawImage(tiles[mapGrid[y][x]], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    ctx.fillStyle = "red";
    ctx.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE); // Player marker
}

// Handle movement
document.addEventListener("keydown", (event) => {
    const { x, y } = player;
    if (event.key === "ArrowLeft" && x > 0) player.x--;
    if (event.key === "ArrowRight" && x < MAP_WIDTH - 1) player.x++;
    if (event.key === "ArrowUp" && y > 0) player.y--;
    if (event.key === "ArrowDown" && y < MAP_HEIGHT - 1) player.y++;
    drawMap();
});

window.onload = () => {
    drawMap();
};
