const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

const ICON_PATH = "icons/";
const TILE_SIZE = 32;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;
const player = { x: 10, y: 10 };
let selectedIcon = null;

const iconContainer = document.getElementById("iconContainer");
for (let i = 0; i <= 10; i++) {
    let img = document.createElement("img");
    img.src = `${ICON_PATH}${i}.png`;
    img.style.width = "32px";
    img.style.cursor = "pointer";
    img.addEventListener("click", () => selectedIcon = img.src);
    iconContainer.appendChild(img);
}

const mapGrid = Array.from({ length: MAP_HEIGHT }, () => Array(MAP_WIDTH).fill(null));

function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (mapGrid[y][x]) {
                let tile = new Image();
                tile.src = mapGrid[y][x];
                ctx.drawImage(tile, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    ctx.fillStyle = "red";
    ctx.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

document.addEventListener("keydown", (event) => {
    const { x, y } = player;
    if (event.key === "ArrowLeft" && x > 0) player.x--;
    if (event.key === "ArrowRight" && x < MAP_WIDTH - 1) player.x++;
    if (event.key === "ArrowUp" && y > 0) player.y--;
    if (event.key === "ArrowDown" && y < MAP_HEIGHT - 1) player.y++;

    if (event.key === " " && selectedIcon) {
        mapGrid[player.y][player.x] = selectedIcon;
    }

    if (event.key === "Delete") {
        mapGrid[player.y][player.x] = null;
    }

    drawMap();
});

window.onload = () => {
    drawMap();
};
