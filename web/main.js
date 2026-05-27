import { app } from "../../scripts/app.js";

const id = "Comfy.ZoomLimiter";

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

function val(name) {
    return +app.ui.settings.getSettingValue(id + "." + name);
}

app.registerExtension({
    name: id,
    settings: [
        {
            id: id + ".Min",
            name: "Min Zoom",
            category: ["Comfy"],
            type: "number",
            attrs: { min: 0.01, max: 2, step: 0.01 },
            defaultValue: 0.5,
            tooltip: "Minimum zoom level (0.5 = 50%)",
            onChange(v) {
                v = +v;
                if (app.canvas?.ds) app.canvas.ds.min_scale = v;
            },
        },
        {
            id: id + ".Max",
            name: "Max Zoom",
            category: ["Comfy"],
            type: "number",
            attrs: { min: 0.5, max: 10, step: 0.01 },
            defaultValue: 1.5,
            tooltip: "Maximum zoom level (1.5 = 150%)",
            onChange(v) {
                v = +v;
                if (app.canvas?.ds) app.canvas.ds.max_scale = v;
            },
        },
    ],
    async setup() {
        console.debug("[ZoomLimiter] setup running, min:", val("Min"), "max:", val("Max"));
        const desc = Object.getOwnPropertyDescriptor(DragAndScale.prototype, "scale");
        if (!desc) { console.warn("[ZoomLimiter] scale descriptor not found"); return; }
        Object.defineProperty(DragAndScale.prototype, "scale", {
            get: desc.get,
            set(v) {
                desc.set.call(this, clamp(+v, val("Min"), val("Max")));
            },
            configurable: true,
        });

        if (app.canvas?.ds) {
            app.canvas.ds.min_scale = val("Min");
            app.canvas.ds.max_scale = val("Max");
        }
    },
});
