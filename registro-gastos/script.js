// ============================================
// Registro de gastos - Lab de almacenamiento
// ============================================

// ---------- Constantes y variables ----------
const CLAVE_GASTOS = "registro-gastos";
const CLAVE_FILTRO = "registro-gastos-filtro";
const CATEGORIAS = ["Comida", "Transporte", "Entretenimiento", "Servicios", "Otros"];

let gastos = [];
let filtroActual = "Todas";

// ---------- Elementos de la página ----------
const inputDescripcion = document.getElementById("inputDescripcion");
const inputMonto = document.getElementById("inputMonto");
const selectCategoria = document.getElementById("selectCategoria");
const btnAgregar = document.getElementById("btnAgregar");
const totalHoy = document.getElementById("totalHoy");
const totalMes = document.getElementById("totalMes");
const listaCategorias = document.getElementById("listaCategorias");
const filtroLista = document.getElementById("filtroLista");
const listaGastos = document.getElementById("listaGastos");

// ---------- Funciones que ya venían ----------
function formatearPesos(valor) {
  return "$" + valor.toLocaleString("es-CO");
}

function actualizarTodo() {
  mostrarTotales();
  mostrarCategorias();
  mostrarLista();
}

// ---------- Ejercicio 01: guardar en localStorage ----------
function guardarGastos() {
  const texto = JSON.stringify(gastos);
  localStorage.setItem(CLAVE_GASTOS, texto);
}

// ---------- Ejercicio 02: cargar sin que un dato roto tumbe la app ----------
function cargarGastos() {
  const texto = localStorage.getItem(CLAVE_GASTOS);

  if (texto === null) {
    gastos = [];
    return;
  }

  try {
    gastos = JSON.parse(texto);
  } catch (error) {
    console.warn("El dato guardado estaba dañado, se empieza con la lista vacía");
    gastos = [];
  }
}

// ---------- Ejercicio 03: el gasto como objeto ----------
function crearGasto(descripcion, monto, categoria) {
  const descripcionLimpia = descripcion.trim();

  if (descripcionLimpia === "") {
    return null;
  }

  if (Number.isNaN(monto) || monto <= 0) {
    return null;
  }

  return {
    descripcion: descripcionLimpia,
    monto: monto,
    categoria: categoria,
    fecha: new Date().toISOString()
  };
}

// ---------- Ejercicio 04: agregar ----------
function agregarGasto() {
  const gasto = crearGasto(
    inputDescripcion.value,
    Number(inputMonto.value),
    selectCategoria.value
  );

  if (gasto === null) {
    return;
  }

  gastos.push(gasto);

  inputDescripcion.value = "";
  inputMonto.value = "";

  guardarGastos();
  actualizarTodo();
}

// ---------- Ejercicio 05: fechas ----------
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

// ---------- Ejercicio 06: totales con reduce ----------
function sumarMontos(lista) {
  return lista.reduce(function (acumulado, gasto) {
    return acumulado + gasto.monto;
  }, 0);
}

function mostrarTotales() {
  const gastosDeHoy = gastos.filter(esDeHoy);
  const gastosDelMes = gastos.filter(esDeEsteMes);

  totalHoy.textContent = formatearPesos(sumarMontos(gastosDeHoy));
  totalMes.textContent = formatearPesos(sumarMontos(gastosDelMes));
}

// ---------- Ejercicio 07: total por categoría ----------
function mostrarCategorias() {
  listaCategorias.innerHTML = "";

  for (const categoria of CATEGORIAS) {
    const deEstaCategoria = gastos.filter(function (gasto) {
      return gasto.categoria === categoria;
    });
    const total = sumarMontos(deEstaCategoria);

    const li = document.createElement("li");
    li.textContent = categoria + ": " + formatearPesos(total);
    listaCategorias.appendChild(li);
  }
}

// ---------- Ejercicio 08: pintar la lista (con el filtro del 10) ----------
function mostrarLista() {
  listaGastos.innerHTML = "";

  for (let i = 0; i < gastos.length; i++) {
    const gasto = gastos[i];

    if (filtroActual !== "Todas" && gasto.categoria !== filtroActual) {
      continue;
    }

    const li = document.createElement("li");
    li.textContent = gasto.descripcion + " - " + formatearPesos(gasto.monto) + " (" + gasto.categoria + ")";

    const boton = document.createElement("button");
    boton.classList.add("eliminar");
    boton.textContent = "Eliminar";
    boton.dataset.index = i;

    li.appendChild(boton);
    listaGastos.appendChild(li);
  }
}

// ---------- Ejercicio 09: eliminar con un solo escuchador ----------
function eliminarGasto(evento) {
  if (!evento.target.classList.contains("eliminar")) {
    return;
  }

  const posicion = Number(evento.target.dataset.index);
  gastos.splice(posicion, 1);

  guardarGastos();
  actualizarTodo();
}

// ---------- Ejercicio 10: filtro con sessionStorage ----------
function cambiarFiltro() {
  filtroActual = filtroLista.value;
  sessionStorage.setItem(CLAVE_FILTRO, filtroActual);
  mostrarLista();
}

function cargarFiltro() {
  let guardado = sessionStorage.getItem(CLAVE_FILTRO);

  if (guardado === null) {
    guardado = "Todas";
  }

  filtroActual = guardado;
  filtroLista.value = filtroActual;
}

// ---------- Conexiones ----------
btnAgregar.addEventListener("click", agregarGasto);
listaGastos.addEventListener("click", eliminarGasto);
filtroLista.addEventListener("change", cambiarFiltro);

// ---------- Arranque ----------
cargarGastos();
cargarFiltro();
actualizarTodo();
