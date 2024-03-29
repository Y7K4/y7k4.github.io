---
title: Hanzi-Color Converter
key: 20220804
tags:
- random thoughts
- JavaScript
---

前段时间偶然看到中国传统色，其中每个颜色都有个不明觉厉的名字。作为一个起名爱好者，我自然就在想有没有别的起名方式。然后我就想到，用 UTF-8 一个汉字三字节，用 RGB 一个颜色也是三字节，如此一来，每个字就可以直接有个对应的颜色了。好耶，搞起来！



<!--more-->



## 试试看

输入一个汉字：
<input type="input" id="hanzi" maxlength="1" size="2" onchange="onHanziChange();">

或者输入一个颜色：
<input type="color" id="color" onchange="onColorChange();">

<canvas id="result" width="128" height="128" style="border:1px solid #ccc;">
</canvas>



## 关于 UTF-8

一般认为汉字在 Unicode 中的范围在 `U+4E00` 到 `U+9FA5`，而用 UTF-8 编码的时候会用到三个字节，二进制长下面这样：

```
1110xxxx
10xxxxxx
10xxxxxx
```

其中 16 个 x 代表的部分就是来自于 Unicode 的那两个字节。比如对于 `草` 这个字，在 Unicode 里对应的就是 `U+8349`，转二进制就是 `1000 0011 0100 1001`，用 UTF-8 编码就是 `11101000 10001101 10001001` 这样。



## 汉字转颜色

假如直接把 UTF-8 编码得到的三个字节分别作为 RGB 三通道的值会有个问题：这三个字节的高位是固定的，而且 R 通道永远最大。不难发现，这对应出的颜色基本都是浅红色，所以汉字之间没什么区分度。

为了省事，我把三个字节里的比特分别逆序了一下，这样就能覆盖到很大范围的颜色了。

于是现在 `草` 对应的就是 `00010111 10110001 10010001`，也就是 `#17B191` 这个颜色了。



## 颜色转汉字

颜色有一千多万个，汉字就几万个，所以颜色转汉字的时候，一般需要就近找个差不多的颜色。具体怎么写的解释有点辛苦，总之就是写了一个出来，可以随便玩玩。



## 废话几句

一年没更新了。

本来上周末就想写这篇，结果来博客一看，好家伙，我以前敲的所有公式全挂了，只好连夜更新了 MathJax 相关的东西。

今天可算有空了，写了坨没用的代码，超开心，以后争取恢复更新！



<!-- code -->
<script src='/assets/20220804/hanzi_color_converter.js'></script>
