// =======================
// NAVIGATION TOGGLE
// =======================
const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
menuBtn.addEventListener('click', () => navMenu.classList.toggle('show'));

// =======================
// AUTO YEAR
// =======================
document.getElementById('year').textContent = new Date().getFullYear();

// =======================
// SERMONS (Dynamic cards)
// =======================
const sermons = [
  { title: "Walking by Faith", speaker: "Bishop David Oyedepo" },
  { title: "Engaging the Power of Prayer", speaker: "Pastor David Oyedepo Jr." },
  { title: "Keys to Divine Health", speaker: "Pastor Faith Oyedepo" }
];

const sermonGrid = document.getElementById('sermonGrid');
sermons.forEach(s => {
  const div = document.createElement('div');
  div.classList.add('card');
  div.innerHTML = `<h3>${s.title}</h3><p>${s.speaker}</p>`;
  sermonGrid.appendChild(div);
});

// =======================
// CONTACT FORM MOCK
// =======================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  formStatus.textContent = 'Sending...';
  setTimeout(() => {
    formStatus.textContent = 'Message sent successfully!';
    contactForm.reset();
  }, 1500);
});

// =======================
// SCROLL FADE-IN EFFECT
// =======================
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.2 });

fadeEls.forEach(el => observer.observe(el));

// =======================
// ABOUT SECTION FADE-IN
// =======================
const aboutBlocks = document.querySelectorAll('.about-block');
const blockObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      blockObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

aboutBlocks.forEach(block => blockObserver.observe(block));

// =======================
// LIGHTBOX GALLERY (Full Featured)
// =======================
(function () {
  const galleryImages = Array.from(document.querySelectorAll('.gallery-grid img'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const closeLightbox = document.querySelector('.close-lightbox');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const captionEl = document.querySelector('.lightbox-caption');

  if (!galleryImages.length || !lightbox || !lightboxImg) return;

  let currentIndex = 0;
  let isAnimating = false;

  function showImage(index) {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex = (index + galleryImages.length) % galleryImages.length;

    const src = galleryImages[currentIndex].src;
    const alt = galleryImages[currentIndex].alt || '';

    lightboxImg.classList.add('fade');
    if (captionEl) captionEl.classList.add('fade');

    setTimeout(() => {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      if (captionEl) captionEl.textContent = alt;
      requestAnimationFrame(() => {
        lightboxImg.classList.remove('fade');
        if (captionEl) captionEl.classList.remove('fade');
        setTimeout(() => { isAnimating = false; }, 300);
      });
    }, 180);
  }

  // Open image
  galleryImages.forEach((img, idx) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = idx;
      showImage(currentIndex);
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  // Close handlers
  function closeLightboxFn() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeLightbox?.addEventListener('click', e => {
    e.stopPropagation();
    closeLightboxFn();
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightboxFn();
  });

  // Next / Prev buttons
  nextBtn?.addEventListener('click', e => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  prevBtn?.addEventListener('click', e => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  // Keyboard support
  document.addEventListener('keydown', e => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightboxFn();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Swipe gestures
  let startX = 0;
  let startY = 0;

  lightbox.addEventListener('touchstart', e => {
    if (!e.touches.length) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    if (!e.changedTouches.length) return;
    const dx = startX - e.changedTouches[0].clientX;
    const dy = startY - e.changedTouches[0].clientY;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) showImage(currentIndex + 1);
    else showImage(currentIndex - 1);
  }, { passive: true });

  lightboxImg.addEventListener('click', e => e.stopPropagation());
})();
