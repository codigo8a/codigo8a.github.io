Fecha: 13/03/2020
---
tags: Tutoriales Linux
---

# Cómo instalar IDE VSCode en Ubuntu Server

Paso a paso para instalar el IDE de desarrollo VSCode y correrlo directamente en la nube desde una URL en un Servidor Linux Ubuntu alojado en Amazon AWS

En [mi canal de youtube](https://youtu.be/tWzzzGoNEq4) hay un video del paso a paso:

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
