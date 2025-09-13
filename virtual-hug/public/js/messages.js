// messages.js - Interactive envelope system
console.log('Love Messages page loaded');

// Envelope data - easily configurable
const envelopes = [
  { id: 1, 
    caption: "When you're feeling happy", 
    message: `
              Hi honey. <br>
              Seems like you are having a good time, right? Well, no one is happier to see you happy
              more than me. I wish that you happiness all the time. Seeing and imagining you smile 
              and laugh the way you do just lights up my heart and mood. Every time I am feeling down
              and you cannot come to the phone, I just see your photos and us laughing and having a 
              good time and it makes me feel a whole lot better. <br>
              I wish that I was there with you, sharing that happiness with you, making the moment 
              last longer than it could. If I am there with you, I hope that I am holding you close 
              and enjoying the moment while it lasts. For whatever reason you are happy, it could be 
              you are having a good time with your friends, you are playing with viyaan and rivan, 
              or you are enjoying some time with yourself, I hope that you enjoy every moment of it 
              because you never know when or how it would change. <br>
              But no matter what, I am always gonna be there for you in your brightest moements, 
              cheering for you louder than anyone, even if no one else is, I will cheer for you so loudly, 
              it will make the others sound loud. <br>
              I hope you are hit with this kind of happiness and joy every day, every moment of your 
              life. And I hope that I am with you to experience some of it with you, together. <br>
              <br>
              I love you so much.
            `
  },
  { id: 2, 
    caption: "When you're feeling sad", 
    message: `
              Hey love. <br>
              I can see that you are not feeling the best right now. What happened? Overthinking? 
              Someone said something? Listen, none of that matters. First, go wash your face quickly. 
              Then, go and hug the penguin. If you are outside, repeat the first step. The next step for 
              either is to call me. IF I dont pick up for whatever reason (because I am an idiot and 
              nothign is more important right now for me than you because you are feeling sad), I want 
              you to give me 2 tight slaps next time you see me. <br>
              But either way, I want you to feel a little better, so we will play a game. I am thinking 
              of a word. You have 10 seconds to guess it. (Hint. it is our song). Befikar. You know that 
              when i first heard it, I didnt think much of it. But when i heard the lyrics and thought 
              about it, it has much more meaning than what it shows. It is such a nice word, Befikar. 
              The song means that whenever I am with you, whenever I see you, all my worries go away 
              and I am free. I am lost in you, your world. <br>
              Isn't that such a good meaning? Well, lets try it out. Lets take a few deep breaths together, 
              and take out all the bad thoughts and bin it. No matter what you are thinking. If you are 
              worried about something, or overthinking about someone saying something, just take out the 
              thoughts and bin it. If the problem is solvable, we will solve it together, if it is not, 
              then answer this, is there any point in thinking about it? <br>
              If you are thinking, think about that. <br>
              I love you. You are not alone. You are loved. You are amazing.
            `
  },
  { id: 3, 
    caption: "When you're mad at me", 
    message: `
              I am sorry. <br>
              Probably the last thing you want to hear. Firstly, this is for some dumb thing I have done, 
              not for any serious thing I have done. But regardless of what has happened, i want you to know 
              that I have heard you and your feelings. I have understood your feelings and what you are 
              trying to convey to me. If it some dumb thing like hurting myself or not remembering something, 
              I am trying to do better. <br>
              So, what dumb thing did I do now. Whatever it is, i hope that you can leave it at the discretion 
              of my dumbness and love me like you always do. It's not fair to ask this of you given the number 
              of dumb things that I end up doing. But I am sorry. <br>
              I love you so much. I love you more than anything else. 
            `
  },
  { id: 4, 
    caption: "When you dont feel good enough", 
    message: `
              Listen no, <br>
              You are enough. You are a good person. You are loved. You are not alone in this. If
              anyone tells you differently, they are not worth your time. They are not good for you.
              Cause the people you love and who love you and want to see you succeed, will not pull 
              you down. They will support you till the end, however much they can. <br>
              Yes, they don't do a great job of showing it or proving it, but they will only want you
              to succeed in life, they will never want anything less for you. <br>
              If your brain is telling you this, tell it to shut up. You are amazing. Take out all 
              your bad thoughts and bin it. I want you to repeat after me: <br> 
              1. I am enough <br> 2. I am loved <br> 3. I am amazing <br> 4. I am smart <br> 
              5. I am capable <br> 6. I am strong <br> 7. I am resilient <br> 8. I am beautiful <br>
              9. I am worthy <br> 10. I am unique <br> 11. I am deserving <br> 12. I am a good person <br>
              13. I am enough <br>
              I want you to repeat it again and again at least 5 times. <br> I love you
            `
  },
  { id: 5, 
    caption: "When you feel like the world is against you", 
    message: `
            Babu, the world is not against you. You are just having a hard time, or this is just a bad time. 
            It's okay to feel this way, and it's okay to ask for help. I am so proud of you if you have asked 
            for it. I am proud of you for being so strong all the way through it. <br>
            I know that you are going through a lot right now, and I wish that I could take all your pain away. 
            But I can't. What I can do is be there for you, to support you, to love you, to hold you, to 
            comfort you, to listen to you, to understand you. This message cannot express how much I support 
            you, nor can it understand what you are going through. Maybe even I can't understand it. But, I 
            will never leave your side. It is not easy to go through what you are going through, but I know 
            that you are strong enough to get through it. <br>
            Even if you are not as strong as you think you are, I will be your strength. I will be your rock. 
            I will be your support. I will hold you together. I will be your light in the dark. Even if I 
            dont express it or communicate it. <br>
            I love you so much. You are not alone. You are loved. You are amazing.
            `
  },
  { id: 6, 
    caption: "When you need a reminder of how much I love you", 
    message: `
            Baby, <br>
            I love you so much. I love you more than anything else in this world. <br>
            These words dont mean anything without actions, and they dont mean anything like this. 
            `
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
