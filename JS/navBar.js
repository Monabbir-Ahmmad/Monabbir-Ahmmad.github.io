const navHamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const links = document.querySelectorAll(".nav-links li");

navHamburger.addEventListener("click", () => {
  navHamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
  document.body.classList.toggle("stop-scrolling");
});
