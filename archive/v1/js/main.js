/* =============================================
   CUSTOM CURSOR
   ============================================= */
(function() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let fx = 0, fy = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();
})();

/* =============================================
   NAVBAR SCROLL EFFECT
   ============================================= */
(function() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
})();

/* =============================================
   MOBILE MENU
   ============================================= */
(function() {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('mobileNav');
  const links = nav.querySelectorAll('.mobile-link');
  let open = false;

  btn.addEventListener('click', () => {
    open = !open;
    nav.classList.toggle('open', open);
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      open = false;
      nav.classList.remove('open');
      const spans = btn.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
})();

/* =============================================
   INTERSECTION OBSERVER — REVEAL ANIMATIONS
   ============================================= */
(function() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
})();

/* =============================================
   STAT COUNTER ANIMATION
   ============================================= */
(function() {
  const statNums = document.querySelectorAll('.stat-num');
  let animated = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNums.forEach(el => {
          const target = parseFloat(el.dataset.target);
          const isDecimal = target % 1 !== 0;
          const duration = 1800;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            el.textContent = isDecimal ? current.toFixed(2) : Math.round(current).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
})();

/* =============================================
   SMOOTH ACTIVE NAV HIGHLIGHTING
   ============================================= */
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* =============================================
   PROJECT CARD TILT EFFECT
   ============================================= */
(function() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -4;
      const rotY = ((x - cx) / cx) * 4;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* =============================================
   PARALLAX HERO ORBS ON MOUSE MOVE
   ============================================= */
(function() {
  const orbs = document.querySelectorAll('.hero-orb');
  document.addEventListener('mousemove', e => {
    const { innerWidth: w, innerHeight: h } = window;
    const nx = (e.clientX / w - 0.5) * 2;
    const ny = (e.clientY / h - 0.5) * 2;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 12;
      orb.style.transform = `translate(${nx * depth}px, ${ny * depth}px)`;
    });
  });
})();

/* =============================================
   TYPING EFFECT FOR HERO TAGLINE HIGHLIGHT
   ============================================= */
(function() {
  const words = ['Deep Learning', 'Computer Vision', 'Systems'];
  const highlights = document.querySelectorAll('.hero-tagline .highlight');
  if (highlights.length === 0) return;

  // Just a subtle shimmer loop on highlights
  highlights.forEach((el, i) => {
    el.style.setProperty('--delay', i * 0.2 + 's');
  });
})();

/* =============================================
   PAGE LOAD TRANSITION
   ============================================= */
(function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();
