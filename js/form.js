/* ── Form → Google Sheets 연동 (Security 모듈 연동) ── */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('register-form');
  if (!form) return;

  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2fwwxWFoOfyBWHiHbUJrmh0HHLHxLyw2QNfYHBhJex8B3V6x0VcZkQmAbkqicVnts/exec';

  // 허니팟 삽입
  var S = window.Security;
  if (S && S.honeypot) S.honeypot.inject(form);
  if (S && S.timing) S.timing.markLoaded();

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var n = document.getElementById('name');
    var p = document.getElementById('phone');
    var m = document.getElementById('message');
    var btn = form.querySelector('.form-submit');
    var span = btn && btn.querySelector('span');

    // 허니팟 봇 차단
    if (S && S.honeypot && S.honeypot.isFilled(form)) return;

    // 타이밍 봇 차단
    if (S && S.timing && S.timing.isTooFast()) {
      alert('잠시 후 다시 시도해주세요.');
      return;
    }

    // 입력값 검증
    if (S && S.validate) {
      var nameR = S.validate.name(n.value);
      if (!nameR.valid) { alert(nameR.msg); n.focus(); return; }
      var phoneR = S.validate.phone(p.value);
      if (!phoneR.valid) { alert(phoneR.msg); p.focus(); return; }
      var msgR = S.validate.message(m.value);
      if (!msgR.valid) { alert(msgR.msg); m.focus(); return; }
      var nameVal = nameR.value;
      var phoneVal = phoneR.value;
      var msgVal = msgR.value;
    } else {
      if (!n.value.trim() || !p.value.trim()) { alert('이름과 연락처를 입력해주세요.'); return; }
      var nameVal = n.value.trim();
      var phoneVal = p.value.trim();
      var msgVal = (m.value || '').trim().substring(0, 500);
    }

    // 레이트 리미팅 (60초에 3회)
    if (S && S.rateLimit) {
      if (!S.rateLimit('form_submit', 60000, 3)) {
        alert('잠시 후 다시 시도해주세요. (1분에 3회 제한)');
        return;
      }
    }

    if (span) span.textContent = '전송 중...';
    if (btn) btn.disabled = true;

    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameVal, phone: phoneVal, message: msgVal })
    }).then(function () {
      if (span) span.textContent = '등록 완료!';
      if (btn) { btn.style.background = '#4a8c3f'; btn.style.color = '#fff'; }
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
