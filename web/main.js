import { app } from "../../scripts/app.js";

const id = "Comfy.ZoomLimiter";

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

app.registerExtension({
    name: id,
    async setup() {
        const minSetting = app.ui.settings.addSetting({
            id: id + ".Min",
            name: "Zoom Minimum",
            type: "number",
            attrs: { min: 0.01, max: 2, step: 0.01 },
            defaultValue: 0.5,
            tooltip: "Minimum zoom level (default: 0.5 = 50%)",
            onChange(v) {
                v = +v;
                if (app.canvas?.ds) app.canvas.ds.min_scale = v;
            },
        });
        const maxSetting = app.ui.settings.addSetting({
            id: id + ".Max",
            name: "Zoom Maximum",
            type: "number",
            attrs: { min: 0.5, max: 10, step: 0.01 },
            defaultValue: 1.5,
            tooltip: "Maximum zoom level (default: 1.5 = 150%)",
            onChange(v) {
                v = +v;
                if (app.canvas?.ds) app.canvas.ds.max_scale = v;
            },
        });

        // Override scale setter to catch ALL direct assignments
        const desc = Object.getOwnPropertyDescriptor(DragAndScale.prototype, "scale");
        Object.defineProperty(DragAndScale.prototype, "scale", {
            get: desc.get,
            set(v) {
                desc.set.call(this, clamp(+v, +minSetting.value, +maxSetting.value));
            },
            configurable: true,
        });

        if (app.canvas?.ds) {
            app.canvas.ds.min_scale = +minSetting.value;
            app.canvas.ds.max_scale = +maxSetting.value;
        }
    },
});
