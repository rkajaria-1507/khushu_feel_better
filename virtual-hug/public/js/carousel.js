// continuous-carousel.js - Rewritten for smooth perpetual scrolling
// Features:
// 1. Continuous slow scroll (loop)
// 2. Pauses when: (a) user presses & holds on an image (pointerdown) (b) a video is playing / expanded
// 3. Video click toggles play/pause + expanded mode inside the carousel frame
// 4. Seamless loop by recycling first element to end
// 5. Graceful with mixed images/videos; placeholder when empty

(function(){
  // Original local media behaviour + added YouTube video support (videos were not showing previously)
  const API_ENDPOINT = '/api/carousel-files';
  const YT_VIDEOS = [
    'https://youtu.be/TR0nyI-NOhg',
    'https://youtu.be/xEVnBAtzW98',
    'https://youtu.be/B19l3GMc-PQ',
    'https://youtu.be/isxse5_fSkI'
  ];

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

  function isYouTube(url){ return /youtu\.be|youtube\.com/.test(url); }
  function ytToEmbed(url){
    try {
      if(url.includes('embed/')) return url;
      let id = '';
      if(url.includes('youtu.be/')) id = url.split('youtu.be/')[1].split(/[?&]/)[0];
      else if(url.includes('watch?v=')) id = url.split('watch?v=')[1].split('&')[0];
      else if(url.includes('/shorts/')) id = url.split('/shorts/')[1].split(/[?&]/)[0];
      if(id) return `https://www.youtube.com/embed/${id}?rel=0`;
    } catch(e) {}
    return url;
  }

  async function loadMedia(){
    let files = [];
    try {
      const resp = await fetch(API_ENDPOINT);
      if(resp.ok){ files = await resp.json(); }
    } catch(e) { /* ignore */ }

    const allowedExt = ['jpg','jpeg','png','gif','webp','mp4','webm','mov'];
    files = files.filter(f=> allowedExt.includes(f.split('.').pop().toLowerCase()));

    const haveLocal = files.length > 0;
    const haveYouTube = YT_VIDEOS.length > 0;
    if(!haveLocal && !haveYouTube){
      const placeholder = document.createElement('div');
      placeholder.className = 'carousel-item placeholder-item';
      placeholder.innerHTML = `<div class="placeholder-content"><span class="placeholder-icon">📷</span><p>Add your favourite moments to<br><code>images/carousel/</code></p></div>`;
      track.appendChild(placeholder);
      mediaReady = true;
      return;
    }

    // 1. Insert YouTube videos first (required order)
    YT_VIDEOS.forEach((yt, idx)=>{
      const item = document.createElement('div');
      item.className = 'carousel-item';
      const iframe = document.createElement('iframe');
      const embed = ytToEmbed(yt);
      const idMatch = embed.match(/embed\/([^?&]+)/);
      const vidId = idMatch ? idMatch[1] : ('yt_'+idx);
      iframe.src = embed; // enablejsapi param added later
      iframe.width = 260;
      iframe.height = 146; // 16:9 ratio
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.frameBorder = '0';
      iframe.dataset.videoId = vidId;
      enableIframePause(iframe, item);
      item.appendChild(iframe);
      track.appendChild(item);
    });

    // 2. Append local files (images + any small mp4s still present)
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

    duplicateUntilWide();
    mediaReady = true;
  }

  function duplicateUntilWide(){
    if(!container) return;
    const minWidth = container.clientWidth * 2;
    while(track.scrollWidth < minWidth){
      const clones = Array.from(track.children).map(node=> node.cloneNode(true));
      clones.forEach(cl=>{
        const img = cl.querySelector('img'); if(img) enableImageHoldPause(img);
        const vid = cl.querySelector('video'); if(vid) enableVideoPause(vid, cl);
        const iframe = cl.querySelector('iframe'); if(iframe) enableIframePause(iframe, cl);
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

  // YouTube iframe pause handling (simplified with IFrame API; clones re-init)
  function enableIframePause(iframe, item){
    if(!window._ytCarousel){
      window._ytCarousel = { pending: [], ready:false };
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = function(){
        window._ytCarousel.ready = true;
        window._ytCarousel.pending.forEach(entry=> initYTPlayer(entry));
        window._ytCarousel.pending = [];
      };
    }
    if(!/enablejsapi=1/.test(iframe.src)){
      iframe.src += (iframe.src.includes('?') ? '&' : '?') + 'enablejsapi=1&modestbranding=1&rel=0';
    }
    const entry = { iframe, item };
    if(window._ytCarousel.ready) initYTPlayer(entry); else window._ytCarousel.pending.push(entry);
  }

  function initYTPlayer(entry){
    if(typeof YT === 'undefined' || !YT.Player) return;
    const { iframe, item } = entry;
    try {
      new YT.Player(iframe, { events: { onStateChange: function(ev){
        if(ev.data === 1){ setPaused(true); item.classList.add('expanded'); }
        else if(ev.data === 0 || ev.data === 2){ setPaused(false); item.classList.remove('expanded'); }
      } } });
    } catch(e) {}
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
