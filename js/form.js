/* ── Form → Google Sheets 연동 ── */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('register-form');
  if (!form) return;

  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2fwwxWFoOfyBWHiHbUJrmh0HHLHxLyw2QNfYHBhJex8B3V6x0VcZkQmAbkqicVnts/exec';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = document.getElementById('name');
    var p = document.getElementById('phone');
    var m = document.getElementById('message');
    var btn = form.querySelector('.form-submit');
    var span = btn && btn.querySelector('span');

    if (!n.value.trim() || !p.value.trim()) {
      alert('이름과 연락처를 입력해주세요.');
      return;
    }

    if (span) span.textContent = '전송 중...';
    if (btn) btn.disabled = true;

    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: n.value,
        phone: p.value,
        message: m.value
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
