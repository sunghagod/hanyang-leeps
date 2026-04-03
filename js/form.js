/* ── Form → Google Sheets 연동 (보안 강화) ── */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('register-form');
  if (!form) return;

  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2fwwxWFoOfyBWHiHbUJrmh0HHLHxLyw2QNfYHBhJex8B3V6x0VcZkQmAbkqicVnts/exec';
  var lastSubmit = 0;

  function sanitize(str) {
    return str.replace(/[<>"'&]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' }[c];
    }).trim();
  }

  function isValidPhone(p) {
    return /^01[0-9]-?\d{3,4}-?\d{4}$/.test(p.replace(/\s/g, ''));
  }

  function isValidName(n) {
    return n.length >= 2 && n.length <= 20 && /^[가-힣a-zA-Z\s]+$/.test(n);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = document.getElementById('name');
    var p = document.getElementById('phone');
    var m = document.getElementById('message');
    var btn = form.querySelector('.form-submit');
    var span = btn && btn.querySelector('span');

    var nameVal = sanitize(n.value);
    var phoneVal = p.value.replace(/\s/g, '');
    var msgVal = sanitize(m.value).substring(0, 500);

    if (!nameVal || !phoneVal) {
      alert('이름과 연락처를 입력해주세요.');
      return;
    }
    if (!isValidName(nameVal)) {
      alert('이름을 정확히 입력해주세요 (한글/영문 2~20자).');
      return;
    }
    if (!isValidPhone(phoneVal)) {
      alert('연락처를 정확히 입력해주세요 (예: 010-1234-5678).');
      return;
    }

    // Rate limit: 10초
    var now = Date.now();
    if (now - lastSubmit < 10000) {
      alert('잠시 후 다시 시도해주세요.');
      return;
    }
    lastSubmit = now;

    if (span) span.textContent = '전송 중...';
    if (btn) btn.disabled = true;

    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameVal,
        phone: phoneVal,
        message: msgVal
      })
    }).then(function () {
      if (span) span.textContent = '등록 완료!';
      if (btn) btn.style.background = '#4a8c3f';
      if (btn) btn.style.color = '#fff';
      setTimeout(function () {
        if (span) span.textContent = '등록하기';
        if (btn) { btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }
        form.reset();
      }, 2500);
    }).catch(function () {
      alert('전송에 실패했습니다. 다시 시도해주세요.');
      if (span) span.textContent = '등록하기';
      if (btn) btn.disabled = false;
    });
  });
});
