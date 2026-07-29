# Nota de entrega · continuidad mensual

**Fecha:** 29 de julio de 2026  
**Rama:** `feat/subscription-map-continuity`  
**Estado:** implementación y QA completados; no desplegado.

## Implementado

- Los cinco sistemas existentes se presentan como **el mapa**.
- El cierre de la sesión entrega el mapa priorizado.
- El bloque de precios distingue sesión suelta, primer mes y continuidad.
- La sesión suelta mantiene el enlace y el precio piloto de 75 €.
- La tarjeta de suscripción presenta 199 € el primer mes y 149 €/mes después.
- Los precios habituales tachados usan `<s>` y texto accesible.
- La continuidad permanece visible en tablet/escritorio y se pliega por defecto sólo en móvil.
- FAQ, metadatos, comunicaciones de compra y condiciones se han actualizado.
- Las condiciones incluyen el marcador `PENDIENTE REVISIÓN LEGAL`.

## Decisiones confirmadas

1. El piloto continúa limitado a **5 plazas** y quedan **4 disponibles**. Esta decisión sustituye las referencias a 10 plazas del briefing.
2. No se ofrece por ahora una biblioteca de sesiones grabadas; se han eliminado esas menciones.
3. El texto común del proceso de compra sigue siendo «Pagas y solicitas una fecha con Stripe» porque también se aplica a la sesión suelta.
4. Los identificadores técnicos históricos relacionados con la modalidad anterior se conservan para reconocer compras previas. Ninguna etiqueta visible usa ya el vocabulario antiguo.
5. Las tarjetas usan altura natural en escritorio para evitar un gran espacio vacío en la sesión suelta; permanecen alineadas por arriba.

## Bloqueantes antes de publicar

- Crear en Stripe el Payment Link recurrente correcto: 199 € el primer periodo y 149 €/mes después.
- Sustituir el enlace temporal de la tarjeta y añadir los nuevos Price IDs a la clasificación segura del backend.
- Activar el portal de cliente de Stripe con cancelación de suscripciones. La cuenta tiene actualmente 0 configuraciones activas.
- Revisar y validar el nuevo apartado de condiciones.
- Hacer una compra E2E en modo de prueba con alta, primer cargo, renovación, portal y cancelación antes de producción.

La cuenta productiva comprobada tiene actualmente 0 Payment Links recurrentes y 0 precios recurrentes. El enlace de 199 € existente continúa siendo un pago único compuesto por 75 € + 124 €.

## Verificación realizada

- `npm run build`: correcto.
- `npm test`: 16/16 tests correctos.
- `git diff --check`: correcto.
- Playwright a 360, 768 y 1440 px: sin overflow horizontal, errores de consola, errores JavaScript ni peticiones fallidas.
- Anclajes `#sesion`, `#metodo`, `#encaje` y `#proyectos`: presentes; navegación a `#sesion` comprobada.
- Desplegable móvil: cerrado por defecto, foco visible de 2 px y `prefers-reduced-motion` respetado.
- Contraste del precio tachado: 8,08:1.
- Lighthouse rama / producción: rendimiento 90/90, accesibilidad 97/97, buenas prácticas 100/100, SEO 100/100; CLS 0.

## Capturas

- Escritorio 1440 px: `desktop1440-pricing-final.png`
- Tablet 768 px: `tablet768-pricing-final.png`
- Móvil 360 px: `mobile360-pricing-final.png`

Las capturas finales se entregan fuera del repositorio para no añadir binarios de QA al historial de Git.
