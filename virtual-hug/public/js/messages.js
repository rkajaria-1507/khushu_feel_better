// messages.js - Interactive envelope system
console.log('Love Messages page loaded');

// Envelope data - easily configurable
const envelopes = [
  { id: 1, 
    caption: "When you're feeling happy", 
    message: `
              Hi baby,<br>
              I am always so happy to see you happy.
                            
            `
  },
  { id: 2, 
    caption: "When you're feeling sad", 
    message: ``
  },
  { id: 3, 
    caption: "When you're mad at me", 
    message: `
              Hi, what dumb thing did I do this time? <br>
              Is it because I forgot something you said? Or is it about the fact that I am not serious?
              Or is it about the other 4534523235 things I just annoy you with? <br>
              Firstly, I am sorry. If you think I will make some excuse, then you are wrong. I am just an idiot. <br>
              I hope that it is not something too serious and it is something stupid so that I can annoy you more. 
              But if it is, I want you to know that I dont mean it. Yeah I have said it maybe only a 1000 times. 
              And every time I say its going to be different, but it never is. Yes, I understand that you are frustrated,
              I understand that you are probably on the verge of giving up. Thank you for not doing that.
              I know that I am not the best person in the world, but I am trying to be better.
              I am trying to be the person you deserve. I am trying to be the person you can be proud of. <br>
              Right now with everything happening around me, around us, around you, 
            `
  },
  { id: 4, 
    caption: "When you need courage", 
    message: ``
  },
  { id: 5, 
    caption: "When you're feeling lost", 
    message: ``
  },
  { id: 6, 
    caption: "When you need motivation", 
    message: ``
  },
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
