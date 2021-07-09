"use strict";
function expandNav() {
  // console.log("clicked");
  const overlay = document.getElementById("overlay");
  const navBtn = document.getElementById("navBtn");
  if (overlay.style.display == "block") {
    hideNav();
  } else {
    overlay.style.display = "block";
    navBtn.classList.remove("fa-bars");
    navBtn.classList.add("fa-times");
  }
}

function hideNav() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  navBtn.classList.add("fa-bars");
  navBtn.classList.remove("fa-times");
}
