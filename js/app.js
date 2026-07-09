// Screen-swap SPA driving the birthday card. State is intentionally tiny.
(function () {
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  // ---- scattered twinkling stars (decorative bg) ----
  (function seedStars() {
    const layer = $("#stars"), colors = ["var(--star-p)", "var(--star-y)"];
    for (let i = 0; i < 34; i++) {
      const s = document.createElement("span");
      s.className = "star"; s.textContent = "★";
      s.style.setProperty("--c", colors[i % 2]);
      s.style.setProperty("--s", 12 + (i % 5) * 6 + "px");
      s.style.setProperty("--d", 2 + (i % 4) + "s");
      s.style.left = ((i * 37) % 100) + "%";
      s.style.top = ((i * 53) % 100) + "%";
      layer.appendChild(s);
    }
  })();

  // ---- screen navigation ----
  function show(id) {
    $$(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  }
  $$("[data-go]").forEach((b) =>
    b.addEventListener("click", () => show(b.dataset.go))
  );

  // ---- populate text from config ----
  // Inject the recipient's name into the greeting ("Hey <name>! …").
  $("#introText").textContent = C.intro.replace(/^Hey!?/i, `Hey ${C.recipientName}!`);
  $("#blessing").textContent = C.blessing;

  // ---- password gate ----
  $("#unlock").addEventListener("click", tryUnlock);
  $("#pw").addEventListener("keydown", (e) => e.key === "Enter" && tryUnlock());
  function tryUnlock() {
    const ok = $("#pw").value.trim().toLowerCase() === String(C.password).toLowerCase();
    const robot = $("#robot").checked;
    const err = $("#gateErr");
    if (!robot) { err.textContent = "Please confirm you're not a robot 🤖"; return; }
    if (!ok) { err.textContent = "Hmm, that's not it. Try again 💭"; return; }
    err.textContent = ""; show("intro");
  }

  // ---- items: open each, unlock Next when all seen ----
  const opened = new Set();
  $$(".item").forEach((it) =>
    it.addEventListener("click", () => {
      openItem(it.dataset.item);
      it.dataset.done = "1";
      opened.add(it.dataset.item);
      if (opened.size === 3) $("#nextBtn").hidden = false;
    })
  );

  const modal = $("#modal"), body = $("#modalBody");
  $("#modalX").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => e.target === modal && closeModal());
  function closeModal() { modal.classList.remove("open"); body.innerHTML = ""; }

  // Lightbox: click any memory tile to view it full-size.
  const lb = $("#lightbox"), lbImg = $("#lightboxImg");
  body.addEventListener("click", (e) => {
    if (e.target.matches("img.tile")) { lbImg.src = e.target.src; lb.classList.add("open"); }
  });
  lb.addEventListener("click", () => { lb.classList.remove("open"); lbImg.src = ""; });
  function openItem(kind) {
    body.innerHTML = builders[kind]();
    modal.classList.add("open");
  }

  const builders = {
    // Google-style "Memories" gallery
    camera() {
      const tiles = (C.photos && C.photos.length)
        ? C.photos.map((p) => `<img class="tile" src="${p}" loading="lazy" alt="a memory">`).join("")
        : Array.from({ length: 6 }, (_, i) =>
            `<div class="tile" style="background:linear-gradient(135deg,hsl(${i*55},70%,85%),hsl(${i*55+40},75%,90%))"></div>`).join("");
      return `
        <div class="g-logo"><b>M</b><b>e</b><b>m</b><b>o</b><b>r</b><b>i</b><b>e</b>s</div>
        <div class="g-search">🔍 Moments of us ❤️</div>
        <div class="grid">${tiles}</div>`;
    },
    // Handwritten letter
    letter() {
      const paras = C.letter.map((t) => `<p>${escapeHtml(t)}</p>`).join("");
      return `<div class="letter">${paras}<p class="sign">— ${escapeHtml(C.senderName)} 💐</p></div>`;
    },
    // Cassette -> music player (mp3 if provided, else YouTube embed)
    cassette() {
      const s = C.song, player = s.mp3
        ? `<audio class="player" controls autoplay src="${s.mp3}"></audio>`
        : `<iframe class="yt player" src="https://www.youtube.com/embed/${s.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
      return `
        <div class="cassette">📼</div>
        <div class="song-title">${escapeHtml(s.title)} — ${escapeHtml(s.artist)}</div>
        ${player}
        <div class="song-lyric">${escapeHtml(s.lyric || "")}</div>`;
    },
  };

  function escapeHtml(x) {
    return String(x).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---- lightweight confetti on the final screen ----
  const cv = $("#confetti"), ctx = cv.getContext("2d");
  let bits = [], raf = 0;
  function resize() { cv.width = innerWidth; cv.height = innerHeight; }
  addEventListener("resize", resize); resize();
  function burst() {
    bits = Array.from({ length: 140 }, () => ({
      x: Math.random() * cv.width, y: -20 - Math.random() * cv.height,
      r: 4 + Math.random() * 6, vy: 2 + Math.random() * 3, vx: -1 + Math.random() * 2,
      c: ["#b3a4de", "#ecc94f", "#f7a8c0", "#8b7cc4"][Math.floor(Math.random() * 4)],
    }));
    cancelAnimationFrame(raf); tick(0);
  }
  function tick(f) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    bits.forEach((b) => {
      b.y += b.vy; b.x += b.vx;
      ctx.fillStyle = b.c;
      ctx.fillRect(b.x, b.y, b.r, b.r * 1.6);
    });
    bits = bits.filter((b) => b.y < cv.height + 20);
    if (bits.length && f < 400) raf = requestAnimationFrame(() => tick(f + 1));
  }
  // fire confetti whenever the final screen becomes active
  new MutationObserver(() => $("#final").classList.contains("active") && burst())
    .observe($("#final"), { attributes: true, attributeFilter: ["class"] });

  // Preview hook: ?s=<screen>&open=<item> jumps straight to a screen/modal.
  // Handy for previewing without re-typing the password each time.
  const q = new URLSearchParams(location.search);
  if (q.get("s")) show(q.get("s"));
  if (q.get("open") && builders[q.get("open")]) openItem(q.get("open"));
})();
