---
layout: post
title:  "Cómo desplegar una app React + Vite a Github"
description: "Cómo desplegar una app React + Vite en Github Pages"
comments: true
category: Paso a paso
tags: Tutoriales React Framework
youtube: https://youtu.be/ScwqUMKhNm4
---
Código paso a paso para hacer un deploy de una aplicación React con Vite en Github Pages.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:
 
```react
npm create vite@latest
git init
homepage
"predeploy":"npm run build"
"deploy":"gh-pages -d dist"
base: "https://juandavid.site/reactapp"
```
