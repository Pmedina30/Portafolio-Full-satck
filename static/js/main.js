/**
 * Main Client-Side UI Controller (DESIGN.md Compliant)
 * Handles: Theme persistence, Mobile Drawer, Flash alerts,
 * SVG Password Toggle, Demo Autofill, and Form Loading Spinners.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dual-Mode Theme Controller (Dark Dovetail <-> Light Wise/Mixpanel)
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const iconSun = document.getElementById('iconSun');
  const iconMoon = document.getElementById('iconMoon');

  const syncThemeIcons = () => {
    const isDark = root.classList.contains('dark');
    if (iconSun && iconMoon) {
      iconSun.style.display = isDark ? 'block' : 'none';
      iconMoon.style.display = isDark ? 'none' : 'block';
    }
  };

  const savedTheme = localStorage.getItem('pystack_theme');
  if (savedTheme === 'light') {
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
  }
  syncThemeIcons();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      root.classList.toggle('dark');
      localStorage.setItem('pystack_theme', root.classList.contains('dark') ? 'dark' : 'light');
      syncThemeIcons();
    });
  }

  // 2. Responsive Mobile Drawer
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Flash Message Dismissal
  document.querySelectorAll('.flash-message').forEach((msg) => {
    const closeBtn = msg.querySelector('.flash-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => msg.remove());
    }
    setTimeout(() => {
      if (msg && msg.parentElement) {
        msg.style.opacity = '0';
        msg.style.transition = 'opacity 200ms ease';
        setTimeout(() => msg.remove(), 200);
      }
    }, 5500);
  });

  // 4. Accessible SVG Password Visibility Toggle (Zero Emojis)
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const eyeOpen = document.getElementById('eyeOpenIcon');
  const eyeClosed = document.getElementById('eyeClosedIcon');

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const nextType = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', nextType);
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = nextType === 'password' ? 'block' : 'none';
        eyeClosed.style.display = nextType === 'password' ? 'none' : 'block';
      }
    });
  }

  // 5. Demo Credentials Auto-Fill & Inline Password Recovery Helper
  const fillDemoBtn = document.getElementById('fillDemoBtn');
  if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', () => {
      const emailInput = document.getElementById('email');
      const passInput = document.getElementById('password');
      if (emailInput && passInput) {
        emailInput.value = 'demo@example.com';
        passInput.value = 'password123';
        emailInput.focus();
      }
    });
  }

  const forgotBtn = document.getElementById('forgotPasswordBtn');
  const forgotNote = document.getElementById('forgotHelperNote');
  if (forgotBtn && forgotNote) {
    forgotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      forgotNote.classList.toggle('visible');
    });
  }

  // 6. Form Submit Loading Spinner State
  document.querySelectorAll('form[data-loading-form]').forEach((form) => {
    form.addEventListener('submit', () => {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && !submitBtn.classList.contains('is-loading')) {
        submitBtn.classList.add('is-loading');
        const label = submitBtn.getAttribute('data-loading-text') || 'Processing...';
        submitBtn.innerHTML = `
          <svg class="spinner-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
          <span>${label}</span>
        `;
      }
    });
  });
});
