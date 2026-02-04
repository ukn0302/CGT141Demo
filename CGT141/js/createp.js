
const $  = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

/*  Date in preview  */
(function(){
  const el = $("#previewDate");
  const now = new Date();
  el.textContent = now.toLocaleString(undefined, {
    month:"long",
    day:"numeric",
    year:"numeric"
  });
})();

/*  Title: 5 words  */
const titleInput   = $("#title");
const titleCount   = $("#titleCount");
const previewTitle = $("#previewTitle");

const countWords = (str) => (str.trim().match(/\S+/g) || []).length;

function enforceTitleLimit(){
  const words = (titleInput.value.trim().match(/\S+/g) || []);
  if (words.length > 5) titleInput.value = words.slice(0,5).join(" ");
  titleCount.textContent = `${countWords(titleInput.value)} / 5 words`;
  previewTitle.textContent = titleInput.value || "Untitled Note";
}
titleInput.addEventListener("input", enforceTitleLimit);

/*  Content: 2 sentences  */
const content      = $("#content");
const contentCount = $("#contentCount");
const previewBody  = $("#previewBody");

function sentenceCount(str){
  return (str.trim().match(/[^.!?]+[.!?]+/g) || []).length;
}

function enforceSentenceLimit(){
  const parts = (content.value.match(/[^.!?]+[.!?]+|\S+$/g) || []);
  let sentences = [];
  let cur = "";
  for (const p of parts){
    cur += p;
    if (/[.!?]$/.test(p)){
      sentences.push(cur.trim());
      cur = "";
    }
    if (sentences.length === 2) break;
  }
  if (sentenceCount(content.value) > 2){
    content.value = sentences.join(" ");
  }
  const n = Math.min(sentenceCount(content.value), 2);
  contentCount.textContent = `${n} / 2 sentences`;
  previewBody.textContent = content.value || "No content provided";
}
content.addEventListener("input", enforceSentenceLimit);

/*  Tags with colors  */
let currentColor = "#F5CF5D";

const palette     = document.getElementById("colorPalette");
const customBtn   = document.getElementById("customColorBtn");
const colorPicker = document.getElementById("customColorPicker");
const tagInput    = document.getElementById("tagText");
const tagList     = document.getElementById("tagList");
const addTagBtn   = document.getElementById("addTagBtn");

function clearDotOutlines() {
  if (!palette) return;
  palette.querySelectorAll(".dot").forEach(d => {
    d.style.outline = "none";
  });
}


if (palette) {
  const presetDots = palette.querySelectorAll(".dot");
  presetDots.forEach(dot => {
    if (dot.id === "customColorBtn") return;

    dot.addEventListener("click", () => {
      currentColor = dot.dataset.color || currentColor;
      clearDotOutlines();
      dot.style.outline = "3px solid rgba(0,0,0,.15)";
    });
  });
}

/* "+" button -> open system color picker */
if (customBtn && colorPicker) {
  customBtn.addEventListener("click", () => {
    colorPicker.click();
  });

  const handlePickedColor = (e) => {
    if (!e.target.value) return;
    currentColor = e.target.value;

    customBtn.style.background = currentColor;
    customBtn.style.color = "#000";
    clearDotOutlines();
    customBtn.style.outline = "3px solid rgba(0,0,0,.15)";
  };

  colorPicker.addEventListener("input", handlePickedColor);
  colorPicker.addEventListener("change", handlePickedColor);
}

/* add tag chip with currentColor */
if (addTagBtn && tagInput && tagList) {
  addTagBtn.addEventListener("click", () => {
    const text = tagInput.value.trim();
    if (!text) return;

    const el = document.createElement("span");
    el.className = "tag";
    el.innerHTML =
      `<span class="dot-mini" style="background:${currentColor}"></span>${text}<span class="x" title="Remove">×</span>`;

    tagList.appendChild(el);
    tagInput.value = "";
  });

  tagList.addEventListener("click", (e) => {
    if (e.target.classList.contains("x")) {
      e.target.parentElement.remove();
    }
  });
}

/* Cover image drag/drop + preview  */
const dz        = $("#dropzone");
const fileInput = $("#coverInput");
const preview   = $("#coverPreview");

function showPreview(file){
  if (!file) return;
  if (!/image\/(png|jpe?g)/i.test(file.type)) return alert("Please use PNG or JPG.");
  if (file.size > 10 * 1024 * 1024) return alert("Max size is 10MB.");
  const reader = new FileReader();
  reader.onload = (e)=>{
    preview.src = e.target.result;
    preview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}
dz.addEventListener("click", ()=> fileInput.click());
fileInput.addEventListener("change", (e)=> showPreview(e.target.files[0]));

["dragenter","dragover"].forEach(evt=>{
  dz.addEventListener(evt, (e)=>{ e.preventDefault(); dz.style.background = "#fff9e1"; }, false);
});
["dragleave","drop"].forEach(evt=>{
  dz.addEventListener(evt, (e)=>{ e.preventDefault(); dz.style.background = "#fffdf4"; }, false);
});
dz.addEventListener("drop", (e)=> showPreview(e.dataTransfer.files[0]));

/*  Visibility toggle  */
const visPrivate = $("#visPrivate");
const visPublic  = $("#visPublic");
const badge      = $("#previewVisibility");

function setVis(btn){
  [visPrivate, visPublic].forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  badge.textContent = btn.dataset.value;
}
visPrivate.addEventListener("click", ()=> setVis(visPrivate));
visPublic .addEventListener("click", ()=> setVis(visPublic));

/* Save  */
$("#saveBtn").addEventListener("click", ()=>{
  const payload = {
    title: titleInput.value.trim(),
    content: content.value.trim(),
    visibility: badge.textContent,
    tags: [...document.querySelectorAll("#tagList .tag")]
      .map(t => t.textContent.replace("×","").trim())
  };
  console.log("Saved draft:", payload);
  alert("Saved! (demo)\nOpen the console to see the payload.");
});

/* Notification dropdown  */
const notifToggle = document.getElementById("notificationToggle");
const notifPanel  = document.getElementById("notificationPanel");

if (notifToggle && notifPanel) {
  notifToggle.addEventListener("click", (e) => {
    e.preventDefault();
    notifPanel.classList.toggle("hidden");
  });

  // click outside to close
  document.addEventListener("click", (e) => {
    if (!notifPanel.contains(e.target) && !notifToggle.contains(e.target)) {
      notifPanel.classList.add("hidden");
    }
  });
}

/*  User dropdown  */
const userToggle = document.getElementById("userToggle");
const userPanel  = document.getElementById("userPanel");

if (userToggle && userPanel) {
  userToggle.addEventListener("click", (e) => {
    e.preventDefault();
    userPanel.classList.toggle("hidden");
  });

  // close when clicking outside
  document.addEventListener("click", (e) => {
    if (!userPanel.contains(e.target) && !userToggle.contains(e.target)) {
      userPanel.classList.add("hidden");
    }
  });
}

/* Log Out (demo function) */
document.querySelector(".logout-btn")?.addEventListener("click", () => {
  alert("Logged out! (demo)");
});

/* initialize counters */
enforceTitleLimit();
enforceSentenceLimit();
