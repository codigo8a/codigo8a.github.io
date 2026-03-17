Fecha: 10/03/2020
---
tags: Trucos Linux
---

# Cómo instalar un certificado SSL gratis en Ubuntu Server

Paso a paso para instalar un certificado SSL gratis en servidor web ubuntu

En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:

Instalamos Certbot
```csharp
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot python-certbot-apache -y
```
