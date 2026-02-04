const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const $  = (sel) => document.querySelector(sel);

const tagButtons    = $$(".pill-tag");
const skyContainer  = $("#skyContainer");
const skyStarsLayer = $("#skyStars");
const skyLines      = $("#skyLines");
const skyHint       = $("#skyHint");

const zoomInBtn     = $("#zoomInBtn");
const zoomOutBtn    = $("#zoomOutBtn");
const fullscreenBtn = $("#fullscreenBtn");
const tagSearch     = $("#tagSearchInput");

// filter controls
const filterPills   = $$(".vis-filters .pill");
const applyBtn      = $("#applyFiltersBtn");
const relatedOnlyCb = $("#relatedOnlyCheckbox");
const cards         = $$(".vis-note-card");
const resultsCount  = $("#resultsCount");

let stars = [];  // { tag, x, y, el }
let scale = 1;

// canvas sizing 
function resizeCanvas(){
  if (!skyContainer || !skyLines) return;
  const rect = skyContainer.getBoundingClientRect();
  skyLines.width  = rect.width;
  skyLines.height = rect.height;
  drawLines();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function updateHint(){
  if (!skyHint) return;
  skyHint.style.display = stars.length ? "none" : "flex";
}

// add star as SVG star shape
function addStar(tag){
  const rect = skyContainer.getBoundingClientRect();
  const padding = 60;
  const x = Math.random() * (rect.width  - padding * 2) + padding;
  const y = Math.random() * (rect.height - padding * 2) + padding;

  const ns = "http://www.w3.org/2000/svg";
  const el = document.createElementNS(ns, "svg");
  el.setAttribute("class", "star-node");
  el.setAttribute("width", 0);        // remove rectangle
  el.setAttribute("height", 0);
  el.style.position = "absolute";
  el.style.left = x + "px";
  el.style.top  = y + "px";
  el.style.overflow = "visible";      // ensure star is fully visible
  el.dataset.tag = tag;
  el.style.cursor = "grab";

  // star shape path
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", `
    M 0 30 
    q 80 5 74 -70
    q 2 70 80 70
    q -84 -10 -80 70.9
    q 5 -80 -70 -70
    Z
  `);
  path.setAttribute("fill", "#F5CF5D");
  path.setAttribute("transform", "scale(0.4)"); // smaller star
  el.appendChild(path);

  // label text
  const text = document.createElementNS(ns, "text");
  text.textContent = "#" + tag;
  text.setAttribute("x", 0);
  text.setAttribute("y", 0);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "#111");
  text.setAttribute("font-size", "8px");
  text.setAttribute("font-weight", "bold");
  el.appendChild(text);

  skyStarsLayer.appendChild(el);

  const star = { tag, x, y, el };
  stars.push(star);

  makeDraggable(star);
  applyScale();
  updateHint();
  drawLines();
}

function removeStar(tag){
  const idx = stars.findIndex(s => s.tag === tag);
  if (idx === -1) return;
  stars[idx].el.remove();
  stars.splice(idx, 1);
  updateHint();
  drawLines();
}

// tag click -> add/remove star 
tagButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tag = btn.dataset.tag;
    const active = btn.classList.contains("active");

    if (active){
      btn.classList.remove("active");
      removeStar(tag);
    } else {
      btn.classList.add("active");
      addStar(tag);
    }

    applyFilters();
  });
});

// dragging 
function makeDraggable(star){
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  const el = star.el;

  function onDown(e){
    e.preventDefault();
    dragging = true;
    el.style.cursor = "grabbing";
    const box  = el.getBoundingClientRect();
    offsetX = e.clientX - box.left;
    offsetY = e.clientY - box.top;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function onMove(e){
    if (!dragging) return;
    const rect = skyContainer.getBoundingClientRect();
    let x = e.clientX - rect.left - offsetX;
    let y = e.clientY - rect.top  - offsetY;
    const pad = 20;
    x = Math.max(pad, Math.min(rect.width  - pad, x));
    y = Math.max(pad, Math.min(rect.height - pad, y));
    star.x = x;
    star.y = y;
    el.style.left = x + "px";
    el.style.top  = y + "px";
    drawLines();
  }

  function onUp(){
    dragging = false;
    el.style.cursor = "grab";
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  }

  el.addEventListener("pointerdown", onDown);
}

// draw constellation lines
function drawLines(){
    if (!skyLines || !skyContainer) return;
    const ctx = skyLines.getContext("2d");
    const rect = skyContainer.getBoundingClientRect();
    ctx.clearRect(0,0,rect.width,rect.height);
  
    if (stars.length < 2) return;
  
    ctx.save();
    ctx.setLineDash([6,6]);
    ctx.strokeStyle = "rgba(255,209,89,0.9)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
  
    stars.forEach((s, i) => {
      const path = s.el.querySelector("path");
      const bbox = path.getBBox();
  
      // Account for the star's position and scale
      const scaleValue = parseFloat(s.el.style.transform.replace(/scale\((.*)\)/, "$1")) || 1;
      const cx = s.x + bbox.x + bbox.width/2 * scaleValue;
      const cy = s.y + bbox.y + bbox.height/2 * scaleValue;
  
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
  
    ctx.stroke();
    ctx.restore();
  }
  
  
  
// zoom 
function applyScale(){
  stars.forEach(s => {
    s.el.style.transformOrigin = "center center";
    s.el.style.transform = `scale(${scale})`;
  });
}
zoomInBtn?.addEventListener("click", () => { scale = Math.min(1.6, scale + 0.1); applyScale(); });
zoomOutBtn?.addEventListener("click", () => { scale = Math.max(0.7, scale - 0.1); applyScale(); });

// fullscreen height toggle
fullscreenBtn?.addEventListener("click", () => { skyContainer.classList.toggle("fullscreen"); resizeCanvas(); });

// tag search 
tagSearch?.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  tagButtons.forEach(btn => {
    const tag = btn.dataset.tag.toLowerCase();
    btn.style.display = tag.includes(q) ? "inline-flex" : "none";
  });
});

/* FILTER LOGIC */
function getFilterState(){
  const visActive  = document.querySelector('.vis-filter-group[data-filter="visibility"] .pill.active');
  const timeActive = document.querySelector('.vis-filter-group[data-filter="time"] .pill.active');
  return { visibility: visActive ? visActive.dataset.value : 'all',
           time:       timeActive ? timeActive.dataset.value : 'all',
           relatedOnly: !!relatedOnlyCb?.checked };
}

function applyFilters(){
  const state = getFilterState();
  const activeTags = $$(".pill-tag.active").map(b => b.dataset.tag.toLowerCase());
  let visibleCount = 0;
  cards.forEach(card => {
    const cardVis  = (card.dataset.visibility || 'public').toLowerCase();
    const cardTime = (card.dataset.time || 'all').toLowerCase();
    const cardTags = (card.dataset.tags || "").split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
    let show = true;
    if (state.visibility !== 'all' && cardVis !== state.visibility) show = false;
    if (state.time !== 'all' && cardTime !== state.time) show = false;
    if (show && state.relatedOnly && activeTags.length){
      const hasCommon = cardTags.some(t => activeTags.includes(t));
      if (!hasCommon) show = false;
    }
    card.style.display = show ? "" : "none";
    if (show) visibleCount++;
  });
  if (resultsCount) resultsCount.textContent = `Results (${visibleCount})`;
}

// clicking on pills switches active & filters
filterPills.forEach(btn => {
  btn.addEventListener("click", () => {
    const group = btn.closest(".vis-filter-group");
    if (!group) return;
    group.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
  });
});

applyBtn?.addEventListener("click", (e) => { e.preventDefault(); applyFilters(); });
relatedOnlyCb?.addEventListener("change", applyFilters);
applyFilters();

/* Notification dropdown */
const notifToggle = document.getElementById("notificationToggle");
const notifPanel  = document.getElementById("notificationPanel");
if (notifToggle && notifPanel){
  notifToggle.addEventListener("click", (e) => { e.preventDefault(); notifPanel.classList.toggle("hidden"); });
  document.addEventListener("click", (e) => { if (!notifPanel.contains(e.target) && !notifToggle.contains(e.target)) notifPanel.classList.add("hidden"); });
}

/* User dropdown */
const userToggle = document.getElementById("userToggle");
const userPanel  = document.getElementById("userPanel");
if (userToggle && userPanel){
  userToggle.addEventListener("click", (e) => { e.preventDefault(); userPanel.classList.toggle("hidden"); });
  document.addEventListener("click", (e) => { if (!userPanel.contains(e.target) && !userToggle.contains(e.target)) userPanel.classList.add("hidden"); });
}

/* Log Out (demo) */
document.querySelector(".logout-btn")?.addEventListener("click", () => { alert("Logged out! (demo)"); });
