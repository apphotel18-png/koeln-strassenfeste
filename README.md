# Köln Umsonst

App de eventos gratuitos al aire libre en Colonia (Straßenfeste, Kirmes,
Weihnachtsmärkte, Karneval, fuegos artificiales, Pride/CSD).

## Estructura

```
koeln-umsonst/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── images/
│       ├── hero-dom.jpg
│       ├── heinzels-altermarkt.jpg
│       └── heinzels-heumarkt.jpg
└── src/
    ├── main.jsx
    └── App.jsx        <- toda la lógica y los datos de eventos viven aquí
```

## Cómo correrla en tu computadora

Necesitás tener [Node.js](https://nodejs.org) instalado (versión 18 o
superior). Luego, desde la carpeta `koeln-umsonst`:

```bash
npm install
npm run dev
```

Esto abre la app en `http://localhost:5173`.

## Cómo generar la versión de producción

```bash
npm run build
```

Esto crea una carpeta `dist/` con los archivos listos para subir a
cualquier hosting estático (Vercel, Netlify, GitHub Pages, un servidor
propio, etc.).

## Dónde editar los eventos

Todos los eventos están en el array `EVENTS` dentro de `src/App.jsx`.
Cada evento tiene: fecha de inicio (`date`), fecha de fin (`endDate`),
categoría (`cat`), nombre en los tres idiomas, ubicación (`loc`), fuente
(`source`) y, opcionalmente, una imagen (`img`) y un pie de foto
(`caption`).

Las categorías (Straßenfest, Kirmes, Weihnachtsmarkt, etc.) se definen en
el objeto `CATS`, con su color, ícono y descripción en los tres idiomas.
