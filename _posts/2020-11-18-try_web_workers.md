---
title: Try Web Workers
key: 20201118
tags:
- JavaScript
---

How I learn about web workers by writing a simple example.



<!--more-->



## Demo

Two workers sharing and manipulating the same `i`:
1. `worker1`: Run `i = i + 3` every 4 seconds and update
2. `worker2`: Run `i = i - 1` every 2 seconds and update

<textarea id="worker1" readonly></textarea>
<textarea id="worker2" readonly></textarea>



## Background

Over the past few weeks, I've been too busy to update my blog. What I originally planned to do during this time was to start a project about mobile robots. Although not even a single line was written, I still did some research to see what I need to learn. Among these, one thing I want to try first is the web workers.

Today I finally have some free time to write something ~~by pretending there's no urgent work to do~~, so now I'm controlling my personal laptop remotely from hotel! :smirk:



## Idea

Web workers runs in their own threads, and can communicate with the main thread via the `postMessage()` method and the `onmessage` event handler. So I think it would be possible to use web workers similarly as ROS nodes, and the main thread as ROS core. Following this concept, I can put different components, e.g. planning, control, perception, decision, etc., into seperate workers, and reuse the paradigm of ROS.

Anyway, this is the big idea. This post is just a naive try...



## Code

Available on my GitHub repository.



<!-- code -->
<link rel="stylesheet" href="/assets/20201118/style.css">
<script src='/assets/20201118/main.js'></script>
<script src='/assets/20201118/worker1.js'></script>
<script src='/assets/20201118/worker2.js'></script>
