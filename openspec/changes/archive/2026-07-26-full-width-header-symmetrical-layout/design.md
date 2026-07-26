## Context

The application currently places the main title inside the right column above the pyramid board while the left sidebar starts at the top of the container. This causes a vertical mismatch of ~64px between the sidebar top edge and the main play area panel. Furthermore, `GameSidebar` utilizes asymmetrical Tailwind border utilities (`border-l-[14px] border-y-[6px] border-r-[6px]`) which produces an uneven frame visual.

## Goals / Non-Goals

**Goals:**
- Create a full-width header bar component (`HeaderBar` or header section within `GameShell`) displaying the game title, ankh icon (`𓋹`), game status summary, and debug drawer toggle.
- Move the `<h1>` title out of `App.tsx`'s main column and into the top header bar.
- Align the top edges of `GameSidebar` and `PyramidBoard` container at the same horizontal baseline underneath the header.
- Clean up `GameSidebar` border styling to use uniform border widths (`border border-[#2d2319]` / `border-game-border`) and symmetrical `rounded-2xl` corners.
- Re-anchor `DebugPanel` to align nicely with the header layout.

**Non-Goals:**
- Changing game rules, solitaire logic, autoplay solver functionality, or card graphics.
- Restructuring mobile vertical stacking order (sidebar on top, board below on narrow screens).

## Decisions

1. **Header Placement inside `GameShell` vs. Separate Component**
   - *Decision*: Include a dedicated `<header>` section inside `GameShell.tsx` or pass header content to `GameShell`. `GameShell` will render a full-width header bar followed by the 2-column grid.
   - *Rationale*: Keeps `GameShell` as the single layout orchestrator for container bounds, header padding, and grid structure.

2. **Sidebar Border Simplification**
   - *Decision*: Replace `border-l-[14px] border-y-[6px] border-r-[6px] border-[#251b12]` with `border border-[#2d2319] bg-[#120e0a] rounded-2xl p-4 shadow-xl`.
   - *Rationale*: Eliminates the asymmetrical left border artifact while preserving dark sandstone/leather aesthetic coherence with the rest of the UI.

3. **Debug Trigger Positioning**
   - *Decision*: Anchor the fixed floating tab in `DebugPanel.tsx` to `top-4` or embed its toggle button into the header bar so it sits flush alongside header elements.
   - *Rationale*: Eliminates arbitrary vertical offsets (`top-24`) that conflict with viewport baselines across different screen sizes.

## Risks / Trade-offs

- [Risk: Header height on small mobile screens] → Mitigation: Use responsive text size (`text-xl sm:text-2xl`) and flex wrapping on mobile screens so header content stays readable without crowding.
