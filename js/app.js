// Romantic birthday microsite — screen-swap SPA. State stays tiny & readable.
(function () {
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  // ---- ambient layers: twinkling stars, floating hearts, drifting petals ----
  (function seed() {
    const stars = $("#stars"), petals = $("#petals");
    const starColors = ["var(--lav-deep)", "var(--gold)", "var(--rose)"];
    for (let i = 0; i < 30; i++) {
      const s = document.createElement("span");
      s.className = "star"; s.textContent = "★";
      s.style.setProperty("--c", starColors[i % 3]);
      s.style.setProperty("--s", 11 + (i % 5) * 5 + "px");
      s.style.setProperty("--d", 2 + (i % 4) + "s");
      s.style.left = ((i * 37) % 100) + "%"; s.style.top = ((i * 53) % 100) + "%";
      stars.appendChild(s);
    }
    if (reduce) return;
    const glyphs = ["💗", "💕", "🌸", "💛", "🌷", "✨", "💖"];
    for (let i = 0; i < 18; i++) {
      const f = document.createElement("span");
      f.className = "float"; f.textContent = glyphs[i % glyphs.length];
      f.style.left = ((i * 53) % 100) + "%";
      f.style.setProperty("--s", 16 + (i % 4) * 8 + "px");
      f.style.setProperty("--d", 8 + (i % 6) + "s");
      f.style.setProperty("--delay", (i % 9) * -1.3 + "s");
      f.style.setProperty("--drift", (i % 2 ? 1 : -1) * (20 + i % 40) + "px");
      f.style.setProperty("--spin", (i % 2 ? 1 : -1) * (120 + i * 10) + "deg");
      petals.appendChild(f);
    }
  })();

  // ---- navigation ----
  function show(id) {
    $$(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
    if (id === "intro") runTypewriter();
    if (id === "final") celebrate();
  }
  $$("[data-go]").forEach((b) => b.addEventListener("click", () => show(b.dataset.go)));

  // ---- text from config ----
  $("#splashLine").textContent = C.splashLine;
  $("#splashSub").textContent = C.splashSub;
  $("#introText").textContent = C.intro;
  $("#finName").textContent = C.recipientName;
  $("#finTitle").textContent = C.finaleTitle;
  $("#finSub").textContent = C.finaleSub;

  // ---- typewriter on the intro line ----
  let typed = false;
  function runTypewriter() {
    const el = $("#typeLine"), rest = $("#introRest"), text = C.typeLine;
    if (typed) { el.textContent = text; rest.style.visibility = "visible"; return; }
    typed = true; el.textContent = ""; el.classList.add("caret"); rest.style.visibility = "hidden";
    if (reduce) { el.textContent = text; el.classList.remove("caret"); rest.style.visibility = "visible"; return; }
    let i = 0;
    (function step() {
      el.textContent = text.slice(0, i++);
      if (i <= text.length) setTimeout(step, 55);
      else { el.classList.remove("caret"); rest.style.visibility = "visible"; }
    })();
  }

  // ---- password gate ----
  $("#unlock").addEventListener("click", tryUnlock);
  $("#pw").addEventListener("keydown", (e) => e.key === "Enter" && tryUnlock());
  function tryUnlock() {
    const ok = $("#pw").value.trim().toLowerCase() === String(C.password).toLowerCase();
    const err = $("#gateErr");
    if (!ok) { err.textContent = "hmm, not quite… try again 💭"; return; }
    err.textContent = ""; show("intro");
  }

  // ---- the dodging "No" button (she can't say no 💕) ----
  const noBtn = $("#noBtn");
  let dodges = 0;
  function dodge() {
    if (reduce) return;
    dodges++;
    const dx = (Math.min(dodges, 8)) * 26 * (dodges % 2 ? 1 : -1);
    const dy = (dodges % 3) * -22;
    noBtn.style.transform = `translate(${dx}px, ${dy}px) scale(${Math.max(0.55, 1 - dodges * 0.06)})`;
    if (dodges > 6) noBtn.textContent = ["No", "pls?", "🥺", "no?", "🙈"][dodges % 5];
  }
  noBtn.addEventListener("mouseenter", dodge);
  noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });
  noBtn.addEventListener("click", (e) => { e.preventDefault(); dodges > 4 ? show("yay") : (dodge(), show("no")); });

  // ---- items: open each, reveal Next when all seen ----
  const opened = new Set(), totalItems = $$(".item").length;
  $$(".item").forEach((it) =>
    it.addEventListener("click", () => {
      openItem(it.dataset.item); it.dataset.done = "1"; opened.add(it.dataset.item);
      if (opened.size === totalItems) $("#nextBtn").hidden = false;
    })
  );

  const modal = $("#modal"), body = $("#modalBody");
  $("#modalX").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => e.target === modal && closeModal());
  function closeModal() { modal.classList.remove("open"); body.innerHTML = ""; }
  function openItem(kind) { body.innerHTML = builders[kind](); modal.classList.add("open"); afterOpen[kind] && afterOpen[kind](); }

  const esc = (x) => String(x).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const builders = {
    camera() {
      const tiles = (C.photos && C.photos.length)
        ? C.photos.map((p) => `<img class="tile" src="${p}" loading="lazy" alt="a memory">`).join("")
        : Array.from({ length: 6 }, (_, i) =>
            `<div class="tile" style="background:linear-gradient(135deg,hsl(${i*50},70%,86%),hsl(${i*50+40},75%,90%))"></div>`).join("");
      return `<div class="g-logo"><b>M</b><b>e</b><b>m</b><b>o</b><b>r</b><b>i</b><b>e</b>s</div>
        <div class="g-search">🔍 moments of us ❤️</div><div class="grid">${tiles}</div>`;
    },
    letter() {
      const [first, ...rest] = C.letter;
      const paras = rest.map((t) => `<p>${esc(t)}</p>`).join("");
      return `<div class="letter"><div class="top">${esc(first)}</div>${paras}
        <p class="sign">— forever yours,<br>${esc(C.senderName)} 💐</p></div>`;
    },
    reasons() {
      return `<div class="reasons-title">reasons I love you</div>
        <div class="reason-card" id="reasonCard"></div>
        <div class="reason-meta" id="reasonMeta"></div>
        <div class="reason-nav">
          <button class="btn ghost" id="rPrev">‹ prev</button>
          <button class="btn" id="rNext">next ›</button>
        </div>`;
    },
    cassette() {
      const s = C.song, player = s.mp3
        ? `<audio class="player" controls autoplay src="${s.mp3}"></audio>`
        : `<iframe class="yt player" src="https://www.youtube.com/embed/${s.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
      return `<div class="cassette">📼</div>
        <div class="song-title">${esc(s.title)} — ${esc(s.artist)}</div>${player}
        <div class="song-lyric">${esc(s.lyric || "")}</div>`;
    },
  };

  // reasons carousel wiring (runs after its modal is injected)
  const afterOpen = {
    reasons() {
      const R = C.reasons || [], card = $("#reasonCard"), meta = $("#reasonMeta");
      let idx = 0;
      const render = () => {
        card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
        card.innerHTML = `<span><span class="heartbeat">💗</span><br>${esc(R[idx])}</span>`;
        meta.textContent = `${idx + 1} of ${R.length}`;
      };
      $("#rPrev").addEventListener("click", () => { idx = (idx - 1 + R.length) % R.length; render(); });
      $("#rNext").addEventListener("click", () => { idx = (idx + 1) % R.length; render(); });
      render();
    },
  };

  // ---- lightbox with prev/next + captions + keyboard ----
  const lb = $("#lightbox"), lbImg = $("#lightboxImg"), lbCount = $("#lbCount"), lbCap = $("#lbCap");
  const gallery = C.photos || [], caps = C.captions || [];
  let lbIdx = 0;
  function openLb(i) {
    if (!gallery.length) return;
    lbIdx = (i + gallery.length) % gallery.length;
    lbImg.src = gallery[lbIdx];
    lbCap.textContent = caps[lbIdx] || "";
    lbCount.textContent = `${lbIdx + 1} / ${gallery.length}`;
    lb.classList.add("open");
  }
  function closeLb() { lb.classList.remove("open"); lbImg.src = ""; }
  body.addEventListener("click", (e) => {
    if (e.target.matches("img.tile")) openLb(Math.max(0, gallery.indexOf(e.target.getAttribute("src"))));
  });
  $("#lbPrev").addEventListener("click", (e) => { e.stopPropagation(); openLb(lbIdx - 1); });
  $("#lbNext").addEventListener("click", (e) => { e.stopPropagation(); openLb(lbIdx + 1); });
  $("#lbClose").addEventListener("click", (e) => { e.stopPropagation(); closeLb(); });
  lbImg.addEventListener("click", (e) => e.stopPropagation());
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  // swipe on mobile
  let tx = 0;
  lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    const d = e.changedTouches[0].clientX - tx;
    if (Math.abs(d) > 45) openLb(lbIdx + (d < 0 ? 1 : -1));
  });
  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowLeft") openLb(lbIdx - 1);
    else if (e.key === "ArrowRight") openLb(lbIdx + 1);
  });

  // ---- confetti + heart burst on finale ----
  const cv = $("#confetti"), ctx = cv.getContext("2d");
  let bits = [], raf = 0;
  const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
  addEventListener("resize", resize); resize();
  function celebrate() {
    if (reduce) return;
    const colors = ["#f4a6c0", "#e0678f", "#c9bce8", "#efc25f", "#fff"];
    bits = Array.from({ length: 160 }, () => ({
      x: Math.random() * cv.width, y: -20 - Math.random() * cv.height,
      r: 4 + Math.random() * 7, vy: 2 + Math.random() * 3.5, vx: -1.2 + Math.random() * 2.4,
      c: colors[Math.floor(Math.random() * colors.length)],
      heart: Math.random() < 0.35, rot: Math.random() * 6,
    }));
    cancelAnimationFrame(raf); tick(0);
  }
  function tick(f) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    bits.forEach((b) => {
      b.y += b.vy; b.x += b.vx; b.rot += 0.05;
      if (b.heart) {
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
        ctx.font = `${b.r * 3}px serif`; ctx.fillText("💗", 0, 0); ctx.restore();
      } else { ctx.fillStyle = b.c; ctx.fillRect(b.x, b.y, b.r, b.r * 1.6); }
    });
    bits = bits.filter((b) => b.y < cv.height + 30);
    if (bits.length && f < 500) raf = requestAnimationFrame(() => tick(f + 1));
    else ctx.clearRect(0, 0, cv.width, cv.height);
  }

  // ---- preview hooks: ?s=<screen>&open=<item>&lb=<n> ----
  const q = new URLSearchParams(location.search);
  if (q.get("s")) show(q.get("s"));
  if (q.get("open") && builders[q.get("open")]) openItem(q.get("open"));
  if (q.has("lb")) openLb(+q.get("lb"));
})();
