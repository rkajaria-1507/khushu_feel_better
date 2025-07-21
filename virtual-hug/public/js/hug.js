// hug.js - Virtual Hug Panda Interactions with Image Switching
console.log('Virtual Hug page loaded');

let isHugging = false;

function initializeHug() {
  const hugButton = document.querySelector('.hug-button');
  const pandaContainer = document.querySelector('.panda-container');
  const hugMessage = document.querySelector('.hug-message');
  
  if (hugButton && pandaContainer && hugMessage) {
    hugButton.addEventListener('click', () => {
      if (!isHugging) {
        startHug();
      } else {
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
  pandaImage.src = "../images/images.png";
  
  pandaContainer.classList.add('hugging');
  hugMessage.textContent = "🤗 Hugging you tight! You are loved! 💕";
  hugButton.textContent = "End Hug";
  hugButton.style.background = "linear-gradient(145deg, #28a745, #34ce57)";
  
  // Auto end hug after 5 seconds
  setTimeout(() => {
    if (isHugging) {
      endHug();
    }
  }, 5000);
}

function endHug() {
  const pandaContainer = document.querySelector('.panda-container');
  const pandaImage = document.querySelector('.panda-image');
  const hugMessage = document.querySelector('.hug-message');
  const hugButton = document.querySelector('.hug-button');
  
  isHugging = false;
  
  // Switch back to the "before" image (JPEG)
  pandaImage.src = "../images/images.jpeg";
  
  pandaContainer.classList.remove('hugging');
  hugMessage.textContent = "💖 Click below for a warm hug! 💖";
  hugButton.textContent = "Give Me a Hug!";
  hugButton.style.background = "linear-gradient(145deg, #4CAF50, #45a049)";
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeHug);
