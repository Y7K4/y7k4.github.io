---
title: Pinyin-Like English Words
key: 20210711
tags:
- random thoughts
- Python
---

我最近创建了一个 [repo](https://github.com/Y7K4/pinyin-like-english-words) ，把所有长得像拼音的英文单词给列了出来。这篇博客会用中文大致介绍下，并且放一些有那么一点点意思的结果。



<!--more-->



## 啊？什么东西？

所谓“长得像拼音的英文单词”，就是可以被分割成若干个拼音音节的英文单词，比如：

* cache 可以被分割成 ca che
* siren 可以被分割成 si ren
* pinyin 可以被分割成 pin yin
* Chihuahua 可以被分割成 chi hua hua

需要注意的是虽然是说长得像“拼音”，但是分割结果是“拼音音节”。换句话说，这里不考虑声调。



## 啊？这还不简单？

搜索的算法确实简单，最基本的动态规划就大概可以在3秒找出所有目标单词，所以也没什么提升的必要。

但数据来源的搜集真的很麻烦。主要问题是版本实在太多了，我花了很多时间去对比，最后才确定下来最终使用的版本。英文单词的来源是在GitHub上的 [english-words](https://github.com/dwyl/english-words/blob/master/words_alpha.txt) ，而拼音音节的来源是 [ISO 7098:2015](https://www.iso.org/standard/61420.html) 的附录A。

如果你像我之前一样感到疑惑：英文单词就算了，拼音音节还能有什么争议？那么我来随手推荐几个例子：nun、biang、fiao。类似的稀有音节在不同的列表中有着很大的出入，所以虽然大家都有400多个音节，但又有微妙的差异。总之最后我用的是ISO版本的，至少它有一定的权威性。



## 啊？这有什么意思？

![humuhumunukunukuapuaa](/assets/20210711/reef_triggerfish.jpg){:.rounded}

首先扩充一下我在 [repo](https://github.com/Y7K4/pinyin-like-english-words) 中提到的两条：

* 在所有长得像拼音的英文单词中，最长的词是 [humuhumunukunukuapuaa](https://en.wikipedia.org/wiki/Reef_triggerfish)
  * 这个词据说是最长的鱼名，但我没仔细考证
  * 这个鱼是夏威夷的州鱼，算是小有名气（也因为它超有趣的名字）
  * 它的中文名叫斜带吻棘鲀，也可以叫“胡姆胡姆努库努库阿普阿阿”鱼——没错，就是按照拼音读出来！
  * 据我观察，能直接按照拼音读出来的词其实还挺少见的
* 大约有 3% (12209/370103) 的单词长得像拼音
  * 这个比例其实比我预想的要高
  * 在[常用词](https://github.com/first20hours/google-10000-english)中，这个比例甚至会进一步上升

再另外写几条：

* 如果采用 10k 或者 20k 的[常用词](https://github.com/first20hours/google-10000-english)，最长的单词是 humanitarian ，占比大约是5~6%。
* 有接近一半的词需要用到 a/e/o 开头的音节（零声母音节，但没算 w/y 开头的那些），因为这些音节真的很适合穿插在英文单词中作为衔接
* 那些比较长的词大多是稀奇古怪的生物术语、化学术语，或者由一个基本词加一堆前缀和后缀构成的词
  * 生物的几个例子：humuhumunukunukuapuaa, acinacifoliate, chenopodiaceae
  * 化学的几个例子：aminoacetanilide, aluminosilicate, manganotantalite
  * 前缀后缀的几个例子：denominationalize, desentimentalize, semidependence

好吧，可能确实没什么意思。但是至少我认识了“胡姆胡姆努库努库阿普阿阿”鱼，希望看到这里的你也能喜欢它！
