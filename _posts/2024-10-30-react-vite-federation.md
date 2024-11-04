---
layout: post
title:  "Cómo crear un Micro-FrontEnd React + Vite + Federation"
description: "Cómo crear Micro-FrontEnd (remote - cliente)"
comments: true
category: tutoriales
tags: tutoriales react framework
youtube: https://youtu.be/ScwqUMKhNm4
---
Código paso a paso para crear dos aplicaciones (remoto y cliente) React + Vite + Federation para Micro-FrontEnd.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:
 
***01 Crear dos proyectos (remoto y cliente)***
- npm create vite@latest

***02 Instalar pnpm (PowerShell)***
```csharp
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

***03 Instalar federation (cliente y remoto)***
- pnpm add @originjs/vite-plugin-federation

***04 Configurar package.json (cliente y remoto)***
```csharp
"preview": "vite preview --port 5001 --strictPort",
"start": "npm run build && npm run preview"
```

***05 Configurar vite.config (remoto)***
```csharp
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

***06 Configurar main.tsx (remoto)***
```csharp
const Main = () => (
  <StrictMode>
    <App />
  </StrictMode>
)

export default Main;
```

***07 Configurar vite.config (cliente)***  
```csharp
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

***08 Crear declares.d.ts (cliente)***  
```csharp
declare module 'remoteApp/remote-app' {
    export default RemoteApp;
}
```

***09 Modificar app remoto***  
***10 Importar app remoto y llamarla cómo un componente***  
***11 npm run start (remoto y cliente)***
