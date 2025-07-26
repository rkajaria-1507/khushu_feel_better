// carousel.js - Interactive photo and video carousel for favourite moments

class FavouriteCarousel {
  constructor() {
    this.currentIndex = 0;
    this.actualIndex = 0; // Position in DOM (for infinite scrolling)
    this.mediaItems = [];
    this.track = document.getElementById('carousel-track');
    this.dotsContainer = document.getElementById('carousel-dots');
    this.isLoading = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }
  
  async init() {
    await this.loadMediaFiles();
    this.setupEventListeners();
    this.updateCarousel();
  }
  
  async loadMediaFiles() {
    this.isLoading = true;
    try {
      // Fetch the list of files from the server API
      const response = await fetch('/api/carousel-files');
      let files = [];
      if (response.ok) {
        files = await response.json();
      }
      // Build mediaItems array
      const allowedExt = ['jpg', 'jpeg', 'png', 'mp4'];
      this.mediaItems = files.map(filename => {
        const ext = filename.split('.').pop().toLowerCase();
        const type = (['mp4', 'webm', 'mov'].includes(ext)) ? 'video' : 'image';
        return {
          name: filename,
          path: `images/carousel/${filename}`,
          type
        };
      });
      // If no files, show a single placeholder
      if (this.mediaItems.length === 0) {
        this.mediaItems = [{ name: 'placeholder', path: null, type: 'placeholder' }];
      }
    } catch (error) {
      this.mediaItems = [{ name: 'placeholder', path: null, type: 'placeholder' }];
    }
    this.isLoading = false;
    this.renderCarousel();
  }
  
  getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension)) {
      return 'video';
    }
    return 'unknown';
  }
  
  renderCarousel() {
    // Clear existing content
    this.track.innerHTML = '';
    this.dotsContainer.innerHTML = '';
    
    // Only create infinite loop if we have multiple real media files
    const shouldCreateInfiniteLoop = this.mediaItems.length > 1 && this.mediaItems[0].type !== 'placeholder';
    
    if (shouldCreateInfiniteLoop) {
      // Create clones for infinite scrolling
      // Add last item at the beginning
      this.createCarouselItem(this.mediaItems[this.mediaItems.length - 1], -1, true);
      
      // Add all original items
      this.mediaItems.forEach((item, index) => {
        this.createCarouselItem(item, index, false);
        this.createDot(index);
      });
      
      // Add first item at the end
      this.createCarouselItem(this.mediaItems[0], this.mediaItems.length, true);
      
      // Start at position 1 (first real item, after the clone)
      this.currentIndex = 0;
      this.actualIndex = 1; // Position in DOM (accounting for clone)
      
    } else {
      // Single item or placeholder - no infinite scrolling needed
      this.mediaItems.forEach((item, index) => {
        this.createCarouselItem(item, index, false);
        // Only create dot if it's not a placeholder
        if (item.type !== 'placeholder') {
          this.createDot(index);
        }
      });
      this.actualIndex = 0;
      this.currentIndex = 0;
    }
    
    this.updateCarousel(false); // Don't animate on initial render
    this.updateNavigationVisibility();
  }
  
  createCarouselItem(item, index, isClone = false) {
    const carouselItem = document.createElement('div');
    carouselItem.className = 'carousel-item';
    if (isClone) carouselItem.className += ' clone';
    
    if (item.type === 'placeholder') {
      carouselItem.className += ' placeholder-item';
      carouselItem.innerHTML = `
        <div class="placeholder-content">
          <span class="placeholder-icon">📷</span>
          <p>Add your favourite moments to<br><code>images/carousel/</code></p>
          <p style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
            Supported: JPG, PNG, MP4<br>
            Try: moment1.jpg, photo1.png, video1.mp4
          </p>
        </div>
      `;
    } else if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.path;
      img.alt = `Favourite moment ${index + 1}`;
      img.loading = 'lazy';
      
      img.onerror = () => {
        carouselItem.innerHTML = `
          <div class="placeholder-content">
            <span class="placeholder-icon">❌</span>
            <p>Could not load:<br><code>${item.name}</code></p>
          </div>
        `;
      };
      
      carouselItem.appendChild(img);
    } else if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.path;
      video.controls = true;
      video.preload = 'metadata';
      video.style.maxWidth = '100%';
      video.style.maxHeight = '100%';
      
      video.onerror = () => {
        carouselItem.innerHTML = `
          <div class="placeholder-content">
            <span class="placeholder-icon">❌</span>
            <p>Could not load:<br><code>${item.name}</code></p>
          </div>
        `;
      };
      
      carouselItem.appendChild(video);
    }
    
    this.track.appendChild(carouselItem);
  }
  
  createDot(index) {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot';
    if (index === 0) dot.classList.add('active');
    
    dot.addEventListener('click', () => {
      this.goToSlide(index);
    });
    
    this.dotsContainer.appendChild(dot);
  }
  
  updateCarousel(animate = true) {
    const hasMultipleItems = this.mediaItems.length > 1 && this.mediaItems[0].type !== 'placeholder';
    
    if (hasMultipleItems) {
      // Infinite scrolling mode
      const translateX = -this.actualIndex * 100;
      
      if (animate) {
        this.track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      } else {
        this.track.style.transition = 'none';
      }
      
      this.track.style.transform = `translateX(${translateX}%)`;
      
      // Handle infinite loop transitions
      if (animate) {
        setTimeout(() => {
          if (this.actualIndex === 0) {
            // Jumped from last to first clone, move to real last item
            this.actualIndex = this.mediaItems.length;
            this.track.style.transition = 'none';
            this.track.style.transform = `translateX(-${this.actualIndex * 100}%)`;
          } else if (this.actualIndex === this.mediaItems.length + 1) {
            // Jumped from first to last clone, move to real first item
            this.actualIndex = 1;
            this.track.style.transition = 'none';
            this.track.style.transform = `translateX(-${this.actualIndex * 100}%)`;
          }
        }, 600); // Match transition duration
      }
    } else {
      // Single item or placeholder mode
      this.track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
    
    // Update dots
    const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Pause all videos except the current one
    const videos = this.track.querySelectorAll('video');
    videos.forEach((video, index) => {
      const videoIndex = hasMultipleItems ? index - 1 : index; // Account for clone
      if (videoIndex !== this.currentIndex) {
        video.pause();
      }
    });
  }
  
  nextSlide() {
    // Don't allow navigation if only one item or if it's a placeholder
    if (this.mediaItems.length <= 1 || this.mediaItems[0].type === 'placeholder') return;
    
    const hasMultipleItems = this.mediaItems.length > 1;
    
    if (hasMultipleItems) {
      // Infinite scrolling mode
      this.currentIndex = (this.currentIndex + 1) % this.mediaItems.length;
      this.actualIndex++;
      
      if (this.actualIndex > this.mediaItems.length) {
        this.actualIndex = this.mediaItems.length + 1; // Go to last clone
      }
    }
    
    this.updateCarousel();
  }
  
  prevSlide() {
    // Don't allow navigation if only one item or if it's a placeholder
    if (this.mediaItems.length <= 1 || this.mediaItems[0].type === 'placeholder') return;
    
    const hasMultipleItems = this.mediaItems.length > 1;
    
    if (hasMultipleItems) {
      // Infinite scrolling mode
      this.currentIndex = this.currentIndex === 0 ? 
        this.mediaItems.length - 1 : this.currentIndex - 1;
      this.actualIndex--;
      
      if (this.actualIndex < 1) {
        this.actualIndex = 0; // Go to first clone
      }
    }
    
    this.updateCarousel();
  }
  
  goToSlide(index) {
    // Don't allow navigation if only one item or if it's a placeholder
    if (index < 0 || index >= this.mediaItems.length || this.mediaItems.length <= 1 || this.mediaItems[0].type === 'placeholder') return;
    
    const hasMultipleItems = this.mediaItems.length > 1;
    
    this.currentIndex = index;
    
    if (hasMultipleItems) {
      this.actualIndex = index + 1; // Account for first clone
    }
    
    this.updateCarousel();
  }
  
  updateNavigationVisibility() {
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const dotsContainer = this.dotsContainer;
    
    // Hide navigation if only one item or placeholder
    const shouldHideNavigation = this.mediaItems.length <= 1 || this.mediaItems[0].type === 'placeholder';
    
    if (prevBtn) prevBtn.style.display = shouldHideNavigation ? 'none' : 'flex';
    if (nextBtn) nextBtn.style.display = shouldHideNavigation ? 'none' : 'flex';
    if (dotsContainer) dotsContainer.style.display = shouldHideNavigation ? 'none' : 'flex';
  }
  
  setupEventListeners() {
    // Touch events for mobile swiping
    const wrapper = document.querySelector('.carousel-wrapper');
    
    wrapper.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });
    
    wrapper.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });
  }
  
  handleSwipe() {
    // Don't handle swipes if only one item or placeholder
    if (this.mediaItems.length <= 1 || this.mediaItems[0].type === 'placeholder') return;
    
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide(); // Swipe left, go to next
      } else {
        this.prevSlide(); // Swipe right, go to previous
      }
    }
  }
}

// Global functions for button clicks
function nextSlide() {
  if (window.carousel) {
    window.carousel.nextSlide();
  }
}

function prevSlide() {
  if (window.carousel) {
    window.carousel.prevSlide();
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.carousel = new FavouriteCarousel();
});
