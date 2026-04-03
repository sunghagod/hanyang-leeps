/* ── Lightbox for community images ── */
(function () {
  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = '<div class="lightbox__backdrop"></div><div class="lightbox__wrap"><img class="lightbox__img" src="" alt=""><button class="lightbox__close">&times;</button></div>';
  document.body.appendChild(overlay);

  var img = overlay.querySelector('.lightbox__img');
  var backdrop = overlay.querySelector('.lightbox__backdrop');
  var closeBtn = overlay.querySelector('.lightbox__close');

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  document.querySelectorAll('[data-lightbox]').forEach(function (card) {
    card.addEventListener('click', function () {
      var cardImg = this.querySelector('img');
      if (cardImg) open(cardImg.src, cardImg.alt);
    });
  });
})();
