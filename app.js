document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".image_container .image");
  const popup = document.querySelector(".popup_image");
  const popupImg = popup.querySelector("img");
  const closeButton = popup.querySelector("span");

  let currentIndex = -1;

  function showPopup(index) {
    currentIndex = index;
    const imageSrc = images[currentIndex].src;
    const imageAlt = images[currentIndex].alt;
    popupImg.src = imageSrc;
    popupImg.alt = imageAlt;
    popup.style.display = "flex";
  }

  function closePopup() {
    popup.style.display = "none";
    currentIndex = -1;
  }

  function showNextImage() {
    if (currentIndex < images.length - 1) {
      showPopup(currentIndex + 1);
    }
  }

  function showPreviousImage() {
    if (currentIndex > 0) {
      showPopup(currentIndex - 1);
    }
  }

  images.forEach((image, index) => {
    image.addEventListener("click", () => showPopup(index));
  });

  closeButton.addEventListener("click", closePopup);

  document.addEventListener("keydown", (e) => {
    if (popup.style.display === "flex") {
      if (e.key === "ArrowRight") {
        showNextImage();
      } else if (e.key === "ArrowLeft") {
        showPreviousImage();
      } else if (e.key === "Escape") {
        closePopup();
      }
    }
  });

  // Set current year in the footer
  document.getElementById(
    "copyright_text"
  ).textContent = `© ${new Date().getFullYear()} Yousri Cherif. All rights reserved.`;
});

function transformScroll(event) {
  const currentPage = document.body.id;
  if (currentPage === "index") {
    if (!event.deltaY) {
      return;
    }

    event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
    event.preventDefault();
  }
}

var element = document.scrollingElement || document.documentElement;
element.addEventListener("wheel", transformScroll);
