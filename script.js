const pageLoader = document.getElementById("pageLoader");
const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const backToTop = document.getElementById("backToTop");
const revealElements = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const contactForm = document.getElementById("contactForm");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");
const ongItems = document.querySelectorAll(".ong-item");
const locationBtn = document.getElementById("locationBtn");
const mapPins = document.querySelectorAll(".map-pin");

window.addEventListener("load", () => {
  setTimeout(() => {
    pageLoader.classList.add("hidden");
  }, 650);
});

function handleHeaderScroll() {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
    backToTop.classList.add("show");
  } else {
    header.classList.remove("scrolled");
    backToTop.classList.remove("show");
  }
}

window.addEventListener("scroll", handleHeaderScroll);

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navMenu.classList.toggle("open");
  document.body.classList.toggle("no-scroll");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("open");
    document.body.classList.remove("no-scroll");
  });
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${Math.min(index * 80, 280)}ms`;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

function animateCounter(counter) {
  const target = Number(counter.dataset.counter);
  let current = 0;
  const duration = 1400;
  const start = performance.now();

  function updateCounter(time) {
    const progress = Math.min((time - start) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    current = Math.floor(easedProgress * target);
    counter.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(updateCounter);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.5,
  }
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

const sections = document.querySelectorAll("section[id]");

function setActiveNavLink() {
  const scrollPosition = window.scrollY + 140;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

window.addEventListener("scroll", setActiveNavLink);

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase().trim();

    ongItems.forEach((item) => {
      const name = item.dataset.name.toLowerCase();

      if (name.includes(value)) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
}

if (locationBtn) {
  locationBtn.addEventListener("click", () => {
    locationBtn.classList.add("active");
    locationBtn.textContent = "✅ Localização ativa";

    mapPins.forEach((pin, index) => {
      pin.style.animationDuration = "1s";
      pin.style.transform = "rotate(-45deg) scale(1.12)";

      setTimeout(() => {
        pin.style.transform = "";
      }, 800 + index * 150);
    });

    const firstItem = document.querySelector(".ong-item");

    if (firstItem) {
      firstItem.style.background = "#ffffff";
      firstItem.style.boxShadow = "0 14px 40px rgba(15, 61, 46, 0.14)";
      firstItem.style.transform = "translateX(7px)";

      setTimeout(() => {
        firstItem.style.background = "";
        firstItem.style.boxShadow = "";
        firstItem.style.transform = "";
      }, 1800);
    }

    setTimeout(() => {
      locationBtn.textContent = "📍 Usar localização";
      locationBtn.classList.remove("active");
    }, 2600);
  });
}

mapPins.forEach((pin) => {
  pin.addEventListener("click", () => {
    const ongName = pin.dataset.ong;

    showToast(`Você selecionou: ${ongName}`);
  });
});

function showToast(message) {
  const toastText = toast.querySelector("p");

  toastText.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const interest = document.getElementById("interest");

    const isValidName = name.value.trim().length >= 2;
    const isValidEmail = validateEmail(email.value);
    const isValidInterest = interest.value !== "";

    clearInputErrors();

    if (!isValidName) {
      setInputError(name);
      showToast("Digite um nome válido.");
      return;
    }

    if (!isValidEmail) {
      setInputError(email);
      showToast("Digite um e-mail válido.");
      return;
    }

    if (!isValidInterest) {
      setInputError(interest);
      showToast("Selecione uma opção de interesse.");
      return;
    }

    showToast("Interesse enviado com sucesso!");
    contactForm.reset();
  });
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function setInputError(input) {
  input.style.borderColor = "#e35d5b";
  input.style.boxShadow = "0 0 0 5px rgba(227, 93, 91, 0.12)";
}

function clearInputErrors() {
  const fields = contactForm.querySelectorAll("input, select");

  fields.forEach((field) => {
    field.style.borderColor = "";
    field.style.boxShadow = "";
  });
}

const currentYear = new Date().getFullYear();

if (currentYear > 2026) {
  const footerBottom = document.querySelector(".footer-bottom p");

  if (footerBottom) {
    footerBottom.textContent = `© ${currentYear} GeoImpact. Projeto acadêmico desenvolvido para fins educacionais.`;
  }
}