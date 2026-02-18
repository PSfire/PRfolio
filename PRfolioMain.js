(() => {
  const chars = "01_-=+{}[]<>?/\\|~^@#$%&*";
  const timeout = 50;
  const scrambleMs = 35;
  const scrambleSteps = 10;

  const headingSel = ".heading__color";
  const letterClass = "letter";

  const colors = ["#02f", "#ff0040", "#00ff22", "#ffa200"];
  const labels = ["Color_V1", "Color_V2", "Color_V3", "Color_V4"];
  let colorIndex = 0;

  const randChar = () => chars[(Math.random() * chars.length) | 0];

  const clockEl = document.getElementById("clock");
  const cursorEl = document.getElementById("cursor-pos");
  const resEl = document.getElementById("resolution");

  document.body.classList.add("color-ease");

  const wrapHeadings = () => {
    document.querySelectorAll(headingSel).forEach((el) => {
      if (el.querySelector(":scope > .letters-wrap")) return;

      const wrap = document.createElement("span");
      wrap.className = "letters-wrap";
      wrap.textContent = el.textContent;

      el.textContent = "";
      el.appendChild(wrap);

      const text = wrap.textContent;
      const tokens = text.split(/(\s+)/);

      let html = "";
      for (const tok of tokens) {
        if (!tok) continue;

        if (/^\s+$/.test(tok)) {
          html += tok;
          continue;
        }

        html += '<span class="word">';
        for (const ch of tok) {
          html += `<span class="${letterClass}" data-original="${ch}">${ch}</span>`;
        }
        html += "</span>";
      }

      wrap.innerHTML = html;
    });
  };

  const bindMatrixHover = () => {
    document.addEventListener("mouseenter", (e) => {
      const t = e.target;
      if (!t || !t.classList || !t.classList.contains(letterClass)) return;

      if (t.dataset.scrambling === "1") return;
      t.dataset.scrambling = "1";

      const original = t.getAttribute("data-original") ?? t.textContent;
      let step = 0;

      const id = setInterval(() => {
        t.textContent = randChar();
        step++;

        if (step >= scrambleSteps) {
          clearInterval(id);
          t.textContent = original;
          t.dataset.scrambling = "0";
        }
      }, scrambleMs);

      t.dataset.intervalId = String(id);
    }, true);

    document.addEventListener("mouseleave", (e) => {
      const t = e.target;
      if (!t || !t.classList || !t.classList.contains(letterClass)) return;

      const original = t.getAttribute("data-original") ?? t.textContent;

      const intervalId = Number(t.dataset.intervalId || 0);
      if (intervalId) clearInterval(intervalId);

      t.dataset.scrambling = "0";

      const prevT = Number(t.dataset.tid || 0);
      if (prevT) clearTimeout(prevT);

      const tid = window.setTimeout(() => {
        t.textContent = original;
      }, timeout);

      t.dataset.tid = String(tid);
    }, true);
  };

  const updateClock = () => {
    if (!clockEl) return;
    const now = new Date();
    const time = now.toLocaleTimeString("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    clockEl.textContent = `${time} CET`;
  };

  const updateResolution = () => {
    if (!resEl) return;
    const w = window.innerWidth.toFixed(2);
    const h = window.innerHeight.toFixed(2);
    resEl.textContent = `${w} x ${h}`;
  };

  const bindCursor = () => {
    document.addEventListener("mousemove", (e) => {
      if (!cursorEl) return;
      cursorEl.textContent = `X: ${e.clientX} | Y: ${e.clientY}`;
    });
  };

  const bindColorToggle = () => {
    const el = document.getElementById("color-toggle");
    if (!el) return;

    const labelEl = el.querySelector(".colorSwapper") || el.querySelector("h1");

    const getScope = () => document.querySelector(".color-scope") || document.documentElement;

    const applyNext = () => {
      colorIndex = (colorIndex + 1) % colors.length;
      getScope().style.setProperty("--colors--sixth-color", colors[colorIndex]);
      if (labelEl) labelEl.textContent = labels[colorIndex];
    };

    let locked = false;
    const fire = (e) => {
      if (e) e.preventDefault();
      if (locked) return;
      locked = true;
      applyNext();
      setTimeout(() => (locked = false), 250);
    };

    el.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
    el.addEventListener("touchend", fire, { passive: false });
    el.addEventListener("click", fire);
  };

  const init = () => {
    wrapHeadings();
    bindMatrixHover();

    updateClock();
    setInterval(updateClock, 1000);

    updateResolution();
    window.addEventListener("resize", updateResolution);

    bindCursor();
    bindColorToggle();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
