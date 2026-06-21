/**
 * A Level Geography — Summer Transition Work
 * Interactive worksheet logic: localStorage auto-save, progress tracking,
 * per-section status pills, print expansion of textareas, and reset.
 *
 * Ported from the Claude Design prototype (DCLogic Component) to plain
 * vanilla JS — no framework or runtime required.
 */
(function () {
  "use strict";

  var KEY = "ks5-geog-summer-work-v1";

  function init() {
    var store;
    try {
      store = JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      store = {};
    }

    var fields = Array.prototype.slice.call(
      document.querySelectorAll("[data-field]")
    );

    // Hydrate from storage and wire up auto-save.
    fields.forEach(function (f) {
      var k = f.getAttribute("data-field");
      if (store[k] !== undefined) {
        if (f.type === "checkbox") f.checked = !!store[k];
        else f.value = store[k];
      }
      var handler = function () {
        store[k] = f.type === "checkbox" ? f.checked : f.value;
        try {
          localStorage.setItem(KEY, JSON.stringify(store));
        } catch (e) {}
        flashSaved();
        recompute();
      };
      f.addEventListener("input", handler);
      f.addEventListener("change", handler);
    });

    // Print / Save PDF.
    var pb = document.getElementById("btnPrint");
    if (pb) pb.addEventListener("click", function () { window.print(); });

    // Clear answers.
    var rb = document.getElementById("btnReset");
    if (rb)
      rb.addEventListener("click", function () {
        if (window.confirm("Clear all your saved answers? This cannot be undone.")) {
          try {
            localStorage.removeItem(KEY);
          } catch (e) {}
          store = {};
          fields.forEach(function (f) {
            if (f.type === "checkbox") f.checked = false;
            else f.value = "";
          });
          recompute();
        }
      });

    // Expand textareas to their full content before printing so nothing is clipped.
    var tas = Array.prototype.slice.call(document.querySelectorAll("textarea"));
    var before = function () {
      tas.forEach(function (t) {
        t.dataset._h = t.style.height;
        t.style.height = "auto";
        t.style.height = t.scrollHeight + 4 + "px";
      });
    };
    var after = function () {
      tas.forEach(function (t) {
        t.style.height = t.dataset._h || "";
      });
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);

    recompute();
  }

  var saveTimer;
  function flashSaved() {
    var s = document.getElementById("saveStatus");
    if (!s) return;
    s.textContent = "Saved";
    s.style.opacity = "1";
    s.style.color = "#4F8C5A";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      s.style.opacity = "0.5";
      s.style.color = "#6F6F6F";
      s.textContent = "Saved to this device";
    }, 1300);
  }

  function recompute() {
    var tracked = Array.prototype.slice.call(
      document.querySelectorAll("[data-track]")
    );
    var done = 0;
    var groups = {};
    tracked.forEach(function (f) {
      var filled =
        f.type === "checkbox" ? f.checked : (f.value || "").trim() !== "";
      if (filled) done++;
      var g = f.getAttribute("data-group");
      if (g) {
        groups[g] = groups[g] || { t: 0, d: 0 };
        groups[g].t++;
        if (filled) groups[g].d++;
      }
    });

    var total = tracked.length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    var fill = document.getElementById("progFill");
    if (fill) fill.style.width = pct + "%";
    var txt = document.getElementById("progText");
    if (txt) txt.textContent = done + " / " + total + " tasks complete";

    Object.keys(groups).forEach(function (g) {
      var pill = document.getElementById("pill-" + g);
      if (!pill) return;
      var t = groups[g].t;
      var d = groups[g].d;
      var complete = d >= t && t > 0;
      pill.textContent = complete ? "✓ Complete" : d + " / " + t + " done";
      pill.style.background = complete ? "#4F8C5A" : "#FFF2CC";
      pill.style.color = complete ? "#fff" : "#6F6F6F";
      pill.style.borderColor = complete ? "#4F8C5A" : "#C9C8C8";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
