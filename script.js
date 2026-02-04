// script.js — minimal interactions: mobile nav, modal, form, scroll reveals
// No external libraries. Small, accessible, performant.

// DOM helpers
const qs = (s) => document.querySelector(s);
const qsa = (s) => document.querySelectorAll(s);

// NAV TOGGLE
const navToggle = qs("#navToggle");
const navMenu = qs("#navMenu");
navToggle?.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navMenu.classList.toggle("open");
});

// MODAL: request demo
const modalBackdrop = qs("#modalBackdrop");
const modalClose = qs("#modalClose");
const requestButtons = [
  ...qsa("#requestDemoTop, #requestDemoHero, #requestDemoFooter"),
];
const modalCancel = qs("#modalCancel");
// Form submission removed: modal is now contact-only (mailto link / Close)

requestButtons.forEach((b) => b?.addEventListener("click", openModal));
modalClose?.addEventListener("click", closeModal);
modalCancel?.addEventListener("click", closeModal);
modalBackdrop?.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});

function openModal() {
  modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  // focus the close button for accessibility
  modalCancel?.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = "";
}

// DOWNLOAD ONE-PAGER: placeholder behavior
const downloadOnePager = qs("#downloadOnePager");
downloadOnePager?.addEventListener("click", (e) => {
  e.preventDefault();
  const blob = new Blob(
    [
      `Hawana — One Pager
Portable Indoor Air Safety Reimagined

Features:
- Real-time CO2, PM2.5, VOC detection
- Simple risk levels (Green / Yellow / Red)
- Portable and affordable
- Actionable alerts
`,
    ],
    { type: "text/plain" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Hawana-One-Pager.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// SCROLL REVEAL: lightweight using IntersectionObserver
const reveals = qsa(
  ".card, .feature, .persona, .device, .timeline li, .feature-grid > .feature",
);
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

reveals.forEach((el) => io.observe(el));

// keyboard accessibility: close modal with Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalBackdrop.hidden) closeModal();
});

// Tiny enhancement: simulate device risk change on click (demo only)
const deviceStatus = document.querySelector(".device-status");
if (deviceStatus) {
  deviceStatus.addEventListener("click", () => {
    if (deviceStatus.classList.contains("green")) {
      deviceStatus.classList.remove("green");
      deviceStatus.classList.add("yellow");
      deviceStatus.textContent = "Risk: Medium";
      deviceStatus.style.background = "#FFF7ED";
      deviceStatus.style.color = "#B45309";
    } else if (deviceStatus.classList.contains("yellow")) {
      deviceStatus.classList.remove("yellow");
      deviceStatus.classList.add("red");
      deviceStatus.textContent = "Risk: High";
      deviceStatus.style.background = "#FEF2F2";
      deviceStatus.style.color = "#B91C1C";
    } else {
      deviceStatus.classList.remove("red");
      deviceStatus.classList.add("green");
      deviceStatus.textContent = "Risk: Low";
      deviceStatus.style.background = "#ECFDF5";
      deviceStatus.style.color = "#059669";
    }
  });
}
