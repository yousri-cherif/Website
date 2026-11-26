// Redesign 2026. No animations: things simply appear and disappear.

// ---------- Mobile menu ----------
const toggle = document.querySelector(".nav__toggle");
if (toggle) {
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
}

// ---------- Home: left half = previous, right half = next ----------
const stage = document.querySelector(".stage");
if (stage) {
  const images = [...stage.querySelectorAll("img")];
  const counter = document.querySelector(".counter");
  let current = 0;

  // Counter that follows the mouse (hidden over the nav). CSS shows it only for mouse users.
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    cursor.classList.toggle("is-visible", !e.target.closest(".nav, .menu"));
  });
  document.documentElement.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));

  const show = (i) => {
    images[current].hidden = true;
    current = (i + images.length) % images.length;
    images[current].hidden = false;
    counter.textContent = cursor.textContent = `${current + 1}/${images.length}`;
  };

  document.addEventListener("click", (e) => {
    if (e.target.closest(".nav, .menu")) return;
    show(e.clientX < window.innerWidth / 2 ? current - 1 : current + 1);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  show(0);
}

// ---------- Index: hover a line to show its preview ----------
const preview = document.querySelector(".preview img");
if (preview) {
  const rows = document.querySelectorAll(".projects li");
  rows.forEach((row) => {
    new Image().src = row.dataset.preview; // preload, so the preview appears instantly
    row.addEventListener("mouseenter", () => {
      preview.src = row.dataset.preview;
      preview.alt = row.textContent;
      preview.hidden = false;
      row.classList.add("is-active");
    });
    row.addEventListener("mouseleave", () => {
      preview.hidden = true;
      row.classList.remove("is-active");
    });
  });
}
