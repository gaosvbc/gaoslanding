# Tests

Tests del comportamiento pensado para agentes (404 reales, negociación de
contenido markdown, contenido sin JavaScript, JSON-LD y `llms.txt`).

No añaden dependencias: usan el runner integrado de Node.

```bash
node --test tests/*.test.mjs
```

También conviene ejecutar el type-check del proyecto:

```bash
npm run lint
```

Si cambias el copy de la home, `public/*.md`, las rutas de `src/App.tsx` o la
plantilla del 404, estos tests fallarán hasta que actualices las tres capas
(SPA, markdown y configuración de routing).
