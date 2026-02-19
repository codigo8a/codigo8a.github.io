---
layout: post
title:  "Cómo instalar un certificado SSL gratis en Ubuntu Server"
description: Cómo instalar un certificado SSL gratis en Ubuntu Server
comments: true
category: Youtube
tags: Trucos Linux
youtube: https://youtu.be/CDEaBtEeVwM
---
<span class="post-date-header">Marzo 10 de 2020</span>
Paso a paso para instalar un certificado SSL gratis en servidor web ubuntu

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

Instalamos Certbot
```csharp
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot python-certbot-apache -y
```
