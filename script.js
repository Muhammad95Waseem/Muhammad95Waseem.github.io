/* script.js — Mohammad Waseem Portfolio */

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===========================
// SCROLL REVEAL OBSERVER
// Works for any element with class="reveal"
// or class="stagger-children"
// ===========================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, stop observing for performance
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  }
);

// Observe all .reveal and .stagger-children elements
document.querySelectorAll('.reveal, .stagger-children').forEach((el) => {
  revealObserver.observe(el);
});

// ===========================
// HERO NAME TYPEWRITER EFFECT
// ===========================
function typewriterEffect(elementId, text, speed = 80) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}

// ===========================
// SMOOTH ACTIVE NAV LINK
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--violet-mid)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => sectionObserver.observe(s));

// ===========================
// SKILL TAG HOVER SPARKLE
// ===========================
document.querySelectorAll('.skill-tag').forEach((tag) => {
  tag.addEventListener('mouseenter', function (e) {
    this.style.boxShadow = '0 0 16px rgba(109,40,217,0.25)';
  });
  tag.addEventListener('mouseleave', function () {
    this.style.boxShadow = '';
  });
});

// ===========================
// MOUSE PARALLAX ON ORB CANVAS
// Subtle mouse-follow for orbs
// ===========================
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth  - 0.5) * 30;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
});

function animateOrbs() {
  currentX += (mouseX - currentX) * 0.04;
  currentY += (mouseY - currentY) * 0.04;

  const canvas = document.querySelector('.orb-canvas');
  if (canvas) {
    canvas.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }
  requestAnimationFrame(animateOrbs);
}

animateOrbs();

// ===========================
// PAGE LOAD — reveal hero instantly
// ===========================
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-reveal').forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 120 + 100);
  });
});
