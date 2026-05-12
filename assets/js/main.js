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
      document.querySelectorAll('.prince-word, .prince-attr').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      const emph = document.querySelector('.prince-emph');
      if (emph) emph.classList.add('in-view');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      // Honor user preference: show everything, no animation
      gsap.set('.gsap-fade-up, .gsap-fade', { opacity: 1, y: 0, clearProps: 'transform' });
      gsap.set('.hero-eyebrow, .hero-sub, .hero-cta, .hero-meta', { opacity: 1 });
      gsap.set('.hero-title .line-inner', { y: 0 });
      gsap.set('.prince-word', { opacity: 1, y: 0 });
      gsap.set('.prince-attr', { opacity: 1, y: 0 });
      const emph = document.querySelector('.prince-emph');
      if (emph) emph.classList.add('in-view');
      // Counters: just write the final value
      document.querySelectorAll('[data-count]').forEach(el => {
        el.textContent = el.dataset.count;
      });
      return;
    }

    // ─── HERO ENTRANCE ───
    // Main entrance timeline — staggered, theatrical, gentle
    const heroTl = gsap.timeline({ delay: 0.25 });
    heroTl
      // Eyebrow drifts in
      .fromTo('.hero-eyebrow',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1.1, ease: 'power2.out' }
      )
      // Title lines rise from below with overlap
      .to('.hero-title .line-inner', {
        y: 0,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.14
      }, '-=0.6')
      // Subtitle fades in with slight upward drift
      .fromTo('.hero-sub',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
        '-=0.8'
      )
      // CTA buttons rise as a pair
      .fromTo('.hero-cta > *',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power2.out' },
        '-=0.7'
      )
      // Meta items fade in last, at the corners (parent shown first, items stagger)
      .set('.hero-meta', { opacity: 1 })
      .fromTo('.hero-meta-item',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power1.out' },
        '-=0.6'
      );

    // Subtle scroll-driven parallax on hero title — drifts up & fades as user scrolls down
    gsap.to('.hero-title', {
      y: -60,
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
    gsap.to('.hero-sub', {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Floating "tap" on the gold "rightly." word — a tiny breath after the entrance
    gsap.fromTo('.hero-title em',
      { opacity: 0.6 },
      {
        opacity: 1,
        duration: 2.4,
        delay: 2.3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        yoyoEase: 'sine.inOut'
      }
    );

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

    // ─── THE PRINCE (Little Prince quote) ───
    const princeStars = document.getElementById('princeStars');
    if (princeStars) {
      // Build a drifting starfield with two layers (depth)
      const totalStars = 55;
      const stars = [];
      for (let i = 0; i < totalStars; i++) {
        const s = document.createElement('div');
        s.className = 'ps';
        const isBright = Math.random() > 0.78; // ~22% bright stars
        if (isBright) s.classList.add('bright');
        const size = isBright ? 2.2 + Math.random() * 1.2 : 1 + Math.random() * 1.2;
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.width = size + 'px';
        s.style.height = size + 'px';
        princeStars.appendChild(s);
        stars.push({ el: s, bright: isBright });
      }

      // Twinkle: each star fades up & down independently
      stars.forEach(({ el, bright }) => {
        const baseOpacity = bright ? 0.7 : 0.35;
        gsap.set(el, { opacity: 0 });
        gsap.to(el, {
          opacity: baseOpacity + Math.random() * 0.25,
          duration: 2 + Math.random() * 2,
          delay: Math.random() * 2,
          ease: 'sine.inOut',
          onComplete() {
            gsap.to(el, {
              opacity: baseOpacity * 0.4 + Math.random() * baseOpacity,
              duration: 2 + Math.random() * 4,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
        });
      });

      // Slow scroll-driven drift (the whole field moves up gently as you scroll past)
      gsap.to(stars.map(s => s.el), {
        y: () => -40 - Math.random() * 80,
        ease: 'none',
        scrollTrigger: {
          trigger: '.prince',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }

    // Eyebrow + words reveal as the section enters view
    const princeTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.prince',
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });

    princeTl
      // Eyebrow fades up
      .from('.prince-eyebrow', {
        opacity: 0,
        y: 12,
        duration: 1,
        ease: 'power2.out'
      })
      // Line 1 — opening lines, fast cascading words
      .to('.prince-line-1 .prince-word', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power2.out'
      }, '-=0.4')
      // Pause, then line 2 — the heart of the quote, slower & emphasized
      .to('.prince-line-2 .prince-word', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power2.out'
      }, '+=0.3')
      // Trigger the underline on "guides" right after the word lands
      .add(() => {
        const emph = document.querySelector('.prince-emph');
        if (emph) emph.classList.add('in-view');
      }, '-=0.15')
      // Pause again, then line 3 — the personal promise
      .to('.prince-line-3 .prince-word', {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.035,
        ease: 'power2.out'
      }, '+=0.5')
      // Attribution last
      .to('.prince-attr', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '+=0.3');
  }

  // GSAP is loaded with defer — wait for window load to be safe
  if (document.readyState === 'complete') {
    initGsap();
  } else {
    window.addEventListener('load', initGsap);
  }
})();
