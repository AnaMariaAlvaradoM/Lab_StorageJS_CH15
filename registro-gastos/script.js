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
function guardarGastos() 
{
  // Tu código aquí:
 const texto = JSON.stringify(gastos);
  localStorage.setItem(CLAVE_GASTOS, texto);

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
function cargarGastos() 

{
  // Tu código aquí: 

  const texto = localStorage.getItem(CLAVE_GASTOS);
  if (texto === null) {
    gastos = [];
    return;
  }
  try {
    gastos = JSON.parse(texto);
  } catch (error) {
    gastos = [];
    console.warn("El formato de los gastos guardados está dañado.", error);
  }; 

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
function crearGasto(descripcion, monto, categoria) 

{
  // Tu código aquí;

  const descripcionLimpia = descripcion.trim();
  
  if (descripcionLimpia === "" || Number.isNaN(monto) || monto <= 0) {
    return null;
  }

  return {
    descripcion: descripcionLimpia,
    monto: monto,
    categoria: categoria,
    fecha: new Date().toISOString()
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
function agregarGasto()

 {
  // Tu código aquí: 

  const gasto = crearGasto(
    inputDescripcion.value,
    Number(inputMonto.value),
    selectCategoria.value
  );

  if (!gasto) {
    return;
  }
  gastos.push(gasto);
  
  inputDescripcion.value = '';
  inputMonto.value = '';

  guardarGastos();
  actualizarTodo()
}

// ============================================================
// Ejercicio 05 · esDeHoy(gasto) y esDeEsteMes(gasto)
// ============================================================
function esDeHoy(gasto) {
  const fechaGasto = new Date(gasto.fecha);
  const hoy = new Date();

  return (
    fechaGasto.getDate() === hoy.getDate() &&
    fechaGasto.getMonth() === hoy.getMonth() &&
    fechaGasto.getFullYear() === hoy.getFullYear()
  );
}

function esDeEsteMes(gasto) {
  const fechaGasto = new Date(gasto.fecha);
  const hoy = new Date();

  return (
    fechaGasto.getMonth() === hoy.getMonth() &&
    fechaGasto.getFullYear() === hoy.getFullYear()
  );
}

// ============================================================
// Ejercicio 06 · sumarMontos(lista) y mostrarTotales()
// ============================================================
function sumarMontos(lista) {
  return lista.reduce(function (acumulado, gasto) {
    return acumulado + gasto.monto;
  }, 0);
}

function mostrarTotales() {
  const gastosHoy = gastos.filter(esDeHoy);
  const gastosMes = gastos.filter(esDeEsteMes);

  const sumaHoy = sumarMontos(gastosHoy);
  const sumaMes = sumarMontos(gastosMes);

  totalHoy.textContent = formatearPesos(sumaHoy);
  totalMes.textContent = formatearPesos(sumaMes);
}

// ============================================================
// Ejercicio 07 · mostrarCategorias()
// ============================================================
function mostrarCategorias() {
  listaCategorias.innerHTML = "";

  for (let i = 0; i < CATEGORIAS.length; i++) {
    const categoria = CATEGORIAS[i];
    const gastosCategoria = gastos.filter(function (gasto) {
      return gasto.categoria === categoria;
    });

    const totalCategoria = sumarMontos(gastosCategoria);

    const li = document.createElement("li");
    li.textContent = categoria + ": " + formatearPesos(totalCategoria);
    listaCategorias.appendChild(li);
  }
}

// ============================================================
// Ejercicio 08 · mostrarLista()
// ============================================================
function mostrarLista() {
  listaGastos.innerHTML = "";

  for (let i = 0; i < gastos.length; i++) {
    const gasto = gastos[i];

    if (filtroActual !== "Todas" && gasto.categoria !== filtroActual) {
      continue;
    }

    const li = document.createElement("li");
    li.textContent = gasto.descripcion + " - " + formatearPesos(gasto.monto) + " (" + gasto.categoria + ")";

    const botonEliminar = document.createElement("button");
    botonEliminar.className = "eliminar";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.dataset.index = i;

    li.appendChild(botonEliminar);
    listaGastos.appendChild(li);
  }
}

// ============================================================
// Ejercicio 09 · eliminarGasto(evento)
// ============================================================
function eliminarGasto(evento) {
  if (!evento.target.classList.contains("eliminar")) {
    return;
  }

  const posicion = Number(evento.target.dataset.index);
  gastos.splice(posicion, 1);

  guardarGastos();
  actualizarTodo();
}

// ============================================================
// Ejercicio 10 · El filtro se recuerda solo en esta pestaña
// ============================================================
function cambiarFiltro() {
  filtroActual = filtroLista.value;
  sessionStorage.setItem(CLAVE_FILTRO, filtroActual);
  mostrarLista();
}

function cargarFiltro() {
  const filtroGuardado = sessionStorage.getItem(CLAVE_FILTRO);
  if (filtroGuardado === null) {
    filtroActual = "Todas";
  } else {
    filtroActual = filtroGuardado;
  }
  filtroLista.value = filtroActual;
}

// ===== Pintar todo =====
function actualizarTodo() {
  mostrarTotales();
  mostrarCategorias();
  mostrarLista();
}

// ===== Conexiones con la página =====
btnAgregar.addEventListener("click", agregarGasto);
listaGastos.addEventListener("click", eliminarGasto);
filtroLista.addEventListener("change", cambiarFiltro);

// ===== Arranque =====
cargarGastos();
cargarFiltro();
actualizarTodo();