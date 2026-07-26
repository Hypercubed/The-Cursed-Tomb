## MODIFIED Requirements

### Requirement: Dark sandstone and obsidian color scheme
The app SHALL apply `#0d0a07` to the root background (`game-bg`), `#241e17` to game containers (`game-panel`), `#44382c` to borders (`game-border`), `#f5f0e6` to card backgrounds (`game-card-bg`), `#1c1710` to black card text (`game-card-text`), and `#dc2626` to red card text (`game-red`).

#### Scenario: Visual elements display updated high-contrast color tokens
- **WHEN** the main layout or card board is rendered
- **THEN** card background, panel, border, and suit colors SHALL match the high-contrast light parchment and dark sandstone color tokens
