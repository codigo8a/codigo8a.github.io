Fecha: 28/02/2019
---
tags: Tutoriales Linux
---

# Instalación Theme Arc-Dark Linux Mint

A continuación describo los comandos de consola SSH para instalar en menos de 5 minutos el Theme Arc-Dark para Linux Mint.

En [mi canal de youtube](https://bit.ly/2wSo5iD) hay un video del paso a paso:

```csharp
sudo rm -rf /usr/share/themes/{Arc,Arc-Darker,Arc-Dark}
rm -rf ~/.local/share/themes/{Arc,Arc-Darker,Arc-Dark}
rm -rf ~/.themes/{Arc,Arc-Darker,Arc-Dark}

sudo apt-get install autoconf automake pkg-config libgtk-3-dev
git clone https://github.com/horst3180/arc-theme --depth 1 && cd arc-theme

./autogen.sh --prefix=/usr
sudo make install
```
