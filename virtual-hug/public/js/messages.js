// messages.js - Interactive envelope system
console.log('Love Messages page loaded');

// Envelope data - easily configurable
const envelopes = [
  { id: 1, 
    caption: "When you're feeling happy", 
    message: "Your joy is contagious! Keep spreading that beautiful smile and lighting up the world around you. ✨" 
  },
  { id: 2, 
    caption: "When you're feeling sad", 
    message: "It's okay to feel this way. You are stronger than you know, and this feeling will pass. You are loved unconditionally. 💕" 
  },
  { id: 3, 
    caption: "When you're feeling mad", 
    message: "Take a deep breath. Your feelings are valid, but remember that you have the power to choose how you respond. You've got this! 💪" 
  },
  { id: 4, 
    caption: "When you need courage", 
    message: "You are braver than you believe, stronger than you seem, and more loved than you imagine. Go conquer your fears! 🦋" 
  },
  { id: 5, 
    caption: "When you're feeling lost", 
    message: "Every path leads somewhere beautiful. Trust the journey, trust yourself, and know that you're exactly where you need to be. 🌟" 
},
  { id: 6, 
    caption: "When you need motivation", 
    message: "You have within you right now, everything you need to deal with whatever the world can throw at you. Believe in yourself! 🔥" 
  }
];

// Track current open envelope
let currentOpenEnvelope = null;

// Create envelope elements
function createEnvelopes() {
  const container = document.querySelector('.messages-container');
  container.innerHTML = '';
  
  envelopes.forEach(envelope => {
    const envelopeDiv = document.createElement('div');
    envelopeDiv.className = 'envelope';
    envelopeDiv.innerHTML = `
      <div class="envelope-front">
        <div class="envelope-flap"></div>
        <div class="envelope-body">
          <div class="envelope-caption">${envelope.caption}</div>
        </div>
      </div>
    `;
    container.appendChild(envelopeDiv);
  });
  
  // Add click handlers
  document.querySelectorAll('.envelope').forEach((envelope, index) => {
    envelope.addEventListener('click', () => openEnvelope(envelope, index));
  });
}

function openEnvelope(envelope, index) {
  // Don't open if another envelope is already open
  if (currentOpenEnvelope) return;
  if (envelope.classList.contains('opened')) return;
  
  currentOpenEnvelope = envelope;
  envelope.classList.add('opened');
  
  // Create fullscreen letter
  const letterOverlay = document.createElement('div');
  letterOverlay.className = 'letter-overlay';
  letterOverlay.innerHTML = `
    <div class="letter-fullscreen">
      <div class="letter-content">
        <div class="close-letter">✕</div>
        <p>${envelopes[index].message}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(letterOverlay);
  
  // Add event listeners for closing
  const closeBtn = letterOverlay.querySelector('.close-letter');
  closeBtn.addEventListener('click', () => closeEnvelope());
  
  // Close when clicking outside the letter
  letterOverlay.addEventListener('click', (e) => {
    if (e.target === letterOverlay) {
      closeEnvelope();
    }
  });
  
  // Animate letter appearance
  setTimeout(() => {
    letterOverlay.classList.add('visible');
  }, 300);
}

function closeEnvelope() {
  if (!currentOpenEnvelope) return;
  
  const letterOverlay = document.querySelector('.letter-overlay');
  if (letterOverlay) {
    letterOverlay.classList.remove('visible');
    
    setTimeout(() => {
      letterOverlay.remove();
      currentOpenEnvelope.classList.remove('opened');
      currentOpenEnvelope = null;
    }, 300);
  }
}

// Close letter with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentOpenEnvelope) {
    closeEnvelope();
  }
});
   
// Initialize on page load
document.addEventListener('DOMContentLoaded', createEnvelopes);
