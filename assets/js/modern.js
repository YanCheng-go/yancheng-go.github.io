/* ===== Particle Canvas ===== */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles, mouse;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function init() {
    resize();
    mouse = { x: w / 2, y: h / 2 };
    particles = [];
    const count = Math.min(Math.floor((w * h) / 8000), 120);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,255,213,0.5)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,255,213,${0.12 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // mouse interaction
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0,255,213,${0.08 * (1 - dist / 200)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('resize', resize);
  init();
  draw();
})();

/* ===== Terminal Boot Sequence ===== */
(function () {
  const lines = document.querySelectorAll('.terminal-line');
  let delay = 300;
  lines.forEach(function (line, i) {
    setTimeout(function () {
      line.classList.add('visible');
    }, delay);
    delay += line.dataset.delay ? parseInt(line.dataset.delay) : 400;
  });

  // Rotating descriptors
  const el = document.getElementById('typed-role');
  if (!el) return;
  const roles = [
    'ML & AI Engineer',
    'Creative',
    'Fast Learner',
    'Team Player',
    'Blogger',
    'Cat Person',
    'Photographer',
    'Open Source Contributor',
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function typeRole() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(function () {
          deleting = true;
          typeRole();
        }, 2000);
        return;
      }
      setTimeout(typeRole, 80);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeRole, 500);
        return;
      }
      setTimeout(typeRole, 40);
    }
  }

  // Start typing after boot sequence finishes
  setTimeout(typeRole, delay + 500);
})();

/* ===== Scroll Reveal ===== */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );
  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ===== Nav scroll effect + active link highlight ===== */
(function () {
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    var current = '';
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNav);
  updateNav();
})();

/* ===== Mobile nav toggle ===== */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
  });
  // Close on link click
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
    });
  });
})();

/* ===== Avatar Lightbox ===== */
(function () {
  var avatar = document.querySelector('.hero-avatar');
  var overlay = document.getElementById('avatar-overlay');
  if (!avatar || !overlay) return;

  avatar.addEventListener('click', function () {
    overlay.classList.add('active');
  });

  overlay.addEventListener('click', function () {
    overlay.classList.remove('active');
  });
})();

/* ===== Publication Pagination ===== */
(function () {
  var items = document.querySelectorAll('.pub-item');
  var toggle = document.getElementById('pub-toggle');
  if (!toggle || items.length === 0) return;

  var PAGE_SIZE = 5;
  var expanded = false;

  // Hide items beyond PAGE_SIZE
  items.forEach(function (item, i) {
    if (i >= PAGE_SIZE) item.classList.add('pub-hidden');
  });

  if (items.length <= PAGE_SIZE) {
    toggle.style.display = 'none';
    return;
  }

  toggle.addEventListener('click', function () {
    expanded = !expanded;
    items.forEach(function (item, i) {
      if (i >= PAGE_SIZE) {
        item.classList.toggle('pub-hidden', !expanded);
        if (expanded) item.classList.add('visible');
      }
    });
    toggle.textContent = expanded
      ? 'show less ↑'
      : 'show all publications ↓';
  });
})();

/* ===== Blog Filter ===== */
(function () {
  const buttons = document.querySelectorAll('.blog-filter-btn');
  const cards = document.querySelectorAll('.blog-card');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(function (card) {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('blog-card-hidden');
        } else {
          card.classList.add('blog-card-hidden');
        }
      });
    });
  });
})();
