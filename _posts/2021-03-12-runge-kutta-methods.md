---
title: Runge-Kutta Methods
key: 20210312
tags:
- algorithm
- JavaScript
- math
- visualization
mathjax: true
---

A simple JavaScript implementation of explicit and non-adaptive Runge-Kutta methods.



<!--more-->



## Generalization

Based on the following steps from [Wikipedia](https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods), explicit and non-adaptive Runge-Kutta methods can be generalized with just different Butcher tableaux.

$$y_{n+1}=y_{n}+h\sum _{i=1}^{s}b_{i}k_{i}$$

$$\begin{aligned}k_{1}&=f(t_{n},y_{n}),\\k_{2}&=f(t_{n}+c_{2}h,y_{n}+h(a_{21}k_{1})),\\k_{3}&=f(t_{n}+c_{3}h,y_{n}+h(a_{31}k_{1}+a_{32}k_{2})),\\&\ \ \vdots \\k_{s}&=f(t_{n}+c_{s}h,y_{n}+h(a_{s1}k_{1}+a_{s2}k_{2}+\cdots +a_{s,s-1}k_{s-1})).\end{aligned}$$



## Demo

Here is a demo of the Van der Pol oscillator, i.e.,

$$\ddot{x}-\mu\left(1-x^2\right)\dot{x}+x=0$$

<div id="vdp"></div>



## Tests

Some accuracy tests:

```
rungeKutta(ode, y0, tSpan, dt = 0.1, method = "RK4")

y(t) = t^4
Euler:    y(10.0000) = 9801.00
Midpoint: y(10.0000) = 9999.50
RK4:      y(10.0000) = 10000.0
True:     y(10.0000) = 10000.0

y(t) = e^(-t)
dt=1:    y(10.0000) = 0.0000549937
dt=0.1:  y(10.0000) = 0.0000454003
dt=0.01: y(10.0000) = 0.0000453999
True:    y(10.0000) = 0.0000453999

y(t) = [cos(t), -sin(t)]
0.1, RK4: y(10.0000) = -0.839075,0.544014
True:     y(10.0000) = -0.839072,0.544021
```

<script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.58.4/plotly.min.js"></script>
<script src='/assets/20210312/runge_kutta.js'></script>
<script src='/assets/20210312/vdp.js'></script>
