import { app } from "../../scripts/app.js";

const id = "Comfy.ZoomLimiter";

app.registerExtension({
    name: id,
    setup() {
        const minSetting = app.ui.settings.addSetting({
            id: id + ".Min",
            name: "Zoom Minimum",
            type: "number",
            attrs: { min: 0.01, max: 2, step: 0.01 },
            defaultValue: 0.5,
            tooltip: "Minimum zoom level (default: 0.5 = 50%)",
            onChange(v) { if (app.canvas?.ds) app.canvas.ds.min_scale = +v; },
        });
        const maxSetting = app.ui.settings.addSetting({
            id: id + ".Max",
            name: "Zoom Maximum",
            type: "number",
            attrs: { min: 0.5, max: 10, step: 0.01 },
            defaultValue: 1.5,
            tooltip: "Maximum zoom level (default: 1.5 = 150%)",
            onChange(v) { if (app.canvas?.ds) app.canvas.ds.max_scale = +v; },
        });

        const orig = DragAndScale.prototype.changeScale;
        DragAndScale.prototype.changeScale = function (scale, center, trigger) {
            scale = Math.min(Math.max(scale, +minSetting.value), +maxSetting.value);
            return orig.call(this, scale, center, trigger);
        };
        if (app.canvas?.ds) {
            app.canvas.ds.min_scale = +minSetting.value;
            app.canvas.ds.max_scale = +maxSetting.value;
        }
    },
});
