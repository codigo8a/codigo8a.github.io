Fecha: 30/06/2021
---
tags: Trucos BaseDeDatos
---

# Cómo eliminar todas las tablas SQL

Código SQL para eliminar todas las tablas de una base de datos SQL sin eliminar la base de datos

En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:

```sql
DECLARE @sql NVARCHAR(max)=''

SELECT @sql += ' Drop table ' + QUOTENAME(TABLE_SCHEMA) + '.'+ QUOTENAME(TABLE_NAME) + '; '
FROM   INFORMATION_SCHEMA.TABLES
WHERE  TABLE_TYPE = 'BASE TABLE'

Exec Sp_executesql @sql
```
