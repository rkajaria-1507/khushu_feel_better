// hug.js - Virtual Hug Panda Interactions with Image Switching
console.log('Virtual Hug page loaded');

let isHugging = false;

function popImage(type) {
  const img = document.createElement('img');
  img.src = type === 'sad' ? '../images/sad.png' : '../images/kissing.png';
  img.className = 'pop-image';
  img.style.position = 'fixed';
  img.style.zIndex = 1000;
  img.style.width = '60px';
  img.style.height = '60px';
  img.style.left = `${Math.random() * 80 + 10}vw`;
  img.style.top = `${Math.random() * 70 + 10}vh`;
  img.style.transition = 'opacity 0.5s';
  document.body.appendChild(img);
  setTimeout(() => { img.style.opacity = 0; }, 2500);
  setTimeout(() => { img.remove(); }, 3000);
}

let popInterval;
function startPop(type) {
  if (popInterval) clearInterval(popInterval);
  popInterval = setInterval(() => popImage(type), 700);
}
function stopPop() {
  if (popInterval) clearInterval(popInterval);
}

function initializeHug() {
  const hugButton = document.querySelector('.hug-button');
  const pandaContainer = document.querySelector('.panda-container');
  const hugMessage = document.querySelector('.hug-message');
  
  startPop('sad'); // Start sad popping on load
  // Add floating hearts effect
  if (typeof createHeart === 'function') {
    setInterval(createHeart, 500);
  }
  if (hugButton && pandaContainer && hugMessage) {
    hugButton.addEventListener('click', () => {
      if (!isHugging) {
        stopPop();
        startPop('kissing'); // Switch to kissing popping
        startHug();
      } else {
        stopPop();
        startPop('sad'); // Back to sad popping
        endHug();
      }
    });
  }
}

function startHug() {
  const pandaContainer = document.querySelector('.panda-container');
  const pandaImage = document.querySelector('.panda-image');
  const hugMessage = document.querySelector('.hug-message');
  const hugButton = document.querySelector('.hug-button');

  isHugging = true;

  // Switch to the "after" image (PNG)
  pandaImage.src = "../images/hugging.png";

  pandaContainer.classList.add('hugging');
  hugMessage.textContent = "🤗 Hugging you tight! You are loved! 💕";
  hugButton.textContent = "End Hug";
  hugButton.style.background = "linear-gradient(145deg, #28a745, #34ce57)";
}

function endHug() {
  const pandaContainer = document.querySelector('.panda-container');
  const pandaImage = document.querySelector('.panda-image');
  const hugMessage = document.querySelector('.hug-message');
  const hugButton = document.querySelector('.hug-button');
  
  isHugging = false;
  
  // Switch back to the "before" image (JPEG)
  pandaImage.src = "../images/standing.png";
  
  pandaContainer.classList.remove('hugging');
  hugMessage.textContent = "💖 Click below for a warm hug! 💖";
  hugButton.textContent = "Give Me a Hug!";
  hugButton.style.background = "linear-gradient(145deg, #4CAF50, #45a049)";
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeHug);
