# Delivery Acceptance

1. With no providers, the sidebar contains no session-import trigger.
2. With Codex only, one trigger opens one `Import from Codex` row.
3. With Claude only, one trigger opens one `Import from Claude` row.
4. With both providers, one trigger opens Codex then Claude rows.
5. Selecting a row closes the menu and opens only that provider's existing
   Workspace selection dialog.
6. Unloading one provider removes only its row; unloading the last removes the
   trigger.
7. The wide trigger is a full-width 42px text row and does not compete for
   horizontal space with another import action.
8. The rail trigger is a 36px icon button with an accessible name and tooltip.
9. Keyboard Escape/outside-pointer behavior remains owned by the official DSH
   `Menu` primitive.
10. Two provider Loader rows activate one browser hub module without duplicate
    slot registration.
11. Typecheck, component tests, package tests, builds, and real DSH composition
    all pass.
12. Desktop wide/rail screenshots show no overlap, clipping, or ambiguous
    provider glyph composition.
