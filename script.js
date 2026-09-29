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
  initFontSwitcher();
  // Clear any legacy client-side photo cache so the official asset always loads
  try { localStorage.removeItem('ridhil_custom_user_photo'); } catch (e) {}
});

// Hero Font Style Switcher
function initFontSwitcher() {
  const fontBtns = document.querySelectorAll('.font-pill-btn');
  const heroText = document.getElementById('hero-name-display');
  if (!heroText || !fontBtns.length) return;

  const fontClasses = ['font-preset-poppins', 'font-preset-jakarta', 'font-preset-syne', 'font-preset-space', 'font-preset-inter'];

  function applyFont(fontKey) {
    fontClasses.forEach(cls => heroText.classList.remove(cls));
    const targetClass = `font-preset-${fontKey}`;
    heroText.classList.add(targetClass);

    fontBtns.forEach(btn => {
      if (btn.getAttribute('data-font') === fontKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Restore saved font or default to poppins (override legacy default jakarta)
  let savedFont = localStorage.getItem('ridhil_hero_font');
  if (!savedFont || savedFont === 'jakarta') {
    savedFont = 'poppins';
  }
  applyFont(savedFont);

  fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const fontKey = btn.getAttribute('data-font');
      applyFont(fontKey);
      localStorage.setItem('ridhil_hero_font', fontKey);
      showToast(`Font Applied: ${btn.textContent}`);
    });
  });
}

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

// 5. CONTACT DRAWER / MODAL & EMAIL COPY
function initContactModal() {
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const contactForm = document.getElementById('contact-form');

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'ridhil.ai.creator@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied: ridhil.ai.creator@gmail.com');
      });
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || 'Friend';
      showToast(`Thanks ${name}! Your project inquiry has been sent.`);
      contactForm.reset();
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
