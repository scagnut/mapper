const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;
const player = { x: 10, y: 10 };

// Array to store loaded tiles (sprites)
const tiles = [];
for (let i = 0; i < 93; i++) {
    let img = new Image();
    img.src = `icons/${i}.png`; // Adjust path for your PNG tiles
    tiles.push(img);
}

// Randomized map generation (initial grid)
const mapGrid = Array.from({ length: MAP_HEIGHT }, () =>
    Array.from({ length: MAP_WIDTH }, () => Math.floor(Math.random() * tiles.length))
);

// Track placed tiles by sprite index and position
let placedTiles = [];
let selectedSprite = null;
let position = { x: 0, y: 0 }; // Position for sprite placement

// Draw the map grid
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing

    // Draw the randomized map grid
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            ctx.drawImage(tiles[mapGrid[y][x]], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    // Draw the placed tiles
    placedTiles.forEach(tile => {
        ctx.drawImage(tiles[tile.sprite], tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    // Draw the currently selected sprite as an underlay
    if (selectedSprite !== null) {
        ctx.drawImage(tiles[selectedSprite], position.x * TILE_SIZE, position.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    // Draw the player marker (just for visualization)
    ctx.fillStyle = "red";
    ctx.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

// Handle sprite selection (from the side panel)
document.addEventListener("click", (event) => {
    const panel = document.getElementById('sprites');
    const spriteDiv = event.target;

    if (spriteDiv && spriteDiv.classList.contains('sprite')) {
        selectedSprite = spriteDiv.getAttribute('data-index');
        console.log("Selected sprite: " + selectedSprite); // For debugging
    }
});

// Handle movement (WASD keys)
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.x > 0) player.x--;
    if (event.key === "ArrowRight" && player.x < MAP_WIDTH - 1) player.x++;
    if (event.key === "ArrowUp" && player.y > 0) player.y--;
    if (event.key === "ArrowDown" && player.y < MAP_HEIGHT - 1) player.y++;
    drawMap();
});

// Handle sprite placement (space bar)
document.addEventListener("keydown", (e) => {
    if (e.key === ' ' && selectedSprite !== null) {
        placedTiles.push({ x: position.x, y: position.y, sprite: selectedSprite });
        drawMap();
    }
});

window.onload = () => {
    drawMap();
};
