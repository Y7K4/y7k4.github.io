---
title: How to Serve This Jekyll Blog Locally
key: 20201024
tags:
- metablog
- Ubuntu
---

A local blog server can show a blog preview before pushing changes to GitHub, but certain dependencies need to be installed. Recently I installed Ubuntu 20.04 and this Jekyll blog was one of the very first things I downloaded. Here I record how I got it working locally.



<!--more-->



## Tutorial

Note that this tutorial is for Ubuntu 20.04 and my simplified version of TeXt theme.
{:.warning}

Clone the repository first. In the commit `5863e2`, I removed lots of files to simplify the theme.

```bash
git clone https://github.com/Y7K4/y7k4.github.io
cd y7k4.github.io/
```

The following dependencies are installed. Perhaps some of them are redundant, but these were all I installed.

```bash
sudo apt install ruby-bundler
sudo apt install ruby-dev
sudo apt install build-essential
sudo apt install patch zlib1g-dev liblzma-dev
```

Serve the blog locally.

```bash
bundle exec jekyll serve
```

A handy alias.

```bash
alias blog='cd ~/Blog/ && bundle exec jekyll serve'
```
