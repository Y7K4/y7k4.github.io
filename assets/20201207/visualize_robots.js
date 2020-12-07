let container, camera, scene, renderer, controls;
let kinematics;
let params = {
  shoulder_pan: -50,
  shoulder_lift: -120,
  elbow: 100,
  wrist_1: 20,
  wrist_2: 90,
  wrist_3: 0,
};
let t_prev = Date.now() * 0.001;

init();
animate();

function init() {
  // container
  container = document.getElementById("canvas");
  const width = container.clientWidth;
  const height = container.clientHeight;

  // scene
  scene = new THREE.Scene();

  // grid
  scene.add(new THREE.GridHelper(1, 10));

  // hemisphere light
  scene.add(new THREE.HemisphereLight());

  // directional light (blue from above)
  scene.add(new THREE.DirectionalLight(0x56a0d3, 0.5));

  // point light (red from the front)
  const pointLight = new THREE.PointLight(0x330000);
  pointLight.position.set(0, 0.4, 3);
  scene.add(pointLight);

  // ur5
  const loader = new THREE.ColladaLoader();
  loader.load("/assets/20201207/ur5.dae", function (collada) {
    kinematics = collada.kinematics;
    dae = collada.scene;
    dae.traverse(function (child) {
      if (child.isMesh) {
        if (Array.isArray(child.material)) {
          for (m of child.material) {
            m.flatShading = true;
          }
        } else {
          child.material.flatShading = true;
        }
      }
    });
    scene.add(dae);
  });

  // camera
  camera = new THREE.PerspectiveCamera(30, width / height, 0.01, 100);
  camera.position.set(0, 1, 2);

  // renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // control
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0, 0.3, 0);
  controls.maxPolarAngle = Math.PI / 2;

  // dat.gui
  const gui = new dat.GUI({ autoPlace: false });
  gui.add(params, "shoulder_pan", -180, 180);
  gui.add(params, "shoulder_lift", -180, 180);
  gui.add(params, "elbow", -180, 180);
  gui.add(params, "wrist_1", -180, 180);
  gui.add(params, "wrist_2", -180, 180);
  gui.add(params, "wrist_3", -180, 180);
  gui.close();
  document.getElementById("param").appendChild(gui.domElement);

  // add listener for window resize
  window.addEventListener("resize", onWindowResize);
}

// animation
function animate() {
  requestAnimationFrame(animate);
  if (kinematics === undefined) {
    return;
  }
  const t = Date.now() * 0.001;
  for (p in params) {
    const joint = p + "_joint";
    const theta_prev = kinematics.getJointValue(joint);
    const theta_goal = params[p];
    let theta_curr;
    if ((t - t_prev) * 3 > 1 || Math.abs(theta_goal - theta_prev) < 0.1) {
      theta_curr = theta_goal;
    } else {
      theta_curr = theta_prev + (theta_goal - theta_prev) * (t - t_prev) * 3;
    }
    kinematics.setJointValue(joint, theta_curr);
  }
  t_prev = t;
  controls.update();
  renderer.render(scene, camera);
}

// reset camera and renderer on window resize
function onWindowResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
