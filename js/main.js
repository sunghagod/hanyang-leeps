/* ── Main: Lenis, Cursor, Loader ── */
(function () {
  var lenis;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    }
  }

  function initCursor() {
    var c = document.getElementById('cursor');
    if (!c || window.innerWidth < 769) return;
    var cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    (function upd() { cx += (tx - cx) * .15; cy += (ty - cy) * .15; c.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; requestAnimationFrame(upd); })();
    var targets = document.querySelectorAll('a,button,.proj-card,.proj-row,.features__item,.footer__top-btn');
    for (var i = 0; i < targets.length; i++) {
      targets[i].addEventListener('mouseenter', function () { c.classList.add('hover'); });
      targets[i].addEventListener('mouseleave', function () { c.classList.remove('hover'); });
    }
  }

  function initLoader() {
    var loader = document.getElementById('loader');
    var bar = document.getElementById('loader-bar');
    var pct = document.getElementById('loader-pct');
    var logo = document.getElementById('loader-logo');
    var header = document.getElementById('header');

    if (!loader || !bar || !pct || !logo) { finish(); return; }

    gsap.to(logo, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', delay: .2 });
    gsap.to(pct, { opacity: 1, duration: .5, delay: .4 });

    var p = 0;
    var iv = setInterval(function () {
      p += Math.random() * 14 + 4;
      if (p > 100) p = 100;
      bar.style.width = p + '%';
      pct.textContent = 'Loading ' + Math.round(p) + '%';
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(function () {
          gsap.to(loader, { opacity: 0, duration: .7, ease: 'power3.inOut', onComplete: function () {
            loader.style.display = 'none';
            if (header) gsap.to(header, { opacity: 1, y: 0, duration: .8, ease: 'power3.out' });
            finish();
          }});
        }, 300);
      }
    }, 80);
  }

  function finish() {
    initLenis();
    initCursor();
    window.dispatchEvent(new Event('loaderDone'));
  }

  // back-top removed (footer redesigned)

  // Floating CTA visibility on scroll
  function initFloatingCta() {
    var cta = document.getElementById('floating-cta');
    if (!cta) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) cta.classList.add('visible');
      else cta.classList.remove('visible');
    });
  }

  // SFP 평형안내 탭
  function initSfpTabs() {
    var tabs = document.querySelectorAll('.sfp-tab');
    var panels = document.querySelectorAll('.sfp-panel');
    if (!tabs.length) return;
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var idx = this.getAttribute('data-fptab');
        tabs.forEach(function(t) { t.classList.remove('active'); });
        panels.forEach(function(p) { p.classList.remove('active'); });
        this.classList.add('active');
        var target = document.querySelector('.sfp-panel[data-fppanel="' + idx + '"]');
        if (target) target.classList.add('active');
      });
    });

    // 모바일: 카드 클릭 시 모달
    if (window.innerWidth <= 768) {
      // 모달 생성
      var modal = document.createElement('div');
      modal.className = 'sfp-modal';
      modal.innerHTML = '<div class="sfp-modal-backdrop"></div><div class="sfp-modal-sheet"><button class="sfp-modal-close">&times;</button><div class="sfp-modal-content"></div></div>';
      document.body.appendChild(modal);

      var backdrop = modal.querySelector('.sfp-modal-backdrop');
      var closeBtn = modal.querySelector('.sfp-modal-close');
      var content = modal.querySelector('.sfp-modal-content');

      function closeModal() { modal.classList.remove('open'); }
      backdrop.addEventListener('click', closeModal);
      closeBtn.addEventListener('click', closeModal);

      panels.forEach(function(panel) {
        panel.addEventListener('click', function() {
          content.innerHTML = '';
          var clone = panel.cloneNode(true);
          content.appendChild(clone);
          modal.classList.add('open');
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initLoader(); initFloatingCta(); initSfpTabs(); });
  } else {
    initLoader(); initFloatingCta(); initSfpTabs();
  }
})();
