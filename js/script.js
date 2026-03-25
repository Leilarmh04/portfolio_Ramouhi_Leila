// ===== SWIPER =====
const swiper = new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 3,
  spaceBetween: 20,
  coverflowEffect: {
    rotate: 40,
    stretch: 0,
    depth: 120,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    0: { slidesPerView: 1.2 },
    600: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

// ===== BOUTONS < > =====
const btnNext = document.querySelector(".carousel-btn.next");
const btnPrev = document.querySelector(".carousel-btn.prev");

if (btnNext)
  btnNext.addEventListener("click", () => {
    swiper.slideNext();
    swiper.slideTo(swiper.activeIndex, 300); // recentre
  });
if (btnPrev)
  btnPrev.addEventListener("click", () => {
    swiper.slidePrev();
    swiper.slideTo(swiper.activeIndex, 300); // recentre
  });

// ===== TEXTE + LIEN PAR SLIDE =====
const projects = [
  {
    text:
      "J'ai créé ce site vitrine à partir d'un besoin concret, mais aussi comme un vrai terrain de progression.\n" +
      "Il m'a permis de travailler la logique côté base de données et JavaScript, tout en construisant un projet utile et structuré.\n" +
      "Le site a été pensé pour évoluer : il servira à organiser des prestations et deviendra progressivement un espace de type blog, géré directement par la personne qui le fera vivre.\n" +
      "Aujourd'hui, c'est une base fonctionnelle ; demain, une plateforme complète, amenée à grandir avec le projet.",
    url: "https://leilarmh04.github.io/Site-Vitrine-Henne/",
  },
  {
    text:
      "Dans le cadre d'une évaluation HTML/CSS, j'ai réalisé un site web destiné à présenter mes compétences en intégration. L'objectif était de transformer une maquette fournie en un site fonctionnel, tout en respectant la structure et l'apparence du design original. \n" +
      "J'ai construit l'intégralité du site en utilisant uniquement HTML et CSS. Même si le design n'était pas de moi, j'ai pris en charge toute la partie technique : organisation du contenu, mise en page, intégration des images, choix des bonnes balises, gestion des espacements et du rendu global. Ce projet m'a permis de mettre en pratique mes connaissances, mais surtout d'apprendre énormément sur la manière de structurer un site proprement et de reproduire fidèlement une maquette.\n" +
      "Cette évaluation a été une vraie occasion de progresser et de consolider mes bases. Elle m'a permis de mieux comprendre les exigences d'un travail d'intégration et de gagner en assurance dans ma façon de coder.",
  },
];

const descEl = document.getElementById("project-desc");
const linkEl = document.getElementById("project-link");

function updateProjectUI() {
  const i = Number.isFinite(swiper.realIndex) ? swiper.realIndex : 0;
  const p = projects[i] || { text: "", url: "" };

  if (descEl) descEl.textContent = p.text || "";

  if (linkEl) {
    if (p.url) {
      linkEl.href = p.url;
      linkEl.style.display = "inline-flex";
    } else {
      linkEl.href = "#";
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
    return new URL(src, window.location.href).href;
  } catch {
    return src || "";
  }
}

function getAllSlideImages() {
  return Array.from(document.querySelectorAll(".mySwiper .swiper-slide img"))
    .map((img) => img.currentSrc || img.src)
    .map(toAbsUrl)
    .filter(Boolean);
}

function openLightbox(startIndex) {
  const images = getAllSlideImages();
  if (!images.length || !lightbox || !lightboxImg) return;
  lightbox.dataset.images = JSON.stringify(images);
  lightbox.dataset.index = String(startIndex);
  lightboxImg.src = images[startIndex];
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

function show(delta) {
  if (!lightbox || !lightboxImg) return;
  const images = JSON.parse(lightbox.dataset.images || "[]");
  if (!images.length) return;
  let index = Number(lightbox.dataset.index || 0);
  index = (index + delta + images.length) % images.length;
  lightbox.dataset.index = String(index);
  lightboxImg.src = images[index];
}

// ===== CLIC SUR UNE SLIDE POUR LA CENTRER =====
document.addEventListener("click", (e) => {
  const slide = e.target.closest(".mySwiper .swiper-slide");
  if (!slide) return;

  const slides = Array.from(
    document.querySelectorAll(".mySwiper .swiper-slide"),
  );
  const clickedIndex = slides.indexOf(slide);
  if (clickedIndex < 0) return;

  // Si ce n'est pas la slide active, on la centre (pas de lightbox)
  if (!slide.classList.contains("swiper-slide-active")) {
    swiper.slideTo(clickedIndex, 300);
    return;
  }

  // Si c'est la slide active, on ouvre la lightbox
  const img = slide.querySelector("img");
  if (!img) return;
  const clickedSrc = toAbsUrl(img.currentSrc || img.src);
  if (!clickedSrc) return;
  const sources = getAllSlideImages();
  let finalIndex = sources.indexOf(clickedSrc);
  if (finalIndex < 0) {
    const clickedFile = clickedSrc.split("/").pop();
    finalIndex = sources.findIndex((s) => s.split("/").pop() === clickedFile);
  }
  if (finalIndex < 0) return;
  openLightbox(finalIndex);
});

lbPrev?.addEventListener("click", () => show(-1));
lbNext?.addEventListener("click", () => show(1));
lbClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ===== HEADER FADE ON SCROLL =====
const header = document.querySelector(".header-color");

function updateHeaderFade() {
  if (!header) return;
  const y = window.scrollY;
  let t = (y - 0) / 160;
  if (t < 0) t = 0;
  if (t > 1) t = 1;
  header.style.setProperty("--fadeOpacity", String(t));
}

updateHeaderFade();
window.addEventListener("scroll", updateHeaderFade, { passive: true });
