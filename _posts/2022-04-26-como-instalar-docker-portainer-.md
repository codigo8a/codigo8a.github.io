---
layout: post
title:  "Cómo instalar docker en Raspbian linux"
description: Cómo instalar docker en Raspbian linux
comments: true
category: Youtube
tags: Tutoriales Linux Docker
youtube: https://youtu.be/EbKw0Dcaf6o
---
<span class="post-date-header">Abril 26 de 2022</span>
Paso a paso para tener docker instalado junto con un administrador visual de contenedores en una Raspberry Pi.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

Instalar docker
```csharp
sudo apt update
sudo apt upgrade
sudo apt install raspberrypi-kernel raspberrypi-kernel-headers
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker pi
sudo reboot
docker version
```

Instalar Portainer
```csharp
docker run -itd -p 8000:8000 -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v /docker/portainer:/data portainer/portainer-ce
localhost:9000
docker ps
```
