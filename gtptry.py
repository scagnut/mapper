import tkinter as tk
from tkinter import filedialog
from PIL import Image, ImageTk, ImageDraw
import os

ICON_FOLDER = "icons"
TILE_SIZE = 32
GRID_WIDTH = 200
GRID_HEIGHT = 200

class MudMapper(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("MUD Mapper")
        self.geometry("1024x768")

        self.tileset_suffix = ""
        self.icons = {}
        self.load_icons()

        self.grid_data = [[None for _ in range(GRID_WIDTH)] for _ in range(GRID_HEIGHT)]
        self.offset_x = 0
        self.offset_y = 0

        self.selected_tile = 0

        self.create_widgets()
        self.bind_keys()

    def load_icons(self):
        self.icons.clear()
        for i in range(94):
            name = f"{i}{self.tileset_suffix}.png"
            path = os.path.join(ICON_FOLDER, name)
            if os.path.exists(path):
                img = Image.open(path).resize((TILE_SIZE, TILE_SIZE), Image.NEAREST)
                self.icons[i] = ImageTk.PhotoImage(img)
            else:
                self.icons[i] = None

    def create_widgets(self):
        self.icon_frame = tk.Frame(self, width=100)
        self.icon_frame.pack(side=tk.LEFT, fill=tk.Y)

        self.canvas = tk.Canvas(self, bg="white")
        self.canvas.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)
        self.canvas.bind("<Button-1>", self.place_tile)

        self.icon_buttons = []
        for i in range(94):
            icon = self.icons.get(i)
            btn = tk.Button(self.icon_frame, image=icon, command=lambda i=i: self.select_tile(i))
            btn.grid(row=i % 47, column=i // 47)
            self.icon_buttons.append(btn)

        self.save_btn = tk.Button(self.icon_frame, text="Save PNG", command=self.save_image)
        self.save_btn.grid(row=48, column=0, columnspan=2)

        self.redraw()

    def bind_keys(self):
        self.bind("<Key-w>", lambda e: self.move_view(0, -1))
        self.bind("<Key-s>", lambda e: self.move_view(0, 1))
        self.bind("<Key-a>", lambda e: self.move_view(-1, 0))
        self.bind("<Key-d>", lambda e: self.move_view(1, 0))
        self.bind("<space>", self.place_tile)
        self.bind("<Delete>", self.remove_tile)
        self.bind("<grave>", self.toggle_tileset)

    def select_tile(self, tile_id):
        self.selected_tile = tile_id

    def move_view(self, dx, dy):
        self.offset_x += dx
        self.offset_y += dy
        self.redraw()

    def place_tile(self, event):
        x = (event.x // TILE_SIZE) + self.offset_x
        y = (event.y // TILE_SIZE) + self.offset_y
        if 0 <= x < GRID_WIDTH and 0 <= y < GRID_HEIGHT:
            self.grid_data[y][x] = self.selected_tile
        self.redraw()

    def remove_tile(self, event):
        x = self.offset_x
        y = self.offset_y
        if 0 <= x < GRID_WIDTH and 0 <= y < GRID_HEIGHT:
            self.grid_data[y][x] = None
        self.redraw()

    def toggle_tileset(self, event):
        self.tileset_suffix = "s" if self.tileset_suffix == "" else ""
        self.load_icons()
        for i, btn in enumerate(self.icon_buttons):
            btn.configure(image=self.icons.get(i))
        self.redraw()

    def redraw(self):
        self.canvas.delete("all")
        w = self.canvas.winfo_width() // TILE_SIZE
        h = self.canvas.winfo_height() // TILE_SIZE
        for y in range(h):
            for x in range(w):
                gx = x + self.offset_x
                gy = y + self.offset_y
                if 0 <= gx < GRID_WIDTH and 0 <= gy < GRID_HEIGHT:
                    tile_id = self.grid_data[gy][gx]
                    if tile_id is not None and self.icons[tile_id]:
                        self.canvas.create_image(x * TILE_SIZE, y * TILE_SIZE, anchor=tk.NW, image=self.icons[tile_id])

    def save_image(self):
        img = Image.new("RGBA", (GRID_WIDTH * TILE_SIZE, GRID_HEIGHT * TILE_SIZE), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        for y in range(GRID_HEIGHT):
            for x in range(GRID_WIDTH):
                tile_id = self.grid_data[y][x]
                if tile_id is not None:
                    tile_path = os.path.join(ICON_FOLDER, f"{tile_id}{self.tileset_suffix}.png")
                    if os.path.exists(tile_path):
                        tile_img = Image.open(tile_path).resize((TILE_SIZE, TILE_SIZE), Image.NEAREST)
                        img.paste(tile_img, (x * TILE_SIZE, y * TILE_SIZE), tile_img)
        file = filedialog.asksaveasfilename(defaultextension=".png", filetypes=[("PNG files", "*.png")])
        if file:
            img.save(file)

if __name__ == "__main__":
    app = MudMapper()
    app.mainloop()
