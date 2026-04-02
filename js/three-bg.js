/* ── Three.js Particle Background ── */
(function () {
  var canvas = document.getElementById('three-bg');
  if (!canvas || typeof THREE === 'undefined') return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var count = 600;
  var pos = new Float32Array(count * 3);
  var vel = [];
  for (var i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - .5) * 100;
    pos[i * 3 + 1] = (Math.random() - .5) * 100;
    pos[i * 3 + 2] = (Math.random() - .5) * 50;
    vel.push({ x: (Math.random() - .5) * .015, y: (Math.random() - .5) * .015, z: (Math.random() - .5) * .008 });
  }

  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var mat = new THREE.PointsMaterial({ color: 0x000000, size: 1, sizeAttenuation: true, transparent: true, opacity: .35 });
  scene.add(new THREE.Points(geo, mat));

  var mx = 0, my = 0;
  document.addEventListener('mousemove', function (e) {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  (function animate() {
    requestAnimationFrame(animate);
    var p = geo.attributes.position.array;
    for (var i = 0; i < count; i++) {
      p[i*3] += vel[i].x; p[i*3+1] += vel[i].y; p[i*3+2] += vel[i].z;
      if (Math.abs(p[i*3]) > 50) vel[i].x *= -1;
      if (Math.abs(p[i*3+1]) > 50) vel[i].y *= -1;
      if (Math.abs(p[i*3+2]) > 25) vel[i].z *= -1;
    }
    geo.attributes.position.needsUpdate = true;
    camera.position.x += (mx * 2.5 - camera.position.x) * .02;
    camera.position.y += (my * 2.5 - camera.position.y) * .02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
