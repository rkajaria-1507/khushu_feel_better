// index.js - Home page specific functionality
console.log('Virtual Care Package home page loaded');

// Add any home page specific interactions here

function updateLoveTimer() {
  const startDate = new Date('2023-09-13T00:00:00');
  const now = new Date();
  let diff = now - startDate;

  // Calculate total seconds
  let totalSeconds = Math.floor(diff / 1000);
  let years = Math.floor(totalSeconds / (365.25 * 24 * 3600));
  totalSeconds -= years * 365.25 * 24 * 3600;
  let months = Math.floor(totalSeconds / (30.44 * 24 * 3600));
  totalSeconds -= months * 30.44 * 24 * 3600;
  let days = Math.floor(totalSeconds / (24 * 3600));
  totalSeconds -= days * 24 * 3600;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds -= hours * 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds - minutes * 60); // ensure whole number seconds

  const timerText = `${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  const timerEl = document.getElementById('love-timer');
  if (timerEl) timerEl.textContent = timerText;
}
setInterval(updateLoveTimer, 1000);
updateLoveTimer();

function showBouquetPopup() {
  // Remove any existing bouquet
  const existing = document.getElementById('bouquet-popup');
  if (existing) existing.remove();

  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'bouquet-popup';
  popup.style.position = 'fixed';
  popup.style.left = '50%';
  popup.style.top = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.zIndex = 9999;
  popup.style.background = 'rgba(255, 230, 242, 0.95)';
  popup.style.borderRadius = '24px';
  popup.style.boxShadow = '0 8px 32px rgba(212, 20, 110, 0.18)';
  popup.style.padding = '32px 24px 16px 24px';
  popup.style.textAlign = 'center';
  popup.style.maxWidth = '90vw';
  popup.style.maxHeight = '80vh';

  // Image
  const img = document.createElement('img');
  img.src = 'images/flowers.png';
  img.alt = 'Bouquet';
  img.style.width = '220px';
  img.style.maxWidth = '200%';
  img.style.borderRadius = '16px';
  img.style.boxShadow = '0 4px 16px rgba(212, 20, 110, 0.12)';
  popup.appendChild(img);

  // Caption
  const caption = document.createElement('div');
  caption.textContent = 'a pretty little bouquet for my pretty little woman';
  caption.style.marginTop = '18px';
  caption.style.fontSize = '1.2rem';
  caption.style.color = '#d4146e';
  caption.style.fontWeight = '600';
  popup.appendChild(caption);

  document.body.appendChild(popup);

  // Remove after 5-7 seconds
  setTimeout(() => { popup.remove(); }, Math.floor(Math.random() * 2000) + 5000);
}

function bouquetLoop(first = false) {
  if (first) {
    // Delay first popup by 2-10 min
    const firstDelay = Math.floor(Math.random() * 30000) + 30000; 
    setTimeout(() => {
      showBouquetPopup();
      bouquetLoop();
    }, firstDelay);
  } else {
    showBouquetPopup();
    const nextDelay = Math.floor(Math.random() * 120000); 
    setTimeout(bouquetLoop, nextDelay);
  }
}

// Start bouquet loop on every page
if (typeof window !== 'undefined') {
  bouquetLoop(true);
}

function toggleMusic() {
  const music = document.getElementById('bg-music');
  const btn = document.querySelector('.music-btn');
  if (!music || !btn) return;
  if (music.paused) {
    music.play();
    btn.textContent = 'Pause ⏸';
  } else {
    music.pause();
    btn.textContent = 'Play 🎵';
  }
}

document.getElementById('music-select').addEventListener('change', function() {
  const music = document.getElementById('bg-music');
  const btn = document.querySelector('.music-btn');
  music.src = this.value;
  music.load();
  btn.textContent = 'Play 🎵';
});
