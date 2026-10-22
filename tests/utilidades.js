// Ayudas para los tests: abren tu registro de gastos en un navegador simulado (jsdom),
// le ponen datos en localStorage y sessionStorage ANTES de correr tu script.js
// (como si la persona ya hubiera usado la app ayer) y hacen clic por ti.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const { JSDOM, VirtualConsole } = require("jsdom");

const CARPETA = path.join(__dirname, "..", "registro-gastos");
const CLAVE_GASTOS = "registro-gastos";
const CLAVE_FILTRO = "registro-gastos-filtro";

function leer(archivo) {
  const ruta = path.join(CARPETA, archivo);
  if (!fs.existsSync(ruta)) throw new Error(`No encuentro registro-gastos/${archivo}: no le cambies el nombre ni la carpeta`);
  return fs.readFileSync(ruta, "utf8");
}

function codigoSinComentarios(archivo) {
  return leer(archivo).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

// El cuerpo de una función de script.js, sin comentarios (para los tests de estructura)
function cuerpoDe(nombre) {
  const codigo = codigoSinComentarios("script.js");
  const inicio = codigo.search(new RegExp(`function\\s+${nombre}\\s*\\(`));
  assert.ok(inicio >= 0, `no encuentro la función ${nombre} en script.js: no le cambies el nombre`);
  const siguiente = codigo.slice(inicio + 1).search(/\n(function\s|\/\/ =====|btnAgregar\.addEventListener)/);
  return siguiente < 0 ? codigo.slice(inicio) : codigo.slice(inicio, inicio + 1 + siguiente);
}

function explicarError(error) {
  const linea = ((error.stack || "").match(/registro-gastos\/script\.js:(\d+)/) || [])[1];
  const donde = linea ? ` (línea ${linea})` : "";
  if (error.name === "SyntaxError" && !/JSON/.test(error.message)) {
    return `script.js tiene un error de sintaxis (SyntaxError)${donde}: revisa paréntesis, llaves y comillas`;
  }
  if (/JSON/.test(error.message)) {
    return `script.js se detuvo${donde} porque JSON.parse recibió un texto dañado: ${error.message}. Usa try/catch en cargarGastos (Ejercicio 02)`;
  }
  if (/timed out/i.test(error.message)) {
    return "script.js tardó demasiado: revisa si tienes un ciclo infinito";
  }
  if (/of null/.test(error.message)) {
    return `script.js intentó usar un elemento que no existe${donde}: no cambies los id del index.html ni las constantes de "Elementos de la página"`;
  }
  if (/of undefined/.test(error.message)) {
    const propiedad = (error.message.match(/reading '([^']+)'/) || [])[1];
    return `script.js intentó leer "${propiedad}" de algo que vale undefined${donde}: ¿te faltó un return o revisar que el dato exista?`;
  }
  const noEsFuncion = error.message.match(/^([\w.]+) is not a function/);
  if (noEsFuncion) {
    return `script.js intentó usar "${noEsFuncion[1]}" como función, pero no lo es${donde}: si es un método de gastos (filter, push, forEach), revisa que gastos sea un arreglo. ¿Usaste JSON.parse al cargar (Ejercicio 02)?`;
  }
  const noExiste = error.message.match(/^(\w+) is not defined/);
  if (noExiste) {
    return `script.js usa "${noExiste[1]}", pero no existe${donde}: ¿lo escribiste distinto?`;
  }
  return `script.js lanzó un error${donde}: ${error.message}`;
}

// Abre la app. Antes de correr script.js deja en el almacenamiento lo que pidas:
//   { gastos: [...] }          → se guarda como JSON en localStorage (clave "registro-gastos")
//   { textoGuardado: "..." }   → se guarda tal cual (para probar datos dañados)
//   { filtro: "Comida" }       → se guarda en sessionStorage (clave "registro-gastos-filtro")
// Retorna { window, document, error }.
function abrirApp(opciones = {}) {
  const dom = new JSDOM(leer("index.html"), {
    url: "http://localhost:5500/registro-gastos/index.html",
    runScripts: "outside-only",
    virtualConsole: new VirtualConsole(),
  });
  const window = dom.window;
  window.localStorage.clear();
  window.sessionStorage.clear();
  if (opciones.gastos) window.localStorage.setItem(CLAVE_GASTOS, JSON.stringify(opciones.gastos));
  if (opciones.textoGuardado !== undefined) window.localStorage.setItem(CLAVE_GASTOS, opciones.textoGuardado);
  if (opciones.filtro) window.sessionStorage.setItem(CLAVE_FILTRO, opciones.filtro);
  window.alert = () => {};
  window.confirm = () => true;

  let error = null;
  try {
    new vm.Script(leer("script.js"), { filename: "registro-gastos/script.js" }).runInContext(dom.getInternalVMContext(), { timeout: 1000 });
  } catch (e) {
    error = new Error(explicarError(e));
  }
  return { window, document: window.document, error };
}

// Corre la revisión sobre una app recién abierta. Si algo falla y script.js
// lanzó un error al cargar, se muestra ese error: casi siempre es la causa.
function revisar(opciones, revision) {
  const app = abrirApp(opciones);
  try {
    revision(app);
  } catch (fallo) {
    throw app.error || fallo;
  }
}

// Para los tests de estructura: primero exige que script.js cargue sin errores
function revisarCodigo(revision) {
  const app = abrirApp();
  if (app.error) throw app.error;
  revision();
}

// Evalúa código dentro de la app y devuelve el resultado como datos simples
function evaluar(window, codigo) {
  let texto;
  try {
    texto = window.eval(`JSON.stringify(${codigo})`);
  } catch (e) {
    throw new Error(explicarError(e));
  }
  return texto === undefined ? undefined : JSON.parse(texto);
}

// Corre instrucciones dentro de la app (por ejemplo, llamar una de tus funciones)
function correr(window, codigo) {
  try {
    window.eval(codigo);
  } catch (e) {
    throw new Error(explicarError(e));
  }
}

function gastosDe(window) {
  try {
    return evaluar(window, "gastos");
  } catch (e) {
    throw new Error("No encuentro el arreglo gastos en script.js: no lo borres ni le cambies el nombre");
  }
}

function guardado(window) {
  return window.localStorage.getItem(CLAVE_GASTOS);
}

// Lo guardado en localStorage, ya desempacado. Si no es JSON válido, lo dice claro.
function guardadoComoArreglo(window) {
  const texto = guardado(window);
  assert.notEqual(texto, null, `no hay nada guardado en localStorage con la clave "${CLAVE_GASTOS}": llama a guardarGastos() (Ejercicio 01)`);
  try {
    return JSON.parse(texto);
  } catch (e) {
    throw new Error(`lo guardado en localStorage no es JSON válido (dice ${texto.slice(0, 30)}): empaca el arreglo con JSON.stringify(gastos) (Ejercicio 01)`);
  }
}

function elemento(document, selector) {
  const el = document.querySelector(selector);
  assert.ok(el, `no encuentro ${selector} en index.html: no lo borres ni le cambies el id`);
  return el;
}

function texto(document, selector) {
  return elemento(document, selector).textContent.trim();
}

function clic(el) {
  el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent("click", { bubbles: true }));
}

function escribirGasto(document, descripcion, monto, categoria) {
  elemento(document, "#inputDescripcion").value = descripcion;
  elemento(document, "#inputMonto").value = monto;
  elemento(document, "#selectCategoria").value = categoria;
  clic(elemento(document, "#btnAgregar"));
}

function elegirFiltro(document, valor) {
  const filtro = elemento(document, "#filtroLista");
  filtro.value = valor;
  filtro.dispatchEvent(new document.defaultView.Event("change", { bubbles: true }));
}

function itemsDeLista(document) {
  return [...elemento(document, "#listaGastos").querySelectorAll("li")];
}

function itemsDeCategorias(document) {
  return [...elemento(document, "#listaCategorias").querySelectorAll("li")].map((li) => li.textContent.trim());
}

// ===== Fechas de prueba, siempre relativas al día en que corre el test =====
function fechaISO(anio, mes, dia, hora) {
  return new Date(anio, mes, dia, hora, 15).toISOString();
}

function fechas() {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = ahora.getMonth();
  const dia = ahora.getDate();
  return {
    hoy: fechaISO(anio, mes, dia, ahora.getHours() === 6 ? 7 : 6),
    hoyOtraHora: fechaISO(anio, mes, dia, ahora.getHours() === 20 ? 21 : 20),
    esteMesOtroDia: fechaISO(anio, mes, dia === 1 ? 2 : 1, 12),
    mesPasado: fechaISO(anio, mes - 1, 15, 12),
    anioPasado: fechaISO(anio - 1, mes, 10, 12),
    hoyAnioPasado: fechaISO(anio - 1, mes, dia, 12),
  };
}

// Los 5 gastos de ejemplo que usan casi todos los tests
function gastosDeEjemplo() {
  const f = fechas();
  return [
    { descripcion: "Café", monto: 5000, categoria: "Comida", fecha: f.hoy },
    { descripcion: "Bus", monto: 2950, categoria: "Transporte", fecha: f.hoyOtraHora },
    { descripcion: "Almuerzo", monto: 18000, categoria: "Comida", fecha: f.esteMesOtroDia },
    { descripcion: "Arriendo", monto: 900000, categoria: "Servicios", fecha: f.mesPasado },
    { descripcion: "Cine", monto: 22000, categoria: "Entretenimiento", fecha: f.anioPasado },
  ];
}

module.exports = {
  CLAVE_GASTOS, CLAVE_FILTRO, leer, codigoSinComentarios, cuerpoDe, abrirApp, revisar, revisarCodigo, evaluar, correr,
  gastosDe, guardado, guardadoComoArreglo, elemento, texto, clic, escribirGasto, elegirFiltro, itemsDeLista,
  itemsDeCategorias, fechas, gastosDeEjemplo,
};
