const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;
const player = { x: 10, y: 10 };

// Array to store loaded tiles (sprites)
const tiles = [];
let tilesLoaded = false;

// Preload all tiles and track when they're loaded
function loadTiles() {
    let loadedCount = 0;
    for (let i = 0; i < 93; i++) {
        const img = new Image();
        img.src = `icons/${i}.png`; // Adjust path for your PNG tiles
        img.onload = () => {
            loadedCount++;
            if (loadedCount === 93) {
                tilesLoaded = true;
                drawMap();
            }
        };
        tiles.push(img);
    }
}
loadTiles();

// Randomized map generation (initial grid)
const mapGrid = Array.from({ length: MAP_HEIGHT }, () =>
    Array.from({ length: MAP_WIDTH }, () => Math.floor(Math.random() * tiles.length))
);

// Track placed tiles by sprite index and position
let placedTiles = [];
let selectedSprite = null;

// Draw the map grid
function drawMap() {
    if (!tilesLoaded) return; // Wait until tiles are loaded

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing

    // Draw the randomized map grid (background tiles)
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            ctx.drawImage(tiles[mapGrid[y][x]], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    // Draw the placed tiles (on top of the map)
    placedTiles.forEach(tile => {
        ctx.drawImage(tiles[tile.sprite], tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    // Draw the player marker (just for visualization)
    ctx.fillStyle = "red";
    ctx.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

// Handle sprite selection (from the side panel)
document.addEventListener("click", (event) => {
    const panel = document.getElementById("sprites");
    const spriteDiv = event.target;

    if (spriteDiv && spriteDiv.classList.contains("sprite")) {
        selectedSprite = parseInt(spriteDiv.getAttribute("data-index"), 10); // Set selected sprite by index
        console.log("Selected sprite: " + selectedSprite); // For debugging
    }
});

// Handle movement (Arrow keys)
document.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault(); // Prevent scrolling

        if (event.key === "ArrowLeft" && player.x > 0) player.x--;
        if (event.key === "ArrowRight" && player.x < MAP_WIDTH - 1) player.x++;
        if (event.key === "ArrowUp" && player.y > 0) player.y--;
        if (event.key === "ArrowDown" && player.y < MAP_HEIGHT - 1) player.y++;
        drawMap();
    }
});

// Handle sprite placement (space bar)
document.addEventListener("keydown", (e) => {
    if (e.key === " " && selectedSprite !== null) {
        // Place the selected sprite at the player's position
        placedTiles.push({ x: player.x, y: player.y, sprite: selectedSprite });
        drawMap();
    }
});

// Save the map grid and placed tiles as JSON
function saveMap() {
    const mapData = { mapGrid, placedTiles };
    const mapJSON = JSON.stringify(mapData);
    const blob = new Blob([mapJSON], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "map.json";
    a.click();
}

// Start drawing when the page loads
window.onload = () => {
    canvas.width = MAP_WIDTH * TILE_SIZE;
    canvas.height = MAP_HEIGHT * TILE_SIZE;
    drawMap();
};
