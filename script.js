/* ==========================================================================
   RIDHIL PORTFOLIO - INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAccentSwitcher();
  initTime();
  initFilters();
  initPromptInspector();
  initContactModal();
  initMobileMenu();
  initVideoControls();
  initCertificateModal();
  // Clear any legacy client-side photo cache so the official asset always loads
  try { localStorage.removeItem('ridhil_custom_user_photo'); } catch (e) {}
});

// Professional Accent & Color Pattern Switcher
function initAccentSwitcher() {
  const accentBtns = document.querySelectorAll('.accent-dot-btn');
  if (!accentBtns.length) return;

  function applyAccent(accentKey) {
    document.documentElement.setAttribute('data-accent', accentKey);
    accentBtns.forEach(btn => {
      if (btn.getAttribute('data-accent') === accentKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  const savedAccent = localStorage.getItem('ridhil_accent') || 'cobalt';
  applyAccent(savedAccent);

  const labels = {
    cobalt: 'Cobalt Blue 🔵',
    emerald: 'Emerald Teal 🟢',
    violet: 'Creative Violet 🟣',
    monochrome: 'Slate Minimal ⚪'
  };

  accentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-accent');
      applyAccent(key);
      localStorage.setItem('ridhil_accent', key);
      showToast(`Accent: ${labels[key] || key}`);
    });
  });
}

// 1. THEME SWITCHER (Executive Light <-> Midnight Slate)
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('ridhil_theme') || 'dark';

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      applyTheme(nextTheme);
      localStorage.setItem('ridhil_theme', nextTheme);
      showToast(nextTheme === 'dark' ? 'Switched to Midnight Slate Mode 🌙' : 'Switched to Executive Light Mode ☀️');
    });
  }
}

function applyTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');

  if (themeId === 'light') {
    document.documentElement.classList.remove('dark');
    if (themeIcon) {
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
    }
    if (themeText) {
      themeText.textContent = 'Light';
    }
  } else {
    document.documentElement.classList.add('dark');
    if (themeIcon) {
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
    }
    if (themeText) {
      themeText.textContent = 'Dark';
    }
  }
}

// 2. LIVE TIME INDICATOR (India Standard Time)
function initTime() {
  const timeEl = document.getElementById('live-time');
  if (!timeEl) return;

  function update() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    timeEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now) + ' IST';
  }
  update();
  setInterval(update, 60000);
}

// 3. PROJECT FILTERING
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 4. PROMPT RECIPE INSPECTOR MODAL
const promptDatabase = {
  'zanotic': {
    title: 'Zanotic — Luxury Perfume Commercial',
    tools: 'Live Camera Direction + Studio Lighting + Premiere Pro / Flow Suite',
    prompt: 'Commercial product cinematography for Zanotic luxury perfume, dark moody aesthetic, rim highlights tracing bottle silhouette, macro tactile hand interaction, 1080x1920 vertical commercial format, studio color grading.',
    negative: 'Overexposed, shaky camera, low resolution, poor lighting, unnatural reflections',
    motion: 'Slow tactile reveal, dramatic rim lighting pan, focused macro depth of field',
    notes: 'Directed and edited as a high-conversion commercial video showcase for luxury fragrance branding, combining dynamic product reveal with atmospheric sound design.'
  },
  'zanotic2': {
    title: 'Zanotti — ABBA Perfume Luxury Commercial',
    tools: 'Live Camera Direction + Studio Lighting + Premiere Pro / Flow Suite',
    prompt: 'Cinematic commercial direction for Zanotti ABBA perfume, vibrant red exotic sports car backdrop, crystalline blue bottle tactile reveal in natural golden sunlight, shallow depth of field, 1080x1920 vertical commercial format, color-matched grading.',
    negative: 'Overexposed, shaky camera, low resolution, unnatural reflections, jitter',
    motion: 'Dynamic hand reveal, luxury automotive reflections, seamless macro camera pan',
    notes: 'Directed and edited as an elite luxury lifestyle commercial, pairing automotive prestige aesthetics with signature fragrance bottle design.'
  },
  'ordinary': {
    title: 'The Ordinary — Salicylic Acid Skincare Commercial',
    tools: 'Live Commercial Direction + Minimalist Studio Lighting + Premiere Pro / Flow Suite',
    prompt: 'Clean minimalist commercial cinematography for The Ordinary Salicylic Acid 2% serum, natural soft morning window illumination, white marble circular pedestal, subtle cast plant shadows, macro product rotation, 720x1280 vertical commercial format, neutral organic color grade.',
    negative: 'Overexposed, harsh reflections, dark murky background, jitter, low quality',
    motion: 'Smooth orbital rotation on pedestal, gentle window shadow movement, focused product reveal',
    notes: 'Directed and edited as an authentic, high-converting skincare product showcase emphasizing minimalism, clean ingredients, and pristine studio lighting.'
  },
  'cinema': {
    title: 'Chronos 2099 — Sci-Fi Generative Film',
    tools: 'Nano Banana OmniFlash + Seedance AI Video + Flow',
    prompt: '/imagine prompt: Anamorphic 35mm cinematic film still, atmospheric rainy futuristic Neo-Tokyo street, holographic neon billboards casting magenta and cyan specular reflections on wet asphalt, solitary wanderer in techwear with glowing visor holding translucent umbrella, towering brutalist megastructures with monorail cutting through smog, volumetric mist, photorealistic grain, directed by Ridley Scott --ar 16:9 --pipeline [Nano Banana OmniFlash + Seedance]',
    negative: '--no lowres, blurred background, CGI render, cartoon, oversaturated, deformed hands',
    motion: 'Camera Track Forward 1.8, Slow Crane Rise, Ambient Rain Particles + Fog Drift via Seedance',
    notes: 'Engineered keyframes using Nano Banana OmniFlash for exact character and world consistency, then brought to life using Seedance AI Video camera motion and Flow suite post-production.'
  },
  'fashion': {
    title: 'Avant-Garde Void — Luxury Haute Couture Editorial',
    tools: 'Nano Banana OmniFlash + Flow Creative Suite + Topaz AI',
    prompt: 'High fashion editorial photography for Vogue, haute couture model draped in liquid iridescent sculptural silk dress, architectural brutalist concrete pavilion, natural overcast sky lighting from above, high cheekbones, wet-look slicked back hair, sharp textile folds, studio grade color grading --ar 16:9 --pipeline [Nano Banana OmniFlash]',
    negative: 'bad anatomy, distorted fabric, plastic skin, oversmoothed, low quality',
    motion: 'Static high-fashion plate with subtle fabric shimmer and micro optical breath',
    notes: 'Rendered at native 4K using Nano Banana OmniFlash with custom textile and skin-texture controls, composited in Flow Creative Suite for print fidelity.'
  },
  'auto': {
    title: 'Solitude Noir — Conceptual Hypercar Reveal',
    tools: 'Kling AI Video + Flow + Nano Banana OmniFlash',
    prompt: 'Ultra-luxury aerodynamic hypercar prototype in a dark minimalist architectural concrete studio, dramatic rim light carving carbon fiber contours, gloss reflection floor, aggressive LED matrix headlamps illuminating subtle haze, 8k commercial cinematography, medium shot, Hasselblad H6D-100c --ar 16:9 --pipeline [Kling + Flow]',
    negative: 'blurry, scratches, cartoon, watermark, distorted wheels, low poly',
    motion: 'Orbital 360 camera arc with motion blur and headlight lens bloom flare via Kling AI',
    notes: 'Created for an automotive design pitch. Kling AI was used for smooth 60fps slow-motion camera pan with Flow Creative Suite grading.'
  }
};

function initPromptInspector() {
  const modal = document.getElementById('prompt-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const inspectBtns = document.querySelectorAll('.inspect-prompt-btn');
  const copyBtn = document.getElementById('copy-prompt-btn');

  inspectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      const data = promptDatabase[key];
      if (!data) return;

      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-tools').textContent = data.tools;
      document.getElementById('modal-prompt').textContent = data.prompt;
      document.getElementById('modal-negative').textContent = data.negative;
      document.getElementById('modal-motion').textContent = data.motion;
      document.getElementById('modal-notes').textContent = data.notes;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = 'auto';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = document.getElementById('modal-prompt').textContent;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Prompt copied to clipboard! ✦');
      });
    });
  }
}

// 5. CONTACT MODAL (CALL, WHATSAPP, EMAIL)
function initContactModal() {
  const contactModal = document.getElementById('contact-action-modal');
  const closeContactBtn = document.getElementById('close-contact-modal-btn');
  const openContactBtns = document.querySelectorAll('.open-contact-modal-btn');
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');

  function openModal() {
    if (!contactModal) return;
    contactModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!contactModal) return;
    contactModal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  openContactBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeContactBtn) {
    closeContactBtn.addEventListener('click', closeModal);
  }

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeModal();
      }
    });
  }


  // Handle escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (contactModal?.classList.contains('open')) closeModal();
      const promptModal = document.getElementById('prompt-modal');
      if (promptModal?.classList.contains('open')) {
        promptModal.classList.remove('open');
        document.body.style.overflow = 'auto';
      }
      const certModal = document.getElementById('certificate-modal');
      if (certModal?.classList.contains('open')) {
        certModal.classList.remove('open');
        document.body.style.overflow = 'auto';
      }
    }
  });

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const email = 'richuridhil@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied: richuridhil@gmail.com');
      });
    });
  });
}

// 6. 4K CERTIFICATE INSPECTION & ZOOM MODAL
function initCertificateModal() {
  const modal = document.getElementById('certificate-modal');
  const closeBtn = document.getElementById('close-cert-modal-btn');
  const openBtns = document.querySelectorAll('.inspect-cert-btn, .cert-preview-clickable');
  const img = document.getElementById('cert-full-image');
  const viewport = document.getElementById('cert-viewport');
  const zoomInBtn = document.getElementById('cert-zoom-in-btn');
  const zoomOutBtn = document.getElementById('cert-zoom-out-btn');
  const zoomResetBtn = document.getElementById('cert-zoom-reset-btn');
  const zoomLevelText = document.getElementById('cert-zoom-level');

  if (!modal || !img) return;

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function updateTransform() {
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    if (zoomLevelText) {
      zoomLevelText.textContent = `${Math.round(scale * 100)}%`;
    }
    if (viewport) {
      if (scale > 1) {
        viewport.style.cursor = 'grab';
      } else {
        viewport.style.cursor = 'default';
        viewport.classList.remove('grabbing');
      }
    }
  }

  function resetZoom() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  function openModal() {
    resetZoom();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
    resetZoom();
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      scale = Math.min(scale + 0.35, 3.5);
      updateTransform();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      scale = Math.max(scale - 0.35, 0.7);
      if (scale <= 1) {
        translateX = 0;
        translateY = 0;
      }
      updateTransform();
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', resetZoom);
  }

  // Mouse wheel zoom inside viewport
  if (viewport) {
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      const nextScale = Math.min(Math.max(scale + delta, 0.7), 3.5);
      if (nextScale !== scale) {
        scale = nextScale;
        if (scale <= 1) {
          translateX = 0;
          translateY = 0;
        }
        updateTransform();
      }
    }, { passive: false });

    // Drag / Pan image when zoomed in
    viewport.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Primary click only
      if (scale <= 1) return;
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      viewport.style.cursor = 'grabbing';
      viewport.classList.add('grabbing');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        viewport.style.cursor = scale > 1 ? 'grab' : 'default';
        viewport.classList.remove('grabbing');
      }
    });

    // Touch support for mobile panning
    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1 && scale > 1) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      updateTransform();
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      isDragging = false;
    });
  }
}

// 7. MOBILE MENU TOGGLE
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  }
}

// TOAST NOTIFICATION HELPER
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✦</span><span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// 6. VIDEO PLAYER CONTROLS (FULLSCREEN, AUTOMATIC SCROLL-SOUND & SMART SYNC)
function initVideoControls() {
  const registeredVideos = [];
  let soundEnabled = true;      // Auto-sound on scroll enabled by default
  let userInteracted = false;   // Browser audio unlock tracker
  let activeController = null;  // Currently active sounding video

  // Audio unlock listener for browser autoplay policy
  function unlockAudio() {
    if (!userInteracted) {
      userInteracted = true;
      updateActiveVideoOnScroll();
    }
  }

  ['pointerdown', 'touchstart', 'click', 'keydown', 'scroll'].forEach(evt => {
    window.addEventListener(evt, unlockAudio, { passive: true, once: false });
  });

  // Helper to mute & pause all other videos except the current one
  function deactivateOtherVideos(currentVideo) {
    registeredVideos.forEach(item => {
      if (item.video !== currentVideo) {
        if (!item.video.muted) {
          item.video.muted = true;
          item.updateMuteState();
        }
        if (!item.video.paused) {
          item.video.pause();
        }
      }
    });
  }

  function setupVideo(videoId, muteBtnId, muteIconId, fsBtnId, label) {
    const video = document.getElementById(videoId);
    const muteBtn = document.getElementById(muteBtnId);
    const muteIcon = document.getElementById(muteIconId);
    const fsBtn = document.getElementById(fsBtnId);
    if (!video) return;

    function updateMuteState() {
      if (!muteIcon) return;
      if (video.muted) {
        muteIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
        `;
        muteBtn?.setAttribute('title', 'Unmute Sound');
      } else {
        muteIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
        `;
        muteBtn?.setAttribute('title', 'Mute Sound');
      }
    }

    const controller = {
      video,
      muteBtn,
      muteIcon,
      label,
      updateMuteState
    };
    registeredVideos.push(controller);
    updateMuteState();

    // Hover on desktop project card switches active video with sound
    const card = video.closest('.project-card');
    if (card) {
      card.addEventListener('mouseenter', () => {
        if (soundEnabled && userInteracted && activeController !== controller) {
          activeController = controller;
          registeredVideos.forEach(item => {
            if (item === controller) {
              item.video.muted = false;
              item.video.play().catch(() => {});
              item.updateMuteState();
            } else {
              item.video.muted = true;
              item.video.pause();
              item.updateMuteState();
            }
          });
        }
      });
    }

    // Manual mute button toggle
    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userInteracted = true;
        if (video.muted) {
          // User turned sound ON
          soundEnabled = true;
          activeController = controller;
          deactivateOtherVideos(video);
          video.muted = false;
          updateMuteState();
          if (video.paused) {
            video.play().catch(() => {});
          }
          showToast(`${label} sound ON 🔊`);
        } else {
          // User manually turned sound OFF
          soundEnabled = false;
          video.muted = true;
          updateMuteState();
          showToast(`${label} sound muted`);
        }
      });
    }

    // When video plays with sound, silence other videos
    video.addEventListener('play', () => {
      if (!video.muted) {
        deactivateOtherVideos(video);
      }
    });

    // Synchronize UI icon on volume/mute change
    video.addEventListener('volumechange', () => {
      updateMuteState();
    });

    function enterFullscreen() {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen(); // iOS Safari native full screen
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }

    if (fsBtn) {
      fsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        enterFullscreen();
      });
    }

    // Double click / tap on video to enter fullscreen
    video.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      enterFullscreen();
    });

    // Tap video to toggle play/pause
    video.addEventListener('click', () => {
      userInteracted = true;
      if (video.paused) {
        if (soundEnabled) {
          video.muted = false;
          deactivateOtherVideos(video);
        }
        video.play().catch(() => {});
      } else {
        video.pause();
      }
      updateMuteState();
    });
  }

  // Register all portfolio videos
  setupVideo('zanotic-video', 'zanotic-mute-btn', 'zanotic-mute-icon', 'zanotic-fs-btn', 'Commercial 1');
  setupVideo('zanotic-video-2', 'zanotic-mute-btn-2', 'zanotic-mute-icon-2', 'zanotic-fs-btn-2', 'Commercial 2');
  setupVideo('ordinary-video', 'ordinary-mute-btn', 'ordinary-mute-icon', 'ordinary-fs-btn', 'The Ordinary');

  // Automatic Viewport & Scroll Center Detection
  function findFocusedVideo() {
    const viewportCenter = window.innerHeight / 2;
    let bestCandidate = null;
    let minDistance = Infinity;

    registeredVideos.forEach(item => {
      const rect = item.video.getBoundingClientRect();
      // Video must be clearly inside the viewport
      if (rect.bottom > 80 && rect.top < window.innerHeight - 80) {
        const itemCenter = rect.top + rect.height / 2;
        const dist = Math.abs(itemCenter - viewportCenter);
        if (dist < minDistance) {
          minDistance = dist;
          bestCandidate = item;
        }
      }
    });

    return bestCandidate;
  }

  // Update which video plays with sound as user scrolls
  function updateActiveVideoOnScroll() {
    const candidate = findFocusedVideo();

    if (candidate) {
      if (candidate !== activeController) {
        activeController = candidate;

        registeredVideos.forEach(item => {
          if (item === candidate) {
            if (soundEnabled && userInteracted) {
              item.video.muted = false;
            }
            if (item.video.paused) {
              item.video.play().catch(() => {});
            }
            item.updateMuteState();
          } else {
            // Previous / other video automatically turns off sound and pauses
            item.video.muted = true;
            item.video.pause();
            item.updateMuteState();
          }
        });
      } else {
        // Still on same video: ensure unmuted if user recently unlocked audio
        if (soundEnabled && userInteracted && candidate.video.muted) {
          candidate.video.muted = false;
          candidate.updateMuteState();
        }
      }
    } else {
      // User scrolled out of the video showcase section (e.g. to Hero or Contact)
      if (activeController) {
        registeredVideos.forEach(item => {
          item.video.muted = true;
          item.video.pause();
          item.updateMuteState();
        });
        activeController = null;
      }
    }
  }

  // High performance throttled scroll listener (60-120fps sync)
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateActiveVideoOnScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Initial check on page load
  setTimeout(updateActiveVideoOnScroll, 300);
}

