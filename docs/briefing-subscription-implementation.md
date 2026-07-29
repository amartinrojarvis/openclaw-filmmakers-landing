# Nota de entrega · continuidad mensual

**Fecha:** 29 de julio de 2026  
**Rama:** `feat/subscription-map-continuity`  
**Estado:** integración Stripe y aplicación completadas; pendiente E2E y despliegue.

## Implementado

- Los cinco sistemas existentes se presentan como **el mapa**.
- El cierre de la sesión entrega el mapa priorizado.
- El bloque de precios distingue sesión suelta, primer mes y continuidad.
- La sesión suelta mantiene el precio piloto de 75 €.
- La suscripción cobra 199 € el primer mes y 149 €/mes después.
- Los precios habituales tachados usan `<s>` y texto accesible.
- La continuidad permanece visible en tablet/escritorio y se pliega por defecto sólo en móvil.
- FAQ, metadatos, comunicaciones de compra y condiciones están actualizados.
- Página de gracias y correo de bienvenida enlazan al portal seguro de Stripe.
- Intake, webhook, Brevo y panel administrativo distinguen suscripción, modalidad histórica y sesión suelta.
- El panel lee el estado live de Stripe y contempla renovación automática, cancelación al final del periodo y pago pendiente.

## Stripe live

- Precio recurrente de continuidad: `price_1TyUcwHBqq0IP9Iawcxyo0Xk` · 149 €/mes.
- Cargo inicial único: `price_1TyUcxHBqq0IP9IaZQqnJoH7` · 50 €.
- Payment Link: `plink_1TyUdYHBqq0IP9IaePZYy78D`.
- Primer pago comprobable en la configuración: 149 € + 50 € = 199 €.
- Renovaciones: 149 €/mes.
- Límite del nuevo Payment Link: 4 altas nuevas.
- Portal: `bpc_1TyUe2HBqq0IP9Iajh0YXwhU`.
- Portal configurado con cancelación al final del periodo, sin prorrateo, actualización de método de pago e historial de facturas.
- Snapshot previo, privado y con permisos `0600`: `/home/amartin/.hermes/backups/stripe/iaf-before-subscription-20260729T102035Z.json`.

## Capacidad

- Piloto limitado a **5 plazas**.
- Stripe contiene 1 reserva real y 1 compra interna de prueba en el enlace legacy.
- La compra interna legacy queda excluida del inventario comercial.
- Quedan **4 plazas**.
- El enlace histórico de la modalidad anterior se desactivará en el corte a producción y no podrá reactivarse desde `syncAdvisoryCapacity`.

## Compatibilidad histórica

- Los identificadores técnicos de la modalidad anterior se conservan para reconocer compras previas.
- El cargo inicial aislado de 50 € no valida acceso: el backend exige el Price ID mensual.
- La sesión suelta y los productos digitales mantienen su flujo actual.

## Condiciones

- Se retiró el marcador técnico `PENDIENTE REVISIÓN LEGAL` tras la aprobación expresa del propietario para completar el lanzamiento.
- La redacción mantiene cancelación al final del periodo, ausencia de permanencia, alcance limitado, costes de terceros y conservación del precio mientras la suscripción siga activa.
- La aprobación operativa no sustituye una revisión jurídica profesional externa, que sigue siendo recomendable.

## Gates completados

- `npm test`: 19/19.
- `npm run build`: correcto.
- TypeScript: correcto.
- `git diff --check`: correcto.
- Sin claves Stripe, webhook secrets ni credenciales en el diff.
- QA responsive previo a 360, 768 y 1440 px: sin overflow horizontal ni errores de consola.
- Contraste del precio tachado: 8,08:1.
- Lighthouse previo: rendimiento 90, accesibilidad 97, buenas prácticas 100, SEO 100; CLS 0.

## Gates pendientes

1. Crear un enlace QA aislado con descuento live del 100 % y desactivarlo tras la prueba.
2. Desplegar preview y registrar temporalmente su webhook.
3. Verificar checkout, alta, página de gracias, webhook, portal y cancelación sin cobro.
4. Activar eventos recurrentes en el webhook productivo.
5. Fusionar, desplegar y ejecutar smoke público.

## Capturas previas

- Escritorio 1440 px: `desktop1440-pricing-final.png`.
- Tablet 768 px: `tablet768-pricing-final.png`.
- Móvil 360 px: `mobile360-pricing-final.png`.

Las capturas se entregan fuera del repositorio para no añadir binarios de QA al historial de Git.
