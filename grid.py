import pygame

class Grid:
    def __init__(self, width, height, sidebar_width):
        self.width = width
        self.height = height
        self.sidebar_width = sidebar_width
        self.cell_size = 32  # Default cell size
        self.grid_offset_x = 0
        self.grid_offset_y = 0
        self.blocks = {}  # Dictionary to store blocks (key: (row, col), value: icon index)
        self.lines = []  # List of lines (each line is a tuple of two points)

    def draw(self, screen):
        # Draw grid lines
        for x in range(self.sidebar_width, self.width, self.cell_size):
            pygame.draw.line(screen, (50, 50, 50), (x + self.grid_offset_x, 0), (x + self.grid_offset_x, self.height))
        for y in range(0, self.height, self.cell_size):
            pygame.draw.line(screen, (50, 50, 50), (self.sidebar_width, y + self.grid_offset_y), (self.width, y + self.grid_offset_y))

        # Draw lines under blocks
        for line in self.lines:
            pygame.draw.line(screen, (0, 0, 255), line[0], line[1], 2)

        # Draw blocks
        for (row, col), icon in self.blocks.items():
            x = self.sidebar_width + col * self.cell_size + self.grid_offset_x
            y = row * self.cell_size + self.grid_offset_y
            screen.blit(icon, (x, y))

    def add_block(self, row, col, icon):
        self.blocks[(row, col)] = icon

    def remove_block(self, row, col):
        if (row, col) in self.blocks:
            del self.blocks[(row, col)]

    def add_line(self, start, end):
        self.lines.append((start, end))

    def zoom(self, zoom_in):
        if zoom_in and self.cell_size < 64:
            self.cell_size += 2
        elif not zoom_in and self.cell_size > 16:
            self.cell_size -= 2
