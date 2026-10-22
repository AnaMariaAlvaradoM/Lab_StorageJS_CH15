# 💸 Lab de almacenamiento · ¿Cuánto me costó vivir este mes?

Generation Colombia · Cohorte 15 · JavaScript para la web · Taller calificable

---

## 🧭 ¿Qué es esto?

### La situación

Anotas cada gasto del día en una app: el café, el bus, el almuerzo.
Por la noche cierras el navegador. Al otro día abres la app para ver cuánto llevas en el mes… y está vacía.

**¿Sirve de algo un registro de gastos que se borra cada noche?**
Hoy construyes uno que **no olvida**.

### Para pensar antes de empezar

> Si abres esta misma app en tu celular, ¿vas a ver los gastos que anotaste en el computador?

Escribe tu respuesta en un papel. Al final del taller vuelve a leerla.

### Lo que recibes y lo que construyes

Dentro de la carpeta `registro-gastos/` hay tres archivos:

| Archivo | Cómo viene | Qué haces tú |
|---|---|---|
| `index.html` | Completo | Nada. Ya tiene todos los `id` que vas a usar |
| `estilos.css` | Completo | Nada |
| `script.js` | Con los datos, los elementos y las conexiones listas | Escribes el cuerpo de 13 funciones (10 ejercicios) |

### La idea de todo el taller

Es el mismo ciclo de Café Origen:

```text
al abrir la página  →  cargar (localStorage → gastos)  →  pintar
en cada cambio      →  cambiar gastos  →  guardar  →  pintar
```

El arreglo `gastos` es la verdad. `localStorage` es su respaldo. La pantalla solo **muestra** lo que dice el arreglo.

### La calificación es automática

Cada vez que subes tu código, GitHub corre unos **tests** que abren tu app, le ponen gastos de "ayer" en `localStorage`, hacen clic y revisan lo que aparece.
En pocos minutos ves tu nota de **0.0 a 5.0** y qué te falta.

### ¿Qué es un test?

**Definición técnica:** un test es un código que abre tu página en un navegador simulado, hace lo mismo que haría una persona (escribir, hacer clic, recargar) y compara lo que aparece con lo esperado.

**En la vida real:** es como el auditor que revisa tu extracto: suma a mano, compara con lo que dice el banco y anota cada diferencia.

### Algunos tests revisan CÓMO lo hiciste

En el Ejercicio 06 un test revisa que sumes con `.reduce()`, y en el 06 y el 07 que **reutilices** tus funciones en vez de repetir código.

---

## 📋 Los 10 ejercicios

### Tabla general

Los 10 ejercicios construyen **una sola app**. Cada uno se monta sobre el anterior.

| # | Tema | Función(es) en `script.js` |
|---|---|---|
| 01 | Guardar en `localStorage` | `guardarGastos()` |
| 02 | Cargar sin que un dato roto tumbe la app | `cargarGastos()` |
| 03 | El gasto como objeto, con su fecha | `crearGasto(descripcion, monto, categoria)` |
| 04 | Agregar: cambiar, guardar, pintar | `agregarGasto()` |
| 05 | ¿Es de hoy? ¿Es de este mes? | `esDeHoy(gasto)` y `esDeEsteMes(gasto)` |
| 06 | Totales con `.reduce()` | `sumarMontos(lista)` y `mostrarTotales()` |
| 07 | Total por categoría | `mostrarCategorias()` |
| 08 | Pintar la lista | `mostrarLista()` |
| 09 | Eliminar con un solo escuchador | `eliminarGasto(evento)` |
| 10 | Un filtro que se recuerda solo en la pestaña | `cambiarFiltro()`, `cargarFiltro()` y una parte de `mostrarLista()` |

### ¿Dónde está el enunciado?

Aquí abajo, en el **Paso 3**, explicado paso a paso.
En `script.js` también hay un resumen corto de cada ejercicio, justo encima de su función.

---

## 🚀 Paso 1 · Crea tu copia del repo (Fork)

### ¿Qué es un Fork?

**Definición técnica:** un fork es una copia de un repositorio en tu propia cuenta de GitHub. Puedes modificarla sin afectar el original.

**En la vida real:** la profe tiene el cuaderno original y tú le sacas fotocopia. Escribes en tu fotocopia, no en el cuaderno de la profe.

### Cómo hacerlo

1. Entra al repositorio de la profe en GitHub.
2. Arriba a la derecha, haz clic en **Fork**.
3. Deja todo como está y haz clic en **Create fork**.

### Cómo saber que quedó bien

Arriba a la izquierda debe decir **TU-USUARIO / Lab_StorageJS_CH15**.
Debajo aparece en letra pequeña: *forked from …*

---

## 💻 Paso 2 · Descarga tu copia al computador (Clone)

### Copia la dirección de TU fork

En **tu** fork (no en el de la profe), haz clic en el botón verde **Code** y copia la URL que termina en `.git`.

### Clona desde VS Code

Abre la terminal de VS Code (`Ctrl + ñ` o menú **Terminal → New Terminal**), ubícate en la carpeta donde guardas tus proyectos y escribe esto. Cambia la URL por la que copiaste:

```bash
git clone https://github.com/TU-USUARIO/Lab_StorageJS_CH15.git
```

### Abre la carpeta del proyecto

```bash
cd Lab_StorageJS_CH15
code .
```

### Instala las herramientas de los tests (una sola vez)

Como en los labs de la web y de eventos: los tests usan un **navegador simulado** llamado *jsdom*.
En la terminal, dentro de la carpeta del proyecto:

```bash
npm install
```

Aparece una carpeta `node_modules`. No la toques: es de los tests y nunca se sube a GitHub.

---

## ✍️ Paso 3 · Construye la app

### Mira tu app mientras trabajas

Clic derecho sobre `registro-gastos/index.html` → **Open with Live Server**.
Cada vez que guardas (`Ctrl + S`), la página se recarga sola.

### Ten abiertas Console y Application

En la página, presiona `F12`:

- **Console**: tus `console.log` y los errores.
- **Application → Local storage → http://127.0.0.1:5500**: lo que tu app tiene guardado. Ahí ves cambiar el valor con cada clic.

### Lo que ya viene escrito en `script.js`

- Las constantes `CLAVE_GASTOS`, `CLAVE_FILTRO` y `CATEGORIAS`, y las variables `gastos` y `filtroActual`.
- Los 9 elementos de la página (`inputDescripcion`, `totalHoy`, `listaGastos`…).
- `formatearPesos(valor)`: convierte `7950` en `"$7.950"`.
- `actualizarTodo()`: llama a `mostrarTotales()`, `mostrarCategorias()` y `mostrarLista()`.
- Las conexiones (`addEventListener`) y el arranque.

Tú escribes **dentro** de las funciones que dicen `// Tu código aquí`.

### Reglas de oro

- **No le cambies el nombre** a las funciones, a los archivos ni a la carpeta `registro-gastos/`.
- **No borres** las constantes, las variables ni las conexiones que ya vienen escritas.
- **Los textos van exactos:** `Café - $5.000 (Comida)`, `Comida: $23.000`, `Eliminar`. Usa `formatearPesos`.
- **No toques** `index.html` ni `estilos.css`: GitHub califica con los originales.

### Un ejemplo de la forma (no resuelve ningún ejercicio)

Así se ve una función que lee algo, decide y escribe en la página. Fíjate en el `return` temprano:

```javascript
function saludar(nombre) {
  if (nombre === "") {
    return;
  }
  titulo.textContent = "Hola, " + nombre;
}
```

---

### Ejercicio 01 · Guardar en `localStorage`

#### Qué es `localStorage`

**Definición técnica:** `localStorage` es un almacenamiento del navegador que guarda pares **clave → valor**, solo de **texto**, por página y sin fecha de vencimiento. Lo guardado sigue ahí al recargar y al cerrar el navegador.

**En la vida real:** es tu casillero del gimnasio: dejas tus cosas y mañana siguen ahí. Pero solo en esa sede: en otro gimnasio (otro navegador, otro celular) no está.

#### Qué es `JSON.stringify`

**Definición técnica:** convierte un valor de JavaScript (un arreglo, un objeto) en **texto JSON**, que sí cabe en `localStorage`.

**En la vida real:** desarmar la cama para que quepa en el camión de la mudanza.

#### Tu tarea

En `guardarGastos()`, guarda el arreglo `gastos` **completo** con la clave `CLAVE_GASTOS`:

1. Convierte `gastos` en texto con `JSON.stringify`.
2. Guárdalo con `localStorage.setItem(clave, texto)`.

#### Pruébalo en la consola

```javascript
gastos = [{ descripcion: "Café", monto: 5000, categoria: "Comida", fecha: "2026-10-22T11:15:00.000Z" }];
guardarGastos();
```

En **Application** debe aparecer `registro-gastos` con el texto del arreglo.

#### Para pensar

> Guarda sin `JSON.stringify` y mira Application. ¿Qué dice? ¿Dónde quedaron el café y los 5.000 pesos?

---

### Ejercicio 02 · Cargar sin que un dato roto tumbe la app

#### Qué es `JSON.parse`

**Definición técnica:** convierte un texto JSON de vuelta en el valor de JavaScript (el arreglo, el objeto). Si el texto no es JSON válido, **lanza un error**.

**En la vida real:** armar la cama en la casa nueva. Si las piezas llegaron rotas, no se puede armar.

#### Por qué `try/catch`

Si el texto guardado se daña (alguien lo editó en Application, o lo guardaron sin `JSON.stringify`), `JSON.parse` lanza un error y **todo** tu `script.js` se detiene: no se pinta nada y los botones no responden.
Con `try/catch`, atrapas el error y la app arranca con la lista vacía. *Ya lo viste:* con `fetch` y en Café Origen.

#### Tu tarea

En `cargarGastos()`:

1. Lee el texto guardado con `localStorage.getItem(CLAVE_GASTOS)`.
2. Si es `null` (no hay nada guardado), deja `gastos = []` y sal con `return`.
3. Dentro de un `try`, pon en `gastos` lo que devuelve `JSON.parse(texto)`.
4. En el `catch`, deja `gastos = []` (si quieres, avisa con `console.warn`).

`cargarGastos()` ya se llama sola en el arranque, al final del archivo.

#### Pruébalo

1. Agrega gastos (cuando tengas el 04) o guárdalos desde la consola como en el 01.
2. Recarga con `F5`: deben seguir ahí.
3. En Application cambia el valor por `[{dañado` y recarga: la app abre vacía y la consola muestra tu aviso, sin error rojo.

#### Para pensar

> Al recuperar un gasto, ¿qué tipo de dato es su `fecha`? Escribe en la consola `typeof gastos[0].fecha`.
> `JSON.parse` sabe reconstruir textos, números, arreglos y objetos. ¿Sabe reconstruir fechas?

---

### Ejercicio 03 · El gasto como objeto, con su fecha

#### La forma de un gasto

Cada gasto no es un texto suelto: es un objeto con 4 datos.

```javascript
{ descripcion: "Café", monto: 5000, categoria: "Comida", fecha: "2026-10-22T13:05:00.000Z" }
```

#### Qué es `toISOString`

**Definición técnica:** `new Date()` crea la fecha y hora de este momento. `.toISOString()` la convierte en un texto estándar con fecha, hora, minutos, segundos y milisegundos, listo para guardar.

**En la vida real:** el sello de fecha y hora que pone la registradora en el recibo. Nadie lo escribe a mano.

#### Tu tarea

`crearGasto(descripcion, monto, categoria)` **retorna** el objeto del gasto:

- `descripcion` sin espacios al inicio y al final (`trim`);
- `monto` y `categoria` tal como llegan;
- `fecha` generada por tu código: `new Date().toISOString()`.

Retorna `null` si:

- la descripción queda vacía después del `trim`, o
- el monto no es un número mayor que 0 (`0`, `-500` o `NaN`). Para saber si algo es `NaN`, usa `Number.isNaN(monto)`.

#### Ejemplos

```text
crearGasto("Café", 5000, "Comida")      → { descripcion: "Café", monto: 5000, categoria: "Comida", fecha: "…" }
crearGasto("   Bus  ", 2950, "Transporte") → descripcion: "Bus"
crearGasto("", 5000, "Comida")          → null
crearGasto("Café", 0, "Comida")         → null
crearGasto("Chicle", 1, "Otros")        → sí crea el gasto: 1 es mayor que 0
```

#### Para pensar

> Si el monto viene vacío, `Number("")` da `0`. ¿Qué pasaría con tus totales si guardaras gastos de $0? ¿Lo notarías a simple vista?

---

### Ejercicio 04 · Agregar: cambiar, guardar, pintar

#### Tu tarea

`agregarGasto()` se ejecuta al hacer clic en **Agregar gasto** (la conexión ya está escrita). En orden:

1. Crea el gasto con `crearGasto(...)` usando lo escrito: `inputDescripcion.value`, `Number(inputMonto.value)` y `selectCategoria.value`.
2. Si `crearGasto` retornó `null`, sal con `return`: no se agrega nada.
3. Agrégalo a `gastos` con `push`.
4. Limpia la descripción y el monto (`.value = ""`).
5. Guarda con `guardarGastos()` y vuelve a pintar todo con `actualizarTodo()`.

#### Por qué `Number`

Lo escrito en un `<input>` **siempre** es texto, aunque sea `type="number"`. Sin `Number`, el monto se guardaría como `"5000"` y las sumas pegarían textos: `"5000" + "2950"` da `"50002950"`.

#### Para pensar

> Agrega un gasto y recarga. ¿Sigue ahí? Ahora borra la línea `guardarGastos()` de `agregarGasto`, agrega otro y recarga. ¿Qué pasó? (Vuelve a ponerla.)

---

### Ejercicio 05 · ¿Es de hoy? ¿Es de este mes?

#### Qué son `getDate`, `getMonth` y `getFullYear`

**Definición técnica:** son métodos de un objeto `Date`: `getDate()` da el día del mes (1 a 31), `getMonth()` el mes **empezando en 0** (enero es 0, octubre es 9) y `getFullYear()` el año completo.

**En la vida real:** de un recibo solo miras el día, el mes y el año, y no la hora.

#### Antes de comparar: reconstruir la fecha

`gasto.fecha` es **texto** (Ejercicio 02). Los textos no tienen `getDate()`. Primero reconstruye la fecha:

```javascript
const fechaGasto = new Date(gasto.fecha);
```

#### Tu tarea

- `esDeHoy(gasto)` retorna `true` si el día, el mes **y** el año de la fecha del gasto son iguales a los de hoy (`new Date()`).
- `esDeEsteMes(gasto)` retorna `true` si el mes **y** el año son iguales a los de hoy.

#### Para pensar

> ¿Por qué no sirve `gasto.fecha === new Date().toISOString()`? Piensa en un gasto de las 8:03 a. m. revisado a las 3:47 p. m.
> ¿Por qué hay que comparar también el año? Piensa en un gasto de octubre del año pasado.

---

### Ejercicio 06 · Totales con `.reduce()`

#### Qué es `.filter()`

**Definición técnica:** `arreglo.filter(funcion)` recorre el arreglo y construye uno **nuevo** solo con los elementos para los que la función retorna `true`. No cambia el original. *Ya lo viste* en el taller del restaurante.

```javascript
const deHoy = gastos.filter(esDeHoy);
```

Fíjate: `esDeHoy` va **sin paréntesis**. Le entregas la función a `filter` para que él la llame con cada gasto.

#### Qué es `.reduce()`

**Definición técnica:** `arreglo.reduce(funcion, inicial)` recorre el arreglo y lo "reduce" a **un solo valor**. En cada vuelta, la función recibe lo acumulado hasta ese momento y el elemento actual, y retorna el nuevo acumulado. El segundo argumento es el valor con el que arranca.

**En la vida real:** la cajera que va sumando producto por producto en la registradora, empezando en cero.

```javascript
const total = [1, 2, 3].reduce(function (acumulado, numero) {
  return acumulado + numero;
}, 0);
// total → 6
```

#### Tu tarea

1. `sumarMontos(lista)` retorna la suma de los `monto` de la lista, con `.reduce()` y valor inicial `0`.
2. `mostrarTotales()` escribe en `totalHoy` y `totalMes` el total de los gastos de hoy y del mes:
   - filtra `gastos` con `esDeHoy` y con `esDeEsteMes`;
   - suma cada grupo con `sumarMontos`;
   - escribe el resultado con `formatearPesos` en el `textContent` de cada uno.

#### Ejemplos

```text
sumarMontos([Café 5000, Bus 2950]) → 7950
sumarMontos([])                    → 0
totalHoy  → "$7.950"
```

#### Para pensar

> ¿Por qué el valor inicial de `reduce` es `0` y no `1`? ¿Qué pasa si no le pones valor inicial y la lista está vacía?

---

### Ejercicio 07 · Total por categoría

#### Tu tarea

`mostrarCategorias()`:

1. Vacía `listaCategorias` (`innerHTML = ""`).
2. Recorre el arreglo `CATEGORIAS`.
3. Para cada categoría, filtra los gastos de esa categoría y súmalos con `sumarMontos`.
4. Crea un `<li>` con el texto exacto `Comida: $23.000` y cuélgalo de `listaCategorias`.

Las 5 categorías **siempre** aparecen, aunque su total sea `$0`.

#### Para pensar

> ¿Cómo evitas escribir el mismo bloque 5 veces, uno por categoría?
> Este total por categoría, ¿es de hoy, del mes o de todo el historial? ¿Es un error o una decisión?

---

### Ejercicio 08 · Pintar la lista

#### Tu tarea

`mostrarLista()`:

1. Vacía `listaGastos`.
2. Recorre `gastos` con un `for` de índice (`for (let i = 0; i < gastos.length; i++)`): vas a necesitar la posición.
3. Por cada gasto crea un `<li>` con el texto exacto `Café - $5.000 (Comida)`.
4. Crea un `<button>` con la clase `eliminar`, el texto `Eliminar` y `boton.dataset.index = i`. Cuélgalo del `<li>`, y el `<li>` de `listaGastos`.

Así queda cada gasto:

```html
<li>Café - $5.000 (Comida)<button class="eliminar" data-index="0">Eliminar</button></li>
```

#### Por qué `textContent` y no `innerHTML`

La descripción la escribe la persona. Si escribe etiquetas HTML y las pintas con `innerHTML`, el navegador las ejecuta. Con `textContent` se muestran como texto, sin peligro.

#### Para pensar

> Si tienes varios botones "Eliminar" iguales, ¿cómo sabe cada uno a qué gasto le corresponde?

---

### Ejercicio 09 · Eliminar con un solo escuchador

#### Qué es la delegación de eventos

**Definición técnica:** el clic en un botón **sube** por el árbol: botón → `li` → lista. Delegar es poner **un** escuchador en la lista (que nunca se borra) y preguntar con `evento.target` dónde fue el clic. *Ya lo viste:* en Café Origen y en el tablero de turnos.

**En la vida real:** un solo portero en la entrada del conjunto, en vez de uno por apartamento.

#### Tu tarea

`eliminarGasto(evento)` ya está conectada a `listaGastos`. Escribe su cuerpo:

1. Si `evento.target` **no** tiene la clase `eliminar` (`classList.contains`), sal con `return`.
2. Lee la posición: `Number(evento.target.dataset.index)` (el `dataset` siempre entrega texto).
3. Saca ese gasto del arreglo con `gastos.splice(posicion, 1)`.
4. Guarda con `guardarGastos()` y vuelve a pintar **todo** con `actualizarTodo()`.

#### Para pensar

> Si después de eliminar solo llamas a `mostrarLista()`, ¿qué números de la pantalla quedan mintiendo?

---

### Ejercicio 10 · Un filtro que se recuerda solo en la pestaña

#### Qué es `sessionStorage`

**Definición técnica:** `sessionStorage` funciona igual que `localStorage` (`setItem`, `getItem`), pero sus datos pertenecen a **una pestaña**: sobreviven a la recarga y se borran al cerrar la pestaña. Una pestaña nueva empieza vacía.

**En la vida real:** el tablero de la mesa del restaurante: dura mientras estás sentado.

#### La decisión

Si eliges "Comida" y recargas, te molestaría perder el filtro. Pero si mañana abres la app y solo ves la comida, puedes creer que se borraron los demás gastos. El filtro es **de esta visita**: va en `sessionStorage`.

#### Qué es el evento `change`

En un `<select>`, el evento `change` se dispara cuando la persona elige otra opción. La conexión ya está escrita: `filtroLista.addEventListener("change", cambiarFiltro);`.

#### Tu tarea

1. `cambiarFiltro()`: pon `filtroLista.value` en `filtroActual`, guárdalo con `sessionStorage.setItem(CLAVE_FILTRO, filtroActual)` y llama a `mostrarLista()`.
2. `cargarFiltro()`: lee `sessionStorage.getItem(CLAVE_FILTRO)`; si da `null`, usa `"Todas"`. Ponlo en `filtroActual` y en `filtroLista.value`.
3. Vuelve a `mostrarLista()`: dentro del `for`, si `filtroActual` no es `"Todas"` y el gasto es de otra categoría, sáltalo con `continue`.

`data-index` sigue siendo `i`, la posición en `gastos`, aunque el gasto aparezca de segundo en la lista filtrada.

#### Pruébalo

1. Elige **Comida** y recarga: el filtro sigue puesto.
2. Copia la dirección y ábrela en una **pestaña nueva**: aparece **Todas**, pero tus gastos siguen ahí.

#### Para pensar

> Con el filtro en "Comida", el Almuerzo aparece de segundo. Si su botón tuviera `data-index="1"`, ¿qué gasto se borraría?

---

### Antes de entregar

Revisa que tu app cumpla todo esto:

- Agregas gastos, recargas y siguen ahí, con sus totales.
- Un monto vacío, en 0 o una descripción vacía no agregan nada.
- El total de hoy y el del mes cuadran con una calculadora.
- Las 5 categorías aparecen siempre.
- Eliminar quita el gasto y corrige **todos** los totales.
- El filtro sobrevive a la recarga, pero no a una pestaña nueva.
- Con un dato dañado en Application, la app abre vacía y sin error rojo.

### La pregunta final

> Vuelve a leer lo que respondiste al inicio sobre el celular y el computador.
> ¿Qué necesitarías para ver los mismos gastos en los dos? ¿Lo resuelve `localStorage`?

---

## 🧪 Paso 4 · Prueba tu nota en tu computador

### Corre todos los tests

En la terminal de VS Code, dentro de la carpeta del proyecto:

```bash
npm test
```

### Cómo leer el resultado

- ✅ el ejercicio pasó todos sus tests
- 🟡 pasó algunos tests
- ❌ no pasó ninguno
- Debajo de cada ✗ aparece **qué** esperaba el test

Al final ves tu **nota de 0.0 a 5.0**. Es la misma que te va a poner GitHub.

### Corre un solo ejercicio

Si quieres revisar solo uno, agrega su número. Por ejemplo, para el 05:

```bash
npm test -- 05
```

---

## ☁️ Paso 5 · Sube tu código a tu fork

### Los 3 comandos de siempre

```bash
git add .
git commit -m "Registro de gastos: guardar y cargar"
git push
```

### ¿Qué hace cada uno?

- `git add .` → prepara todos tus cambios (como meter las cosas en una caja).
- `git commit -m "..."` → cierra la caja y le pone una etiqueta con un mensaje.
- `git push` → envía la caja a tu fork en GitHub.

---

## 📬 Paso 6 · Entrega: abre tu Pull Request (solo UNA vez)

### ¿Qué es un Pull Request?

**Definición técnica:** un Pull Request (PR) es una solicitud para proponer tus cambios al repositorio original. Ahí se revisan y se comentan.

**En la vida real:** es como radicar un documento en una oficina. Lo entregas una vez, queda con número de radicado, y cualquier corrección se agrega a ese mismo trámite.

### Cómo abrirlo

1. Entra a **tu fork** en GitHub.
2. Haz clic en **Contribute** y luego en **Open pull request**.
3. En el título escribe tu **nombre y apellido completos**. Por ejemplo: `Laura Gómez Pérez`.
4. Haz clic en **Create pull request**.

### Muy importante

**Abre un solo PR.** Cuando hagas `git push` otra vez, tu PR se actualiza solo y se vuelve a calificar.

---

## 🎯 Paso 7 · Mira tu nota en GitHub

### Dónde aparece

Espera 1 o 2 minutos después de cada `git push` y entra a tu Pull Request:

- Aparece un **comentario automático** con tu nota y una tabla por ejercicio.
- A la derecha verás una etiqueta, por ejemplo **Nota 4.2**.
- El enlace **Ver qué falta por corregir** te muestra qué tests fallaron.

### ¿Quieres subir la nota?

Corrige en VS Code, revisa con `npm test` y haz de nuevo el **Paso 5**.

### Ojo con la fecha límite

Si la profe puso fecha de cierre, los `push` que hagas **después** ya no cambian tu nota.
Si tu primera entrega llega tarde, el PR queda con la etiqueta **⏰ Fuera de plazo**.

---

## 🚫 Archivos que NO debes modificar

### La lista

- `registro-gastos/index.html` y `registro-gastos/estilos.css`
- La carpeta `tests/`
- La carpeta `scripts/`
- La carpeta `.github/`
- Los archivos `package.json` y `package-lock.json`

### ¿Qué pasa si los modificas?

Tu PR queda marcado con la etiqueta **⚠️ Revisar** y la profe lo revisa a mano.
Además, GitHub siempre califica con los archivos originales: solo toma tu `script.js`.

---

## 🆘 Errores frecuentes

### "npm no se reconoce como un comando"

No tienes Node.js instalado, o VS Code se abrió antes de instalarlo.
Instálalo desde [nodejs.org](https://nodejs.org) (versión LTS) y reinicia VS Code.

### "Faltan las herramientas de los tests: corre npm install"

Te saltaste la última parte del **Paso 2**. Corre `npm install` una vez y vuelve a correr `npm test`.

### "se guardó [object Object]"

Guardaste el arreglo sin empacarlo. Usa `JSON.stringify(gastos)` dentro de `setItem` (Ejercicio 01).

### "script.js se detuvo porque JSON.parse recibió un texto dañado"

A `cargarGastos` le falta el `try/catch` (Ejercicio 02).
Mientras lo arreglas, borra el dato dañado en **Application** (clic derecho sobre la clave → **Delete**).

### "intentó usar "gastos.filter" como función, pero no lo es"

`gastos` no es un arreglo: casi siempre es porque pusiste en `gastos` el texto de `getItem` sin `JSON.parse`.

### "el monto debería ser el NÚMERO 5000"

Lo escrito en un `<input>` es texto. Conviértelo con `Number(inputMonto.value)`.

### "intentó leer "…" de algo que vale undefined"

Te faltó un `return`, o usaste una posición que no existe en el arreglo (revisa la condición de tu `for`).

### El total de hoy da $0 aunque acabas de agregar un gasto

Estás comparando el texto completo de la fecha. Compara día, mes y año por separado (Ejercicio 05).

### "Tu código debería usar .reduce()"

El enunciado del Ejercicio 06 pide sumar con `.reduce()`. Funciona con un `for`, pero hoy se practica `reduce`.

### "script.js tiene un error de sintaxis (SyntaxError) (línea …)"

Falta o sobra un paréntesis, una llave o una comilla cerca de esa línea.
Con un error de sintaxis **nada** de `script.js` funciona: por eso fallan todos los ejercicios al tiempo.

### "script.js tardó demasiado: revisa si tienes un ciclo infinito"

Un `for` que nunca termina, casi siempre en `mostrarLista`. Revisa que tenga su `i++`.

### "Se borraron mis gastos"

Mira la barra de direcciones: `127.0.0.1:5500` y `localhost:5500` son **orígenes distintos**, cada uno con su propio `localStorage`. Lo mismo pasa con una ventana de incógnito.

### "Please tell me who you are" al hacer commit

Git no sabe quién eres. Configúralo una sola vez con tu nombre y el correo de tu cuenta de GitHub:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tucorreo@ejemplo.com"
```

### "Permission denied" o error 403 al hacer push

Clonaste el repo de la profe en vez de tu fork.
Vuelve al **Paso 2** y clona la URL de **tu** fork.

---

<sub>© 2026 Ana Alvarado · Educadora Tech & Desarrolladora Full Stack · Todos los derechos reservados · linkedin.com/in/ana-alvarado-instructora-full-stack</sub>
