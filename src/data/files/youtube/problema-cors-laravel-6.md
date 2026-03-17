Fecha: 21/09/2019
---
tags: Error Framework Laravel PHP
---

# Solucionar problema CORS en Laravel 6 | 2019

Este tutorial es la actualización de un post anterior que ya no funciona en versiones nuevas:
A continuación doy una solución rápida al problema Access-Control-Allow-Origin - CORS en Laravel 6 que sucede por razones de seguridad, los exploradores restringen las solicitudes HTTP de origen cruzado iniciadas dentro de un script.

En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:

```csharp
//Instalamos
composer require barryvdh/laravel-cors

//Agregamos esta linea al archivo config/app.php
//en el array de providers
Barryvdh\Cors\ServiceProvider::class,

//Agregamos esta linea al archivo app/Http/Kernel.php
//en "protected $middleware"
\Barryvdh\Cors\HandleCors::class,

//ejecutamos
php artisan vendor:publish --provider="Barryvdh\Cors\ServiceProvider"
```
