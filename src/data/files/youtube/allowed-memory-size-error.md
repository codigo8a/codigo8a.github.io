Fecha: 08/03/2021
---
tags: Trucos Error CMS WordPress
---

# Cómo arreglar el error Memory Exhausted de WordPress en WP Engine

Un par de lineas necesarias para arreglar en WordPress el error Memory Exhausted, o en otras palabras como incrementar la memoria de PHP (Increase PHP Memory) y en este caso lo haremos a un sitio web que esta alojado en la plataforma WP Engine. Los pasos son utiles para cualquier pagina web en wordpress y en cualquier hosting.

En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:

Debemos buscar el archivo "wp-config.php" y agregar las siguientes lineas

```php
define('WP_MEMORY_LIMIT', '256M');
define( 'WP_MAX_MEMORY_LIMIT', '512M' );
```
