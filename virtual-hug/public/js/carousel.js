// continuous-carousel.js - Rewritten for smooth perpetual scrolling
// Features:
// 1. Continuous slow scroll (loop)
// 2. Pauses when: (a) user presses & holds on an image (pointerdown) (b) a video is playing / expanded
// 3. Video click toggles play/pause + expanded mode inside the carousel frame
// 4. Seamless loop by recycling first element to end
// 5. Graceful with mixed images/videos; placeholder when empty

(function(){
  const API_ENDPOINT = '/api/carousel-files';
  const track = document.getElementById('carousel-track');
  if(!track) return;
  const container = track.parentElement; // .carousel-wrapper

  const SPEED_PX_PER_SEC = 18; // adjust for slower/faster glide
  let offset = 0;
  let lastTs = null;
  let isPaused = false;
  let mediaReady = false;

  function setPaused(p){
    isPaused = p;
  }

  async function loadMedia(){
    let files = [];
    try {
      const resp = await fetch(API_ENDPOINT);
      if(resp.ok){ files = await resp.json(); }
    } catch(e) { /* ignore */ }

    const allowedExt = ['jpg','jpeg','png','gif','webp','mp4'];
    files = files.filter(f=> allowedExt.includes(f.split('.').pop().toLowerCase()));

    if(files.length === 0){
      const placeholder = document.createElement('div');
      placeholder.className = 'carousel-item placeholder-item';
      placeholder.innerHTML = `<div class="placeholder-content"><span class="placeholder-icon">📷</span><p>Add your favourite moments to<br><code>images/carousel/</code></p></div>`;
      track.appendChild(placeholder);
      mediaReady = true;
      return;
    }

    files.forEach((name, idx)=>{
      const ext = name.split('.').pop().toLowerCase();
      const type = ['mp4','webm','mov'].includes(ext) ? 'video' : 'image';
      const item = document.createElement('div');
      item.className = 'carousel-item';
      if(type==='image'){
        const img = document.createElement('img');
        img.src = `images/carousel/${name}`;
        img.alt = `Favourite moment ${idx+1}`;
        enableImageHoldPause(img);
        item.appendChild(img);
      } else {
        const video = document.createElement('video');
        video.src = `images/carousel/${name}`;
        video.preload = 'metadata';
        video.controls = true;
        video.playsInline = true;
        enableVideoPause(video, item);
        item.appendChild(video);
      }
      track.appendChild(item);
    });

    // Duplicate items until we have at least 2 * container width for smooth looping
    duplicateUntilWide();
    mediaReady = true;
  }

  function duplicateUntilWide(){
    if(!container) return;
    const minWidth = container.clientWidth * 2;
    while(track.scrollWidth < minWidth){
      const clones = Array.from(track.children).map(node=> node.cloneNode(true));
      clones.forEach(cl=>{
        // Re-wire event handlers for clones
        const img = cl.querySelector('img');
        if(img) enableImageHoldPause(img);
        const vid = cl.querySelector('video');
        if(vid){ enableVideoPause(vid, cl); }
        track.appendChild(cl);
      });
    }
  }

  function enableImageHoldPause(img){
    let holding = false;
    img.addEventListener('pointerdown', ()=>{ holding = true; setPaused(true); });
    ['pointerup','pointerleave','pointercancel'].forEach(ev=> img.addEventListener(ev, ()=>{
      if(holding){ holding = false; setPaused(false); }
    }));
  }

  function enableVideoPause(video, item){
    video.addEventListener('play', ()=>{ 
      setPaused(true); 
      item.classList.add('expanded');
      // Ensure current video is fully visible
      try { item.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'}); } catch(e) {}
    });
    video.addEventListener('pause', ()=>{ setPaused(false); item.classList.remove('expanded'); });
    video.addEventListener('ended', ()=>{ setPaused(false); item.classList.remove('expanded'); });
  }

  function step(ts){
    if(!mediaReady){ requestAnimationFrame(step); return; }
    if(lastTs == null) lastTs = ts;
    const dt = (ts - lastTs)/1000; // seconds
    lastTs = ts;

    if(!isPaused && track.children.length > 0){
      offset -= SPEED_PX_PER_SEC * dt;
      const first = track.children[0];
      if(first){
        const firstW = first.getBoundingClientRect().width;
        if(-offset >= firstW){
          // Move first to end and adjust offset
            track.appendChild(first);
            offset += firstW;
        }
      }
      track.style.transform = `translateX(${offset}px)`;
    }
    requestAnimationFrame(step);
  }

  loadMedia().then(()=>{
    requestAnimationFrame(step);
  });
})();
