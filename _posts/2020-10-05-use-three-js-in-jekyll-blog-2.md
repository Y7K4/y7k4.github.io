---
title: Use three.js in Jekyll Blog (2)
key: 20201005
tags:
- CSS
- dat.gui.js
- JavaScript
- metablog
- three.js
- visualization
modify_date: 2020-12-07
---

{%- capture prev_in_series -%}
  {% post_url 2020-10-02-use-three-js-in-jekyll-blog-1 %}
{%- endcapture -%}

{%- capture next_in_series -%}
  {% post_url 2020-12-07-use-three-js-in-jekyll-blog-3 %}
{%- endcapture -%}



This is the 2nd post in the _Use three.js in Jekyll Blog_ series ([<<]({{prev_in_series}}) - [>>]({{next_in_series}})), introducing
1. fixed aspect ratio;
2. [three.js](https://github.com/mrdoob/three.js/) on window resize;
3. [dat.gui.js](https://github.com/dataarts/dat.gui) for control panel.



<!--more-->



<!-- Spinning Cube Demo -->
<div id="cube" style="--aspect-ratio:16/9;">
  <div id="param" class="dat-gui">
  </div>
</div>

Try to resize the window and change the parameters!



## Fixed aspect ratio

Inspired by [this](https://css-tricks.com/aspect-ratio-boxes/#using-custom-properties), I found a new method to embed [three.js](https://github.com/mrdoob/three.js/) content as well as [dat.gui.js](https://github.com/dataarts/dat.gui) panel in Jekyll blog.

Using this method, the HTML side can be simple, readable and customizable. Users can fix the aspect ratio by setting the custom property called `aspect-ratio`, which is `16:9` in the following example.

{% highlight html %}
<div id="cube" style="--aspect-ratio:16/9;">
</div>
{% endhighlight %}

The following CSS snippet does the magic under the hood, and is now in `/assets/share/style.css`.

{% highlight css %}
[style*="--aspect-ratio"] {
  position: relative;
}
[style*="--aspect-ratio"]::before {
  content: "";
  display: block;
  padding-bottom: calc(100% / (var(--aspect-ratio)));
}
[style*="--aspect-ratio"] > * {
  position: absolute;
  top: 0;
  bottom: 0;
}
{% endhighlight %}



## three.js on window resize

When the user resizes the window, the div size can automatically update using the CSS above, but the three.js side also needs to update. This can be accomplished by an event listener as follows.

{% highlight javascript %}
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  var width = container.clientWidth;
  var height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
{% endhighlight %}



## dat.gui.js for control panel

[dat.gui.js](https://github.com/dataarts/dat.gui) can create a control panel and enable users to adjust parameters and immediately see the feedback. This kind of interactive experience is critical in a fancy demo.

Add a div inside the div with fixed aspect ratio.

{% highlight html %}
<div id="cube" style="--aspect-ratio:16/9;">
  <div id="param" class="dat-gui">
  </div>
</div>
{% endhighlight %}

Use the following CSS to locate the control panel at the top-right corner. The `.dg` part is necessary here due to a conflict between dat.gui.js and TeXt theme. This CSS snippet is also in `/assets/share/style.css` now.

{% highlight css %}
.dat-gui {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}
.dg {
  padding: 0; /* overwrite padding of .main */
}
{% endhighlight %}

Create the control panel and define all the parameters. Due to [this bug](https://github.com/dataarts/dat.gui/issues/261), I have to call `close()` to close the control panel after initialization.

{% highlight javascript %}
var params = { rpm_x: 7.0, rpm_y: -5.0, rpm_z: 0.0 };
var gui = new dat.GUI({ autoPlace: false });
gui.add(params, "rpm_x", -10, 10).step(1);
gui.add(params, "rpm_y", -10, 10).step(1);
gui.add(params, "rpm_z", -10, 10).step(1);
gui.close();
document.getElementById("param").appendChild(gui.domElement);
{% endhighlight %}



<!-- code -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.min.js"></script>
<link rel="stylesheet" href="/assets/share/style.css">
<script src='/assets/20201005/cube.js'></script>
