const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const revealItems = document.querySelectorAll("[data-reveal]");
const projectTrack = document.querySelector("[data-project-track]");
const prevButton = document.querySelector("[data-project-prev]");
const nextButton = document.querySelector("[data-project-next]");
const yearLabel = document.querySelector("#year");
const heroSpotlight = document.querySelector(".hero-spotlight");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (yearLabel) {
  yearLabel.textContent = `(c) ${new Date().getFullYear()} Swastik Das`;
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteHeader.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (!prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sections = [...document.querySelectorAll("main section[id]")];

if (sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleSection) {
        return;
      }

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visibleSection.target.id}`;
        link.classList.toggle("is-active", isActive);
      });
    },
    {
      threshold: 0.45,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (projectTrack && prevButton && nextButton) {
  const scrollAmount = () => Math.max(projectTrack.clientWidth * 0.88, 280);

  prevButton.addEventListener("click", () => {
    projectTrack.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  nextButton.addEventListener("click", () => {
    projectTrack.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
}

if (heroSpotlight && !prefersReducedMotion.matches) {
  heroSpotlight.addEventListener("pointermove", (event) => {
    const bounds = heroSpotlight.getBoundingClientRect();
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;

    heroSpotlight.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroSpotlight.addEventListener("pointerleave", () => {
    heroSpotlight.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  });
}
