// encouragement.js - Daily encouragement system with randomized messages

const encouragementMessages = [
  "I love your smile",
  "I love your eyes",
  "I love your cheeks",
  "I love your laugh",
  "I love your caring",
  "I love your cheesecake",
  "I love your strength",
  "I love your passion",
  "I love your intelligence",
  "I love your sense of humor",
  "I love your determination",
  "I love your monte carlo",
  "I love your body",
  "I love your face",
  "I love your empathy",
  "I love your creativity",
  "I love your abilities",
  "I love your energy",
  "I love your style",
  "I love your bitchiness",
  "I love your warmth",
  "I love your presence",
  "I love your quirks",
  "I love your kaleshiness",
  "I love your hugs",
  "I love your kisses",
  "I love your cuddles",
  "I love our watermelon",
  "I love watching sunsets with you",
  "I love our talks",
  "I love our adventures",
  "I love walking around campus with you",
  "I love going to sharma and share with you",
  "I love our dancing together",
  "I love going JP with you",
  "I love eating hashtag late night with you",
  
];

let currentMessageIndex = -1;
let usedMessages = [];

function getRandomMessage() {
  // Reset if all messages have been used
  if (usedMessages.length >= encouragementMessages.length) {
    usedMessages = [];
  }
  
  let availableMessages = encouragementMessages.filter((_, index) => 
    !usedMessages.includes(index)
  );
  
  if (availableMessages.length === 0) {
    // Fallback, should not happen
    return encouragementMessages[0];
  }
  
  const randomIndex = Math.floor(Math.random() * availableMessages.length);
  const selectedMessage = availableMessages[randomIndex];
  
  // Find the original index and mark as used
  const originalIndex = encouragementMessages.indexOf(selectedMessage);
  usedMessages.push(originalIndex);
  currentMessageIndex = originalIndex;
  
  return selectedMessage;
}

function showDailyEncouragement() {
  // Add flowers and enhanced hearts
  document.body.classList.add('encouragement-active');
  
  // Create flowers
  createFlowers();
  
  // Get random message
  const message = getRandomMessage();
  document.getElementById('encouragement-message').textContent = message;
  
  // Show overlay
  const overlay = document.getElementById('encouragement-overlay');
  overlay.classList.remove('hidden');
  
  // Hide main content
  const container = document.querySelector('.container');
  container.style.opacity = '0.1';
  container.style.transform = 'scale(0.95)';
}

function closeDailyEncouragement() {
  // Hide overlay
  const overlay = document.getElementById('encouragement-overlay');
  overlay.classList.add('hidden');
  
  // Show main content
  const container = document.querySelector('.container');
  container.style.opacity = '1';
  container.style.transform = 'scale(1)';
  
  // Remove flowers and enhanced effects after animation
  setTimeout(() => {
    document.body.classList.remove('encouragement-active');
    removeFlowers();
  }, 500);
}

function showNewMessage() {
  const message = getRandomMessage();
  const messageElement = document.getElementById('encouragement-message');
  
  // Fade out current message
  messageElement.style.opacity = '0';
  messageElement.style.transform = 'translateY(20px)';
  
  // Change message and fade back in
  setTimeout(() => {
    messageElement.textContent = message;
    messageElement.style.opacity = '1';
    messageElement.style.transform = 'translateY(0)';
  }, 300);
}

function createFlowers() {
  const flowerEmojis = ['🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '💐', '🏵️', '🌾', '🍀'];
  
  // Remove existing flowers first
  removeFlowers();
  
  // Create new flowers
  for (let i = 0; i < 15; i++) {
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
    flower.style.left = Math.random() * 100 + '%';
    flower.style.animationDelay = Math.random() * 5 + 's';
    flower.style.animationDuration = (8 + Math.random() * 7) + 's';
    document.body.appendChild(flower);
  }
}

function removeFlowers() {
  const flowers = document.querySelectorAll('.flower');
  flowers.forEach(flower => flower.remove());
}

// Close overlay if clicking outside
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('encouragement-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeDailyEncouragement();
      }
    });
  }
});
