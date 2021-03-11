---
title: Write a Command Line Tool Using Bash
key: 20210303
tags:
- metablog
- Bash
---

I wrote a simple command line tool for my blog. Here are a few key takeaways about the tool usage, some Bash language features, several Bash commands, and how to write custom Bash autocompletion function.



<!--more-->



## Usage

```
blog [{cd, edit, list, new, push, root, run} [args...]]
```

* `cd`: change directory
  * `blog cd`: cd into the root directory of the blog
  * `blog cd assets/share/`: cd into `$BLOG_ROOT/assets/share`
  * Autocompletion is available
* `edit`: edit post files
  * `blog edit`: open the entire blog folder
  * `blog edit 2020-11`: open all posts with `2020-11` in their file names
  * `blog edit "-i MAGIC" "vim -p"`: open all posts with `MAGIC` in their file names (case insensitive) in Vim with multiple tabs, instead of the default editor, VS Code
  * Autocompletion is available
* `list`: list post files
  * `blog list`: list all post files
  * `blog list 2020-11`: list all posts with `2020-11` in their file names
  * `blog list -i MAGIC`: list all posts with `MAGIC` in their file names (case insensitive)
  * Autocompletion is available
* `new`: create a new post file
  * `blog new`: create a new post file using `tools/post_template.md` as template with today as the date
* `push`: git add + commit + push
  * `blog push "bug fixes"`: git add + commmit + push with message "bug fixes"
* `root`: echo the root directory of the blog
  * `blog root`: echo `$BLOG_ROOT`
* `run`: serve the blog
  * `blog`: serve the blog at `0.0.0.0:4000`
  * `blog run --host=127.0.0.1 --port=8000`: serve the blog at `127.0.0.1:8000`

The Bash script is on [GitHub]. Source it before using.



## Bash language

### If-Else in one line

```bash
[[ -z "" ]] && echo empty || echo non-empty # show empty
[[ -z 00 ]] && echo empty || echo non-empty # show non-empty
```

### Range of arguments

```bash
f () { echo "$@" && echo "${@: -3}" && echo "${@:2:2}"; }
f 1 2 3 4 5 6 7
# Output:
# 1 2 3 4 5 6 7
# 5 6 7
# 2 3
```



## Bash commands

### pushd, popd

```bash
pushd "$BLOG_ROOT/_posts" > /dev/null # temporarily cd into
$editor $posts # do something
popd > /dev/null # cd back
```

### ls

```bash
ls -1 # -1 forces one result per line
```

### date

```bash
date +%F # 2021-03-03
date +%Y%m%d # 20210303
```

### sed

```bash
# replace 19700101 with today
sed -i "s/19700101/$(date +%Y%m%d)/" "$new_file"
```

## Autocomplete

### Overview

[Here](http://fahdshariff.blogspot.com/2011/04/writing-your-own-bash-completion.html) is a great tutorial for writing custom autocomplete function, and let me quote this:

> Bash uses the following variables for completion:
>
> * `COMPREPLY`: an array containing possible completions as a result of your function
>
> * `COMP_WORDS`: an array containing individual command arguments typed so far
>
> * `COMP_CWORD`: the index of the command argument containing the current cursor position
>
> * `COMP_LINE`: the current command line

In short, our job is to build `COMPREPLY` based on the other three variable, especially the current word `${COMP_WORDS[COMP_CWORD]}`.

### compgen

The command `compgen` is a convenient tool for this job, and you can try it in command line as follows. `-W "meow meeoow meeeooow"` defines a list of possible words to complete, and `"mee"` is the current word typed so far. The double dashes `--` signify the end of the options (see [here](https://unix.stackexchange.com/questions/11376/what-does-double-dash-mean)).

```bash
compgen -W "meow meeoow meeeooow" -- "mee"
# Output:
# meeoow
# meeeooow
```

Another example in my code. Here `nospace` means no extra space after completion, `-d` means searching directories, and `-S /` means adding suffix `/`. This setup is for subdirectory autocompletion.
```bash
compopt -o nospace # no extra space after completion
COMPREPLY=($(compgen -d -S / -- "$word")) # add suffix /
```

### complete

When you finish everything, add the following line to register `_blog` as the autocompletion function of `blog`.
```bash
complete -F _blog blog
```
