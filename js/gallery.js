// ═══════════════════════════════════════════
// GALLERY — loads from data/work.json
// ═══════════════════════════════════════════

const VALID_CATEGORIES = [
  'Brand Identity',
  'Logo Design',
  'Print Design',
  'Social Media Assets',
  'Google Ads Creative',
  'Meta Ads Creative'
];

const MAX_FILE_SIZE_KB = 500;
const RECOMMENDED_WIDTH = 1200;
const RECOMMENDED_HEIGHT = 900;

let allWork = [];
let activeFilter = 'all';

// ── Load and render ──────────────────────────
async function loadGallery() {
  const grid = document.getElementById('workGrid');
  const placeholder = document.getElementById('workPlaceholder');
  const empty = document.getElementById('workEmpty');

  try {
    const res = await fetch('data/work.json');
    if (!res.ok) throw new Error('Could not load work.json');
    const data = await res.json();

    // Validate each entry
    allWork = data.filter(item => validateEntry(item));

    if (allWork.length === 0) {
      placeholder.style.display = 'block';
      return;
    }

    placeholder.style.display = 'none';
    renderGrid(allWork);

  } catch (err) {
    console.warn('Gallery:', err.message);
    placeholder.style.display = 'block';
  }
}

// ── Validate a work entry ────────────────────
function validateEntry(item) {
  if (!item.title || typeof item.title !== 'string') {
    console.warn('Gallery: entry missing title', item);
    return false;
  }
  if (!item.image || typeof item.image !== 'string') {
    console.warn('Gallery: entry missing image', item);
    return false;
  }
  if (!VALID_CATEGORIES.includes(item.category)) {
    console.warn(`Gallery: invalid category "${item.category}" for "${item.title}"`);
    return false;
  }
  return true;
}

// ── Render grid ──────────────────────────────
function renderGrid(items) {
  const grid = document.getElementById('workGrid');
  const empty = document.getElementById('workEmpty');

  grid.innerHTML = '';

  if (items.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  items.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((i % 3) * 100));

    const img = document.createElement('img');
    img.alt = item.title;
    img.loading = 'lazy';

    // Image load validation
    img.onload = function() {
      if (img.naturalWidth < RECOMMENDED_WIDTH || img.naturalHeight < RECOMMENDED_HEIGHT) {
        console.warn(
          `Gallery: "${item.title}" is ${img.naturalWidth}x${img.naturalHeight}px. ` +
          `Recommended: ${RECOMMENDED_WIDTH}x${RECOMMENDED_HEIGHT}px.`
        );
      }
    };

    img.onerror = function() {
      console.warn(`Gallery: image not found for "${item.title}" → ${item.image}`);
      card.classList.add('placeholder');
      img.remove();
    };

    img.src = item.image;

    const overlay = document.createElement('div');
    overlay.className = 'work-overlay';

    const label = document.createElement('span');
    label.textContent = item.title;

    const cat = document.createElement('small');
    cat.textContent = item.category;
    cat.className = 'work-category';

    overlay.appendChild(label);
    overlay.appendChild(cat);
    card.appendChild(img);
    card.appendChild(overlay);
    grid.appendChild(card);
  });

  // Re-init AOS for dynamically added elements
  if (typeof AOS !== 'undefined') AOS.refresh();
}

// ── Filter buttons ───────────────────────────
function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeFilter = btn.getAttribute('data-filter');

      const filtered = activeFilter === 'all'
        ? allWork
        : allWork.filter(item => item.category === activeFilter);

      renderGrid(filtered);
    });
  });
}

// ── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadGallery();
  initFilters();
});
