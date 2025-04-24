const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const ICON_SIZE = 28;
const MAP_WIDTH = 100;
const MAP_HEIGHT = 100;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    placedTiles.forEach(tile => {
        const screenX = tile.x * TILE_SIZE * zoom + offsetX;
        const screenY = tile.y * TILE_SIZE * zoom + offsetY;
        const size = ICON_SIZE * zoom;
        ctx.drawImage(tiles[tile.sprite], screenX + (TILE_SIZE * zoom - size) / 2, screenY + (TILE_SIZE * zoom - size) / 2, size, size);
    });

    const px = player.x * TILE_SIZE * zoom + offsetX;
    const py = player.y * TILE_SIZE * zoom + offsetY;
    ctx.fillStyle = "red";
    ctx.fillRect(px, py, TILE_SIZE * zoom, TILE_SIZE * zoom);
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
    const zoomFactor = 1.1;
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    const wx = (mouseX - offsetX) / zoom;
    const wy = (mouseY - offsetY) / zoom;

    if (e.deltaY < 0) zoom *= zoomFactor;
    else zoom /= zoomFactor;

    offsetX = mouseX - wx * zoom;
    offsetY = mouseY - wy * zoom;

    draw();
});
