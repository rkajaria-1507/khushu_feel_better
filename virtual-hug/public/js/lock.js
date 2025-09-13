// lock.js - Bank-style vault dial lock
(function(){
  const TARGET = new Date('2025-09-13T00:00:00'); // Local time target
  const now = new Date();
  if (now >= TARGET) return; // Already unlocked; show site normally

  // Build overlay DOM (single combo dial)
  const overlay = document.createElement('div');
  overlay.className = 'vault-lock-overlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.innerHTML = `
    <div class="vault-door" aria-live="polite">
      <div class="vault-title">Vault Secured</div>
      <div class="vault-sub">Unlocks automatically on<br/><strong>13 Sept 2025 · 00:00</strong></div>
      <div class="vault-countdown" id="vault-countdown">Loading…</div>
      <div class="vault-combo-wrapper">
        <div class="vault-combo-dial" id="vault-combo-dial" aria-label="Vault combination dial">
          <div class="dial-center-cap"></div>
          <div class="dial-pointer"></div>
          <div class="dial-numbers" aria-hidden="true"></div>
        </div>
      </div>
      <div class="vault-help">WILL SPIN & OPEN AT ZERO</div>
    </div>`;
  document.body.appendChild(overlay);

  const countdownEl = overlay.querySelector('#vault-countdown');
  const dial = overlay.querySelector('#vault-combo-dial');
  const start = new Date();
  const totalMs = TARGET - start;

  function pad(n){ return n < 10 ? '0'+n : ''+n; }

  function update(){
    const now = new Date();
    let remaining = TARGET - now;
    if (remaining < 0) remaining = 0;
    const totalSeconds = Math.floor(remaining/1000);
    const days = Math.floor(totalSeconds/86400);
    const hours = Math.floor((totalSeconds % 86400)/3600);
    const minutes = Math.floor((totalSeconds % 3600)/60);
    const seconds = totalSeconds % 60;
    countdownEl.textContent = `${days}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
    if (remaining <= 0) startSpinSequence();
  }

  const interval = setInterval(update,1000);
  update();

  let spinning = false;
  function startSpinSequence(){
    if (spinning) return; spinning = true;
    clearInterval(interval);
    overlay.classList.add('spinning');
    // After spin ends, door open, then redirect
    dial.addEventListener('animationend', (e)=>{
      if (e.animationName === 'comboSpinSequence') {
        overlay.classList.add('unlocking');
        setTimeout(()=>{
          overlay.remove();
          redirectHome();
        },1150); // matches door animation
      }
    }, { once:true });
  }

  function redirectHome(){
    try {
      const path = window.location.pathname;
      if (path === '/' || /index\.html$/.test(path)) return; // already home
      // Redirect to root (assuming index.html served there)
      window.location.replace('/');
    } catch(e) {}
  }
})();
