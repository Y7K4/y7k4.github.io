---
title: Random Sampling on SO(3)
key: 20201016
tags:
- math
- robotics
- three.js
mathjax: true
---

This post introduces random sampling on the 3D rotation group SO(3), which can be useful in robotics or other applications, but is also error-prone. Visualization and explanation of two correct methods and two wrong ones are included.



<!--more-->



## Before you read

If you just want to find a correct and elegant algorithm and save some time, directly jump to [this section](#quaternion) or [this link](http://planning.cs.uiuc.edu/node198.html).



## Introduction

Random sampling on $\mathrm{SO}(2)$ is easy. For example,

$$R = \begin{bmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{bmatrix} \in \mathrm{SO}(2)$$

with $\theta \sim \mathcal{U}(0, 2\pi)$ works. This easiness, in my opinion, comes from this concept: uniform random angles yield uniform random 2D rotations. Unfortunately, this concept only works for 2D. For higher dimensions, the [Haar measure](https://en.wikipedia.org/wiki/Haar_measure) should be used for randomness.

In this post, I will show two typical wrong methods for random sampling on $\mathrm{SO}(3)$, and also introduce two correct ones. The following sections are organized based on various representations. You can probably see the pattern that when angles appear in the representation, people tend to make mistakes. Actually, I've seen similar mistakes in many open source repositories, and this is one of the reasons why I want to write this post.

By the way, it is still possible to correct the wrong methods, but that requires sampling angles in a specific distribution, which is harder to implement and not encouraged.



## Demo

<!-- samples -->
<div id="samples" style="--aspect-ratio: 16/9">
  <div id="param" class="dat-gui"></div>
</div>

Try different methods and the number of points in the control panel.

Numerically testing the randomness is actually even harder than implementing the algorithms. An alternative is to apply random 3D rotations to a 3D vector, and see if the resulting points are uniformly distributed on a sphere. Here in the demo I visualize all the points coming from the vector $[1, 0, 0]^T$, which is at least sufficient to show that the "Euler" and "AxisAngle" methods are incorrect.



## Sampling methods

### Euler angles

A common but wrong method with the Euler angles:

$$R(\alpha, \beta, \gamma) = R_z(\alpha) R_y(\beta) R_x(\gamma) \in \mathrm{SO}(3)$$

where $\alpha \sim \mathcal{U}(-\pi, \pi)$, $\beta \sim \mathcal{U}(-\pi/2, \pi/2)$ and $\gamma \sim \mathcal{U}(-\pi, \pi)$ (i.i.d.). To intuitively understand why this method does not generate uniform random 3D rotations, consider the singularities: if the pitch angle $\beta$ is close to $\pm\pi/2$, then $\alpha$ and $\gamma$ will have almost the same contribution to $R$, resulting in many redundant samples around the singularities. You can verify in the demo that the blue and yellow (close to the blue $z$-axis) points are denser.

{% highlight javascript %}
case "Euler":
  var yaw = rand(-PI, PI);
  var pitch = rand(-PI / 2, PI / 2);
  var roll = rand(-PI, PI);
  var euler = new THREE.Euler(yaw, pitch, roll, "ZYX");
  return new THREE.Quaternion().setFromEuler(euler);
{% endhighlight %}



### Axis-angle

A less common but also wrong method with axis-angle representation:

$$R(\mathbf{v}, \theta) \in \mathrm{SO}(3)$$

where we pick a uniform random axis $\mathbf{v} \in \mathbb{S}^2$ and an angle $\theta \sim \mathcal{U}(-\pi, \pi)$. Again, consider the singularities: if the angle $\theta$ is close to zero, then $R$ is almost the same regardless of $\mathbf{v}$; if the angle $\theta$ is close to $\pm\pi$, then $R$ can be drastically different depending on $\mathbf{v}$. Therefore, the red points (close to the red $x$-axis) are denser.

{% highlight javascript %}
case "AxisAngle":
  var axis = new THREE.Vector3(randn(), randn(), randn()).normalize();
  var angle = rand(-PI, PI);
  return new THREE.Quaternion().setFromAxisAngle(axis, angle);
{% endhighlight %}

PS: Random sampling on $\mathbb{S}^2$ can be done in this way:

$$\mathbf{v} = \frac{1}{\sqrt{v_1^2 + v_2^2 + v_3^2}} \begin{bmatrix}v_1 \\ v_2 \\ v_3\end{bmatrix}$$

where $v_1, v_2, v_3 \sim \mathcal{N}(0, 1)$ (i.i.d.). This method can be extended to higher dimensions.

PPS: It seems that there is no existing `randn()` function in JavaScript's built-in math library and [math.js](https://mathjs.org/), so I implement it using the [Box-Muller transform](https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform):

$$z_0 = \sqrt{-2\ln u_1} \cos (2\pi u_2),\quad z_1 = \sqrt{-2\ln u_1} \sin (2\pi u_2) \sim \mathcal{N}(0, 1)$$

where $u_1, u_2 \sim \mathcal{U}(0, 1)$ (i.i.d.).



### Rotation matrix

This method using rotation matrix is very classical and easy to understand. Recall how we did random sampling on $\mathbb{S}^2$ in the previous section. This time we start with a 3-by-3 matrix whose entries are all independent standard normal random variables. Then we use the [Gram-Schmidt process](https://en.wikipedia.org/wiki/Gram%E2%80%93Schmidt_process) to orthonormalize three column vectors. Equivalently, we can apply the [QR decomposition](https://en.wikipedia.org/wiki/QR_decomposition) to get the orthogonal matrix. (Here the common notation $A = QR$ can be a little confusing because $Q$ is orthogonal and $R$ is upper triangular.) The spatial symmetry can guarantee the uniform randomness of the resulting matrix.

However, this algorithm has two problems:

1. This is actually sampling on $\mathrm{O}(3)$ instead of $\mathrm{SO}(3)$. To fix this, flip the sign when the matrix determinant is $-1$.
2. The QR decomposition is not unique. For example, $A = QR = (-Q)(-R)$. The actual implementation of this decomposition may prefer some kind of orthogonal matrices and make your results not uniformly distributed. I had this issue when using MATLAB (but math.js seems ok). To fix this, make sure the diagonal elements of the upper triangular matrix are all positive (see line 10).

{% highlight javascript linenos %}
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
{% endhighlight %}



### Quaternion

The quaternion

$$h = (\sqrt{1-u_1}\sin(2\pi u_2), \sqrt{1-u_1}\cos(2\pi u_2), \sqrt{u_1}\sin(2\pi u_3), \sqrt{u_1}\cos(2\pi u_3))$$

with $u_1, u_2, u_3 \in \mathcal{U}(0, 1)$ (i.i.d.) generates uniform random elements in $\mathrm{SO}(3)$. This algorithm is my favorite one. Only three random variables, only uniform distribution involved, and directly in quaternion form.

{% highlight javascript %}
case "Quaternion":
  var u1 = rand(0, 1);
  var u2 = rand(0, 1);
  var u3 = rand(0, 1);
  var x = Math.sqrt(1 - u1) * Math.sin(2 * PI * u2);
  var y = Math.sqrt(1 - u1) * Math.cos(2 * PI * u2);
  var z = Math.sqrt(u1) * Math.sin(2 * PI * u3);
  var w = Math.sqrt(u1) * Math.cos(2 * PI * u3);
  return new THREE.Quaternion(x, y, z, w);
{% endhighlight %}

An intuitive explanation can be found [here](http://planning.cs.uiuc.edu/node198.html) and a comprehensive one can be found [here](https://doc.lagout.org/Others/Game%20Development/Programming/Graphics%20Gems%203.pdf#page=156) (this is probably where it was proposed). I will not go through the derivation step by step here, but I would like to talk about its origin: [the subgroup algorithm](https://statweb.stanford.edu/~cgates/PERSI/papers/subgroup-rand-var.pdf). Essentially, the "quaternion" method is the subroup algorithm with brilliant simplification for the case of $\mathrm{SO}(3)$.

The subgroup algorithm itself can handle $\mathrm{SO}(n)$ with higher dimensions and even other compact groups. A rough analogy is how you would do random sampling in a unit cube: pick a random $x$ in a unit segment, then a random $y$ to get $(x, y)$ in a unit square, then a random $z$ to get $(x, y, z)$ in a unit cube. Using fancy language, the idea is to go through a nested subgroup chain by choosing a random coset representative at every step. In the case of going from $\mathrm{SO}(2)$ to $\mathrm{SO}(3)$, imagine you first do a random rotation about $z$-axis (a random element in $\mathrm{SO}(2)$), and then rotate the $z$-axis to a random direction (a random coset representative). The latter rotation can be done by a [Householder transformation](https://en.wikipedia.org/wiki/Householder_transformation) followed by a negation to flip the determinant from $-1$ to $+1$.

PS: It is also possible to use uniform random elements of $\mathbb{S}^3$ as quaternions. This is easier to understand, but only works for $\mathrm{SO}(3)$.



## More details

This post is more about the visualization and intuitive explanation rather than rigorous derivation. Please refer to the links above and the reference [here](https://en.wikipedia.org/wiki/Rotation_matrix#Uniform_random_rotation_matrices) for further reading on group structures, the Haar measure, etc. In implementation, it would be also good to consider numerical issues. For example, discard $u_1=0$ in the Box-Muller transform. (I ignored most of these due to my laziness...)



<!-- code -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/7.5.1/math.min.js"></script>
<link rel="stylesheet" href="/assets/share/style.css">
<script src='/assets/20201016/random_sampling_on_so_3.js'></script>
