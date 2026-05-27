import { app } from "../../scripts/app.js";

const id = "Comfy.ZoomLimiter";
const cat = ["Comfy", "Zoom Limiter"];

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

function getVal(name) {
    return +app.ui.settings.getSettingValue(id + "." + name);
}

app.registerExtension({
    name: id,
    settings: [
        {
            id: id + ".Min",
            name: "Zoom Minimum",
            category: cat,
            type: "number",
            attrs: { min: 0.01, max: 2, step: 0.01 },
            defaultValue: 0.5,
            tooltip: "Minimum zoom level (default: 0.5 = 50%)",
            onChange(v) {
                v = +v;
                if (app.canvas?.ds) app.canvas.ds.min_scale = v;
            },
        },
        {
            id: id + ".Max",
            name: "Zoom Maximum",
            category: cat,
            type: "number",
            attrs: { min: 0.5, max: 10, step: 0.01 },
            defaultValue: 1.5,
            tooltip: "Maximum zoom level (default: 1.5 = 150%)",
            onChange(v) {
                v = +v;
                if (app.canvas?.ds) app.canvas.ds.max_scale = v;
            },
        },
    ],
    async setup() {
        const desc = Object.getOwnPropertyDescriptor(DragAndScale.prototype, "scale");
        Object.defineProperty(DragAndScale.prototype, "scale", {
            get: desc.get,
            set(v) {
                desc.set.call(this, clamp(+v, getVal("Min"), getVal("Max")));
            },
            configurable: true,
        });

        if (app.canvas?.ds) {
            app.canvas.ds.min_scale = getVal("Min");
            app.canvas.ds.max_scale = getVal("Max");
        }
    },
});
