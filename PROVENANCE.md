# Source and build provenance

This compatibility snapshot is based on the public upstream `yangbobo2021/relay-dsh-plugin-session-import` commit `7c67748b86277fb804ef79b821056cac28e89047`. It targets DSH 0.2.1-rc.2 and React 19.3.0; its import icon uses the corresponding DSH 0.2.1 public component. The DSH development-peer preparation script comes from the public `kllilizxc/relay-dsh-plugin-codex` commit `e0aa8be0c9d75acb5a57ba516ccc1dce155d5a36`. The upstream MIT license is retained.

Build with Node 24.14.1 and npm 11.11.0, the committed npm lock, and a prepared public DSH 0.2.1-rc.2 checkout at `687f282e8625c6b8d11ff58211a90524be2e4317`. Run `npm ci --ignore-scripts --strict-peer-deps`, then `DSH_ROOT=<official-checkout> npm run build` and `npm pack --ignore-scripts`. The release tarball is a normal npm pack of this tree and omits source maps. Automatic npm publishing is not configured.
