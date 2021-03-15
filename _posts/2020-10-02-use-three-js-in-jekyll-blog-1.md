---
title: Use three.js in Jekyll Blog (1)
key: 20201002
tags:
- CSS
- JavaScript
- metablog
- three.js
- visualization
modify_date: 2020-10-06
---

{%- capture next_in_series -%}
  {% post_url 2020-10-05-use-three-js-in-jekyll-blog-2 %}
{%- endcapture -%}



This is the 1st post in the _Use three.js in Jekyll Blog_ series ([>>]({{next_in_series}})). In this post, I'll get started with [three.js](https://github.com/mrdoob/three.js/) by trying a simple example.



<!--more-->



<!-- Spinning Cube Demo -->
<div class='threejs'>
    <div id='cube'></div>
</div>



## Introduction

My goal is to create some fancy demos on my blog, and three.js, a popular JavaScript 3D library, can be very useful to that end. The _Use three.js in Jekyll Blog_ series will record my journey in learning three.js. Hopefully I can learn the basics of HTML, CSS and JS as well.



## Before we start

### Create a container

To resize and locate the 3D content in jekyll blog posts, we need to create a container as the canvas.

The simplest example looks like this:
```html
<div id='cube'></div>
```

This is a common way I found to maintain the aspect ratio. Here the outer div controls the aspect ratio, while the inner div holds the 3D content. A more elegant way is shown [here]({{next_in_series}}).
```css
.threejs {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
}
.threejs > * {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
```
```html
<div class='threejs'>
    <div id='cube'></div>
</div>
```

Note that the inner div's id will be used to get container's width and height while initialzing three.js.
```javascript
var container = document.getElementById('cube');
var width = container.clientWidth;
var height = container.clientHeight;
```

~~**TODO**: make this responsive in three.js, i.e., automatically resize the content when the window is resized.~~

Learn [how to make this responsive in three.js]({{next_in_series}}#threejs-on-window-resize), i.e., automatically resize the content when the window is resized.



### Include the library

This can be done by adding the following line
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
```
where the src comes from CDN or a local copy of the minified library.

**TODO**: control this in the front matter like [other Markdown enhancements](https://tianqi.name/jekyll-TeXt-theme/docs/en/markdown-enhancements).



## Hello, cube!

The spinning cube demo is originally obtained from [here](https://github.com/mrdoob/three.js/blob/dev/README.md) and a great explaination can be found [here](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene). Essentially, we need to set up three things: scene, camera and renderer to display the 3D content using three.js.



### Scene

Here is a unit cube.
```javascript
// scene
scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
geometry = new THREE.BoxGeometry(1, 1, 1);
material = new THREE.MeshNormalMaterial();
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```



### Camera

Here is a perspective camera. `70` is the field of view (FOV) in degrees, `width / height` is the aspect ratio, `0.01` is the near clipping plane, and `10` is the far clipping plane.
```javascript
// camera
camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
camera.position.z = 2;
```



### Renderer

Here is a WebGL renderer. Don't forget to append it as the container's child.
```javascript
// renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);
```

**TODO**: `antialias: true` does not work on my phone. To be investigated. Try [this](https://github.com/mrdoob/three.js/issues/7655)?



### Animation

Here is the so-called render or animate loop.
```javascript
// animation
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
```



<!-- code -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
<link rel="stylesheet" href="/assets/20201002/style.css">
<script src='/assets/20201002/cube.js'></script>
