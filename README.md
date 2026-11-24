# Prueba técnica: lista de cadenas de texto

Aplicación para gestionar una lista de textos. Está hecha dos veces con el mismo diseño: una en JavaScript sin librerías y otra en React.

```
vanilla/   HTML, CSS y JavaScript, sin dependencias ni build
react/     React 19 con TypeScript, Vite y React Compiler; tests con Vitest y Testing Library
```

## Cómo ejecutarlo

### Vanilla JS

Abre `vanilla/index.html` en el navegador. No hace falta servidor.

### React

Necesita Node 22.12 o superior (la versión usada está en `react/.nvmrc`).

```bash
cd react
npm install
npm run dev
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Arranca el servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Comprueba los tipos y genera el build en `dist/` |
| `npm run lint` | Pasa oxlint |
| `npm test` | Lanza los tests en modo watch (`npx vitest run` para una sola pasada) |
| `npm run coverage` | Lanza los tests con informe de cobertura |

## Qué hace

El botón ADD abre un modal para escribir un texto nuevo. Si está vacío o solo tiene espacios, no se puede añadir; los espacios de los extremos se quitan al guardar.

Un clic sobre un ítem lo selecciona y otro lo deselecciona. Puede haber varios seleccionados a la vez, y DELETE los borra todos (mientras no haya ninguno, está desactivado). Con doble clic se borra un ítem directamente. El botón de deshacer revierte los cambios de uno en uno hasta volver a la lista inicial.

Aparte de lo obligatorio (añadir y borrar), incluye los tres extras del enunciado: selección múltiple, borrado con doble clic y deshacer.

Otros detalles:

- El modal se cierra con CANCEL, con Escape o con un clic fuera. Enter añade el texto.
- Funciona con teclado: Tab llega a cada ítem y Enter o Espacio lo marca. Al abrir el modal, el foco va a la caja de texto; al cerrarlo, vuelve a ADD.
- Cuando la lista no cabe, baja sola hasta el último ítem añadido.
- El diseño se adapta a móvil.

## Tests

Están en la versión React:

- `listReducer.test.ts`: la lógica de la lista (añadir, seleccionar, borrar y deshacer).
- `useItemList.test.ts`: el hook que usa la interfaz.
- `App.test.tsx`: los flujos completos desde la interfaz, del modal al deshacer.

## Integración continua

`.github/workflows/ci.yml` pasa el lint, los tests y el build en cada push a `main` y en cada pull request.
