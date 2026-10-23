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
  //Convertir el arreglo a un texto JSON (PARA CONVERTIR A STRING JSON.stringify)
  //JSON.stringify(gastos); -> !La variable dentro de gastos es el arreglo¡ 
  const gastosTexto = JSON.stringify(gastos);

  //Guardar en localStorage 
  //CLAVE_GASTOS es la etiqueta con la que se guarda, y gastos texto es la variable donde guarde el arreglo
  // Sintanxis del local localStorage.setItem(clave, valor) clave-> CLAVE_GASTOS, valor->gastosTexto
  localStorage.setItem(CLAVE_GASTOS, gastosTexto);

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

  //Variable para leer lo que hay guardado en localstorage
  //setItem -> Envia getItem -> Trae
  const textoGuardado = localStorage.getItem(CLAVE_GASTOS);

  //   - si no hay nada guardado (getItem da null) → gastos = []
  if (!textoGuardado) {
    gastos = [];
    return
  }

  //   - si hay texto → gastos = JSON.parse(texto)
  //try - catch estructura de control de excepciones que se usa para detectar y gestionar errores de ejecucion sin que el 
  //programa se detenta abrutamente:
  //try -> contiene el bloque que puede generar un error, para evaluarlo. catch-> Maneja el error en caso que se presente, evitando que la APP falle
  try {
    gastos = JSON.parse(textoGuardado);
  } catch {
    //   - si el texto está dañado (JSON.parse falla) → gastos = []
    console.log("Error al parsear los gastos desde localStorage: ", console.error());
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

  //Limpiar los espacios en blanco o innecesario con trim
  const descripcionLimpia = descripcion.trim();

  //Convertir a numero para asegurarnos de que llega sin problemas
  const montoaNumero = Number(monto);

  // Retorna null si la descripción queda vacía, o si el monto no es
  // un número mayor que 0 (ojo: Number("abc") da NaN).

  if (!descripcionLimpia || isNaN(montoaNumero) || montoaNumero <= 0) {
    return null;
  }

  // Retorna un objeto con esta forma:
  //   { descripcion: "Café", monto: 5000, categoria: "Comida", fecha: "2026-10-22T13:05:00.000Z" }
  return {
    descripcion: descripcionLimpia,
    monto: montoaNumero,
    categoria: categoria,
    fecha: new Date().toISOString() //toIsoString() -> convierte la fecha y lo convierte en cadena de texto bajo el estandar internacional ISO 8601
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
  //Crear el objeto con los valores del formulario, puestos arriba 
  const nuevoGasto = crearGasto(
    inputDescripcion.value,
    Number(inputMonto.value),
    selectCategoria.value
  );

  //   2. si es null, no hagas nada más (return)
  if (nuevoGasto === null) {
    return;
  }

  //3. agrégalo a gastos y limpia la descripción y el monto
  gastos.push(nuevoGasto);

  inputDescripcion.value = "";
  inputMonto.value = "";

  //   4. guárdalo (Ejercicio 01) y vuelve a pintar todo: actualizarTodo()
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
  const hoy = new Date();
  const fechaGasto = new Date(gasto.fecha);

  // retorna si coinciden dia, mes y año
  return (
    fechaGasto.getFullYear() === hoy.getFullYear()
    && fechaGasto.getMonth() === hoy.getMonth()
    && fechaGasto.getDate() === hoy.getDate()
  );

}

function esDeEsteMes(gasto) {
  const hoy = new Date();
  const fechaGasto = new Date(gasto.fecha);

  // retorna si coinciden mes y año
  return (
    fechaGasto.getFullYear() === hoy.getFullYear()
    && fechaGasto.getMonth() === hoy.getMonth()
  );
}

// ============================================================
// Ejercicio 06 · sumarMontos(lista) y mostrarTotales()
// ============================================================
// - sumarMontos: suma los montos de la lista con .reduce() (empieza en 0)
// - mostrarTotales: escribe en totalHoy y totalMes el total de los
//   gastos de hoy y del mes, con formatearPesos. Reutiliza esDeHoy,
//   esDeEsteMes (con .filter) y sumarMontos.
// ============================================================
function sumarMontos(lista) {

  if (!Array.isArray(lista)) {
    return 0;
  }
  // - sumarMontos: suma los montos de la lista con .reduce() (empieza en 0)
  // Sintaxis array.reduce((acumulador, valorActual, indice, array) => { lógica }, valorInicial);
  return lista.reduce((acumulado, gastos) => acumulado + gastos.monto, 0);
}

function mostrarTotales() {
  // - mostrarTotales: escribe en totalHoy y totalMes el total de los
  //   gastos de hoy y del mes, con formatearPesos. Reutiliza esDeHoy,
  //   esDeEsteMes (con .filter) y sumarMontos.

  //Filter crear un nuevo array con todos los elementos que cumplan la condicion implementada por lafuncion dada
  const gastosH = gastos.filter(esDeHoy);
  const montoH = sumarMontos(gastosH);

  //Enviar al html
  totalHoy.textContent = formatearPesos(montoH);

  //Filter crear un nuevo array con todos los elementos que cumplan la condicion implementada por lafuncion dada
  const gastosM = gastos.filter(esDeEsteMes);
  const montoM = sumarMontos(gastosM);

  //Enviar al html
  totalMes.textContent = formatearPesos(montoM);
}

// ============================================================
// Ejercicio 07 · mostrarCategorias()
// ============================================================
// Vacía listaCategorias y, recorriendo CATEGORIAS, crea un <li> por
// categoría con este texto exacto:   Comida: $23.000
// Las 5 categorías siempre aparecen, aunque su total sea $0.
// ============================================================
function mostrarCategorias() {
  // Vaciar listaCategorias
  listaCategorias.innerHTML = "";

  //Validar que sea un arreglo valido 
  const listaGastosActual = Array.isArray(gastos) ? gastos : [];


  // Recorrer las categorias 
  CATEGORIAS.forEach(categoria => {

    // Filtrar los gastos que pertenecen a esta categoría
    const gastosCategoria = listaGastosActual.filter(gasto => gasto.categoria === categoria);

    // Sumar el total gastado en la categoría
    const totalCategoria = sumarMontos(gastosCategoria);

    // Crear el elemento <li> y asignar el texto
    const li = document.createElement("li");
    li.textContent = `${categoria}: ${formatearPesos(totalCategoria)}`;

    // Agregar el elemento a la lista HTML
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
  // Vaciar listaGastos
  listaGastos.innerHTML = "";

  //Validar que sea un arreglo valido 
  const listaGastosActual = Array.isArray(gastos) ? gastos : [];

  //Recorrer el arreglo de gastos
  listaGastosActual.forEach((gasto, index) => {
    //Crear el elemento <li>
    const li = document.createElement("li");

    //   <li>Café - $5.000 (Comida)<button class="eliminar" data-index="0">Eliminar</button></li>
    li.innerHTML = `${gasto.descripcion} - ${formatearPesos(gasto.monto)} (${gasto.categoria})<button class="eliminar" data-index="${index}">Eliminar</button>`;

    //Agregar el <li> al contenedor de la lista
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
  //Verifica que el click fue en eliminar 
  //event.target es el elemento exacto donde el usuario hace click .contains-> pregunta si dentro de la clase esta la clase "Eliminar"
  if (!evento.target.classList.contains("eliminar")) {
    return;
  }

  //Posicion con con evento.target.dataset.index
  const posicion = Number(evento.target.dataset.index);
  // - sácalo del arreglo con splice, guarda y vuelve a pintar TODO
  //splice sirve para eliminar, reemplazar o agregar elemento a una posicion especifica;
  gastos.splice(posicion, 1);

  //Pintar todo
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
  //Guardar en filtroActual
  filtroActual = filtroLista.value;

  //sessionStorage
  sessionStorage.setItem(CLAVE_FILTRO, filtroActual);

  //pintar lista
  mostrarLista();
}

function cargarFiltro() {
  //leer el filtro 
  filtroActual = sessionStorage.getItem(CLAVE_FILTRO) || "Todas";
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
