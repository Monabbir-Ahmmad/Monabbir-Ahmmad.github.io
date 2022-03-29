const navbar = document.getElementById("navbar");
const intro = document.getElementById("intro-container");
const about = document.getElementById("about-container");
const skills = document.getElementById("skills-container");
const typeWriterElement = document.getElementById("typeWriter");
const btnAboutMe = document.getElementById("intro-btn-about");
const btnSkills = document.getElementById("about-btn-skills");
const sections = document.getElementsByClassName("section");

const sectionsInView = [];
const introText = "Hello world! I'm Tajbir  |^◡^|";
let introTextIndex = 0;

function typeWriter() {
  if (introTextIndex === 0) {
    typeWriterElement.innerHTML = "&hairsp;";
    introTextIndex += 1;
    setTimeout(typeWriter, 1000);
  } else if (introTextIndex <= introText.length) {
    typeWriterElement.innerHTML += introText.charAt(introTextIndex - 1);
    introTextIndex++;
    setTimeout(typeWriter, 100);
  } else {
    introTextIndex = 0;
    setTimeout(typeWriter, 2000);
  }
}

typeWriter();

btnAboutMe.addEventListener("click", () => {
  about.scrollIntoView({
    behavior: "smooth",
  });
});

btnSkills.addEventListener("click", () => {
  skills.scrollIntoView({
    behavior: "smooth",
  });
});

window.onscroll = () => {
  if (sectionsInView[0].classList.contains("dark")) {
    navbar.classList.add("nav-dark");
  } else {
    navbar.classList.remove("nav-dark");
  }
};

const intersectionCallback = (entries) => {
  entries.forEach((entry) => {
    setSectionAnimation(entry);
    setSectionsInView(entry);
  });
};

const setSectionAnimation = (entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add("animation");
  } else {
    entry.target.classList.remove("animation");
  }
};

const setSectionsInView = (entry) => {
  if (entry.isIntersecting) {
    if (entry.intersectionRect.height - entry.intersectionRect.top > 0) {
      sectionsInView.unshift(entry.target);
    } else {
      sectionsInView.push(entry.target);
    }
  } else {
    const index = sectionsInView.indexOf(entry.target);

    if (index > -1) {
      sectionsInView.splice(index, 1);
    }
  }
};

const observer = new IntersectionObserver(intersectionCallback, {
  threshold: 0.1,
});

for (let i = 0; i < sections.length; i++) {
  observer.observe(sections[i]);
}
