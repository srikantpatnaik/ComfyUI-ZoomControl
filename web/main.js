import { app } from "../../scripts/app.js";

const NS = "Comfy.ZoomLimiter";

function clamp(v, lo, hi) {
    return Math.min(Math.max(v, lo), hi);
}

function load(key, def) {
    const v = localStorage.getItem(NS + "." + key);
    if (v === null) return def;
    const n = +v;
    return isNaN(n) ? def : n;
}

function save(key, v) {
    localStorage.setItem(NS + "." + key, v);
}

app.registerExtension({
    name: NS,
    setup() {
        app.ui.settings.addSetting({
            id: NS + ".UI",
            name: "Zoom Min / Max",
            category: ["Comfy", "Zoom"],
            type: () => {
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 2;
                td.style.cssText = "display:flex;gap:8px;align-items:center;padding:4px 0";
                const lo = document.createElement("input");
                lo.type = "number";
                lo.min = 0.01;
                lo.max = 2;
                lo.step = 0.01;
                lo.value = load("Min", 0.5);
                lo.style.cssText = "width:80px;text-align:center";
                const hi = document.createElement("input");
                hi.type = "number";
                hi.min = 0.5;
                hi.max = 10;
                hi.step = 0.01;
                hi.value = load("Max", 1.5);
                hi.style.cssText = "width:80px;text-align:center";
                const lbl = document.createElement("span");
                lbl.textContent = "Min \u2192 Max";
                lbl.style.cssText = "font-size:12px;color:var(--input-text);margin:0 4px";
                lo.oninput = () => {
                    save("Min", lo.value);
                    if (app.canvas?.ds) app.canvas.ds.min_scale = +lo.value;
                };
                hi.oninput = () => {
                    save("Max", hi.value);
                    if (app.canvas?.ds) app.canvas.ds.max_scale = +hi.value;
                };
                td.append(lo, lbl, hi);
                tr.append(td);
                return tr;
            },
            defaultValue: null,
        });

        const desc = Object.getOwnPropertyDescriptor(DragAndScale.prototype, "scale");
        if (!desc) return;

        Object.defineProperty(DragAndScale.prototype, "scale", {
            get: desc.get,
            set(v) {
                desc.set.call(this, clamp(+v, load("Min", 0.5), load("Max", 1.5)));
            },
            configurable: true,
        });

        if (app.canvas?.ds) {
            app.canvas.ds.min_scale = load("Min", 0.5);
            app.canvas.ds.max_scale = load("Max", 1.5);
        }
    },
});
