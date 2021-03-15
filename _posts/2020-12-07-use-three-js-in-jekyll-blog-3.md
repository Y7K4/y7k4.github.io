---
title: Use three.js in Jekyll Blog (3)
key: 20201207
tags:
- JavaScript
- metablog
- robotics
- three.js
- visualization
---

{%- capture prev_in_series -%}
  {% post_url 2020-10-05-use-three-js-in-jekyll-blog-2 %}
{%- endcapture -%}



This is the 3rd post in the _Use three.js in Jekyll Blog_ series ([<<]({{prev_in_series}})). Here you can see a robot (UR5) in my blog for the first time, and it can be used for various demos, for example, inverse kinematics, trajectory planning, etc.



<!--more-->



## Demo

<div id="canvas" style="--aspect-ratio: 16/9">
  <div id="param" class="dat-gui"></div>
</div>

Change the view angle with your mouse, and change joint angles on the control panel.



## Download 3D model

Here I use the [UR5](https://www.universal-robots.com/products/ur5-robot/) model for demostration. The model can be obtained from [ros-industrial/unirersal_robot](https://github.com/ros-industrial/universal_robot).

```bash
cd ~/catkin_ws/src/
git clone https://github.com/ros-industrial/universal_robot
cd universal_robot/ur_description/urdf/
```



## Convert 3D model

[Many 3D model loaders](https://github.com/mrdoob/three.js/tree/dev/examples/js/loaders) are provided by three.js, but unfortunately, the URDF format, which is widely used in ROS, is not officially supported. The workaround is to convert the URDF format to the COLLADA format for loading.

1. From `.xacro` to `.urdf`
```bash
rosrun xacro xacro -o ur5.urdf ur5_joint_limited_robot.urdf.xacro
```
2. From `.urdf` to `.dae`
```bash
sudo apt install ros-noetic-collada-urdf
rosrun collada_urdf urdf_to_collada ur5.urdf ur5.dae
```

Now `ur5.dae` is ready.



## Load 3D model

Here is the code to load `ur5.dae`.

```javascript
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
```

* Set `flatShading = true`, otherwise the model is black.
* Iterate through `child.material` to set if it is an array, otherwise the model is black.
* Do not change `MeshPhongMaterial` to `MeshLambertMaterial`, otherwise the model is black.
* Add `HemisphereLight` into the scene, otherwise the model is black.

You can probably see how many times I end up with a complete black UR5 model :tired_face:



## Get/Set joint angles

In the previous section, when we load the material, we also obtain the `kinematics` to access joint angles.

* `kinematics.getJointValue(joint_name)`
* `kinematics.setJointValue(joint_name, joint_value)`

I use these methods to create a short animation - a simple proportional control that drives the joint angles to desired values.



<!-- code -->
<script src="https://unpkg.com/three/build/three.min.js"></script>
<script src="https://unpkg.com/dat.gui/build/dat.gui.min.js"></script>
<script src="https://unpkg.com/three/examples/js/loaders/ColladaLoader.js"></script>
<script src="https://unpkg.com/three/examples/js/controls/OrbitControls.js"></script>
<link rel="stylesheet" href="/assets/share/style.css">
<script src='/assets/20201207/visualize_robots.js'></script>
