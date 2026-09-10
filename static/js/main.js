/**
 * Main Client-Side JavaScript
 * Handles interactive elements: flash messages, password toggles,
 * demo autofill, and mobile navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // 2. Flash Messages Auto-dismiss after 5 seconds & Close Button
  const flashMessages = document.querySelectorAll('.flash-message');
  flashMessages.forEach((msg) => {
    const closeBtn = msg.querySelector('.flash-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 250);
      });
    }

    // Automatically remove after 5 seconds
    setTimeout(() => {
      if (msg && msg.parentElement) {
        msg.style.transition = 'opacity 0.3s ease';
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 300);
      }
    }, 5000);
  });

  // 3. Password Visibility Toggle
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      toggleBtn.textContent = type === 'password' ? '👁️' : '🔒';
    });
  }

  // 4. Quick Auto-fill Demo Credentials
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
});

