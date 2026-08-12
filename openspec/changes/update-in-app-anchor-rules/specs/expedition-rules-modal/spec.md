## MODIFIED Requirements

### Requirement: Core Physical Ruleset Documentation Rendering
The modal SHALL render all 7 sections of the official physical ruleset (`docs/rules.md`), including Expedition Objective & Defeat Conditions, Core Definitions, Preparation & Difficulty, Live-Play Architecture (including Retrospective Anchor Rules & Absorption Shield), Attrition Track (including Immunity Exception for Anchors), Survival Rewards (including Suit Hero Blessings, Anchor Progression, Solo Clears, and Wildcard Partner Rules), and Reset Protocol.

#### Scenario: Viewing physical rules content
- **WHEN** the "Core Physical Ruleset" tab is active
- **THEN** the modal SHALL render the formatted physical rules text with section headings and structural guidelines
- **AND** Section 4 SHALL document Retrospective Anchor Rules & Absorption Shield (4 scarlet red corner quadrant marks, shield breaking on 4th hit, and preservation of pre-existing scars/curses)
- **AND** Section 5 SHALL document the Anchor Immunity Exception (Anchored `[+]` cards absorb freeze hits with red quadrant marks instead of advancing Attrition stages)
- **AND** Section 6 SHALL document Anchor progression (lower-value card in final pair clear becoming Anchor `[—]` -> `[+]`, solo King clears awarding Anchor strokes, and Clubs Wildcard pairing rules for Anchors)

### Requirement: Digital Interaction Mapping Guide
The modal SHALL provide a clear reference mapping physical paper & marker mechanics to web game UI actions (such as card selection, Spades targeting mode, Diamond Vaulting, Clubs wildcard pairing, Black Curse weight partner reshuffle, automated post-round attrition processing, and Anchored defense upgrades). Digital mappings SHALL match `docs/rules.md` §6: Hearts (Stock Reshuffle: shuffle Waste back into Stock without consuming a redeal), Diamonds (Vault: free FILO placement from Stock/Waste/Pyramid), Spades (Tunnel: move an exposed pyramid card onto the top of the Waste pile), Clubs (Universal Wildcard: pair with ANY exposed card), Black Curse (Recycled Weight: partner reshuffled into Stock), and Anchors (Defensive Immunity: displays anchor upgrade notifications in round summary and corner absorption charge indicators `0/4`–`4/4`).

#### Scenario: Reviewing digital controls mapping
- **WHEN** the "Web Play & Controls" tab is active
- **THEN** the modal SHALL display instructions for each digital interaction model, including click mechanics, mode transitions, visual indicator badges, and Anchored defense upgrade notifications
- **AND** the Hearts description SHALL state Stock Reshuffle (Waste → Stock without redeal cost), the Spades description SHALL state moving an exposed pyramid card onto the Waste pile, the Black Curse description SHALL state the partner card is shuffled back into the Stock draw pile, and the Anchor description SHALL explain round summary anchor upgrades and digital corner absorption indicators (`0/4` to `4/4`)
