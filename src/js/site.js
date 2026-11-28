// Site behaviour. No animations: things simply appear and disappear.
// Each feature runs only on pages that have its elements.

initMenu();
initHome();
initIndexPreview();
initProjectSuggestions();

// Small screens: Menu opens a full-screen menu and turns into Close.
// The visible word is the button's name, so only aria-expanded changes.
function initMenu() {
  const toggle = document.querySelector(".nav__toggle");
  if (!toggle) return;

  const setOpen = (open) => {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("menu-open")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

// Home: click the left half for the previous image, the right half for the next.
// With a mouse, the counter follows the pointer (see .cursor in site.css).
function initHome() {
  const stage = document.querySelector(".stage");
  if (!stage) return;

  const images = [...stage.querySelectorAll("img")];
  const counter = document.querySelector(".counter");
  const cursor = createCursor();
  const isOverNav = (target) => target.closest(".nav, .menu");
  let current = 0;

  const show = (index) => {
    images[current].hidden = true;
    current = (index + images.length) % images.length;
    images[current].hidden = false;
    counter.textContent = cursor.textContent = `${current + 1}/${images.length}`;
  };

  document.addEventListener("click", (e) => {
    if (isOverNav(e.target)) return;
    show(e.clientX < window.innerWidth / 2 ? current - 1 : current + 1);
  });

  // Right and up go forward (the counter goes up), left and down go back.
  const steps = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 };
  document.addEventListener("keydown", (e) => {
    if (e.key in steps) show(current + steps[e.key]);
  });

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    cursor.classList.toggle("is-visible", !isOverNav(e.target));
  });

  document.documentElement.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible");
  });

  show(0);
}

function createCursor() {
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);
  return cursor;
}

// Index: hovering a project shows its preview image. The italic is pure CSS.
function initIndexPreview() {
  const preview = document.querySelector(".preview img");
  if (!preview) return;

  for (const row of document.querySelectorAll(".projects li")) {
    new Image().src = row.dataset.preview; // preload, so the preview appears instantly

    row.addEventListener("mouseenter", () => {
      preview.src = row.dataset.preview;
      preview.hidden = false;
    });
    row.addEventListener("mouseleave", () => {
      preview.hidden = true;
    });
  }
}

// Project page: the page lists every other project and CSS shows the
// first few (how many depends on the screen width). Shuffling the list
// makes those few a random pick on each visit.
function initProjectSuggestions() {
  const list = document.querySelector(".project__more-list");
  if (!list) return;

  list.append(...shuffle([...list.querySelectorAll("a")]));
}

// Fisher–Yates: every order is equally likely.
function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
