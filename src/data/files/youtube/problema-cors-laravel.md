Fecha: 29/09/2018
---
tags: Tutoriales Laravel Error Framework PHP
---

# Solucionar problema CORS en Laravel 5

A continuación doy una solución rápida al problema Access-Control-Allow-Origin - CORS en Laravel 5 que sucede por razones de seguridad, los exploradores restringen las solicitudes HTTP de origen cruzado iniciadas dentro de un script.

En [mi canal de youtube](https://youtu.be/KvldwGjCg5M) hay un video del paso a paso:

```PHP
//Creamos un middleware
->header('Access-Control-Allow-Origin', '*’)
->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS’);

//ingresamos al Kernel
'cors' => \App\Http\Middleware\Cors::class,

//Agregamos a las rutas
Route::group(['middleware' => 'cors'], function(){
    //aqui van todas las rutas que necesitan CORS
}); 
```
