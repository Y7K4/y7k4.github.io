---
title: Publicly Hide Magic Strings (1)
key: 20201007
tags:
- cryptography
- crypto-js
- JavaScript
mathjax: true
modify_date: 2020-11-20
---

{%- capture next_in_series -%}
  {% post_url 2020-10-14-publicly_hide_magic_strings_2 %}
{%- endcapture -%}

This is the 1st post in the _Publicly Hide Magic Strings_ series ([>>]({{next_in_series}})). A common form of website Easter eggs is magic strings, but how can they be hidden in a public repository? Encryption. In this post, I'll develop a magic string encryption tool based on [crypto-js](https://github.com/brix/crypto-js).



<!--more-->



***

Input `Q` and `A` below.

<textarea id="Q" placeholder="Q" oninput="generateKeys()"></textarea>
<textarea id="A" placeholder="A" oninput="generateKeys()"></textarea>

Here will show the keys `KQ` and `KA`, which can be saved in the public repository.

<button class="button button--success button--pill copy_btn">
  Copy KQ: KA
</button>

<textarea id="KQ" placeholder="KQ" readonly></textarea>
<textarea id="KA" placeholder="KA" readonly></textarea>

Finally input your `Q` or any of the following to test. Only the encrypted pairs of `(KQ, KA)` are used in code.

* `Y7K4`
* `Meow?`
* `We will, we will`

<textarea id="Q_test" placeholder="Q_test" oninput="validate()"></textarea>

***



## Introduction

I have two expectations for my GitHub Pages.

* As a platform sharing my ideas, especially in technical fields, it should be hosted on a public repository so that everyone can access the source code.
* It should have some hidden Easter eggs. Just for fun.

There are various ways to hide Easter eggs on a website: code comments, [Konami code](https://en.wikipedia.org/wiki/Konami_Code), hidden buttons, [magic strings](https://en.wikipedia.org/wiki/Magic_string), etc. These methods are all great, and I especially prefer magic strings as it can be naturally embedded in the search box.

However, nothing is really a secret in a public repository. If the website visitor reads the source code, the secret is not hidden anymore, unless it's carefully encrypted.



## Design

### Concepts

Let `Q` be a magic string and `A` be the corresponding response, i.e., when the user inputs `Q` in the search box, the website should display `A` in addition to the search results. Multiple pairs of `(Q, A)` form the website Easter eggs.

After encryption, multiple pairs of keys `(KQ, KA)` are explicitly stored in the public repository. It should be practically impossible to know `(Q, A)` based on `(KQ, KA)`.



### Workflow

Given a pair `(Q, A)`, compute the key pair `(KQ, KA)` as follows and save it in the public repository. Note that `Q` (after hashing) is used as the key for encryption. This avoids people from getting `A` without even knowing `Q`.

$$\mathrm{KQ} = \mathrm{hash}(\mathrm{Q})$$

$$\mathrm{KA} = \mathrm{encrypt}(\mathrm{A}, \mathrm{Q})$$

When the user input `Q` is received, compute its hash `KQ` and look up in the list of keys. If `KQ` is found, decrypt the corresponding `KA` with `Q` as the key and get the result `A`; otherwise do nothing.

$$\mathrm{A} = \mathrm{decrypt}(\mathrm{KA}, \mathrm{Q})$$



## Algorithms

### Hash

The hash function I use is [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2), which is a common choice for password hashing. Note that if the number of iterations is too large, then the PBKDF2 becomes slow, making the search box less responsive; but if it's too small, then the hash becomes less secure.

```javascript
// KQ = hash(Q)
function hash(Q) {
  const salt = "Y7K4's magic salt for PBKDF2";
  var KQ = CryptoJS.enc.Base64.stringify(
    CryptoJS.PBKDF2(Q, salt, { iterations: 1000 })
  );
  return KQ;
}
```



### Encrypt & Decrypt

The cipher I use is [Rabbit](https://en.wikipedia.org/wiki/Rabbit_(cipher)), which is a high-speed [stream cipher](https://en.wikipedia.org/wiki/Stream_cipher).

```javascript
// KA = encrypt(A, Q)
function encrypt(A, Q) {
  var key = CryptoJS.SHA256(Q);
  var KA = CryptoJS.Rabbit.encrypt(A, key);
  return KA;
}

// A = decrypt(KA, Q)
function decrypt(KA, Q) {
  var key = CryptoJS.SHA256(Q);
  var A = CryptoJS.enc.Utf8.stringify(CryptoJS.Rabbit.decrypt(KA, key));
  return A;
}
```



## What's next

* Embed the magic string system into the search box.
* Create a lot of magic strings for fun.



<!-- code -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css"/>
<link rel="stylesheet" href="/assets/20201007/style.css">
<script src='/assets/20201007/magic_string.js'></script>
