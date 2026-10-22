const test = require("node:test");
const assert = require("node:assert/strict");
const { revisar, correr, gastosDe, gastosDeEjemplo } = require("./utilidades");

test("al abrir la página recupera los gastos guardados", () => {
  const ejemplo = gastosDeEjemplo();
  revisar({ gastos: ejemplo }, ({ window }) => {
    assert.deepEqual(gastosDe(window), ejemplo, "al abrir la página, gastos debería tener los 5 gastos guardados en localStorage (usa JSON.parse en cargarGastos)");
  });
});

test("la fecha recuperada es texto, no un objeto Date", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ window }) => {
    const gastos = gastosDe(window);
    assert.equal(gastos.length, 5, "al abrir la página, gastos debería tener los 5 gastos guardados: termina primero el test anterior");
    assert.equal(evaluarTipo(window), "string", "la fecha de un gasto recuperado debería ser texto: JSON.parse no la convierte en Date");
  });
});

function evaluarTipo(window) {
  return window.eval("typeof gastos[0].fecha");
}

test("si no hay nada guardado, gastos queda vacío", () => {
  revisar({}, ({ window }) => {
    correr(window, 'gastos = [{ descripcion: "Viejo", monto: 1, categoria: "Otros", fecha: "" }]; cargarGastos();');
    assert.deepEqual(gastosDe(window), [], "si localStorage no tiene nada (getItem da null), cargarGastos debería dejar gastos = []");
  });
});

test("con un dato dañado la página no se rompe y gastos queda vacío", () => {
  revisar({ textoGuardado: "[{dañado" }, ({ window }) => {
    correr(window, 'gastos = [{ descripcion: "Viejo", monto: 1, categoria: "Otros", fecha: "" }]; cargarGastos();');
    assert.deepEqual(gastosDe(window), [], "con un texto dañado en localStorage, cargarGastos debería atrapar el error (try/catch) y dejar gastos = []");
  });
});
