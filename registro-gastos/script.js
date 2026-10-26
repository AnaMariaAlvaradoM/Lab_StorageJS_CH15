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
  localStorage.setItem(CLAVE_GASTOS, JSON.stringify(gastos)) //acá se guarda lo que se crea dentro del parentesis

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
  const texto = localStorage.getItem(CLAVE_GASTOS)
  if (texto === null) {
    gastos = []
    return
  } else {
    try {
      gastos = JSON.parse(texto)
    } catch {
      gastos = []
    }
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
  let descripcionLimpia;
  descripcionLimpia = descripcion.trim()
  let fecha = new Date().toISOString();
  if (descripcionLimpia === "" || Number.isNaN(Number(monto)) || Number(monto) <= 0) {
    return null
  } else {
    return {
      descripcion: descripcionLimpia,
      monto: Number(monto),
      categoria: categoria,
      fecha: fecha
    }
  }

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
  let gastoCreado = crearGasto(inputDescripcion.value, Number(inputMonto.value), selectCategoria.value)
  if (gastoCreado === null) {
    return
  } else {
    //No es necesario
  }
  gastos.push(gastoCreado)
  inputDescripcion.value = "";
  inputMonto.value = "";
  guardarGastos()
  actualizarTodo()
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
  let fechaGasto = new Date(gasto.fecha)
  let fechaActual = new Date()
  if (fechaGasto.getDate() === fechaActual.getDate() && fechaGasto.getMonth() === fechaActual.getMonth() && fechaGasto.getFullYear() === fechaActual.getFullYear()) {
    return true
  } else {
    return false
  }

}

function esDeEsteMes(gasto) {
  let fechaGasto = new Date(gasto.fecha)
  let fechaActual = new Date()
  if (fechaGasto.getMonth() === fechaActual.getMonth() && fechaGasto.getFullYear() === fechaActual.getFullYear()) {
    return true
  } else {
    return false
  }

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
  return lista.reduce((acumulador, gastoActual) => {
    return acumulador + gastoActual.monto
  }, 0)
}

function mostrarTotales() {
  let gastosHoy = gastos.filter(esDeHoy);
  let gastosMes = gastos.filter(esDeEsteMes);

  let totalGastosHoy = sumarMontos(gastosHoy);
  let totalGastosMes = sumarMontos(gastosMes);

  totalHoy.textContent = formatearPesos(totalGastosHoy);
  totalMes.textContent = formatearPesos(totalGastosMes);
}

// ============================================================
// Ejercicio 07 · mostrarCategorias()
// ============================================================
// Vacía listaCategorias y, recorriendo CATEGORIAS, crea un <li> por
// categoría con este texto exacto:   Comida: $23.000
// Las 5 categorías siempre aparecen, aunque su total sea $0.
// ============================================================
function mostrarCategorias() {
  listaCategorias.innerHTML = ""

  for (let categoria of CATEGORIAS) {
    let gastosCategoria = gastos.filter(gasto => gasto.categoria === categoria)
    let totalCategoria = sumarMontos(gastosCategoria)
    let nuevaCat = document.createElement("li")
    nuevaCat.textContent = `${categoria}: ${formatearPesos(totalCategoria)}`
    listaCategorias.appendChild(nuevaCat)
  }
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
  listaGastos.innerHTML = ""
  for (let i = 0; i < gastos.length; i++) {
    let gastoActual = gastos[i]
    if(filtroActual!="Todas" && filtroActual!=gastoActual.categoria ){
      continue
    }
    let nuevoGast = document.createElement("li")
    nuevoGast.textContent = `${gastoActual.descripcion} - ${formatearPesos(gastoActual.monto)} (${gastoActual.categoria})`
    let btnEliminar = document.createElement("button")
    btnEliminar.textContent = "Eliminar"
    btnEliminar.classList.add("eliminar")
    btnEliminar.className = "eliminar"
    btnEliminar.dataset.index = i
    nuevoGast.appendChild(btnEliminar)
    listaGastos.appendChild(nuevoGast)


  }
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
  if (!evento.target.classList.contains("eliminar")) {
    return
  }
  let leerIndex = Number(evento.target.dataset.index) //number para cambiar el texto
  gastos.splice(leerIndex, 1)
  guardarGastos()
  actualizarTodo()
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
  filtroActual = filtroLista.value
  sessionStorage.setItem(CLAVE_FILTRO, filtroActual)
  mostrarLista()

}

function cargarFiltro() {
  const filtroNuevo = sessionStorage.getItem(CLAVE_FILTRO)
  if (filtroNuevo === null) {
    filtroActual = "Todas"
  } else {
    filtroActual = filtroNuevo
  }
  filtroLista.value = filtroActual

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
