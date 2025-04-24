const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

const ICON_PATH = "icons/"; // Folder where PNGs are stored
const TILE_SIZE = 32;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;
const player = { x: 10, y: 10 };
let selectedIcon = null;
let showLines = false;

// Load icons in sidebar
const iconContainer = document.getElementById("iconContainer");
for (let i = 0; i <= 10; i++) {
    let img = document.createElement("img");
    img.src = `${ICON_PATH}${i}.png`;
    img.style.width = "32px";
    img.style.cursor = "pointer";
    img.addEventListener("click", () => selectedIcon = img.src);
    iconContainer.appendChild(img);
}

// Generate empty grid
const mapGrid = Array.from({ length: MAP_HEIGHT }, () => Array(MAP_WIDTH).fill(null));

// Draw the map
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (mapGrid[y][x]) {
                let tile = new Image();
                tile.src = mapGrid[y][x];
                ctx.drawImage(tile, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }

            // Draw connection lines if toggled
            if (showLines && x > 0 && mapGrid[y][x] && mapGrid[y][x - 1]) {
                ctx.strokeStyle = "black";
                ctx.beginPath();
                ctx.moveTo(x * TILE_SIZE, y * TILE_SIZE + TILE_SIZE / 2);
                ctx.lineTo((x - 1) * TILE_SIZE + TILE_SIZE, y * TILE_SIZE + TILE_SIZE / 2);
                ctx.stroke();
            }
        }
    }

    // Draw player
    ctx.fillStyle = "red";
    ctx.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

// Handle movement & actions
document.addEventListener("keydown", (event) => {
    const { x, y } = player;
    if (event.key === "ArrowLeft" && x > 0) player.x--;
    if (event.key === "ArrowRight" && x < MAP_WIDTH - 1) player.x++;
    if (event.key === "ArrowUp" && y > 0) player.y--;
    if (event.key === "ArrowDown" && y < MAP_HEIGHT - 1) player.y++;
    
    // Place icon when holding Space
    if (event.key === " " && selectedIcon) {
        mapGrid[player.y][player.x] = selectedIcon;
    }

    // Delete tile with Delete key
    if (event.key === "Delete") {
        mapGrid[player.y][player.x] = null;
    }

    // Toggle connection lines with L key
    if (event.key === "l") {
        showLines = !showLines;
    }

    drawMap();
});

window.onload = () => {
    drawMap();
};
