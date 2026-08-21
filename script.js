const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const typing = document.querySelector(".typing");
const cursorGlow = document.querySelector(".cursor-glow");

const words = ["web", "future", "ideas", "digital world"];
let wordIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const word = words[wordIndex];
  typing.textContent = deleting ? word.slice(0, charIndex--) : word.slice(0, charIndex++);
  let delay = deleting ? 55 : 95;

  if (!deleting && charIndex > word.length) {
    deleting = true;
    delay = 1200;
  } else if (deleting && charIndex < 0) {
    deleting = false;
    charIndex = 0;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 350;
  }
  setTimeout(typeLoop, delay);
}
typeLoop();

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light");
  themeToggle.textContent = body.classList.contains("light") ? "☾" : "☼";
  localStorage.setItem("theme", body.classList.contains("light") ? "light" : "dark");
});

if (localStorage.getItem("theme") === "light") {
  body.classList.add("light");
  themeToggle.textContent = "☾";
}

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];

window.addEventListener("scroll", () => {
  let current = "home";
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 180) current = section.id;
  });
  navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
});

document.addEventListener("mousemove", e => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

document.getElementById("year").textContent = new Date().getFullYear();
