let currentPage = document.body.id;
if (currentPage == "index") {
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

try {
  var date = new Date();
  var footer_text =
    "© " + date.getFullYear() + " Yousri cherif. All rights reserved.";
  document.getElementById("copyright_text").textContent = footer_text;
} catch (error) {
  console.error("Error, enable to get date", error);
  document.getElementById("copyright_text").innerHTML =
    "© Yousri cherif. All rights reserved.";
}
