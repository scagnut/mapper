import pygame

class InputHandler:
    def __init__(self, grid, sidebar):
        self.grid = grid
        self.sidebar = sidebar
        self.placing_mode = False

    def handle_event(self, event):
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_w:
                self.grid.grid_offset_y += self.grid.cell_size
            elif event.key == pygame.K_s:
                self.grid.grid_offset_y -= self.grid.cell_size
            elif event.key == pygame.K_a:
                self.grid.grid_offset_x += self.grid.cell_size
            elif event.key == pygame.K_d:
                self.grid.grid_offset_x -= self.grid.cell_size
            elif event.key == pygame.K_SPACE:
                self.placing_mode = not self.placing_mode
            elif event.key == pygame.K_BACKQUOTE:  # Swap block type
                self.sidebar.toggle_block_type()
            elif event.key == pygame.K_DELETE:
                # Logic to remove a block
                pass
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 4:  # Scroll up
                self.grid.zoom(zoom_in=True)
            elif event.button == 5:  # Scroll down
                self.grid.zoom(zoom_in=False)
