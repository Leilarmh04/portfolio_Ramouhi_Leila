/* ===========================================
   PORTFOLIO – script.js
   Leïla Ramouhi
=========================================== */

// ===== SWIPER =====
const swiper = new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slideToClickedSlide: true, // clic sur slide latérale → elle vient au centre
  slidesPerView: 3,
  spaceBetween: 24,
  coverflowEffect: {
    rotate: 35,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    0: { slidesPerView: 1.15, spaceBetween: 12 },
    600: { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 24 },
  },
});

// ===== BOUTONS < > =====
document
  .querySelector(".carousel-btn.next")
  ?.addEventListener("click", () => swiper.slideNext());
document
  .querySelector(".carousel-btn.prev")
  ?.addEventListener("click", () => swiper.slidePrev());

// ===== DONNÉES PROJETS =====
const projects = [
  {
    title: "Site vitrine – Henné by Anissa",
    text:
      "J'ai créé ce site vitrine à partir d'un besoin concret, mais aussi comme un vrai terrain de progression.\n" +
      "Il m'a permis de travailler la logique côté base de données et JavaScript, tout en construisant un projet utile et structuré.\n" +
      "Le site a été pensé pour évoluer : il servira à organiser des prestations et deviendra progressivement un espace de type blog, géré directement par la personne qui le fera vivre.\n" +
      "Aujourd'hui, c'est une base fonctionnelle ; demain, une plateforme complète, amenée à grandir avec le projet.",
    url: "https://leilarmh04.github.io/Site-Vitrine-Henne/",
  },
  {
    title: "Évaluation HTML / CSS",
    text:
      "Dans le cadre d'une évaluation HTML/CSS, j'ai réalisé un site web destiné à présenter mes compétences en intégration.\n" +
      "L'objectif était de transformer une maquette fournie en un site fonctionnel, tout en respectant la structure et l'apparence du design original.\n" +
      "J'ai construit l'intégralité du site en utilisant uniquement HTML et CSS : organisation du contenu, mise en page, intégration des images, choix des balises, gestion des espacements et du rendu global.\n" +
      "Cette évaluation m'a permis de consolider mes bases et de gagner en assurance dans ma façon de coder.",
    url: "http://127.0.0.1:5503/Premiere-evaluation-HTML-CSS/eval_lbb.html",
  },
  {
    title: "Traduction",
    text: "\n" + "\n" + "\n" + "",
    url: "https://github.com/Leilarmh04/Traduction",
  },
  {
    title: "Jeu virtuel",
    text:
      "Dans le cadre d'un projet de groupe, j'ai contribué à la création d'un jeu virtuel interactif et engageant.\n" +
      "\n" +
      "\n" +
      "",
    url: "https://github.com/SPLprod/Sport-Virtuel",
  },
];

// ===== MISE À JOUR DU TEXTE =====
const descEl = document.getElementById("project-desc");
const linkEl = document.getElementById("project-link");

function updateProjectUI() {
  const i = Number.isFinite(swiper.realIndex) ? swiper.realIndex : 0;
  const p = projects[i] ?? { text: "", url: "" };

  if (descEl) descEl.textContent = p.text;

  if (linkEl) {
    if (p.url) {
      linkEl.href = p.url;
      linkEl.style.display = "inline-flex";
    } else {
      linkEl.style.display = "none";
    }
  }
}

updateProjectUI();
swiper.on("slideChange", updateProjectUI);

// ===== LIGHTBOX =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lbClose = lightbox?.querySelector(".lb-close");
const lbPrev = lightbox?.querySelector(".lb-prev");
const lbNext = lightbox?.querySelector(".lb-next");

function toAbsUrl(src) {
  try {
    return new URL(src, location.href).href;
  } catch {
    return src || "";
  }
}

function getSlideImages() {
  return [...document.querySelectorAll(".mySwiper .swiper-slide img")]
    .map((img) => toAbsUrl(img.currentSrc || img.src))
    .filter(Boolean);
}

function openLightbox(idx) {
  const imgs = getSlideImages();
  if (!imgs.length || !lightbox || !lightboxImg) return;
  lightbox.dataset.images = JSON.stringify(imgs);
  lightbox.dataset.index = String(idx);
  lightboxImg.src = imgs[idx];
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  if (lightboxImg) lightboxImg.src = "";
  document.body.style.overflow = "";
}

function shiftLightbox(delta) {
  const imgs = JSON.parse(lightbox?.dataset.images || "[]");
  if (!imgs.length) return;
  let idx =
    (Number(lightbox.dataset.index || 0) + delta + imgs.length) % imgs.length;
  lightbox.dataset.index = String(idx);
  if (lightboxImg) lightboxImg.src = imgs[idx];
}

// Ouvrir lightbox uniquement sur clic de la slide ACTIVE
swiper.on("click", () => {
  const active = document.querySelector(".mySwiper .swiper-slide-active img");
  if (!active) return;
  const src = toAbsUrl(active.currentSrc || active.src);
  const imgs = getSlideImages();
  let idx = imgs.indexOf(src);
  if (idx < 0)
    idx = imgs.findIndex((s) => s.split("/").pop() === src.split("/").pop());
  if (idx < 0) return;
  openLightbox(idx);
});

lbClose?.addEventListener("click", closeLightbox);
lbPrev?.addEventListener("click", () => shiftLightbox(-1));
lbNext?.addEventListener("click", () => shiftLightbox(+1));
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Fermer avec Échap
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ===== HEADER FADE ON SCROLL =====
const header = document.querySelector(".header-color");

function updateHeaderFade() {
  if (!header) return;
  const t = Math.min(Math.max(window.scrollY / 160, 0), 1);
  header.style.setProperty("--fadeOpacity", String(t));
}

updateHeaderFade();
window.addEventListener("scroll", updateHeaderFade, { passive: true });

// ===== EMAILJS =====
// IDs à retrouver sur https://dashboard.emailjs.com
// - Service ID  : dans "Email Services"
// - Template ID : dans "Email Templates"
// - Public Key  : dans "Account" > "General"
//
// Dans ton template EmailJS, utilise ces variables :
//   {{from_name}}   → Nom de l'expéditeur
//   {{from_email}}  → Email de l'expéditeur
//   {{message}}     → Corps du message

document
  .getElementById("contactForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    const statusEl = document.getElementById("status-message");
    const btn = this.querySelector("button[type='submit']");

    // Feedback visuel
    if (statusEl) {
      statusEl.textContent = "Envoi en cours…";
      statusEl.style.color = "var(--text-muted)";
    }
    if (btn) btn.disabled = true;

    emailjs
      .sendForm(
        "service_elp7sjd", // ← ton Service ID EmailJS
        "template_x7imh5p", // ← ton Template ID EmailJS
        this, // ← le formulaire lui-même
      )
      .then(() => {
        if (statusEl) {
          statusEl.textContent = "✓ Message envoyé avec succès !";
          statusEl.style.color = "#7ecb8a";
        }
        this.reset();
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        if (statusEl) {
          statusEl.textContent =
            "✗ Une erreur est survenue. Réessaie plus tard.";
          statusEl.style.color = "#e07070";
        }
      })
      .finally(() => {
        if (btn) btn.disabled = false;
      });
  });
