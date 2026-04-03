/* ── Pinch Zoom for map image ── */
(function () {
  var wrap = document.getElementById('pinch-zoom-wrap');
  var img = document.getElementById('pinch-zoom-img');
  if (!wrap || !img) return;

  var scale = 1, lastScale = 1;
  var posX = 0, posY = 0, lastPosX = 0, lastPosY = 0;
  var startDist = 0, startX = 0, startY = 0;
  var minScale = 1, maxScale = 4;

  function getDist(t) {
    var dx = t[0].clientX - t[1].clientX;
    var dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getMid(t) {
    return {
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2
    };
  }

  function clampPos() {
    if (scale <= 1) { posX = 0; posY = 0; return; }
    var rect = wrap.getBoundingClientRect();
    var maxX = (rect.width * (scale - 1)) / 2;
    var maxY = (rect.height * (scale - 1)) / 2;
    posX = Math.max(-maxX, Math.min(maxX, posX));
    posY = Math.max(-maxY, Math.min(maxY, posY));
  }

  function update() {
    img.style.transform = 'translate(' + posX + 'px,' + posY + 'px) scale(' + scale + ')';
  }

  wrap.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      startDist = getDist(e.touches);
      lastScale = scale;
      var mid = getMid(e.touches);
      startX = mid.x; startY = mid.y;
      lastPosX = posX; lastPosY = posY;
    } else if (e.touches.length === 1 && scale > 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      lastPosX = posX; lastPosY = posY;
    }
  }, { passive: false });

  wrap.addEventListener('touchmove', function (e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      var dist = getDist(e.touches);
      scale = Math.max(minScale, Math.min(maxScale, lastScale * (dist / startDist)));
      var mid = getMid(e.touches);
      posX = lastPosX + (mid.x - startX);
      posY = lastPosY + (mid.y - startY);
      clampPos();
      update();
    } else if (e.touches.length === 1 && scale > 1) {
      e.preventDefault();
      posX = lastPosX + (e.touches[0].clientX - startX);
      posY = lastPosY + (e.touches[0].clientY - startY);
      clampPos();
      update();
    }
  }, { passive: false });

  wrap.addEventListener('touchend', function () {
    if (scale < 1.05) { scale = 1; posX = 0; posY = 0; update(); }
  });

  // 더블탭으로 줌인/아웃
  var lastTap = 0;
  wrap.addEventListener('touchend', function (e) {
    if (e.touches.length > 0) return;
    var now = Date.now();
    if (now - lastTap < 300) {
      e.preventDefault();
      if (scale > 1) {
        scale = 1; posX = 0; posY = 0;
      } else {
        scale = 2.5;
      }
      update();
    }
    lastTap = now;
  });
})();
