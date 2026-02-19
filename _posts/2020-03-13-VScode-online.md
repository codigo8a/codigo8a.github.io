---
layout: post
title:  "Cómo instalar IDE VSCode en Ubuntu Server"
description: Cómo instalar IDE VSCode en Ubuntu Server
comments: true
category: Youtube
tags: Tutoriales Linux
youtube: https://youtu.be/tWzzzGoNEq4
---
<span class="post-date-header">Marzo 13 de 2020</span>
Paso a paso para instalar el IDE de desarrollo VSCode y correrlo directamente en la nube desde una URL en un Servidor Linux Ubuntu alojado en Amazon AWS

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

```csharp
cd bin
sudo wget https://github.com/cdr/code-server/releases/download/2.1698/code-server2.1698-vsc1.41.1-linux-x86_64.tar.gz
sudo tar xvzf code-server2.1698-vsc1.41.1-linux-x86_64.tar.gz

cd code-server2.1698-vsc1.41.1-linux-x86_64
sudo mv code-server /bin
cd ..
sudo rm -rf code-server2.1698-vsc1.41.1-linux-x86_64.tar.gz
sudo rm -rf code-server2.1698-vsc1.41.1-linux-x86_64
sudo code-server
```
