---
layout: post
title:  "Cómo instalar sistema gráfico Linux"
description: Cómo instalar sistema gráfico Linux
comments: true
category: Youtube
tags: Tutoriales Linux
youtube: https://youtu.be/bZnSi0pwkxI
---
<span class="post-date-header">Febrero 17 de 2026</span>
Paso a paso para instalar un sistema grafico liviano a Linux server.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

1. Descargar
```csharp
sudo apt update && sudo apt upgrade -y
sudo apt install xfce4 xfce4-goodies -y
```
2. Sistema de inicio de session
```csharp
sudo apt install slim -y
echo "startxfce4" > ~/.xsession
```
3. Escritorio remoto
```csharp
sudo apt install xrdp -y
sudo systemctl restart xrdp
sudo systemctl enable xrdp
```
