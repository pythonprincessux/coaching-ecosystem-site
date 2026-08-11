document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const navContainer = document.querySelector(".nav-container");

  /*
   * Mobile navigation
   */
  if (nav && navContainer) {
    const menuButton = document.createElement("button");

    menuButton.className = "mobile-menu-button";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    navContainer.appendChild(menuButton);

    const closeMenu = () => {
      nav.classList.remove("nav-open");
      menuButton.classList.remove("menu-open");
      document.body.classList.remove("menu-is-open");

      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
    };

    const openMenu = () => {
      nav.classList.add("nav-open");
      menuButton.classList.add("menu-open");
      document.body.classList.add("menu-is-open");

      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation menu");
    };

    menuButton.addEventListener("click", () => {
      const menuIsOpen = nav.classList.contains("nav-open");

      if (menuIsOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      const clickedInsideNav = nav.contains(event.target);
      const clickedMenuButton = menuButton.contains(event.target);

      if (
        nav.classList.contains("nav-open") &&
        !clickedInsideNav &&
        !clickedMenuButton
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) {
        closeMenu();
      }
    });
  }

  /*
   * Header styling after scrolling
   */
  const updateHeader = () => {
    if (!header) {
      return;
    }

    if (window.scrollY > 20) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /*
   * Smooth scrolling for same-page links
   */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });

  /*
   * Scroll-reveal animation
   */
  const revealSelectors = [
    ".section-heading",
    ".comparison-card",
    ".method-card",
    ".resource-preview-card",
    ".focus-card",
    ".framework-step",
    ".content-panel",
    ".phase-card",
    ".principle-card",
    ".why-panel",
    ".application-card",
    ".not-this-card",
    ".philosophy-card",
    ".credential-card",
    ".experience-card",
    ".value-card",
    ".resource-card",
    ".pathway-card",
    ".journal-entry",
    ".assessment-visual",
    ".assessment-copy",
    ".founder-image",
    ".founder-copy",
    ".story-heading",
    ".story-copy",
    ".story-quote",
    ".personal-note",
    ".signup-panel"
  ];

  const revealElements = document.querySelectorAll(
    revealSelectors.join(",")
  );

  revealElements.forEach((element, index) => {
    element.classList.add("scroll-reveal");

    const staggerPosition = index % 4;
    element.style.setProperty(
      "--reveal-delay",
      `${staggerPosition * 80}ms`
    );
  });

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /*
   * Hero entrance
   */
  const heroElements = document.querySelectorAll(
    [
      ".fcr-hero-copy",
      ".fcr-hero-visual",
      ".about-hero-copy",
      ".about-portrait-wrap",
      ".resources-hero-copy",
      ".resources-hero-visual"
    ].join(",")
  );

  heroElements.forEach((element, index) => {
    element.classList.add("hero-entrance");
    element.style.setProperty(
      "--hero-delay",
      `${150 + index * 130}ms`
    );
  });

  requestAnimationFrame(() => {
    heroElements.forEach((element) => {
      element.classList.add("hero-visible");
    });
  });

  /*
   * Automatically highlight the current page
   */
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav a, .site-footer nav a").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("http") || href.startsWith("#")) {
      return;
    }

    const linkedPage = href.split("/").pop();

    if (linkedPage === currentPage) {
      link.classList.add("current-page");

      if (link.closest(".nav")) {
        link.setAttribute("aria-current", "page");
      }
    }
  });

  /*
   * Prevent unfinished placeholder links from jumping to the top
   */
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
});