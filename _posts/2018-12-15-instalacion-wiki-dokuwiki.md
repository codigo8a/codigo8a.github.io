---
layout: post
title:  "Instalación Sistema Wiki DOKUWIKI"
description: Sistema de documentación WIKI facíl y sin base de datos
comments: true
category: Paso a paso
tags: Tutoriales PHP
youtube: https://bit.ly/2wSo5iD
dokuwiki: https://github.com/splitbrain/dokuwiki
---

A continuación describo linea a linea lo que hay que hacer en la consola SSH para tener en menos de 5 minutos un proyecto de <a target="_blank" href="{{ page.dokuwiki }}">documentación WIKI usando DOKUWIKI</a>.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso: 

```
git clone https://github.com/splitbrain/dokuwiki.git
sudo chmod -R 755 /dokuwiki/data/

//ejecutar dominio-IP/dokuwiki/install.php
```

### Mini-tutorial de manejo 
1. Cómo crear un pagina nueva
2. Cómo crear una pagina dentro de una sección
3. Cómo activar url amigables
