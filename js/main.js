// ═══════════════════════════════════════════
// INIT AOS
// ═══════════════════════════════════════════
AOS.init({
  once: true,
  offset: 80,
  easing: 'ease-out-quart',
});

// ═══════════════════════════════════════════
// NAV — scroll state
// ═══════════════════════════════════════════
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ═══════════════════════════════════════════
// NAV — smooth scroll for anchor links
// ═══════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
    // close mobile menu if open
    mobileMenu.classList.remove('open');
  });
});

// ═══════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// ═══════════════════════════════════════════
// CLIENT PORTAL — access code handler
// ═══════════════════════════════════════════
const retrieveBtn = document.getElementById('retrieveBtn');
const accessCodeInput = document.getElementById('accessCode');
const deliveryResult = document.getElementById('deliveryResult');

if (retrieveBtn) {
  retrieveBtn.addEventListener('click', async () => {
    const code = accessCodeInput.value.trim();

    deliveryResult.className = 'delivery-result';
    deliveryResult.textContent = '';

    if (!code) {
      deliveryResult.textContent = 'Please enter your access code.';
      deliveryResult.classList.add('error');
      return;
    }

    retrieveBtn.textContent = 'Checking...';
    retrieveBtn.disabled = true;

    try {
      // This will call the Supabase edge function once connected.
      // For now, returns a friendly holding message.
      const response = await fetch(`/api/retrieve?code=${encodeURIComponent(code)}`);

      if (response.ok) {
        const data = await response.json();
        deliveryResult.innerHTML = `Files ready: <a href="${data.url}" target="_blank" rel="noopener">Download your deliverables</a>`;
        deliveryResult.classList.add('success');
      } else if (response.status === 404) {
        deliveryResult.textContent = 'Access code not found. Please check your email or contact us.';
        deliveryResult.classList.add('error');
      } else {
        throw new Error('Server error');
      }
    } catch {
      // Dev/pre-Supabase fallback
      deliveryResult.textContent = 'File retrieval is being set up. Contact hello@ariesmediahub.site for your files.';
      deliveryResult.classList.add('error');
    } finally {
      retrieveBtn.textContent = 'Retrieve Files';
      retrieveBtn.disabled = false;
    }
  });

  // Allow Enter key in input
  accessCodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') retrieveBtn.click();
  });
}

// ═══════════════════════════════════════════
// ACTIVE NAV LINK — highlight on scroll
// ═══════════════════════════════════════════
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));
