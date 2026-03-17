Fecha: 20/06/2021
---
tags: Trucos Javascript
---

# Cómo listar contactos inactivos de facebook

Codigo javascript que nos permite listar todos los contactos inactivos de facebook y despues poder borrarlos

En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:

```javascript
let segundos = 0;

function hacerScrollUnMinuto() {
if(segundos < 10) {
segundos++
window.scrollBy(0, 1000)
setTimeout(hacerScrollUnMinuto, 1000)
}
}
function mostrarInactivos() {
let activos = document.querySelectorAll('.right[data-store*=is_deactivated\\"\\:false')
activos.forEach(p => p.parentElement.parentElement.parentElement.parentElement.remove())
window.scrollBy(0, 1000)
}
```
