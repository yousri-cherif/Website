function getCurrentYear() {
  try {
    return new Date().getFullYear().toString();
  } catch (error) {
    console.error("Error while getting the current year:", error);
    return ""; // Fallback to empty string if an error occurs
  }
}

function setFooterText() {
  const footerElement = document.getElementById("copyright_text");
  const currentYear = getCurrentYear();
  const footerText = `© ${currentYear} Yousri Cherif. All rights reserved.`;
  footerElement.textContent = footerText;
}

function addPopupImageBehavior() {
  document.querySelectorAll(".image_container img").forEach((image) => {
    image.onclick = () => {
      document.querySelector(".popup_image").style.display = "block";
      document.querySelector(".popup_image img").src =
        image.getAttribute("src");
    };
  });
  document.querySelector(".popup_image span").onclick = () => {
    document.querySelector(".popup_image").style.display = "none";
  };
}

document.addEventListener("DOMContentLoaded", () => {
  setFooterText();

  const currentPage = document.body.id;
  if (currentPage === "index") {
    addPopupImageBehavior();
  }
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
