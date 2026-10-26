// ============================================================
// Lab de almacenamiento · ¿Cuánto me costó vivir este mes?
// ============================================================
// Una app de gastos personales que NO olvida: lo que anotes hoy
// sigue ahí mañana, aunque cierres el navegador.
// El enunciado completo de cada ejercicio está en el README.md.
//
// La idea de todo el taller:
//   al abrir la página  → cargar (localStorage → gastos) → pintar
//   en cada cambio      → cambiar gastos → guardar → pintar
// ============================================================

// ===== Datos (ya vienen listos, no los borres) =====
const CLAVE_GASTOS = "registro-gastos";
const CLAVE_FILTRO = "registro-gastos-filtro";
const CATEGORIAS = ["Comida", "Transporte", "Entretenimiento", "Servicios", "Otros"];

let gastos = [];
let filtroActual = "Todas";

// ===== Elementos de la página (ya vienen listos) =====
const inputDescripcion = document.querySelector("#inputDescripcion");
const inputMonto = document.querySelector("#inputMonto");
const selectCategoria = document.querySelector("#selectCategoria");
const btnAgregar = document.querySelector("#btnAgregar");
const totalHoy = document.querySelector("#totalHoy");
const totalMes = document.querySelector("#totalMes");
const listaCategorias = document.querySelector("#listaCategorias");
const listaGastos = document.querySelector("#listaGastos");
const filtroLista = document.querySelector("#filtroLista");

// ===== Ayuda (ya viene lista): 7950 → "$7.950" =====
function formatearPesos(valor) {
  return "$" + valor.toLocaleString("es-CO");
}

// ============================================================
// Ejercicio 01 · guardarGastos(): del arreglo al almacenamiento
// ============================================================
// Guarda TODO el arreglo gastos en localStorage, con la clave
// CLAVE_GASTOS. Recuerda: localStorage solo guarda texto
// → empaca el arreglo con JSON.stringify.
// ============================================================
function guardarGastos() {
  // setItem(clave, valor): guarda el valor bajo esa clave.
  // CLAVE_GASTOS es la constante definida arriba ("registro-gastos").
  localStorage.setItem(CLAVE_GASTOS, JSON.stringify(gastos));
}

  // CASOS 2 y 3: hay texto, pero no sabemos si es válido.
  // Usamos try/catch porque JSON.parse LANZA UN ERROR si el texto
  // está roto (por ejemplo "{roto"), y un error sin controlar
  // detendría todo el script.
  try {
    // JSON.parse hace lo contrario de JSON.stringify:
    // convierte el texto en el arreglo de objetos original.
    gastos = JSON.parse(texto);
  } catch (error) {
    // Si JSON.parse falló, descartamos el dato dañado y seguimos
    // con una lista vacía. La app continúa funcionando.
    gastos = [];
  }


// ============================================================
// Ejercicio 02 · cargarGastos(): leer sin que un dato roto tumbe la app
// ============================================================
// Lee el texto guardado con la clave CLAVE_GASTOS y ponlo en gastos:
//   - si no hay nada guardado (getItem da null) → gastos = []
//   - si hay texto → gastos = JSON.parse(texto)
//   - si el texto está dañado (JSON.parse falla) → gastos = []
//     (usa try/catch: la app debe seguir funcionando)
// ============================================================
function cargarGastos() {
  // getItem devuelve el texto guardado con esa clave,
  // o null si nunca se ha guardado nada (ej: primera visita).
  const texto = localStorage.getItem(CLAVE_GASTOS);

  // CASO 1: no hay nada guardado.
  // Empezamos con lista vacía y salimos con return.
  if (texto === null) {
    gastos = [];
    return;
  }

  // CASOS 2 y 3: hay texto, pero no sabemos si es válido.
  // JSON.parse LANZA UN ERROR si el texto está roto, y un error
  // sin controlar detendría todo el script. Por eso try/catch.
  try {
    // Convierte el texto de vuelta en el arreglo de objetos.
    gastos = JSON.parse(texto);
  } catch (error) {
    // Dato dañado: lo descartamos y la app sigue funcionando.
    gastos = [];
  }
}

// ============================================================
// Ejercicio 03 · crearGasto(descripcion, monto, categoria)
// ============================================================
// Retorna un objeto con esta forma:
//   { descripcion: "Café", monto: 5000, categoria: "Comida", fecha: "2026-10-22T13:05:00.000Z" }
// - descripcion va sin espacios al inicio ni al final (trim)
// - fecha la genera tu código: new Date().toISOString()
// Retorna null si la descripción queda vacía, o si el monto no es
// un número mayor que 0 (ojo: Number("abc") da NaN).
// ============================================================
function crearGasto(descripcion, monto, categoria) {
  // trim() quita los espacios al inicio y al final.
  // "  Café " → "Café"   |   "   " → ""
  const texto = descripcion.trim();

  // Number() convierte a número, venga como texto ("5000") o número.
  // Si no se puede convertir (ej: "abc"), el resultado es NaN.
  const valor = Number(monto);

  // VALIDACIÓN 1: la descripción no puede quedar vacía.
  if (texto === "") {
    return null;
  }

  // VALIDACIÓN 2: el monto debe ser un número mayor que 0.
  // isNaN se revisa aparte porque NaN <= 0 da false y, sin esta
  // comprobación, un NaN pasaría la validación.
  if (isNaN(valor) || valor <= 0) {
    return null;
  }

  // Todo es válido: devolvemos el objeto con la forma pedida.
  return {
    descripcion: texto,                 // ya sin espacios sobrantes
    monto: valor,                       // guardado como NÚMERO
    categoria: categoria,               // tal cual llegó del select
    fecha: new Date().toISOString()     // fecha y hora actuales, como TEXTO
  };
}

// ============================================================
// Ejercicio 04 · agregarGasto(): cambiar, guardar, pintar
// ============================================================
// Se ejecuta al hacer clic en "Agregar gasto" (la conexión ya está
// escrita abajo). En orden:
//   1. crea el gasto con crearGasto(...) usando lo escrito en el
//      formulario (el monto llega como texto: conviértelo con Number)
//   2. si es null, no hagas nada más (return)
//   3. agrégalo a gastos y limpia la descripción y el monto
//   4. guárdalo (Ejercicio 01) y vuelve a pintar todo: actualizarTodo()
// ============================================================
function agregarGasto() {
  // PASO 1: crear el gasto con lo escrito en el formulario.
  // .value siempre devuelve TEXTO, por eso el monto se convierte
  // con Number(). crearGasto limpia y valida los datos.
  const gasto = crearGasto(
    inputDescripcion.value,
    Number(inputMonto.value),
    selectCategoria.value
  );

  // PASO 2: si los datos no eran válidos, crearGasto devolvió null.
  // Salimos sin hacer nada: no se agrega, no se guarda, y el
  // formulario conserva lo escrito para poder corregirlo.
  if (gasto === null) {
    return;
  }

  // PASO 3: agregar el gasto al final del arreglo...
  gastos.push(gasto);

  // ...y limpiar descripción y monto para el siguiente gasto.
  // La categoría no se limpia a propósito.
  inputDescripcion.value = "";
  inputMonto.value = "";

  // PASO 4: guardar en localStorage (Ejercicio 01) y volver a
  // pintar totales, categorías y lista.
  guardarGastos();
  actualizarTodo();
}

// ============================================================
// Ejercicio 05 · esDeHoy(gasto) y esDeEsteMes(gasto)
// ============================================================
// gasto.fecha es TEXTO: reconstruye la fecha con new Date(gasto.fecha).
// - esDeHoy → true si coinciden día, mes y año con hoy
// - esDeEsteMes → true si coinciden mes y año con hoy
// No compares el texto completo: la hora casi nunca es la misma.
// ============================================================
function esDeHoy(gasto) {
  // La fecha del gasto está guardada como texto, así que yo la
  // reconstruyo como fecha con new Date(...).
  const fechaGasto = new Date(gasto.fecha);
  // Creo la fecha de hoy para comparar.
  const hoy = new Date();

  // Comparo día, mes y año por separado. No comparo el texto
  // completo porque la hora casi nunca coincide.
  return (
    fechaGasto.getDate() === hoy.getDate() &&
    fechaGasto.getMonth() === hoy.getMonth() &&
    fechaGasto.getFullYear() === hoy.getFullYear()
  );
}




function esDeEsteMes(gasto) {
  function esDeEsteMes(gasto) {
  const fechaGasto = new Date(gasto.fecha);
  const hoy = new Date();

  // Aquí solo me importan el mes y el año, el día no.
  return (
    fechaGasto.getMonth() === hoy.getMonth() &&
    fechaGasto.getFullYear() === hoy.getFullYear()
  );
}}

// ============================================================
// Ejercicio 06 · sumarMontos(lista) y mostrarTotales()
// ============================================================
// - sumarMontos: suma los montos de la lista con .reduce() (empieza en 0)
// - mostrarTotales: escribe en totalHoy y totalMes el total de los
//   gastos de hoy y del mes, con formatearPesos. Reutiliza esDeHoy,
//   esDeEsteMes (con .filter) y sumarMontos.
// ============================================================
function sumarMontos(lista) {
    // Recorro la lista acumulando los montos. Empiezo en 0 para que
  // una lista vacía devuelva 0 y no un error.
  return lista.reduce((acumulado, gasto) => acumulado + gasto.monto, 0);

}

function mostrarTotales() {
  // Me quedo solo con los gastos de hoy y con los del mes.
  const gastosHoy = gastos.filter(esDeHoy);
  const gastosMes = gastos.filter(esDeEsteMes);

  // Sumo cada grupo y lo escribo en pantalla con formato de pesos.
  totalHoy.textContent = formatearPesos(sumarMontos(gastosHoy));
  totalMes.textContent = formatearPesos(sumarMontos(gastosMes));
}

// ============================================================
// Ejercicio 07 · mostrarCategorias()
// ============================================================
// Vacía listaCategorias y, recorriendo CATEGORIAS, crea un <li> por
// categoría con este texto exacto:   Comida: $23.000
// Las 5 categorías siempre aparecen, aunque su total sea $0.
// ============================================================
function mostrarCategorias() {
  // Primero vacío la lista para no duplicar elementos al repintar.
  listaCategorias.innerHTML = "";

  // Recorro las 5 categorías, así todas aparecen aunque sumen $0.
  CATEGORIAS.forEach((categoria) => {
    // Filtro los gastos de esta categoría y los sumo.
    const gastosCategoria = gastos.filter((gasto) => gasto.categoria === categoria);
    const total = sumarMontos(gastosCategoria);

    // Creo el <li> con el texto exacto, por ejemplo "Comida: $23.000".
    const li = document.createElement("li");
    li.textContent = categoria + ": " + formatearPesos(total);
    listaCategorias.appendChild(li);
  });
}

// ============================================================
// Ejercicio 08 · mostrarLista()
// ============================================================
// Vacía listaGastos y crea un <li> por cada gasto del arreglo:
//   <li>Café - $5.000 (Comida)<button class="eliminar" data-index="0">Eliminar</button></li>
// data-index es la posición del gasto en el arreglo gastos.
// (En el Ejercicio 10 vuelves aquí para agregar el filtro.)
// ============================================================
function mostrarLista() {
  // Vacío la lista antes de pintarla de nuevo.
  listaGastos.innerHTML = "";

  // forEach me da el gasto y su posición (index) en el arreglo.
  gastos.forEach((gasto, index) => {
    const li = document.createElement("li");
    // Texto del gasto, por ejemplo: "Café - $5.000 (Comida)"
    li.textContent =
      gasto.descripcion + " - " + formatearPesos(gasto.monto) + " (" + gasto.categoria + ")";

    // Creo el botón Eliminar y le guardo la posición del gasto en
    // data-index, para saber cuál borrar cuando le hagan clic.
    const boton = document.createElement("button");
    boton.className = "eliminar";
    boton.dataset.index = index;
    boton.textContent = "Eliminar";

    li.appendChild(boton);
    listaGastos.appendChild(li);
  });
}

// ============================================================
// Ejercicio 09 · eliminarGasto(evento): UN escuchador en la lista
// ============================================================
// La conexión ya está escrita abajo (en la lista, no en cada botón).
// - si el clic NO fue en un botón con la clase "eliminar" → return
// - lee la posición con evento.target.dataset.index (llega como texto)
// - sácalo del arreglo con splice, guarda y vuelve a pintar TODO
// ============================================================
function eliminarGasto(evento) {
   // Tengo un solo escuchador en toda la lista, así que primero
  // reviso si el clic fue en un botón "eliminar". Si no, no hago nada.
  if (!evento.target.classList.contains("eliminar")) {
    return;
  }

  // La posición llega como texto, la convierto a número.
  const posicion = Number(evento.target.dataset.index);

  // Saco ese gasto del arreglo (splice borra 1 elemento en esa posición).
  gastos.splice(posicion, 1);

  // Guardo y repinto todo, igual que al agregar.
  guardarGastos();
  actualizarTodo();
}

// ============================================================
// Ejercicio 10 · El filtro se recuerda solo en esta pestaña
// ============================================================
// - cambiarFiltro: guarda filtroLista.value en filtroActual y en
//   sessionStorage (clave CLAVE_FILTRO) y vuelve a pintar la lista
// - cargarFiltro: lee el filtro de sessionStorage (si no hay → "Todas"),
//   lo pone en filtroActual y en filtroLista.value
// - en mostrarLista: si filtroActual no es "Todas", sáltate los gastos
//   de otras categorías (data-index sigue siendo la posición en gastos)
// ============================================================
function cambiarFiltro() {
  // Guardo la categoría elegida en la variable...
  filtroActual = filtroLista.value;
  // ...y en sessionStorage, para recordarla mientras la pestaña siga abierta.
  sessionStorage.setItem(CLAVE_FILTRO, filtroActual);
  // Repinto solo la lista con el nuevo filtro.
  mostrarLista();
}

function cargarFiltro() {
   // Leo el filtro guardado. Si no hay nada, uso "Todas".
  const guardado = sessionStorage.getItem(CLAVE_FILTRO);
  filtroActual = guardado || "Todas";
  // Dejo el <select> mostrando el mismo filtro.
  filtroLista.value = filtroActual;
}

// ===== Pintar todo (ya viene lista) =====
function actualizarTodo() {
  mostrarTotales();
  mostrarCategorias();
  mostrarLista();
}

// ===== Conexiones con la página (ya vienen listas) =====
btnAgregar.addEventListener("click", agregarGasto);
listaGastos.addEventListener("click", eliminarGasto);
filtroLista.addEventListener("change", cambiarFiltro);

// ===== Arranque (ya viene listo) =====
cargarGastos();
cargarFiltro();
actualizarTodo();
