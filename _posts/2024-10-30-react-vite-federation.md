---
layout: post
title:  "Cómo crear un Micro-FrontEnd React + Vite + Federation"
description: "Cómo crear Micro-FrontEnd (remote - cliente)"
comments: true
category: Youtube
tags: Tutoriales React Framework
youtube: https://youtu.be/M2o32pzNXI8
---
<span class="post-date-header">Octubre 30 de 2024</span>

Código paso a paso para crear dos aplicaciones (remoto y cliente) React + Vite + Federation para Micro-FrontEnd.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:
 
1 Crear dos proyectos (remoto y cliente)
- npm create vite@latest

2 Instalar pnpm (PowerShell)
```react
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

3 Instalar federation (cliente y remoto)
- pnpm add @originjs/vite-plugin-federation

4 Configurar package.json (cliente y remoto)
```react
"preview": "vite preview --port 5001 --strictPort",
"start": "npm run build && npm run preview"
```

5 Configurar vite.config (remoto)
```react
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote-app",
      filename: "remoteEntry.js",
      exposes: {
        "./remote-app": "./src/main.tsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
```

6 Configurar main.tsx (remoto)
```react
const Main = () => (
  <StrictMode>
    <App />
  </StrictMode>
)

export default Main;
```

7 Configurar vite.config (cliente)  
```react
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "client-app",
      remotes: {
        remoteApp: "http://localhost:5001/assets/remoteEntry.js",
      },
      shared: ["react"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",

    minify: false,
    cssCodeSplit: false,
  },
});
```

8 Crear declares.d.ts (cliente)  
```react
declare module 'remoteApp/remote-app' {
    export default RemoteApp;
}
```

9 Modificar app remoto  
10 Importar app remoto y llamarla cómo un componente  
11 npm run start (remoto y cliente)
