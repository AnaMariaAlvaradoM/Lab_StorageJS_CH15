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
    // la variable gastosjson va a usar el json con (gastos) para trasformarlo en un archivo json leible por el localstorage
    //enviar a el navegador JSON.stringify() transforma cualquier estructura de JavaScript (como [{ descripcion: "Café", monto: 5000 }]) en un texto legible de la forma '[{"descripcion":"Café","monto":5000}]', listo para ser almacenado.
    gastosjson = JSON.stringify(gastos);
    localStorage.setItem(CLAVE_GASTOS, gastosjson);
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
  const traer = localStorage.getItem(CLAVE_GASTOS)
  // gastos = JSON.parse(traer); lo contrario a stringify convierte el texto '[{"descripcion":"Café","monto":5000}]' a javascript [{ descripcion: "Café", monto: 5000 }]
  // leer en pocas palabras lo que hay en el navegador
  if(traer === null){
      gastos = [];
      return;
  }try{
    gastos = JSON.parse(traer);
  }catch(error) {
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
const DESC = descripcion.trim();

  if (DESC === "" || isNaN(monto) || monto <= 0) {
    return null; 
  }
  return {
    descripcion: DESC,
    monto: Number(monto),
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
function agregarGasto() {
  const nuevoGasto = crearGasto(
    inputDescripcion.value,
    Number(inputMonto.value),
    selectCategoria.value
  );
  // 2. Si los datos estaban mal (crearGasto devolvió null), detenemos la función aquí
  if (nuevoGasto === null) {
    return;
  }
  // 3. Guardamos el gasto en nuestro arreglo de la memoria y limpiamos los campos
  gastos.push(nuevoGasto);
  inputDescripcion.value = "";
  inputMonto.value = "";
  // 4. Persistimos los cambios en el navegador y redibujamos la pantalla
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
  const hoy = new Date(); //fecha y hora de este instante
  const fechaGasto = new Date(gasto.fecha); // Reconstruimos la fecha guardada en el gasto
  // Para ser de HOY, deben coincidir día, mes Y año
  return (
    fechaGasto.getDate() === hoy.getDate() &&
    fechaGasto.getMonth() === hoy.getMonth() &&
    fechaGasto.getFullYear() === hoy.getFullYear()
  );
}

function esDeEsteMes(gasto) {
  const hoy = new Date();
  const fechaGasto = new Date(gasto.fecha);

  // Para ser de ESTE MES, solo deben coincidir el mes Y el año
  return (
    fechaGasto.getMonth() === hoy.getMonth() &&
    fechaGasto.getFullYear() === hoy.getFullYear()
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
  // .reduce recibe una función con dos variables:
  // - acumulado: la suma guardada hasta el momento (empieza en 0)
  // - gasto: el elemento de la lista que se está procesando
  return lista.reduce((acumulado, gasto) => 
    acumulado + gasto.monto, 0);
}

function mostrarTotales() {
  // 1. Obtener gastos de hoy con .filter() y calcular su total
  const gastosDeHoy = gastos.filter(esDeHoy);
  const sumaHoy = sumarMontos(gastosDeHoy);

  // 2. Obtener gastos del mes con .filter() y calcular su total
  const gastosDelMes = gastos.filter(esDeEsteMes);
  const sumaMes = sumarMontos(gastosDelMes);

  // 3. Convertir el número a dinero con formatearPesos y colocarlo en el HTML
  totalHoy.textContent = formatearPesos(sumaHoy);
  totalMes.textContent = formatearPesos(sumaMes);
}

// ============================================================
// Ejercicio 07 · mostrarCategorias()
// ============================================================
// Vacía listaCategorias y, recorriendo CATEGORIAS, crea un <li> por
// categoría con este texto exacto:   Comida: $23.000
// Las 5 categorías siempre aparecen, aunque su total sea $0.
// ============================================================
function mostrarCategorias() {
  // 1. Limpiamos la lista en el HTML para no duplicar datos
  listaCategorias.innerHTML = "";
  // 2. Recorremos cada una de las 5 categorías fijas
  CATEGORIAS.forEach(categoria => {
    // 3. Filtramos los gastos que pertenecen a esta categoría
    const gastosDeCategoria = gastos.filter(gasto => gasto.categoria === categoria);
    // 4. Sumamos el total de esa categoría
    const totalCategoria = sumarMontos(gastosDeCategoria);
    // 5. Creamos una nueva etiqueta <li> en memoria
    const li = document.createElement("li");
    // 6. Asignamos el texto con el formato exacto requerido (Ej: "Comida: $23.000")
    li.textContent = `${categoria}: ${formatearPesos(totalCategoria)}`;
    // 7. Insertamos el <li> dentro del <ul>/<ol> del HTML
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
  // 1. Limpiamos la lista
  listaGastos.innerHTML = "";
  // 2. Recorremos todos los gastos manteniendo su posición 'index' real
  gastos.forEach((gasto, index) => {
    // 3. Si hay un filtro aplicado y la categoría no coincide, pasamos al siguiente
    if (filtroActual !== "Todas" && gasto.categoria !== filtroActual) {
      return; // Dentro de un .forEach(), return actúa como un 'saltar al siguiente'
    }
    // 4. Si pasa el filtro, creamos y pintamos el elemento en el HTML
    const li = document.createElement("li");
    li.innerHTML = `${gasto.descripcion} - ${formatearPesos(gasto.monto)} (${gasto.categoria}) <button class="eliminar" data-index="${index}">Eliminar</button>`;
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
  // 1. Si el clic NO fue en un botón con la clase "eliminar", no hacemos nada
  if (!evento.target.classList.contains("eliminar")) {
    return;
  }
  // 2. Leemos la posición guardada en data-index
  const indice = Number(evento.target.dataset.index);
  // 3. Eliminamos 1 elemento del arreglo 'gastos' en la posición 'indice'
  gastos.splice(indice, 1);
  // 4. Persistimos los cambios en localStorage y redibujamos la pantalla
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
  // 1. Leemos el valor seleccionado en el selector HTML
  filtroActual = filtroLista.value;
  // 2. Lo guardamos en sessionStorage para esta pestaña
  sessionStorage.setItem(CLAVE_FILTRO, filtroActual);
  // 3. Volvemos a pintar la lista filtrada
  mostrarLista();
}

function cargarFiltro() {
  // 1. Leemos lo que había guardado en la memoria de la pestaña
  const filtroGuardado = sessionStorage.getItem(CLAVE_FILTRO);
  // 2. Si es null, asignamos "Todas"; de lo contrario, el valor guardado
  if (filtroGuardado === null) {
    filtroActual = "Todas";
  } else {
    filtroActual = filtroGuardado;
  }
  // 3. Sincronizamos el selector desplegable del HTML con el valor activo
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
