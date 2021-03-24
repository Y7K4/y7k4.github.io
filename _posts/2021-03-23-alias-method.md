---
title: Alias Method
key: 20210323
tags:
- algorithm
- JavaScript
- visualization
mathjax: true
---

This post introduces the alias method for efficient sampling from a finite discrete probability distribution. After preprocessing, it takes constant time to draw random values.



<!--more-->



## Problem

Given an array of probabilities `p[0..n-1]`, generate random values `i` with the probability `p[i]`.



## Before we get there

### Uniform distribution

Let's get started with a simple example where `p = [0.2, 0.2, 0.2, 0.2, 0.2]`. The sampling is equivalent to randomly drop a pin in the following horizontal bars, and select the corresponding index.

<div id="div-1"></div>

As all the probabilities are equal, a simple solution would be `Math.floor(Math.random() * 5)`.



### A small variation

Now let's add a small variation by setting `p = [0.3, 0.2, 0.2, 0.2, 0.1]`.

<div id="div-2"></div>

Apparently the previous solution will not work here, but it is already close. A quick fix is to add one more step: if the outcome is 4, change it to 0 with a probability of 50%. This idea can be illustrated as the following figure.

<div id="div-3"></div>



## Alias method

### Overview

Now you should understand the rough idea of the alias method: first assume all the probabilities are the same, then add a few "patches" to compensate the difference. In the previous example, the "patch" for the outcome 4 is determined by the probability 50% and the alias 0. In fact, if we extend this to every outcome and create a probability table `U[0..n-1]` and an alias table `K[0..n-1]`, we can sample from arbitrary finite discrete distribution.

The sampling works as follows:
1. Generate a uniformly random `i` from `0` to `n-1`
2. Return `i` with a probability of `U[i]`, and return `K[i]` otherwise



### Table generation

Note that the tables for a given `p` is not unique, and there are [various ways to generate](https://en.wikipedia.org/wiki/Alias_method#Table_generation). In general, each time from the probability table we select one above average and one below average, fill the smaller one to average using the larger one (this may let the larger one drop below average) and mark the latter as the alias, until all probabilities are equal.

Try the visualization below to understand. Note that here I followed the convention to multiply all probabilities by `n`, so the average should be `1` instead of `1/n`.

<button class="button button--info button--pill" onclick="update()">update weights</button>
<textarea id="weights">[2, 3, 5, 7, 11, 13, 17, 19]</textarea>
<div id="div-4"></div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.58.4/plotly.min.js"></script>
<link rel="stylesheet" href="/assets/20210323/style.css">
<script src='/assets/20210323/color_gen.js'></script>
<script src='/assets/20210323/table_gen.js'></script>
<script src='/assets/20210323/bar_charts.js'></script>
