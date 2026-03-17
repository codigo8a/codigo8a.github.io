Fecha: 17/02/2026
---
tags: Tutoriales Linux
---

# Cómo instalar sistema gráfico Linux

Paso a paso para instalar un sistema grafico liviano a Linux server.

En [mi canal de youtube](https://youtu.be/bZnSi0pwkxI) hay un video del paso a paso:

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
