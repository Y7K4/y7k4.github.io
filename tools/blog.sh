#!/usr/bin/env bash

BLOG_ROOT="$HOME/Blog"

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
#   blog
#   blog run --host=127.0.0.1 --port=8000
function blog {
  case $1 in
    cd)
      cd "$BLOG_ROOT/$2"
      ;;
    edit)
      local editor="code"
      local posts="$BLOG_ROOT"
      [[ -n $2 ]] && posts="$(ls "$BLOG_ROOT/_posts/" -1 | grep $2)"
      [[ -n $3 ]] && editor=$3
      [[ -z $posts ]] && echo "Posts not found." && return 1
      pushd "$BLOG_ROOT/_posts" > /dev/null
      $editor $posts
      popd > /dev/null
      ;;
    list)
      if [[ -z $2 ]]; then
        ls "$BLOG_ROOT/_posts/" -1
      else
        ls "$BLOG_ROOT/_posts/" -1 | grep "${@:2}"
      fi
      ;;
    new)
      local template="$BLOG_ROOT/tools/post_template.md"
      local new_file="$BLOG_ROOT/_posts/$(date +%F)-blog_post.md"
      cp "$template" "$new_file"
      sed -i "s/19700101/$(date +'%Y%m%d')/" "$new_file"
      ;;
    root)
      echo "$BLOG_ROOT"
      ;;
    run | "")
      [[ -n $1 ]] && local args="${@:3}" || local args="--host=0.0.0.0"
      pushd "$BLOG_ROOT" > /dev/null
      bundle exec jekyll serve $args
      echo
      popd > /dev/null
      ;;
    *)
      echo "$1: unknown command"
      ;;
  esac
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
        pushd "$BLOG_ROOT" > /dev/null
        compopt -o nospace
        COMPREPLY=($(compgen -d -S / -- "$word"))
        popd > /dev/null
        ;;
      edit | list)
        local posts="$(blog list)"
        COMPREPLY=($(compgen -W "$posts" -- $word))
        ;;
      *)
        ;;
    esac
  fi
}
complete -F _blog blog
