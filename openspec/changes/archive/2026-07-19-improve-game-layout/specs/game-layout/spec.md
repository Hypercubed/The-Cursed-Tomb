## ADDED Requirements

### Requirement: App shell uses responsive two-column layout on desktop
On viewports ≥ 1024px, the game shell SHALL display a fixed-width left sidebar (setup controls and game status) alongside a main content area (pyramid board and draw zone). On narrower viewports the layout SHALL stack vertically with sidebar content above the board.

#### Scenario: Desktop shows sidebar and board side by side
- **WHEN** the viewport is 1024px or wider
- **THEN** the setup/status panel SHALL appear in a left sidebar and the pyramid board SHALL occupy the remaining horizontal space

#### Scenario: Mobile shows stacked layout
- **WHEN** the viewport is narrower than 1024px
- **THEN** all panels SHALL stack vertically with setup at the top and the board below

### Requirement: Pyramid board is the visual centrepiece
The pyramid SHALL be rendered in a dedicated hero section that occupies the majority of the available board area with generous padding and centred alignment. It SHALL NOT share its container with the draw/discard zone.

#### Scenario: Pyramid and draw zone are in separate containers
- **WHEN** a game is in progress
- **THEN** the pyramid rows SHALL be rendered in a container that is visually distinct and separated from the draw/discard zone below it

#### Scenario: Pyramid rows are horizontally centred in their container
- **WHEN** any pyramid row is rendered
- **THEN** the cards in that row SHALL be centred horizontally within the available board width

### Requirement: Draw and discard zone is a dedicated strip
The draw pile and discard pile SHALL be displayed in a horizontal strip below the pyramid, visually separated by a divider or gap. Each pile SHALL have a clearly labelled card slot placeholder when empty.

#### Scenario: Draw zone appears below the pyramid
- **WHEN** a game is in progress
- **THEN** a draw/discard strip SHALL appear below the pyramid board with the draw pile slot on the left and the discard pile slot on the right

#### Scenario: Empty pile slot shows a placeholder
- **WHEN** the draw pile or discard pile is empty
- **THEN** the corresponding slot SHALL display a visible placeholder with a label (e.g. "Empty")

### Requirement: Game setup panel is always visible in the sidebar
Setup controls (redraw cycles, win condition, start/reset buttons) SHALL be housed in the left sidebar and remain visible during gameplay so the player can restart without scrolling.

#### Scenario: Setup controls remain in sidebar during active game
- **WHEN** a game is in progress
- **THEN** the redraw, win-condition controls, and start/reset buttons SHALL remain visible in the sidebar without requiring a scroll

### Requirement: Game status panel is always visible in the sidebar
The game status summary (status, redraws remaining, pile counts, selected card) SHALL be displayed in the sidebar below the setup controls, updating reactively as game state changes.

#### Scenario: Status updates while game is in progress
- **WHEN** the player draws a card or removes a pair
- **THEN** the sidebar status panel SHALL immediately reflect the updated draw pile count and redraws remaining
