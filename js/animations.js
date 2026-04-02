/* ── GSAP ScrollTrigger — shed.design style ── */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  window.addEventListener('loaderDone', function () {
    // Hero title
    gsap.from('.hero__title', { y: 60, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.1 });
    gsap.from('.hero__marquee', { opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 });
    gsap.from('.hero__bottom', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.6 });

    // Section labels
    document.querySelectorAll('.section__label').forEach(function (el) {
      gsap.from(el, { opacity: 0, x: -20, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } });
    });

    // Intro text
    gsap.from('.intro__text', { opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.intro__text', start: 'top 82%', toggleActions: 'play none none none' } });

    // Reel
    gsap.from('.reel__media', { opacity: 0, scale: 0.96, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.reel__media', start: 'top 85%', toggleActions: 'play none none none' } });
    gsap.from('.reel__info', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.reel__info', start: 'top 85%', toggleActions: 'play none none none' } });

    // Services massive text
    document.querySelectorAll('.services__list li').forEach(function (li, i) {
      gsap.from(li, { opacity: 0, x: 60, duration: 0.9, ease: 'power4.out', delay: i * 0.12,
        scrollTrigger: { trigger: '.services__list', start: 'top 80%', toggleActions: 'play none none none' } });
    });

    // Selected list items
    document.querySelectorAll('.selected__col li').forEach(function (li, i) {
      gsap.from(li, { opacity: 0, y: 15, duration: 0.5, ease: 'power3.out', delay: i * 0.06,
        scrollTrigger: { trigger: li, start: 'top 92%', toggleActions: 'play none none none' } });
    });

    // Update cards
    document.querySelectorAll('.update-card').forEach(function (card, i) {
      gsap.from(card, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: i * 0.15,
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' } });
    });

    // Register form
    gsap.from('.register__form', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.register', start: 'top 80%', toggleActions: 'play none none none' } });

    // Footer big text
    gsap.from('.footer__big-text', { opacity: 0, y: 40, duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: '.footer__big', start: 'top 90%', toggleActions: 'play none none none' } });
    gsap.from('.footer__arrow', { opacity: 0, x: -20, duration: 0.8, ease: 'power3.out', delay: 0.2,
      scrollTrigger: { trigger: '.footer__big', start: 'top 90%', toggleActions: 'play none none none' } });

    ScrollTrigger.refresh();
  });
})();
