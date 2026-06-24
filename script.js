const body = document.body;
const loader = document.querySelector(".loader");
const loaderTrack = document.querySelector(".loader__track span");
const loaderProgress = document.querySelector(".loader__track");
const loaderPercent = document.querySelector(".loader__percent");
const skipButton = document.querySelector(".loader__skip");
const toast = document.querySelector(".birthday-toast");
const cursorGlow = document.querySelector(".cursor-glow");
const scrollProgress = document.querySelector(".scroll-progress span");
const ambientDust = document.querySelector(".ambient-dust");
const journeyLinks = [...document.querySelectorAll(".journey-rail a")];
const wishSeal = document.querySelector("#wish-seal");
const wishDialog = document.querySelector("#wish-dialog");
const wishClose = document.querySelector(".wish-dialog__close");
const wishDone = document.querySelector(".wish-dialog__done");
const calmButton = document.querySelector("#calm-button");
const calmDialog = document.querySelector("#calm-dialog");
const calmClose = document.querySelector(".calm-dialog__close");
const calmDone = document.querySelector(".calm-dialog__done");
const breathingPrompt = document.querySelector(".breathing-prompt");
const breathingCount = document.querySelector(".breathing-orb i");
const finale = document.querySelector(".finale");
const finaleBurst = document.querySelector(".finale__burst");
const countdownLabel = document.querySelector(".countdown__label");
const countdownValues = {
  days: document.querySelector('[data-countdown="days"]'),
  hours: document.querySelector('[data-countdown="hours"]'),
  minutes: document.querySelector('[data-countdown="minutes"]'),
  seconds: document.querySelector('[data-countdown="seconds"]'),
};
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let loaderFinished = false;
let loaderFrame;
let loadedAssets = 0;
let breathingTimer;
let breathingStartedAt = 0;
const loadDuration = reduceMotion ? 250 : 2600;
const loaderStart = performance.now();
const imageAssets = [
  "assets/lake-portrait.webp",
  "assets/traditional-portrait.webp",
  "assets/sunny-day.webp",
  "assets/collage.webp",
  "assets/mirror-moment.webp",
];

imageAssets.forEach((source) => {
  const image = new Image();
  const markComplete = () => {
    loadedAssets += 1;
  };

  image.onload = markComplete;
  image.onerror = markComplete;
  image.src = source;
});

function updateCountdown() {
  const now = new Date();
  const target = new Date(2026, 5, 20, 0, 0, 0, 0);
  const birthdayEnd = new Date(2026, 5, 20, 23, 59, 59, 999);
  const isBirthday = now >= target && now <= birthdayEnd;
  const hasPassed = now > birthdayEnd;
  const remaining = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(remaining / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownLabel.textContent = isBirthday
    ? "Today belongs to you"
    : hasPassed
      ? "Celebrating June 20, 2026"
      : "Until June 20, 2026";
  countdownValues.days.textContent = String(days).padStart(3, "0");
  countdownValues.hours.textContent = String(hours).padStart(2, "0");
  countdownValues.minutes.textContent = String(minutes).padStart(2, "0");
  countdownValues.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

function finishLoader() {
  if (loaderFinished) return;
  loaderFinished = true;
  cancelAnimationFrame(loaderFrame);

  loaderTrack.style.width = "100%";
  loaderPercent.textContent = "100";
  loaderProgress.setAttribute("aria-valuenow", "100");
  loader.classList.add("is-finished");
  body.classList.remove("is-loading");
  window.setTimeout(() => body.classList.add("is-ready"), 180);

  window.setTimeout(() => toast.classList.add("is-visible"), 1100);
  window.setTimeout(() => toast.classList.remove("is-visible"), 4400);
}

function updateLoader(now) {
  const elapsed = now - loaderStart;
  const timeProgress = Math.min(elapsed / loadDuration, 1);
  const assetProgress = loadedAssets / imageAssets.length;
  const readiness = Math.min(1, 0.12 + assetProgress * 0.88);
  const linearProgress = Math.min(timeProgress, readiness);
  const easedProgress = 1 - Math.pow(1 - linearProgress, 3);
  const percent = Math.round(easedProgress * 100);

  loaderTrack.style.width = `${percent}%`;
  loaderPercent.textContent = String(percent).padStart(2, "0");
  loaderProgress.setAttribute("aria-valuenow", String(percent));

  if (linearProgress < 1 && elapsed < 6500) {
    loaderFrame = requestAnimationFrame(updateLoader);
  } else {
    window.setTimeout(finishLoader, reduceMotion ? 0 : 280);
  }
}

loaderFrame = requestAnimationFrame(updateLoader);
skipButton.addEventListener("click", finishLoader);

function addStars(container, count) {
  if (!container) return;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--opacity", (0.15 + Math.random() * 0.7).toFixed(2));
    star.style.setProperty("--duration", `${2.2 + Math.random() * 3.8}s`);
    star.style.setProperty("--delay", `${Math.random() * -5}s`);

    if (Math.random() > 0.86) {
      star.style.width = "3px";
      star.style.height = "3px";
    }

    fragment.appendChild(star);
  }

  container.appendChild(fragment);
}

addStars(document.querySelector(".star-field"), 52);
addStars(document.querySelector(".finale__stars"), 45);

function addFinaleSparks(container, count) {
  if (!container || reduceMotion) return;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const spark = document.createElement("span");
    spark.style.setProperty("--spark-angle", `${(360 / count) * index + Math.random() * 8}deg`);
    spark.style.setProperty("--spark-length", `${2.5 + Math.random() * 5}rem`);
    spark.style.setProperty("--spark-delay", `${Math.random() * 0.55}s`);
    fragment.appendChild(spark);
  }

  container.appendChild(fragment);
}

addFinaleSparks(finaleBurst, 28);

function addDust(container, count) {
  if (!container || reduceMotion) return;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    particle.className = "dust";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--dust-duration", `${13 + Math.random() * 18}s`);
    particle.style.setProperty("--dust-delay", `${Math.random() * -24}s`);
    particle.style.setProperty("--dust-drift", `${-60 + Math.random() * 120}px`);
    particle.style.setProperty("--dust-opacity", (0.08 + Math.random() * 0.2).toFixed(2));
    fragment.appendChild(particle);
  }

  container.appendChild(fragment);
}

addDust(ambientDust, 24);

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((element) => revealObserver.observe(element));

const finaleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        finaleObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

if (finale) finaleObserver.observe(finale);

const memories = [...document.querySelectorAll("[data-memory]")];
let scrollTicking = false;

function updateMemoryMotion() {
  const viewportHeight = window.innerHeight;
  const isMobile = window.innerWidth <= 640;

  memories.forEach((memory) => {
    const rect = memory.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distance = Math.abs(center - viewportHeight / 2);
    const reach = viewportHeight * 0.82;
    const visibility = Math.max(0, Math.min(1, 1 - distance / reach));
    const easedVisibility = 0.18 + visibility * 0.82;
    const shift = (1 - visibility) * (isMobile ? 24 : 38);
    const visual = memory.querySelector(".memory__visual");
    const words = memory.querySelector(".memory__words");
    const image = memory.querySelector(".photo-frame img");
    const direction = memory.classList.contains("memory--reverse") ? -1 : 1;

    visual.style.opacity = easedVisibility.toFixed(3);
    visual.style.transform = `translate3d(0, ${shift}px, 0)`;
    words.style.opacity = easedVisibility.toFixed(3);
    words.style.transform = isMobile
      ? `translate3d(0, ${shift * 0.75}px, 0)`
      : `translate3d(${direction * shift * 0.45}px, 0, 0)`;

    if (image) {
      const scale = 1.025 + (1 - visibility) * (isMobile ? 0.085 : 0.035);
      image.style.transform = `scale(${scale.toFixed(3)})`;
    }

    memory.classList.toggle("is-centered", distance < viewportHeight * 0.24);
  });

  scrollTicking = false;
}

function updatePageProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollProgress.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;

  const chapterTargets = journeyLinks.map((link) => document.querySelector(link.getAttribute("href")));
  let activeIndex = 0;

  chapterTargets.forEach((target, index) => {
    if (target && target.getBoundingClientRect().top <= window.innerHeight * 0.52) {
      activeIndex = index;
    }
  });

  journeyLinks.forEach((link, index) => link.classList.toggle("is-active", index === activeIndex));
}

function requestScrollUpdate() {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(() => {
      if (!reduceMotion) updateMemoryMotion();
      updatePageProgress();
      scrollTicking = false;
    });
  }
}

if (!reduceMotion) updateMemoryMotion();
updatePageProgress();
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

window.addEventListener(
  "pointermove",
  (event) => {
    if (!cursorGlow) return;
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  },
  { passive: true }
);

function openWish() {
  if (!wishDialog) return;

  if (typeof wishDialog.showModal === "function") {
    wishDialog.showModal();
  } else {
    wishDialog.setAttribute("open", "");
  }
}

function closeWish() {
  if (!wishDialog) return;

  if (typeof wishDialog.close === "function") {
    wishDialog.close();
  } else {
    wishDialog.removeAttribute("open");
  }
}

wishSeal?.addEventListener("click", openWish);
wishClose?.addEventListener("click", closeWish);
wishDone?.addEventListener("click", closeWish);

wishDialog?.addEventListener("click", (event) => {
  if (event.target === wishDialog) closeWish();
});

function updateBreathingGuide() {
  const elapsedSeconds = Math.floor((performance.now() - breathingStartedAt) / 1000);
  const cycleSecond = elapsedSeconds % 12;
  const phaseSecond = cycleSecond % 4;
  const count = 4 - phaseSecond;

  if (cycleSecond < 4) {
    breathingPrompt.textContent = "Breathe in";
  } else if (cycleSecond < 8) {
    breathingPrompt.textContent = "Hold gently";
  } else {
    breathingPrompt.textContent = "Breathe out";
  }

  breathingCount.textContent = String(count);
}

function openCalmMoment() {
  if (!calmDialog) return;

  breathingStartedAt = performance.now();
  updateBreathingGuide();
  window.clearInterval(breathingTimer);
  breathingTimer = window.setInterval(updateBreathingGuide, 250);

  if (typeof calmDialog.showModal === "function") {
    calmDialog.showModal();
  } else {
    calmDialog.setAttribute("open", "");
  }
}

function closeCalmMoment() {
  if (!calmDialog) return;
  window.clearInterval(breathingTimer);

  if (typeof calmDialog.close === "function") {
    calmDialog.close();
  } else {
    calmDialog.removeAttribute("open");
  }
}

calmButton?.addEventListener("click", openCalmMoment);
calmClose?.addEventListener("click", closeCalmMoment);
calmDone?.addEventListener("click", closeCalmMoment);

calmDialog?.addEventListener("click", (event) => {
  if (event.target === calmDialog) closeCalmMoment();
});

calmDialog?.addEventListener("close", () => {
  window.clearInterval(breathingTimer);
});
