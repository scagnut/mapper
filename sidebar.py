import os
import pygame

class Sidebar:
    def __init__(self, icon_dir, width, position=(0, 0), columns=2):
        """
        Initialize the Sidebar.
        :param icon_dir: Directory containing the icon files.
        :param width: Width of the sidebar in pixels.
        :param position: (x, y) position of the top-left corner of the sidebar.
        :param columns: Number of columns in the grid layout.
        """
        self.icon_dir = icon_dir
        self.width = width
        self.position = list(position)  # Make position mutable for dragging
        self.columns = columns  # Number of columns in the grid
        self.icons = self._load_icons()
        self.selected_icon = None
        self.dragging = False  # Track whether the sidebar is being dragged
        self.drag_offset = (0, 0)  # Offset when dragging starts
        self.scroll_offset = 0  # Offset for scrolling

        # Calculate icon size based on sidebar width and number of columns
        self.icon_size = (self.width // self.columns, self.width // self.columns)

    def _load_icons(self):
        """Load icons from the specified directory."""
        icons = []
        if os.path.isdir(self.icon_dir):
            for filename in sorted(os.listdir(self.icon_dir)):
                if filename.endswith(".png"):  # Assuming icons are PNG files
                    icon_image = pygame.image.load(os.path.join(self.icon_dir, filename))
                    icons.append(icon_image)
        else:
            print(f"Warning: Icon directory '{self.icon_dir}' does not exist.")
        return icons

    def handle_event(self, event):
        """Handle events for dragging and scrolling the sidebar."""
        if event.type == pygame.MOUSEBUTTONDOWN:
            x, y = event.pos
            # Check if the click is within the sidebar
            if event.button == 1 and self.position[0] <= x <= self.position[0] + self.width:
                self.dragging = True
                self.drag_offset = (x - self.position[0], y - self.position[1])
            elif event.button == 4:  # Scroll up
                self.scroll_offset = min(self.scroll_offset + 50, 0)
            elif event.button == 5:  # Scroll down
                max_scroll = max((len(self.icons) // self.columns) * self.icon_size[1] - 800, 0)  # Assuming 800px window height
                self.scroll_offset = max(self.scroll_offset - 50, -max_scroll)

        elif event.type == pygame.MOUSEBUTTONUP and event.button == 1:
            self.dragging = False

        elif event.type == pygame.MOUSEMOTION and self.dragging:
            # Update the sidebar position while dragging
            self.position[0] = event.pos[0] - self.drag_offset[0]
            self.position[1] = event.pos[1] - self.drag_offset[1]

    def draw(self, screen):
        """Draw the sidebar and its icons on the screen."""
        sidebar_x, sidebar_y = self.position
        background_color = (50, 50, 50)
        border_color = (255, 255, 255)

        # Draw sidebar background
        sidebar_height = len(self.icons) * self.icon_size[1]
        pygame.draw.rect(screen, background_color, (sidebar_x, sidebar_y, self.width, sidebar_height))

        # Draw icons in a grid layout
        for index, icon in enumerate(self.icons):
            row = index // self.columns
            col = index % self.columns

            # Calculate icon position with scroll offset
            icon_x = sidebar_x + col * self.icon_size[0]
            icon_y = sidebar_y + row * self.icon_size[1] + self.scroll_offset

            # Only draw icons within the visible area
            if sidebar_y <= icon_y <= 800:  # Assuming 800px window height
                scaled_icon = pygame.transform.scale(icon, self.icon_size)  # Scale icon to fit grid cell
                screen.blit(scaled_icon, (icon_x, icon_y))

                # Highlight selected icon
                if index == self.selected_icon:
                    icon_rect = pygame.Rect(icon_x, icon_y, *self.icon_size)
                    pygame.draw.rect(screen, border_color, icon_rect, 3)
