const $ = (id) => document.getElementById(id);
const root = document.documentElement;
const sidebar = $("sidebar");
const menuBtn = $("menu-btn");

function setMenu(open) {
  sidebar.classList.toggle("open", open);
  $("overlay").hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}
menuBtn.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
$("close-btn").addEventListener("click", () => setMenu(false));
$("overlay").addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
document.querySelectorAll(".nav a, .hire").forEach((a) => a.addEventListener("click", () => setMenu(false)));
matchMedia("(min-width: 861px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

const themeBtn = $("theme-toggle");
function syncTheme() {
  themeBtn.setAttribute("aria-checked", root.getAttribute("data-theme") === "dark" ? "true" : "false");
}
syncTheme();
themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("portfolio-theme", next); } catch (e) {}
  syncTheme();
});

const links = [...document.querySelectorAll(".nav a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const obs = new IntersectionObserver((entries) => {
  const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!hit) return;
  links.forEach((a) => {
    if (a.getAttribute("href") === "#" + hit.target.id) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
}, { rootMargin: "-15% 0px -55% 0px", threshold: [0.15, 0.4] });
sections.forEach((s) => obs.observe(s));

function certStatus(start, end) {
  const now = new Date();
  if (now < new Date(start + "T00:00:00")) return "Upcoming";
  if (now > new Date(end + "T23:59:59")) return "Completed";
  return "In progress";
}
document.querySelectorAll(".cert").forEach((card) => {
  const label = card.dataset.status || certStatus(card.dataset.start, card.dataset.end);
  const pill = document.createElement("span");
  pill.className = label === "In progress" ? "pill fill" : "pill";
  pill.textContent = label;
  card.querySelector("header").appendChild(pill);
});

let certFilter = "All";
function renderCerts() {
  let shown = 0;
  document.querySelectorAll(".cert").forEach((card) => {
    const ok = certFilter === "All" || card.dataset.issuer === certFilter;
    card.hidden = !ok;
    if (ok) shown += 1;
  });
  $("cert-empty").hidden = shown !== 0;
  document.querySelectorAll("[data-cert-filter]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.certFilter === certFilter));
  });
}
document.querySelectorAll("[data-cert-filter]").forEach((b) => {
  b.addEventListener("click", () => { certFilter = b.dataset.certFilter; renderCerts(); });
});

let semFilter = "all";
function renderSeminars() {
  let shown = 0;
  document.querySelectorAll(".seminar").forEach((item) => {
    const ok = semFilter === "all"
      || (semFilter === "security" && item.dataset.security === "true")
      || (semFilter === "psite" && item.dataset.host === "PSITE");
    item.hidden = !ok;
    if (ok) shown += 1;
  });
  $("sem-empty").hidden = shown !== 0;
  $("sem-note").hidden = semFilter !== "psite";
  document.querySelectorAll("[data-sem-filter]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.semFilter === semFilter));
  });
}
document.querySelectorAll("[data-sem-filter]").forEach((b) => {
  b.addEventListener("click", () => { semFilter = b.dataset.semFilter; renderSeminars(); });
});

$("copy-email")?.addEventListener("click", async () => {
  const status = $("copy-status");
  const email = $("email").textContent;
  try {
    await navigator.clipboard.writeText(email);
    status.textContent = "Email copied.";
  } catch (e) {
    status.textContent = "Copy is blocked in this browser. Select the address and copy it manually.";
  }
});

$("contact-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("c-name").value.trim();
  const email = $("c-email").value.trim();
  const msg = $("c-msg").value.trim();
  const status = $("form-status");
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !msg) {
    status.textContent = "Enter your name, a valid email, and a message.";
    return;
  }
  const subject = encodeURIComponent("Portfolio inquiry from " + name);
  const body = encodeURIComponent(msg + "\n\nFrom: " + name + " <" + email + ">");
  window.location.href = "mailto:kerbi2600@gmail.com?subject=" + subject + "&body=" + body;
  status.textContent = "Opening your email app with this message.";
});

const pdfModal = $("pdf-modal");
const pdfFrame = $("pdf-frame");
let pdfOpener = null;
function showModal(title, opener) {
  pdfOpener = opener;
  $("pdf-title").textContent = title;
  pdfModal.hidden = false;
  document.body.style.overflow = "hidden";
  $("pdf-close").focus();
}
function openPdf(src, title, opener) {
  $("gallery-body").hidden = true;
  $("gallery-body").replaceChildren();
  pdfFrame.hidden = false;
  $("pdf-newtab").hidden = false;
  $("pdf-newtab").href = src;
  pdfFrame.src = src + "#view=FitH";
  showModal(title, opener);
}
function openGallery(templateId, title, opener) {
  const tpl = $(templateId);
  if (!tpl) return;
  pdfFrame.src = "about:blank";
  pdfFrame.hidden = true;
  $("pdf-newtab").hidden = true;
  const body = $("gallery-body");
  body.replaceChildren(tpl.content.cloneNode(true));
  body.hidden = false;
  body.scrollTop = 0;
  showModal(title, opener);
}
function closePdf() {
  if (pdfModal.hidden) return;
  pdfModal.hidden = true;
  pdfFrame.src = "about:blank";
  $("gallery-body").replaceChildren();
  document.body.style.overflow = "";
  if (pdfOpener) pdfOpener.focus();
}
document.querySelectorAll(".lab-open").forEach((b) => {
  b.addEventListener("click", () => {
    if (b.dataset.gallery) openGallery(b.dataset.gallery, b.dataset.title, b);
    else openPdf(b.dataset.pdf, b.dataset.title, b);
  });
});
$("pdf-close").addEventListener("click", closePdf);
pdfModal.addEventListener("click", (e) => { if (e.target === pdfModal) closePdf(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePdf(); });

if ($("year")) $("year").textContent = String(new Date().getFullYear());
