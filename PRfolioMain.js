<script>
(() => {
  const chars = "01_-=+{}[]<>?/\\|~^@#$%&*";
  const timeout = 50;
  const scrambleMs = 35;
  const scrambleSteps = 10;

  const heading = ".heading__color";
  const letter = "letter";

  const colors = ["#02f", "#ff0040", "#00ff22", "#ffa200"];
  const labels = ["Color_V1", "Color_V2", "Color_V3", "Color_V4"];
  let colorIndex = 0;

  const $win = $(window);
  const $doc = $(document);

  const clockEl = document.getElementById("clock");
  const cursorEl = document.getElementById("cursor-pos");
  const resEl = document.getElementById("resolution");
  const trigger = document.getElementById("color-toggle");

  const scope = document.querySelector(".color-scope") || document.documentElement;

  document.body.classList.add("color-ease");

  const randChar = () => chars[(Math.random() * chars.length) | 0];

  $(heading).each(function () {
    const $el = $(this);

    if ($el.find("> .letters-wrap").length === 0) {
      $el.wrapInner('<span class="letters-wrap"></span>');
    }

    const $root = $el.find("> .letters-wrap");
    const text = $root.text();
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
        html += `<span class="${letter}" data-original="${ch}">${ch}</span>`;
      }
      html += "</span>";
    }

    $root.html(html);
  });

  $doc.on("mouseenter", "." + letter, function () {
    const el = $(this);
    if (el.data("scrambling")) return;

    el.data("scrambling", true);

    const original = el.data("original");
    let step = 0;

    const intervalId = setInterval(() => {
      el.text(randChar());
      step++;

      if (step >= scrambleSteps) {
        clearInterval(intervalId);
        el.text(original);
        el.data("scrambling", false);
      }
    }, scrambleMs);

    el.data("intervalId", intervalId);
  });

  $doc.on("mouseleave", "." + letter, function () {
    const el = $(this);
    const original = el.data("original");

    const intervalId = el.data("intervalId");
    if (intervalId) clearInterval(intervalId);

    el.data("scrambling", false);

    clearTimeout(el.data("t"));
    el.data("t", setTimeout(() => el.text(original), timeout));
  });

  function updateClock() {
    if (!clockEl) return;

    const now = new Date();
    const time = now.toLocaleTimeString("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    clockEl.textContent = `${time} CET`;
  }

function updateResolution() {
  if (!resEl) return;

  const width = window.innerWidth.toFixed(2);
  const height = window.innerHeight.toFixed(2);

  resEl.textContent = `${width} x ${height}`;
}


  updateClock();
  setInterval(updateClock, 1000);

  updateResolution();
  $win.on("resize", updateResolution);

  document.addEventListener("mousemove", (e) => {
    if (!cursorEl) return;
    cursorEl.textContent = `X: ${e.clientX} | Y: ${e.clientY}`;
  });

  if (trigger) {
    const labelEl = trigger.querySelector(".colorSwapper") || trigger.querySelector("h1");

    trigger.addEventListener("click", () => {
      colorIndex = (colorIndex + 1) % colors.length;

      scope.style.setProperty("--colors--sixth-color", colors[colorIndex]);

      if (labelEl) labelEl.textContent = labels[colorIndex];
    });
  }
})();
</script>
