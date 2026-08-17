## MODIFIED Requirements

### Requirement: Digital Interaction Mapping Guide
The modal SHALL provide a clear reference mapping physical paper & marker mechanics to web game UI actions (such as card selection, Spades targeting mode, Diamond Vaulting, Clubs wildcard pairing, Black Curse weight partner reshuffle, and automated post-round attrition processing). Digital mappings SHALL match `docs/rules.md` §6: Hearts (Stock Reshuffle: shuffle Waste back into Stock without consuming a redeal), Diamonds (Vault: free FILO placement from Stock/Waste/Pyramid), Spades (Tunnel: move an exposed pyramid card onto the top of the Waste pile), Clubs (Universal Wildcard: pair with ANY exposed card), and Black Curse (Recycled Weight: partner reshuffled into Stock, or on dual Black Curses, higher functional value to Foundation and lower to Stock).

#### Scenario: Reviewing digital controls mapping
- **WHEN** the "Web Play & Controls" tab is active
- **THEN** the modal SHALL display instructions for each digital interaction model, including click mechanics, mode transitions, and visual indicator badges
- **AND** the Hearts description SHALL state Stock Reshuffle (Waste → Stock without redeal cost), the Spades description SHALL state moving an exposed pyramid card onto the Waste pile, and the Black Curse description SHALL state the partner card is shuffled back into the Stock draw pile (with dual Black Curses resolving higher functional value to Foundation and lower to Stock)
