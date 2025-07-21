// encouragement.js - Daily encouragement system with randomized messages

const encouragementMessages = [
  "You are stronger than you think 💪",
  "Every day is a new beginning 🌅",
  "You matter more than you know 💖",
  "Your dreams are valid and achievable ✨",
  "Progress, not perfection is the goal 🌟",
  "You are capable of amazing things 🦋",
  "Keep going, you've got this! 🔥",
  "Your potential is limitless 🚀",
  "You are loved beyond measure 💕",
  "Believe in yourself as much as I believe in you 🌈",
  "You bring light to the world 🌞",
  "Your kindness makes a difference 🌸",
  "You are exactly where you need to be 🎯",
  "Your journey is beautiful, even the tough parts 🌺",
  "You have survived 100% of your difficult days 🌟",
  "Your heart is full of magic ✨",
  "You are a masterpiece in progress 🎨",
  "Your smile can change the world 😊",
  "You are braver than you believe 🦁",
  "Every step forward is progress 👣",
  "You are a gift to this world 🎁",
  "Your story is still being written 📖",
  "You deserve all the good things coming your way 🌈",
  "Your resilience is inspiring 💎",
  "You make the world brighter just by being in it ☀️",
  "Trust the process, trust yourself 🌱",
  "You are enough, exactly as you are 💝",
  "Your voice matters and should be heard 🎤",
  "You have the power to create positive change 🌍",
  "Your compassion is a superpower 💫"
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
