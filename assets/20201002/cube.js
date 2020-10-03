var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();

function init() {
  var container = document.getElementById("cube");
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
}

// animation
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
