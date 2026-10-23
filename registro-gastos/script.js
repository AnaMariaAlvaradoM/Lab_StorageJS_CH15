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

function guardarGastos() {
  const texto = JSON.stringify(gastos);
  localStorage.setItem(CLAVE_GASTOS, texto);

}

function cargarGastos() {

  const texto = localStorage.getItem(CLAVE_GASTOS);
  if (texto === null) {
    gastos = [];
    return;
  }
  try {
    gastos = JSON.parse(texto);
  } catch (error) {
    console.warn("Datos dañados, empiezo con la lista vacía");
    gastos = [];
  }
}

function crearGasto(descripcion, monto, categoria) {
  const limpia = descripcion.trim();
  if (limpia === "") return null;
  if (Number.isNaN(monto) || monto <= 0) return null;

  return {
    descripcion: limpia,
    monto: monto,
    categoria: categoria,
    fecha: new Date().toISOString()
  };

}

function agregarGasto() {

  const gasto = crearGasto(
    inputDescripcion.value,
    Number(inputMonto.value),
    selectCategoria.value
  );
  if (gasto === null) return;

  gastos.push(gasto);
  inputDescripcion.value = "";
  inputMonto.value = "";
  guardarGastos();
  actualizarTodo();
}

function esDeHoy(gasto) {

  const fechaGasto = new Date(gasto.fecha);
  const hoy = new Date();
  return fechaGasto.getDate() === hoy.getDate() &&
    fechaGasto.getMonth() === hoy.getMonth() &&
    fechaGasto.getFullYear() === hoy.getFullYear();
}

function esDeEsteMes(gasto) {
  const fechaGasto = new Date(gasto.fecha);
  const hoy = new Date();
  return fechaGasto.getMonth() === hoy.getMonth() &&
    fechaGasto.getFullYear() === hoy.getFullYear();
}


function sumarMontos(lista) {
  return lista.reduce(function (acumulado, gasto) {
    return acumulado + gasto.monto;
  }, 0);

}

function mostrarTotales() {

  const deHoy = gastos.filter(esDeHoy);
  const delMes = gastos.filter(esDeEsteMes);
  totalHoy.textContent = formatearPesos(sumarMontos(deHoy));
  totalMes.textContent = formatearPesos(sumarMontos(delMes));

}

function mostrarCategorias() {

  listaCategorias.innerHTML = "";
  for (const categoria of CATEGORIAS) {
    const deEsaCategoria = gastos.filter(function (gasto) {
      return gasto.categoria === categoria;
    });
    const li = document.createElement("li");
    li.textContent = categoria + ": " + formatearPesos(sumarMontos(deEsaCategoria));
    listaCategorias.appendChild(li);
  }
}

function mostrarLista() {

  listaGastos.innerHTML = "";
  for (let i = 0; i < gastos.length; i++) {
    const gasto = gastos[i];

    if (filtroActual !== "Todas" && gasto.categoria !== filtroActual) continue;

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

function eliminarGasto(evento) {

  if (!evento.target.classList.contains("eliminar")) return;

  const posicion = Number(evento.target.dataset.index);
  gastos.splice(posicion, 1);
  guardarGastos();
  actualizarTodo();
}

function cambiarFiltro() {

  filtroActual = filtroLista.value;
  sessionStorage.setItem(CLAVE_FILTRO, filtroActual);
  mostrarLista();

}

function cargarFiltro() {
  const guardado = sessionStorage.getItem(CLAVE_FILTRO);
  filtroActual = guardado === null ? "Todas" : guardado;
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
