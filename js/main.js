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
      if (window.scrollY > 400) { cta.classList.add('visible'); }
      else { cta.classList.remove('visible'); }
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

    // 모바일: 카드 클릭 시 모달 (항상 생성, 클릭 시점에 모바일 여부 판단)
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
        if (window.innerWidth > 768) return;
        content.innerHTML = '';
        var clone = panel.cloneNode(true);
        content.appendChild(clone);
        modal.classList.add('open');
      });
    });
  }

  // 단지 배치도 풀스크린 핀치줌
  function initSiteplanZoom() {
    var trigger = document.getElementById('siteplan-zoom-trigger');
    var modal   = document.getElementById('sp-zoom-modal');
    var backdrop = document.getElementById('sp-zoom-backdrop');
    var closeBtn = document.getElementById('sp-zoom-close');
    var wrap    = document.getElementById('sp-zoom-wrap');
    var img     = document.getElementById('sp-zoom-img');
    if (!trigger || !modal || !img) return;

    var scale = 1, posX = 0, posY = 0;
    var lastScale = 1, lastPosX = 0, lastPosY = 0;
    var startDist = 0, startMidX = 0, startMidY = 0;
    var dragStartX = 0, dragStartY = 0, isDragging = false;
    var minScale = 1, maxScale = 5;

    function getDist(t) {
      var dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
    function clamp() {
      if (scale <= 1) { posX = 0; posY = 0; return; }
      var mxX = (wrap.offsetWidth  * (scale - 1)) / 2;
      var mxY = (wrap.offsetHeight * (scale - 1)) / 2;
      posX = Math.max(-mxX, Math.min(mxX, posX));
      posY = Math.max(-mxY, Math.min(mxY, posY));
    }
    function applyTransform() {
      img.style.transform = 'translate(' + posX + 'px,' + posY + 'px) scale(' + scale + ')';
    }
    function resetZoom() { scale = 1; posX = 0; posY = 0; applyTransform(); }

    function openModal() {
      resetZoom();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(resetZoom, 300);
    }

    trigger.addEventListener('click', openModal);
    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // 터치: 핀치줌 + 드래그
    wrap.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        startDist = getDist(e.touches);
        lastScale = scale; lastPosX = posX; lastPosY = posY;
        startMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        startMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      } else if (e.touches.length === 1) {
        dragStartX = e.touches[0].clientX - posX;
        dragStartY = e.touches[0].clientY - posY;
      }
    }, { passive: false });

    wrap.addEventListener('touchmove', function(e) {
      e.preventDefault();
      if (e.touches.length === 2) {
        var dist = getDist(e.touches);
        scale = Math.max(minScale, Math.min(maxScale, lastScale * (dist / startDist)));
        var midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        var midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        posX = lastPosX + (midX - startMidX);
        posY = lastPosY + (midY - startMidY);
        clamp(); applyTransform();
      } else if (e.touches.length === 1 && scale > 1) {
        posX = e.touches[0].clientX - dragStartX;
        posY = e.touches[0].clientY - dragStartY;
        clamp(); applyTransform();
      }
    }, { passive: false });

    // 더블탭 줌인/아웃
    var lastTap = 0;
    wrap.addEventListener('touchend', function(e) {
      if (e.touches.length > 0) return;
      if (scale < 1.05) { scale = 1; posX = 0; posY = 0; applyTransform(); }
      var now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault();
        scale > 1 ? resetZoom() : (scale = 2.5, applyTransform());
      }
      lastTap = now;
    });

    // 마우스 휠 줌 (데스크탑)
    wrap.addEventListener('wheel', function(e) {
      e.preventDefault();
      var delta = e.deltaY > 0 ? 0.85 : 1.15;
      scale = Math.max(minScale, Math.min(maxScale, scale * delta));
      clamp(); applyTransform();
    }, { passive: false });

    // 마우스 드래그 (데스크탑)
    wrap.addEventListener('mousedown', function(e) {
      if (scale <= 1) return;
      isDragging = true;
      dragStartX = e.clientX - posX;
      dragStartY = e.clientY - posY;
      wrap.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      posX = e.clientX - dragStartX;
      posY = e.clientY - dragStartY;
      clamp(); applyTransform();
    });
    window.addEventListener('mouseup', function() {
      isDragging = false;
      wrap.style.cursor = '';
    });

    // ESC 키
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initLoader(); initFloatingCta(); initSfpTabs(); initSiteplanZoom(); });
  } else {
    initLoader(); initFloatingCta(); initSfpTabs(); initSiteplanZoom();
  }
})();
