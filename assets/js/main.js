/* ═══════════════════════════════════════════════════════════
   STAR LIFE — MAIN.JS
   Animations, micro-interactions, mobile menu.
   Respects prefers-reduced-motion.
   ─────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── MOBILE MENU ───
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // ─── SMOOTH SCROLL (anchor links with header offset) ───
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offset,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  // ─── NAV SCROLL STATE (plain JS, no GSAP needed) ───
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── GSAP INITIALIZATION ───
  // Wait until GSAP is loaded (it's deferred)
  function initGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // GSAP not yet loaded — show all GSAP-animated elements immediately
      document.querySelectorAll('.gsap-fade-up, .gsap-fade').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      document.querySelectorAll('.hero-eyebrow, .hero-sub, .hero-cta, .hero-meta').forEach(el => {
        el.style.opacity = '1';
      });
      document.querySelectorAll('.hero-title .line-inner').forEach(el => {
        el.style.transform = 'translateY(0)';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      // Honor user preference: show everything, no animation
      gsap.set('.gsap-fade-up, .gsap-fade', { opacity: 1, y: 0, clearProps: 'transform' });
      gsap.set('.hero-eyebrow, .hero-sub, .hero-cta, .hero-meta', { opacity: 1 });
      gsap.set('.hero-title .line-inner', { y: 0 });
      // Counters: just write the final value
      document.querySelectorAll('[data-count]').forEach(el => {
        el.textContent = el.dataset.count;
      });
      return;
    }

    // ─── HERO ENTRANCE ───
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .to('.hero-eyebrow', { opacity: 1, duration: 1, ease: 'power2.out' })
      .to('.hero-title .line-inner', {
        y: 0,
        duration: 1.4,
        ease: 'power4.out',
        stagger: 0.12
      }, '-=0.5')
      .to('.hero-sub', { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.7')
      .to('.hero-cta', { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.7')
      .to('.hero-meta', { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.5');

    // ─── HERO STAR FIELD ───
    const starField = document.getElementById('starField');
    if (starField) {
      const numStars = 30;
      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const size = 1 + Math.random() * 2;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        starField.appendChild(star);

        gsap.to(star, {
          opacity: 0.2 + Math.random() * 0.5,
          duration: 1.5 + Math.random() * 2,
          delay: Math.random() * 3,
          ease: 'power2.inOut',
          onComplete: function () {
            gsap.to(star, {
              opacity: 0.05 + Math.random() * 0.3,
              duration: 2 + Math.random() * 3,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
        });
      }
    }

    // ─── APPROACH PARALLAX STARS ───
    const approachStars = document.getElementById('approachStars');
    if (approachStars) {
      for (let i = 0; i < 40; i++) {
        const s = document.createElement('div');
        s.className = 'pstar';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        const sz = 1 + Math.random() * 1.5;
        s.style.width = sz + 'px';
        s.style.height = sz + 'px';
        s.style.opacity = 0.3 + Math.random() * 0.5;
        approachStars.appendChild(s);
      }

      gsap.to('.pstar', {
        y: () => -50 - Math.random() * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: '.approach',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // ─── GENERIC FADE-UP ON SCROLL ───
    gsap.utils.toArray('.gsap-fade-up').forEach(el => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // ─── SERVICES STAGGER ───
    ScrollTrigger.create({
      trigger: '.services-grid',
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo('.service',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    });

    // ─── APPROACH STEPS STAGGER ───
    ScrollTrigger.create({
      trigger: '.approach-steps',
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo('.approach-step',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    });

    // ─── TESTIMONIALS STAGGER ───
    ScrollTrigger.create({
      trigger: '.testimonials-grid',
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo('.testimonial',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    });

    // ─── COUNTER ANIMATIONS ───
    document.querySelectorAll('[data-count]').forEach(counter => {
      const target = parseInt(counter.dataset.count, 10);
      const obj = { val: 0 };

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              counter.textContent = Math.round(obj.val);
            }
          });
        }
      });
    });

    // ─── J.P. MORGAN PARALLAX ───
    gsap.to('.billionaires-quote', {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.billionaires',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  // GSAP is loaded with defer — wait for window load to be safe
  if (document.readyState === 'complete') {
    initGsap();
  } else {
    window.addEventListener('load', initGsap);
  }
})();
