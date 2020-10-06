var camera, scene, renderer;
var geometry, material, mesh;
var container;
var t_prev = Date.now() * 0.001;
var params = { rpm_x: 7.0, rpm_y: -5.0, rpm_z: 0.0 };

init();
animate();

function init() {
  container = document.getElementById("cube");
  var width = container.clientWidth;
  var height = container.clientHeight;

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  geometry = new THREE.BoxGeometry(1, 1, 1);
  material = new THREE.MeshNormalMaterial();
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // camera
  camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
  camera.position.z = 2;

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // dat.gui
  var gui = new dat.GUI({ autoPlace: false });
  gui.add(params, "rpm_x", -10, 10).step(1);
  gui.add(params, "rpm_y", -10, 10).step(1);
  gui.add(params, "rpm_z", -10, 10).step(1);
  gui.close();
  document.getElementById("param").appendChild(gui.domElement);

  // add listener for window resize
  window.addEventListener("resize", onWindowResize);
}

// animation
function animate() {
  var t = Date.now() * 0.001;
  var dt = t - t_prev;
  t_prev = t;

  requestAnimationFrame(animate);
  mesh.rotation.x += (dt * params["rpm_x"] * Math.PI) / 30;
  mesh.rotation.y += (dt * params["rpm_y"] * Math.PI) / 30;
  mesh.rotation.z += (dt * params["rpm_z"] * Math.PI) / 30;
  renderer.render(scene, camera);
}

// reset camera and renderer on window resize
function onWindowResize() {
  var width = container.clientWidth;
  var height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
