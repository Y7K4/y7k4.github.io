#!/usr/bin/env bash

# blog {cd, edit, list, new, root, run} [args]
# Examples:
#   blog cd
#   blog cd assets/
#   blog edit
#   blog edit ran
#   blog edit welcome gedit
#   blog list
#   blog list 2020-11
#   blog new
#   blog root
#   blog run
function blog {
  case $1 in
    cd | edit | list | new | root | run)
      "_blog-$1" "${@:2}"
      ;;
    "")
      _blog-run "${@:2}"
      ;;
    *)
      echo "$1: unknown command"
      ;;
  esac
}

# _blog-cd [path]
function _blog-cd {
  cd "$(_blog-root)/$1"
}

# _blog-edit [pattern [editor]]
function _blog-edit {
  local editor="code"
  local posts="$(_blog-root)"
  [[ -n $1 ]] && posts="$(_blog-list $1)"
  [[ -n $2 ]] && editor=$2
  [[ -z $posts ]] && echo "Posts not found." && return 1
  pushd "$(_blog-root)/_posts" > /dev/null
  $editor $posts
  popd > /dev/null
}

# _blog-list [pattern]
function _blog-list {
  if [[ -z $1 ]]; then
    ls "$(_blog-root)/_posts/" -1
  else
    ls "$(_blog-root)/_posts/" -1 | grep "$@"
  fi
}

# _blog-new
function _blog-new {
  local template="$(_blog-root)/tools/post_template.md"
  local new_file="$(_blog-root)/_posts/$(date +%F)-blog_post.md"
  cp $template $new_file
  sed -i "s/19700101/$(date +'%Y%m%d')/" $new_file
}

# _blog-root
function _blog-root {
  echo "$HOME/Blog"
}

# _blog-run [args]
function _blog-run {
  pushd "$(_blog-root)" > /dev/null
  bundle exec jekyll serve "$@"
  echo
  popd > /dev/null
}

# auto-complete
function _blog {
  local word=${COMP_WORDS[COMP_CWORD]}
  if [[ $COMP_CWORD == 1 ]]; then
    local cmds="cd edit list new root run"
    COMPREPLY=($(compgen -W "$cmds" -- $word))
  elif [[ $COMP_CWORD == 2 ]]; then
    case ${COMP_WORDS[1]} in
      cd)
        pushd "$(_blog-root)" > /dev/null
        compopt -o nospace
        COMPREPLY=($(compgen -d -S / -- "$word"))
        popd > /dev/null
        ;;
      edit | list)
        local posts="$(_blog-list)"
        COMPREPLY=($(compgen -W "$posts" -- $word))
        ;;
      *)
        ;;
    esac
  fi
}
complete -F _blog blog
