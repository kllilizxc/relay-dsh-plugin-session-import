# Session Import Hub Specification

## Purpose

`relay-dsh-plugin-session-import` provides one provider-neutral session import
entry in the DSH sidebar. Provider plugins own discovery, selection, import,
progress, and result behavior; the hub owns only aggregation and navigation.

## Composition Contract

- The hub registers one `relay-session-import-hub` entry in the supported
  `sidebar.footer.action` list slot.
- The hub declares the root-scoped list slot
  `relay.session-import.provider`.
- The package exports the canonical slot-definition type. Each provider merges
  that type into its local DSH `SlotMap`, keeping one contract while avoiding
  package-manager-specific TypeScript module identities.
- A provider contribution is renderless while idle. It registers a localized
  descriptor on mount and renders only its own import dialog when selected.
- Provider ids are stable and unique. Lower `order` values appear first.
- The hub is hidden while no provider is registered.
- Provider unload removes its row immediately. Removing the final provider
  closes the menu and removes the trigger.

## User Interface

- Wide sidebar: one 42px row with the standard import/download glyph and the
  label `Import sessions...` / `导入会话...`.
- Collapsed sidebar: one 36px circular icon button with a tooltip.
- The provider menu opens above the wide trigger and to the right of the rail
  trigger.
- Each provider menu row contains its provider mark and an explicit localized
  action label. The hub trigger never combines multiple provider marks.
- Selection closes the menu before opening the provider-owned dialog.

## Packaging

Provider packages depend on this package and add a uniquely identified Loader
row whose `name` is `relay-dsh-plugin-session-import`. Multiple rows are safe:
the host plugin is intentionally empty and DSH client modules are deduplicated
by package name. Provider client declarations inject this package so the hub
applies before provider contributions.

Local DSH development symlinks must preserve one consumer-root type identity
for official DSH peer packages. Provider typechecks pin `@deepseek-ai/*`
resolution to their own `node_modules` and enable `preserveSymlinks`.

## Non-goals

- Modifying official DSH source or Workspace menus.
- DOM injection or CSS selectors against DSH internals.
- Provider-specific scanning, persistence, or import policy.
