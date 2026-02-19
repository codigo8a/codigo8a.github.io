---
layout: post
title:  "Instalación Theme Arc-Dark Linux Mint"
description: Comandos de consola paso a paso para instalar el theme Arc-Dark en linux mint
comments: true
category: Youtube
tags: Tutoriales Linux
youtube: https://bit.ly/2wSo5iD
---
<span class="post-date-header">Febrero 28 de 2019</span>
A continuación describo los comandos de consola SSH para instalar en menos de 5 minutos el Theme Arc-Dark para Linux Mint.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

```csharp
sudo rm -rf /usr/share/themes/{Arc,Arc-Darker,Arc-Dark}
rm -rf ~/.local/share/themes/{Arc,Arc-Darker,Arc-Dark}
rm -rf ~/.themes/{Arc,Arc-Darker,Arc-Dark}

sudo apt-get install autoconf automake pkg-config libgtk-3-dev
git clone https://github.com/horst3180/arc-theme --depth 1 && cd arc-theme

./autogen.sh --prefix=/usr
sudo make install
```
