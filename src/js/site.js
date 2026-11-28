// Site behaviour. No animations: things simply appear and disappear.
// Each feature runs only on pages that have its elements.

initMenu();
initHome();
initIndexPreview();
initProjectSuggestions();
initProjectCounter();

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
// With a mouse, the counter is the pointer (see createCounterCursor).
function initHome() {
  const stage = document.querySelector(".stage");
  if (!stage) return;

  const images = [...stage.querySelectorAll("img")];
  const counter = document.querySelector(".counter");
  const cursor = createCounterCursor();
  let current = 0;

  const show = (index) => {
    images[current].hidden = true;
    current = (index + images.length) % images.length;
    images[current].hidden = false;
    counter.textContent = cursor.textContent = `${current + 1}/${images.length}`;
  };

  document.addEventListener("click", (e) => {
    if (isOverControl(e.target)) return;
    show(e.clientX < window.innerWidth / 2 ? current - 1 : current + 1);
  });

  // Right and up go forward (the counter goes up), left and down go back.
  const steps = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 };
  document.addEventListener("keydown", (e) => {
    if (e.key in steps) show(current + steps[e.key]);
  });

  show(0);
}

// The counter that replaces the mouse pointer (Home, project pages).
// It follows the mouse and steps aside over anything clickable, where
// the normal pointer shows. CSS shows it only with a mouse
// (.has-counter-cursor in site.css). The caller sets its text.
function createCounterCursor() {
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    cursor.classList.toggle("is-visible", !isOverControl(e.target));
  });

  document.documentElement.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible");
  });

  return cursor;
}

// Links, buttons and the nav keep the normal pointer.
function isOverControl(target) {
  return target.closest("a, button, .nav, .menu");
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

// Project page: the counter pointer (3/13) shows the image at the middle
// of the screen. Between two images it keeps the one just passed.
function initProjectCounter() {
  const images = [...document.querySelectorAll(".project__images img")];
  if (!images.length) return;

  const cursor = createCounterCursor();

  function update() {
    const middle = window.innerHeight / 2;
    const reached = images.filter((image) => image.getBoundingClientRect().top <= middle).length;
    cursor.textContent = `${Math.max(reached, 1)}/${images.length}`;
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

// Fisher–Yates: every order is equally likely.
function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
