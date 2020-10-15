---
title: Publicly Hide Magic Strings (2)
key: 20201014
tags:
- JavaScript
- metablog
---

{%- capture prev_in_series -%}
  {% post_url 2020-10-07-publicly_hide_magic_strings_1 %}
{%- endcapture -%}

This is the 2nd post in the _Publicly Hide Magic Strings_ series ([<<]({{prev_in_series}})). This post introduces how I embed magic strings in the search box. Yes, it works now!



<!--more-->



![sample_magic_string](/assets/20201014/sample_magic_string.gif)



## Store the keys

Using the tool [here]({{prev_in_series}}), we can obtain the keys of magic strings. Click the `Copy KQ: KA` button to copy the keys in `<KQ>: <KA>` format, and then store them in `_config.yml`:

```yaml
magic_strings:
  VJfnFW2Jwe4R72vBXTpWUw==: 3seXsYDJ1XIxQgpBvew6AF7Z2OM=
  ...
```



## Include the functions

The included functions are in `/_includes/magic-strings/magic_string.js`. Most of the them are already developed [here]({{prev_in_series}}), the only difference is that now the dictionary of keys is loaded from `_config.yml` via the [Liquid filter](https://jekyllrb.com/docs/liquid/filters/) jsonify.

`magicString(Q)` returns the response `A` if `Q` matches, otherwise `""`.



## Build the UI

[TeXt theme](https://github.com/kitian616/jekyll-TeXt-theme) supports two search providers, the default one and [Google Custom Search Engine (GCSE)](https://cse.google.com/). I don't really like GCSE because it

* Has ads
* Fits bad with the current UI style
* Is hard to customize and embed magic strings
* Updates so slow (re-indexing is possible, but still annoying) that new posts are missing and deleted posts can still show up

The default one is also bad as it only searches the titles, but for now I will just live with it and implement the magic strings first.

The following snippet in `/_includes/search-providers/default/search.js` converts `Q` to `A` and renders `A` if possible. [showdown](https://github.com/showdownjs/showdown) is used for Markdown-to-HTML conversion.

```javascript
// magic strings
A = magicString(window.search.getSearchInput().value);
if (A) {
  var converter = new showdown.Converter();
  $root.append(renderHeader('a secret place'));
  $root.append($(converter.makeHtml(A)));
}
```

Markdown format is supported in `A`.
{:.success}
