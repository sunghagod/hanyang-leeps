/* ── Form (console.log only) ── */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('register-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = document.getElementById('name');
    var p = document.getElementById('phone');
    var m = document.getElementById('message');
    console.log('=== 관심고객 등록 ===');
    console.log('이름:', n ? n.value : '');
    console.log('연락처:', p ? p.value : '');
    console.log('문의내용:', m ? m.value : '');
    console.log('시간:', new Date().toISOString());
    var btn = form.querySelector('.form-submit');
    var span = btn && btn.querySelector('span');
    if (span) {
      var orig = span.textContent;
      span.textContent = '등록 완료!';
      btn.style.background = '#333';
      setTimeout(function () { span.textContent = orig; btn.style.background = ''; form.reset(); }, 2000);
    }
  });
});
