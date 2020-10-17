var camera, scene, renderer;
var points, xAxis, yAxis, zAxis;
var container, requestID;
var params = { nPoints: 8000, method: "Euler" };

init();
animate();

function randomQuaternion() {
  const PI = Math.PI;

  switch (params.method) {
    case "Euler":
      var yaw = rand(-PI, PI);
      var pitch = rand(-PI / 2, PI / 2);
      var roll = rand(-PI, PI);
      var euler = new THREE.Euler(yaw, pitch, roll, "ZYX");
      return new THREE.Quaternion().setFromEuler(euler);

    case "AxisAngle":
      var axis = new THREE.Vector3(randn(), randn(), randn()).normalize();
      var angle = rand(-PI, PI);
      return new THREE.Quaternion().setFromAxisAngle(axis, angle);

    case "RotationMatrix":
      var a = math.matrix([
        [randn(), randn(), randn()],
        [randn(), randn(), randn()],
        [randn(), randn(), randn()],
      ]);
      var qr = math.qr(a);
      var q = qr.Q;
      var r = qr.R;
      q = math.multiply(q, math.diag(math.sign(math.diag(r))));
      if (math.det(q) < 0) {
        q = math.multiply(q, -1);
      }
      q.resize([4, 4]);
      var rot = new THREE.Matrix4().fromArray(q.valueOf().flat());
      return new THREE.Quaternion().setFromRotationMatrix(rot);

    case "Quaternion":
      var u1 = rand(0, 1);
      var u2 = rand(0, 1);
      var u3 = rand(0, 1);
      var x = Math.sqrt(1 - u1) * Math.sin(2 * PI * u2);
      var y = Math.sqrt(1 - u1) * Math.cos(2 * PI * u2);
      var z = Math.sqrt(u1) * Math.sin(2 * PI * u3);
      var w = Math.sqrt(u1) * Math.cos(2 * PI * u3);
      return new THREE.Quaternion(x, y, z, w);

    default:
      alert("Invalid method.");
  }
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randn() {
  var u1 = 0,
    u2 = 0;
  while (u1 === 0) {
    u1 = Math.random();
    u2 = Math.random();
  }

  // Box-Muller transform
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

function init() {
  container = document.getElementById("samples");
  var width = container.clientWidth;
  var height = container.clientHeight;

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 1.5, 5);

  // camera
  camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
  camera.position.z = 2;

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, width: 500 });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  var geometry, material;

  // x axis
  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(1, 0, 0));
  material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 3 });
  xAxis = new THREE.Line(geometry, material);
  scene.add(xAxis);

  // y axis
  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 1, 0));
  material = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 3 });
  yAxis = new THREE.Line(geometry, material);
  scene.add(yAxis);

  // z axis
  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 0, 1));
  material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 3 });
  zAxis = new THREE.Line(geometry, material);
  scene.add(zAxis);

  // generate points
  generatePoints();

  // dat-gui
  var gui = new dat.GUI({ autoPlace: false, width: 285 });
  gui
    .add(params, "method", [
      "Euler",
      "AxisAngle",
      "RotationMatrix",
      "Quaternion",
    ])
    .onFinishChange(generatePoints);
  gui.add(params, "nPoints", 1000, 15000).step(1000).onFinishChange(generatePoints);
  gui.close();
  document.getElementById("param").appendChild(gui.domElement);

  // resize
  window.addEventListener("resize", onWindowResize);
}

function animate() {
  requestID = requestAnimationFrame(animate);

  var time = Date.now() * 0.001;

  points.rotation.x = time * 0.25;
  xAxis.rotation.x = time * 0.25;
  yAxis.rotation.x = time * 0.25;
  zAxis.rotation.x = time * 0.25;

  points.rotation.y = time * 0.5;
  xAxis.rotation.y = time * 0.5;
  yAxis.rotation.y = time * 0.5;
  zAxis.rotation.y = time * 0.5;

  renderer.render(scene, camera);
}

function generatePoints() {
  scene.remove(points);
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var colors = [];
  var color = new THREE.Color();

  for (var i = 0; i < params.nPoints; i++) {
    var vec = new THREE.Vector3(1, 0, 0);
    vec.applyQuaternion(randomQuaternion());
    positions.push(vec.x, vec.y, vec.z);

    color.setRGB(vec.x / 2 + 0.5, vec.y / 2 + 0.5, vec.z / 2 + 0.5);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  var material = new THREE.PointsMaterial({
    size: 0.015,
    vertexColors: THREE.VertexColors,
  });
  points = new THREE.Points(geometry, material);
  scene.add(points);
}

function onWindowResize() {
  var width = container.clientWidth;
  var height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
