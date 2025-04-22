import pygame
from grid import Grid
from sidebar import Sidebar
from input_handler import InputHandler

# Constants
WINDOW_WIDTH, WINDOW_HEIGHT = 1200, 800
SIDEBAR_WIDTH = 200
ICON_DIR = "./icons"

def main():
    pygame.init()
    pygame.display.set_caption("MUD Map Designer")
    screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT), pygame.RESIZABLE)
    clock = pygame.time.Clock()

    # Initialize components
    sidebar = Sidebar(icon_dir=ICON_DIR, width=SIDEBAR_WIDTH, position=(0, 0))
    grid = Grid(width=WINDOW_WIDTH - SIDEBAR_WIDTH, height=WINDOW_HEIGHT, sidebar_width=SIDEBAR_WIDTH)
    input_handler = InputHandler(grid, sidebar)

    # Main loop
    running = True
    while running:
        screen.fill((30, 30, 30))  # Background color

        # Handle events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            input_handler.handle_event(event)

        # Draw components
        sidebar.draw(screen)
        grid.draw(screen)

        # Update the display
        pygame.display.flip()
        clock.tick(60)

    pygame.quit()


if __name__ == "__main__":
    main()
