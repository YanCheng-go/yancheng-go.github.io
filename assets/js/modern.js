/* ===== Particle Canvas ===== */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles, mouse;
  let animating = false;
  let rafId = null;

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
    if (!animating) return;
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
    rafId = requestAnimationFrame(draw);
  }

  // Pause animation when hero section is off-screen
  var hero = canvas.closest('.hero');
  if (hero) {
    var heroObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!animating) { animating = true; draw(); }
      } else {
        animating = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    }, { threshold: 0 });
    heroObserver.observe(hero);
  }

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('resize', resize);
  init();
  animating = true;
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
    'Aspiring Comedian',
    'Meme Connoisseur',
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
    var lang = localStorage.getItem('lang') || 'en';
    var showAll = { en: 'show all publications ↓', zh: '显示全部论文 ↓', da: 'vis alle publikationer ↓' };
    var showLess = { en: 'show less ↑', zh: '收起 ↑', da: 'vis færre ↑' };
    toggle.textContent = expanded
      ? (showLess[lang] || showLess.en)
      : (showAll[lang] || showAll.en);
  });
})();

/* ===== Neko Desktop Pet ===== */
(function () {
  var neko = document.getElementById('neko');
  if (!neko) return;

  var nekoX = window.innerWidth / 2;
  var nekoY = window.innerHeight / 2;
  var mouseX = nekoX;
  var mouseY = nekoY;
  var speed = 10;
  var frame = 0;
  var idleFrames = 0;
  var state = 'idle';

  // Pet mode: 'cat' or 'dog' — toggled via nav cat click
  window._nekoMode = localStorage.getItem('nekoMode') || 'cat';

  function catSvg(type, f) {
    if (type === 'sleep') {
      var zzz = f % 4 < 2 ? 'z' : 'zz';
      return '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">'
        + '<polygon points="6,14 10,6 14,14" fill="#666"/>'
        + '<polygon points="18,14 22,6 26,14" fill="#666"/>'
        + '<circle cx="16" cy="20" r="10" fill="#666"/>'
        + '<line x1="10" y1="18" x2="14" y2="18" stroke="#444" stroke-width="1.5" stroke-linecap="round"/>'
        + '<line x1="18" y1="18" x2="22" y2="18" stroke="#444" stroke-width="1.5" stroke-linecap="round"/>'
        + '<text x="26" y="10" font-family="monospace" font-size="8" fill="#00ffd5" opacity="0.6">' + zzz + '</text>'
        + '</svg>';
    }
    if (type === 'idle') {
      return f % 2 === 0
        ? '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">'
          + '<polygon points="6,12 10,4 14,12" fill="#888"/>'
          + '<polygon points="18,12 22,4 26,12" fill="#888"/>'
          + '<circle cx="16" cy="18" r="10" fill="#888"/>'
          + '<circle cx="12" cy="16" r="2" fill="#00ffd5"/>'
          + '<circle cx="20" cy="16" r="2" fill="#00ffd5"/>'
          + '<ellipse cx="16" cy="20" rx="1.5" ry="1" fill="#555"/>'
          + '<line x1="4" y1="18" x2="10" y2="17" stroke="#aaa" stroke-width="0.5"/>'
          + '<line x1="4" y1="20" x2="10" y2="19" stroke="#aaa" stroke-width="0.5"/>'
          + '<line x1="22" y1="17" x2="28" y2="18" stroke="#aaa" stroke-width="0.5"/>'
          + '<line x1="22" y1="19" x2="28" y2="20" stroke="#aaa" stroke-width="0.5"/>'
          + '</svg>'
        : '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">'
          + '<polygon points="6,12 10,4 14,12" fill="#888"/>'
          + '<polygon points="18,12 22,4 26,12" fill="#888"/>'
          + '<circle cx="16" cy="18" r="10" fill="#888"/>'
          + '<line x1="10" y1="16" x2="14" y2="16" stroke="#00ffd5" stroke-width="1.5" stroke-linecap="round"/>'
          + '<line x1="18" y1="16" x2="22" y2="16" stroke="#00ffd5" stroke-width="1.5" stroke-linecap="round"/>'
          + '<ellipse cx="16" cy="20" rx="1.5" ry="1" fill="#555"/>'
          + '<line x1="4" y1="18" x2="10" y2="17" stroke="#aaa" stroke-width="0.5"/>'
          + '<line x1="4" y1="20" x2="10" y2="19" stroke="#aaa" stroke-width="0.5"/>'
          + '<line x1="22" y1="17" x2="28" y2="18" stroke="#aaa" stroke-width="0.5"/>'
          + '<line x1="22" y1="19" x2="28" y2="20" stroke="#aaa" stroke-width="0.5"/>'
          + '</svg>';
    }
    // run
    return f % 2 === 0
      ? '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">'
        + '<polygon points="6,10 10,2 14,10" fill="#888"/>'
        + '<polygon points="18,10 22,2 26,10" fill="#888"/>'
        + '<ellipse cx="16" cy="16" rx="10" ry="9" fill="#888"/>'
        + '<circle cx="12" cy="14" r="1.5" fill="#00ffd5"/>'
        + '<circle cx="20" cy="14" r="1.5" fill="#00ffd5"/>'
        + '<ellipse cx="16" cy="18" rx="1.5" ry="1" fill="#555"/>'
        + '<line x1="8" y1="26" x2="6" y2="30" stroke="#888" stroke-width="2" stroke-linecap="round"/>'
        + '<line x1="14" y1="24" x2="12" y2="30" stroke="#888" stroke-width="2" stroke-linecap="round"/>'
        + '<line x1="18" y1="24" x2="22" y2="30" stroke="#888" stroke-width="2" stroke-linecap="round"/>'
        + '<line x1="24" y1="26" x2="26" y2="30" stroke="#888" stroke-width="2" stroke-linecap="round"/>'
        + '</svg>'
      : '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">'
        + '<polygon points="6,10 10,2 14,10" fill="#888"/>'
        + '<polygon points="18,10 22,2 26,10" fill="#888"/>'
        + '<ellipse cx="16" cy="16" rx="10" ry="9" fill="#888"/>'
        + '<circle cx="12" cy="14" r="1.5" fill="#00ffd5"/>'
        + '<circle cx="20" cy="14" r="1.5" fill="#00ffd5"/>'
        + '<ellipse cx="16" cy="18" rx="1.5" ry="1" fill="#555"/>'
        + '<line x1="8" y1="26" x2="10" y2="30" stroke="#888" stroke-width="2" stroke-linecap="round"/>'
        + '<line x1="14" y1="24" x2="16" y2="30" stroke="#888" stroke-width="2" stroke-linecap="round"/>'
        + '<line x1="18" y1="24" x2="16" y2="30" stroke="#888" stroke-width="2" stroke-linecap="round"/>'
        + '<line x1="24" y1="26" x2="22" y2="30" stroke="#888" stroke-width="2" stroke-linecap="round"/>'
        + '</svg>';
  }

  function dogSvg(type, f) {
    var c = '#b08050'; // brown dog color
    var cd = '#8a6030';
    if (type === 'sleep') {
      var zzz = f % 4 < 2 ? 'z' : 'zz';
      return '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">'
        + '<ellipse cx="7" cy="14" rx="5" ry="7" fill="' + cd + '" transform="rotate(-20 7 14)"/>'
        + '<ellipse cx="25" cy="14" rx="5" ry="7" fill="' + cd + '" transform="rotate(20 25 14)"/>'
        + '<circle cx="16" cy="20" r="10" fill="' + c + '"/>'
        + '<line x1="10" y1="18" x2="14" y2="18" stroke="#444" stroke-width="1.5" stroke-linecap="round"/>'
        + '<line x1="18" y1="18" x2="22" y2="18" stroke="#444" stroke-width="1.5" stroke-linecap="round"/>'
        + '<ellipse cx="16" cy="22" rx="2.5" ry="1.5" fill="#333"/>'
        + '<text x="26" y="8" font-family="monospace" font-size="8" fill="#00ffd5" opacity="0.6">' + zzz + '</text>'
        + '</svg>';
    }
    if (type === 'idle') {
      // Floppy-eared dog with tongue out on alternate frames
      var tongue = f % 2 === 0
        ? '<ellipse cx="16" cy="24" rx="1.5" ry="2" fill="#e66"/>'
        : '';
      return '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">'
        + '<ellipse cx="7" cy="12" rx="5" ry="7" fill="' + cd + '" transform="rotate(-20 7 12)"/>'
        + '<ellipse cx="25" cy="12" rx="5" ry="7" fill="' + cd + '" transform="rotate(20 25 12)"/>'
        + '<circle cx="16" cy="18" r="10" fill="' + c + '"/>'
        + '<circle cx="12" cy="16" r="2" fill="#00ffd5"/>'
        + '<circle cx="20" cy="16" r="2" fill="#00ffd5"/>'
        + '<ellipse cx="16" cy="20" rx="2.5" ry="1.5" fill="#333"/>'
        + tongue
        + '</svg>';
    }
    // run
    var tailY = f % 2 === 0 ? -5 : 5;
    return '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">'
      + '<ellipse cx="7" cy="10" rx="5" ry="7" fill="' + cd + '" transform="rotate(-30 7 10)"/>'
      + '<ellipse cx="25" cy="10" rx="5" ry="7" fill="' + cd + '" transform="rotate(30 25 10)"/>'
      + '<ellipse cx="16" cy="16" rx="10" ry="9" fill="' + c + '"/>'
      + '<circle cx="12" cy="14" r="1.5" fill="#00ffd5"/>'
      + '<circle cx="20" cy="14" r="1.5" fill="#00ffd5"/>'
      + '<ellipse cx="16" cy="18" rx="2" ry="1.2" fill="#333"/>'
      + '<ellipse cx="16" cy="19.5" rx="1.2" ry="1.5" fill="#e66"/>'
      + '<line x1="8" y1="26" x2="' + (6 + (f % 2) * 4) + '" y2="30" stroke="' + c + '" stroke-width="2" stroke-linecap="round"/>'
      + '<line x1="14" y1="24" x2="' + (12 + (f % 2) * 4) + '" y2="30" stroke="' + c + '" stroke-width="2" stroke-linecap="round"/>'
      + '<line x1="18" y1="24" x2="' + (22 - (f % 2) * 6) + '" y2="30" stroke="' + c + '" stroke-width="2" stroke-linecap="round"/>'
      + '<line x1="24" y1="26" x2="' + (26 - (f % 2) * 4) + '" y2="30" stroke="' + c + '" stroke-width="2" stroke-linecap="round"/>'
      + '<line x1="26" y1="12" x2="30" y2="' + (8 + tailY) + '" stroke="' + c + '" stroke-width="2" stroke-linecap="round"/>'
      + '</svg>';
  }

  function render() {
    var mode = window._nekoMode || 'cat';
    var svgFn = mode === 'dog' ? dogSvg : catSvg;
    if (state === 'idle') {
      neko.innerHTML = svgFn('idle', frame);
    } else {
      neko.innerHTML = svgFn('run', frame);
    }
  }

  function renderSleep() {
    var mode = window._nekoMode || 'cat';
    var svgFn = mode === 'dog' ? dogSvg : catSvg;
    neko.innerHTML = svgFn('sleep', frame);
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function tick() {
    var dx = mouseX - nekoX;
    var dy = mouseY - nekoY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 48) {
      idleFrames++;
      if (idleFrames > 60) {
        state = 'sleep';
        renderSleep();
      } else {
        state = 'idle';
        render();
      }
    } else {
      idleFrames = 0;
      state = 'run';
      var moveX = (dx / dist) * speed;
      var moveY = (dy / dist) * speed;
      nekoX += moveX;
      nekoY += moveY;

      // Flip based on direction
      neko.style.transform = dx < 0 ? 'scaleX(-1)' : 'scaleX(1)';
      render();
    }

    neko.style.left = (nekoX - 16) + 'px';
    neko.style.top = (nekoY - 16) + 'px';

    frame++;
    requestAnimationFrame(tick);
  }

  // Start after a short delay
  setTimeout(tick, 2000);
})();

/* ===== Pet Vote Widget + Hero Icon + Supabase ===== */
(function () {
  var btns = document.querySelectorAll('.pet-vote-btn');
  if (!btns.length) return;

  var heroPet = document.getElementById('hero-pet');
  var catCountEl = document.getElementById('vote-cat-count');
  var dogCountEl = document.getElementById('vote-dog-count');
  var voteBarCat = document.getElementById('vote-bar-cat');

  var catShapeHTML = '<div class="nav-cat-body">'
    + '<div class="nav-cat-ear nav-cat-ear-l"></div>'
    + '<div class="nav-cat-ear nav-cat-ear-r"></div>'
    + '<div class="nav-cat-head">'
    + '<div class="nav-cat-eye nav-cat-eye-l"></div>'
    + '<div class="nav-cat-eye nav-cat-eye-r"></div>'
    + '</div>'
    + '<div class="nav-cat-tail"></div>'
    + '</div>';

  var dogShapeHTML = '<div class="nav-dog-body">'
    + '<div class="nav-dog-ear nav-dog-ear-l"></div>'
    + '<div class="nav-dog-ear nav-dog-ear-r"></div>'
    + '<div class="nav-dog-head">'
    + '<div class="nav-dog-eye nav-dog-eye-l"></div>'
    + '<div class="nav-dog-eye nav-dog-eye-r"></div>'
    + '</div>'
    + '<div class="nav-dog-tongue"></div>'
    + '<div class="nav-dog-tail"></div>'
    + '</div>';

  var catSounds = ['meow!', 'mrrp~', 'purr...', 'nyaa~', '*stretch*'];
  var dogSounds = ['woof!', 'arf~', '*pant*', 'bark!', '*tail wag*'];

  // Supabase client
  var SUPABASE_URL = 'https://avypnlqkemxztfhxbmdy.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2eXBubHFrZW14enRmaHhibWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzk1NjAsImV4cCI6MjA4Nzk1NTU2MH0.ZT_bH-__fJts53nHBLVP28-XpGDM96NhoK8D43fs4zY';
  var sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

  function updateVoteUI(catCount, dogCount) {
    var total = catCount + dogCount;
    var catPct = total > 0 ? Math.round((catCount / total) * 100) : 50;
    if (catCountEl) catCountEl.textContent = catCount > 0 ? '(' + catCount + ')' : '';
    if (dogCountEl) dogCountEl.textContent = dogCount > 0 ? '(' + dogCount + ')' : '';
    if (voteBarCat) voteBarCat.style.width = catPct + '%';
  }

  async function fetchVotes() {
    if (!sb) return;
    var { data } = await sb.from('pet_votes').select('pet, count');
    if (!data) return;
    var catCount = 0, dogCount = 0;
    data.forEach(function (row) {
      if (row.pet === 'cat') catCount = row.count;
      if (row.pet === 'dog') dogCount = row.count;
    });
    updateVoteUI(catCount, dogCount);
  }

  async function castVote(pet) {
    if (!sb) return;
    // Atomic increment via rpc; falls back to read+write if rpc not available
    try {
      await sb.rpc('increment_vote', { pet_type: pet });
    } catch (_) {
      var { data } = await sb.from('pet_votes').select('count').eq('pet', pet).single();
      if (data) {
        await sb.from('pet_votes').update({ count: data.count + 1 }).eq('pet', pet);
      }
    }
    fetchVotes();
  }

  function applyMode(mode, shouldVote) {
    window._nekoMode = mode;
    localStorage.setItem('nekoMode', mode);
    btns.forEach(function (b) {
      b.classList.remove('active');
      b.blur();
    });
    btns.forEach(function (b) {
      if (b.dataset.pet === mode) b.classList.add('active');
    });
    if (heroPet) heroPet.innerHTML = mode === 'dog' ? dogShapeHTML : catShapeHTML;

    // Cast vote if user clicked (not on page load)
    if (shouldVote && !localStorage.getItem('petVoted')) {
      localStorage.setItem('petVoted', mode);
      castVote(mode);
    } else if (shouldVote && localStorage.getItem('petVoted')) {
      // Already voted — switch vote
      var prevVote = localStorage.getItem('petVoted');
      if (prevVote !== mode) {
        localStorage.setItem('petVoted', mode);
        // Decrement old, increment new
        (async function () {
          if (!sb) return;
          try {
            await sb.rpc('decrement_vote', { pet_type: prevVote });
          } catch (_) {
            var { data: oldData } = await sb.from('pet_votes').select('count').eq('pet', prevVote).single();
            if (oldData && oldData.count > 0) {
              await sb.from('pet_votes').update({ count: oldData.count - 1 }).eq('pet', prevVote);
            }
          }
          castVote(mode);
        })();
      }
    }
  }

  // Init from saved preference (no vote on load)
  applyMode(window._nekoMode || 'cat', false);
  fetchVotes();

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyMode(btn.dataset.pet, true);
    });
  });

  // Click hero pet for floating text
  if (heroPet) {
    heroPet.addEventListener('click', function () {
      var mode = window._nekoMode || 'cat';
      var sounds = mode === 'dog' ? dogSounds : catSounds;
      var bubble = document.createElement('span');
      bubble.textContent = sounds[Math.floor(Math.random() * sounds.length)];
      bubble.style.cssText = 'position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-family:var(--mono);font-size:0.75rem;color:var(--accent);pointer-events:none;opacity:1;transition:all 1s ease;white-space:nowrap;';
      heroPet.appendChild(bubble);
      requestAnimationFrame(function () {
        bubble.style.top = '-40px';
        bubble.style.opacity = '0';
      });
      setTimeout(function () { bubble.remove(); }, 1000);
    });
  }
})();

/* ===== i18n Language Switcher ===== */
(function () {
  var translations = {
    en: {
      'nav.about': 'about',
      'nav.oss': 'open_source',
      'nav.knowledge': 'knowledge_sharing',
      'nav.research': 'research',
      'nav.contact': 'contact',
      'hero.loading': '> loading identity...',
      'hero.location': '> Based in <strong style="color: var(--accent);">Denmark</strong> · lived in Netherlands · USA · Kenya · Germany · Switzerland · China',
      'hero.funfact': '> also: aspiring comedian · meme connoisseur · cat person',
      'about.title': 'About Me',
      'about.bio1': '<strong>Machine Learning & AI Engineer</strong> with a PhD in Computer Vision for Earth Observations (<strong>UCPH</strong>, exchange at <strong>ETH Zurich</strong>), focusing on computer vision, deep learning, and geospatial data for environmental monitoring. With 3.5 years of academic research and 3+ years of professional experience across Europe, the USA, and Asia — now happily exploring AI models and toolings in an embedded software company.',
      'about.bio2': 'Passionate about deriving insights from big data to solve real-life problems. I also enjoy sharing knowledge through presentations, teaching, blogging, and publishing.',
      'about.funfact': 'Mastered JavaScript in a week back in 2014 by reading a 687-page guide. Aspiring standup comedian and full-time meme connoisseur.',
      'skills.prog.title': 'Programming',
      'skills.ai.title': 'AI & ML',
      'skills.geo.title': 'Geospatial',
      'skills.cloud.title': 'Cloud & DevOps',
      'skills.data.title': 'Data Handling',
      'skills.viz.title': 'Visualization & Languages',
      'skills.viz.desc': 'Plotly, Matplotlib, Seaborn · English (near-native), Chinese (native), Danish (beginner)',
      'oss.title': 'Open Source',
      'oss.current': 'Currently building <a href="https://danskprep.vercel.app" target="_blank"><strong>danskprep</strong></a> — a fun side project to help with Danish language exam preparation, built with TypeScript and deployed on Vercel.',
      'ks.title': 'Knowledge Sharing',
      'research.title': 'Research Archive',
      'research.subtitle': 'Publications and projects from my academic years — currently happily exploring AI models and tooling in the embedded software industry.',
      'research.showAll': 'show all publications ↓',
      'research.showLess': 'show less ↑',
      'contact.title': "Let's Connect"
    },
    zh: {
      'nav.about': '关于',
      'nav.oss': '开源项目',
      'nav.knowledge': '知识分享',
      'nav.research': '学术研究',
      'nav.contact': '联系我',
      'hero.loading': '> 正在加载身份信息...',
      'hero.location': '> 现居 <strong style="color: var(--accent);">丹麦</strong> · 曾居住于 荷兰 · 美国 · 肯尼亚 · 德国 · 瑞士 · 中国',
      'hero.funfact': '> 另外：有抱负的喜剧演员 · 表情包鉴赏家 · 猫派',
      'about.title': '关于我',
      'about.bio1': '<strong>机器学习与AI工程师</strong>，拥有地球观测计算机视觉方向博士学位（<strong>哥本哈根大学</strong>，交换于<strong>苏黎世联邦理工学院</strong>），专注于计算机视觉、深度学习和地理空间数据在环境监测中的应用。拥有3.5年学术研究经历以及3年以上横跨欧洲、美国和亚洲的职业经验——目前在一家嵌入式软件公司愉快地探索AI模型和工具链。',
      'about.bio2': '热衷于从大数据中发掘洞见以解决实际问题。同时喜欢通过演讲、教学、博客和发表论文来分享知识。',
      'about.funfact': '2014年用一周时间读完687页指南掌握了JavaScript。立志成为脱口秀演员，全职表情包鉴赏家。',
      'skills.prog.title': '编程',
      'skills.ai.title': 'AI与机器学习',
      'skills.geo.title': '地理空间',
      'skills.cloud.title': '云与DevOps',
      'skills.data.title': '数据处理',
      'skills.viz.title': '可视化与语言',
      'skills.viz.desc': 'Plotly, Matplotlib, Seaborn · 英语（近母语）, 中文（母语）, 丹麦语（初学）',
      'oss.title': '开源项目',
      'oss.current': '正在开发 <a href="https://danskprep.vercel.app" target="_blank"><strong>danskprep</strong></a> ——一个帮助丹麦语考试备考的趣味项目，使用 TypeScript 构建，部署在 Vercel 上。',
      'ks.title': '知识分享',
      'research.title': '学术档案',
      'research.subtitle': '来自学术时期的论文和项目——目前正愉快地在嵌入式软件行业探索AI模型和工具链。',
      'research.showAll': '显示全部论文 ↓',
      'research.showLess': '收起 ↑',
      'contact.title': '联系我'
    },
    da: {
      'nav.about': 'om mig',
      'nav.oss': 'open_source',
      'nav.knowledge': 'videndeling',
      'nav.research': 'forskning',
      'nav.contact': 'kontakt',
      'hero.loading': '> indlæser identitet...',
      'hero.location': '> Bor i <strong style="color: var(--accent);">Danmark</strong> · har boet i Holland · USA · Kenya · Tyskland · Schweiz · Kina',
      'hero.funfact': '> også: aspirerende komiker · meme-kender · kattemenneske',
      'about.title': 'Om Mig',
      'about.bio1': '<strong>Machine Learning & AI Ingeniør</strong> med en ph.d. i computersyn til jordobservation (<strong>UCPH</strong>, udveksling på <strong>ETH Zürich</strong>) med fokus på computersyn, deep learning og geospatiale data til miljøovervågning. Med 3,5 års akademisk forskning og 3+ års erhvervserfaring på tværs af Europa, USA og Asien — udforsker nu glædeligt AI-modeller og værktøjer i en embedded software-virksomhed.',
      'about.bio2': 'Passioneret omkring at udlede indsigter fra big data for at løse virkelige problemer. Jeg nyder også at dele viden gennem præsentationer, undervisning, blogging og publicering.',
      'about.funfact': 'Mestrede JavaScript på en uge i 2014 ved at læse en 687-siders guide. Aspirerende standup-komiker og fuldtids meme-kender.',
      'skills.prog.title': 'Programmering',
      'skills.ai.title': 'AI & ML',
      'skills.geo.title': 'Geospatial',
      'skills.cloud.title': 'Cloud & DevOps',
      'skills.data.title': 'Datahåndtering',
      'skills.viz.title': 'Visualisering & Sprog',
      'skills.viz.desc': 'Plotly, Matplotlib, Seaborn · Engelsk (næsten modersmål), Kinesisk (modersmål), Dansk (begynder)',
      'oss.title': 'Open Source',
      'oss.current': 'Bygger i øjeblikket <a href="https://danskprep.vercel.app" target="_blank"><strong>danskprep</strong></a> — et sjovt sideprojekt til forberedelse af dansk sprogeksamen, bygget med TypeScript og deployet på Vercel.',
      'ks.title': 'Videndeling',
      'research.title': 'Forskningsarkiv',
      'research.subtitle': 'Publikationer og projekter fra mine akademiske år — udforsker i øjeblikket glædeligt AI-modeller og værktøjer i den indlejrede softwareindustri.',
      'research.showAll': 'vis alle publikationer ↓',
      'research.showLess': 'vis færre ↑',
      'contact.title': 'Lad Os Forbindes'
    }
  };

  var currentLang = localStorage.getItem('lang') || 'en';

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    var t = translations[lang] || translations.en;

    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });

    // Update innerHTML (for elements with HTML tags)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update html lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
  }

  // Bind buttons
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.dataset.lang);
    });
  });

  // Apply saved language on load
  if (currentLang !== 'en') applyLang(currentLang);
})();

/* ===== Auto Python Years ===== */
(function () {
  var el = document.getElementById('python-years');
  if (el) el.textContent = new Date().getFullYear() - 2018;
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
