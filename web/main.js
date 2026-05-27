import { app } from "../../scripts/app.js";

const NS = "Comfy.ZoomLimiter";

function clamp(v, lo, hi) {
    return Math.min(Math.max(v, lo), hi);
}

app.registerExtension({
    name: NS,
    settings: [
        {
            id: NS + ".Max",
            name: "Zoom Maximum",
            category: ["Comfy", "Zoom"],
            type: "number",
            attrs: { min: 0.5, max: 10, step: 0.01 },
            defaultValue: 1.5,
            tooltip: "Maximum zoom level (1.5 = 150%)",
            onChange(v) {
                if (app.canvas?.ds) app.canvas.ds.max_scale = +v;
            },
        },
        {
            id: NS + ".Min",
            name: "Zoom Minimum",
            category: ["Comfy", "Zoom"],
            type: "number",
            attrs: { min: 0.01, max: 2, step: 0.01 },
            defaultValue: 0.5,
            tooltip: "Minimum zoom level (0.5 = 50%)",
            onChange(v) {
                if (app.canvas?.ds) app.canvas.ds.min_scale = +v;
            },
        },
    ],
    async setup() {
        console.debug("[ZoomLimiter] setup");

        const desc = Object.getOwnPropertyDescriptor(DragAndScale.prototype, "scale");
        if (!desc) { console.warn("[ZoomLimiter] scale descriptor missing"); return; }

        Object.defineProperty(DragAndScale.prototype, "scale", {
            get: desc.get,
            set(v) {
                const lo = +app.ui.settings.getSettingValue(NS + ".Min", 0.5);
                const hi = +app.ui.settings.getSettingValue(NS + ".Max", 1.5);
                desc.set.call(this, clamp(+v, lo, hi));
            },
            configurable: true,
        });

        if (app.canvas?.ds) {
            app.canvas.ds.min_scale = +app.ui.settings.getSettingValue(NS + ".Min", 0.5);
            app.canvas.ds.max_scale = +app.ui.settings.getSettingValue(NS + ".Max", 1.5);
        }
    },
});
