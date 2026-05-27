# ComfyUI-ZoomControl

Restricts the ComfyUI canvas zoom range and exposes user-configurable min/max zoom settings in the UI.

## Features

- **Zoom Limits** — Prevents zooming out too far or zooming in too close to the canvas.
- **Configurable** — Two settings (`Zoom Minimum`, `Zoom Maximum`) under `Comfy.ZoomLimiter` in the settings panel.
- **Live Updates** — Change limits on the fly; the canvas responds immediately.
- **All Zoom Paths Covered** — Patches the `DragAndScale.scale` setter to catch every zoom path (mouse wheel, trackpad, zoom buttons, Fit View, reset, minimap, viewport restore, API calls).
- **Zero tracked-file changes** — Installs as a standard custom node under `custom_nodes/`.

## Installation

```bash
cd custom_nodes/
git clone https://github.com/srikantpatnaik/ComfyUI-ZoomControl.git
```

Then **restart ComfyUI**.

## Usage

1. Open ComfyUI.
2. Go to **Settings** → **Comfy.ZoomLimiter**.
3. Adjust **Zoom Minimum** (default: `0.50`) and **Zoom Maximum** (default: `1.50`).
4. The canvas zoom is now clamped to your chosen range.

## Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| Zoom Minimum | number (0.01–2.0) | 0.50 | Furthest zoom-out allowed |
| Zoom Maximum | number (0.5–10.0) | 1.50 | Closest zoom-in allowed |

## Files

```
ComfyUI-ZoomControl/
├── __init__.py          # Registers WEB_DIRECTORY
├── web/
│   └── main.js          # Patches DragAndScale, adds settings
└── README.md
```

## License

MIT
