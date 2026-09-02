#!/bin/sh
cd "$(dirname "$0")"
{
  cat _shell_head.html
  printf '\n<template id="t-perfil">\n';  cat carro-perfil.svg;  printf '\n</template>\n'
  if [ -f carro-frontal.svg ]; then printf '\n<template id="t-frontal">\n'; cat carro-frontal.svg; printf '\n</template>\n'; fi
  cat _shell_tail.html
} > carro.html
echo built
