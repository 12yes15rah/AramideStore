/* =========================================
   PEACEFUL VARIETIES
   Vanilla JavaScript interactions
   ========================================= */

"use strict";

// 1. Select the elements we need
const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

const revealElements = document.querySelectorAll(".reveal");

const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

const yearElement = document.querySelector("#year");

// 2. Mobile navigation menu
function closeMenu() {
  navMenu.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  const isOpen = navMenu.classList.toggle("open");

  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );

  document.body.classList.toggle("menu-open", isOpen);
}

menuToggle.addEventListener("click", toggleMenu);

// Close the menu when a visitor chooses a section.
navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Close the menu with the Escape key.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// Reset the mobile menu when returning to desktop layout.
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

// 3. Filter the product collection
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    // Update which filter button looks active.
    filterButtons.forEach((item) => {
      const isActive = item === button;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    // Show matching products and hide the rest.
    productCards.forEach((card) => {
      const category = card.dataset.category;

      const shouldShow =
        selectedCategory === "all" || category === selectedCategory;

      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

// Give the filter buttons their initial accessibility state.
filterButtons.forEach((button) => {
  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("active")),
  );
});


/* Update the product count on the dedicated shop page */
const shopCount = document.querySelector("#shopCount");

function updateShopCount() {
  if (!shopCount) return;

  const visibleProducts = [...productCards].filter(
    (card) => !card.classList.contains("is-hidden")
  );

  shopCount.textContent =
    `${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"}`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", updateShopCount);
});

updateShopCount();


// 4. Reveal sections as they enter the viewport
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // Animate an element only once.
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px",
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  // Fallback for older browsers or reduced-motion settings.
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// 5. Contact form validation and feedback
contactForm.addEventListener("submit", (event) => {
  // Stop the browser from reloading the page.
  event.preventDefault();

  // Clear previous status messages.
  formStatus.textContent = "";
  formStatus.className = "form-status";

  // Let the browser check required fields and input formats.
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  // The form is valid, but no server is connected yet.
  formStatus.textContent =
    "Your form looks good! To send this enquiry, connect a backend or form service.";

  formStatus.classList.add("success");
});

// 6. Automatically update the copyright year
yearElement.textContent = new Date().getFullYear();

// 7. Log a message to help during development
console.log("Peaceful Varieties website is ready.");

/* Contact form: only runs on pages that contain the form */
if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formStatus.textContent = "";
    formStatus.className = "form-status";

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    formStatus.textContent =
      "Your form looks good! Connect a backend or form service to receive enquiries.";

    formStatus.classList.add("success");
  });
}
