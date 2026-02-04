document.addEventListener("DOMContentLoaded", function () {
    //  Screens 
    const startScreen  = document.getElementById("start-screen");
    const gameScreen   = document.getElementById("game-screen");
    const resultScreen = document.getElementById("result-screen");
  
    // only one screen visible
    function showScreen(el) {
      [startScreen, gameScreen, resultScreen].forEach(s => s && s.classList.remove("active"));
      if (el) el.classList.add("active");
    }
  
    showScreen(startScreen);
  
    
    const startBtn   = document.getElementById("start-btn");
    
  
    const gameArea       = document.getElementById("game-area");
    const currentStarEl  = document.getElementById("current-star");
    const caughtCountEl  = document.getElementById("caught-count");
    const missedCountEl  = document.getElementById("missed-count");
    const finalCaughtEl  = document.getElementById("final-caught");
    const finalMissedEl  = document.getElementById("final-missed");
  
   
    const totalStars = 10;
    let currentStar = 0;
    let caught = 0;
    let missed = 0;
    let starTimeoutId = null;
    let starElement = null;
  
    
    startBtn?.addEventListener("click", startGame);
  
   
  
  
    // Game flow 
    function startGame() {
      currentStar = 0;
      caught = 0;
      missed = 0;
      updateHUD();
  
      showScreen(gameScreen);
      spawnNextStar();
    }
  
    function spawnNextStar() {
      if (currentStar >= totalStars) {
        endGame();
        return;
      }
  
      currentStar++;
      updateHUD();
  
      if (starElement) starElement.remove();
  
      const starSize = 90;
      const gameRect = gameArea.getBoundingClientRect();
      const maxX = gameRect.width - starSize;
      const maxY = gameRect.height - starSize;
  
      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;
  
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.left = randomX + "px";
      star.style.top  = randomY + "px";
  
      // pop-in
      requestAnimationFrame(() => star.classList.add("show"));
  
      // catch
      star.addEventListener("click", () => {
        if (!star.isConnected) return;
        caught++;
        updateHUD();
        clearTimeout(starTimeoutId);
        star.remove();
        spawnNextStar();
      });
  
      gameArea.appendChild(star);
      starElement = star;
  
      // start fading 
      setTimeout(() => {
        if (star.isConnected) star.classList.add("fade-out");
      }, 700);
  
      // remove and count miss
      starTimeoutId = setTimeout(() => {
        if (star.isConnected) {
          missed++;
          updateHUD();
          star.remove();
        }
        spawnNextStar();
      }, 900);
    }
  
    function updateHUD() {
      if (currentStarEl) currentStarEl.textContent = currentStar;
      if (caughtCountEl)  caughtCountEl.textContent  = caught;
      if (missedCountEl)  missedCountEl.textContent  = missed;
    }
  
    function endGame() {
    // cleanup
    if (starElement && starElement.isConnected) {
      starElement.remove();
      starElement = null;
    }
    clearTimeout(starTimeoutId);
  
    // numbers
    const lostEl = document.getElementById("lost-count");
    if (lostEl) lostEl.textContent = missed;
    if (finalCaughtEl)  finalCaughtEl.textContent  = caught;
    if (finalMissedEl)  finalMissedEl.textContent  = missed;
  
    // show result screen now
    showScreen(resultScreen);
  
    // line-by-line reveal (0.5s per sentence) 
    // pick only the sentence lines, in order
    const lines = resultScreen.querySelectorAll(
      ".result-body .lead, .result-body .mid"
    );
  
    // prepare all lines
    lines.forEach(el => el.classList.add("result-line"));
  
    // reveal each line sequentially
    lines.forEach((el, i) => {
      setTimeout(() => el.classList.add("show"), i * 500); // 0.5s per line
    });
  
    
  
  
  }
  
  
    (function setupScrollExplore() {
      const el = document.getElementById('scroll-explore');
      if (!el) return;
  
      function go() {
        const sel = el.getAttribute('data-target');
        if (sel) {
          const tgt = document.querySelector(sel);
          if (tgt) {
            tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        }
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
  
      el.addEventListener('click', go);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go();
        }
      });
    })();
  });
  