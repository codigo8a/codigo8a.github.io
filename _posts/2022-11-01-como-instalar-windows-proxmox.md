---
layout: post
title:  "Cómo instalar windows en proxmox"
description: Cómo instalar una maquina virtual linux en Proxmox
comments: true
category: Paso a paso
tags: Tutoriales Linux Windows
youtube: https://youtu.be/At5CpVwy-iY
link: https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers
---
Paso a paso para poder instalar una maquina virtual windows en Proxmox.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

* Descargar ISO Windows y agregarlo a Proxmox
* Descargar ISO <a target="_blank" href="{{ page.link }}">Windows VirtIO Drivers</a> y agregarlo a Proxmox
* Crear maquina virtual
* System = Qemu
* Hard Disck = SCSI - cache write back
* CPU = 4 cores
* Network = VirtIO
* Montar CDRoom con ISO VirtIO
* Cargar drivers para instalacion desde el CDRoom
* Instalar drivers del controlador desde el CDRoom
* Instalar Guest Agent
