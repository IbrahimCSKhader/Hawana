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

// Request Demo & Download features removed per user request. No modal or automatic downloads remain.

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

// Modal removed — Escape key handler omitted (no modal present)

// Tiny enhancement: simulate device risk change on click (demo only)
const deviceStatus = document.querySelector(".device-status");
const deviceEl = document.querySelector(".device");
const readingCO2 = document.querySelector(".reading:nth-child(1) .value");
const readingPM = document.querySelector(".reading:nth-child(2) .value");
const readingVOC = document.querySelector(".reading:nth-child(3) .value");

function setDeviceState(level) {
  if (!deviceStatus) return;
  // clear classes
  deviceStatus.classList.remove("green", "yellow", "red");
  if (deviceEl) deviceEl.classList.remove("danger", "warn");
  // set states
  if (level === "high") {
    deviceStatus.classList.add("red");
    deviceStatus.textContent = "Risk: High";
    deviceStatus.style.background = "#FEF2F2";
    deviceStatus.style.color = "#B91C1C";
    if (deviceEl) deviceEl.classList.add("danger");
    if (readingCO2) readingCO2.textContent = "2,500 ppm";
    if (readingPM) readingPM.textContent = "250 µg/m³";
    if (readingVOC) readingVOC.textContent = "5.2 mg/m³";
  } else if (level === "medium") {
    deviceStatus.classList.add("yellow");
    deviceStatus.textContent = "Risk: Medium";
    deviceStatus.style.background = "#FFFBEB";
    deviceStatus.style.color = "#B45309";
    if (deviceEl) deviceEl.classList.add("warn");
    if (readingCO2) readingCO2.textContent = "950 ppm";
    if (readingPM) readingPM.textContent = "55 µg/m³";
    if (readingVOC) readingVOC.textContent = "1.2 mg/m³";
  } else {
    // default/low
    deviceStatus.classList.add("green");
    deviceStatus.textContent = "Risk: Low";
    deviceStatus.style.background = "#ECFDF5";
    deviceStatus.style.color = "#059669";
    if (deviceEl) deviceEl.classList.remove("danger", "warn");
    if (readingCO2) readingCO2.textContent = "420 ppm";
    if (readingPM) readingPM.textContent = "8 µg/m³";
    if (readingVOC) readingVOC.textContent = "0.2 mg/m³";
  }

  // update state buttons active styles
  const btnLow = document.getElementById("state-low");
  const btnMed = document.getElementById("state-medium");
  const btnHigh = document.getElementById("state-high");
  [btnLow, btnMed, btnHigh].forEach((b) => {
    if (!b) return;
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
  });
  if (level === "high") {
    btnHigh?.classList.add("active");
    btnHigh?.setAttribute("aria-selected", "true");
  } else if (level === "medium") {
    btnMed?.classList.add("active");
    btnMed?.setAttribute("aria-selected", "true");
  } else {
    btnLow?.classList.add("active");
    btnLow?.setAttribute("aria-selected", "true");
  }
}

// Interactive chart dots — clicking cycles device state (low -> medium -> high)
const chartDots = document.querySelectorAll(".chart-dot");
function cycleState() {
  if (!deviceStatus) return;
  if (deviceStatus.classList.contains("green")) setDeviceState("medium");
  else if (deviceStatus.classList.contains("yellow")) setDeviceState("high");
  else setDeviceState("low");
}
chartDots.forEach((dot) => {
  dot.addEventListener("click", () => cycleState());
  dot.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cycleState();
    }
  });
});

// state buttons
["state-low", "state-medium", "state-high"].forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("click", () => setDeviceState(id.replace("state-", "")));
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setDeviceState(id.replace("state-", ""));
    }
  });
});

// init
setDeviceState("low");
