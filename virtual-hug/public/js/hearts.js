// hearts.js - Floating heart background script
function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart-bg';
  heart.style.left = `${Math.random() * 100}vw`;
  heart.innerText = '❤️';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}
// Create a new heart every 500ms (guard against multiple intervals)
if (typeof window !== 'undefined') {
  if (!window.__heartIntervalId) {
    window.__heartIntervalId = setInterval(createHeart, 500);
  }
}
