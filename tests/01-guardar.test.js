const test = require("node:test");
const assert = require("node:assert/strict");
const { revisar, correr, guardado, guardadoComoArreglo, CLAVE_GASTOS } = require("./utilidades");

const CAFE = { descripcion: "Café", monto: 5000, categoria: "Comida", fecha: "2026-10-22T11:15:00.000Z" };
const BUS = { descripcion: "Bus", monto: 2950, categoria: "Transporte", fecha: "2026-10-22T12:40:00.000Z" };

function guardarEstos(window, lista) {
  correr(window, `gastos = ${JSON.stringify(lista)}; guardarGastos();`);
}

test("guardarGastos guarda el arreglo con la clave registro-gastos", () => {
  revisar({}, ({ window }) => {
    guardarEstos(window, [CAFE]);
    assert.notEqual(guardado(window), null, `después de guardarGastos() no hay nada en localStorage con la clave "${CLAVE_GASTOS}" (usa localStorage.setItem(CLAVE_GASTOS, ...))`);
  });
});

test("lo guardado es texto JSON, no [object Object]", () => {
  revisar({}, ({ window }) => {
    guardarEstos(window, [CAFE]);
    const texto = guardado(window);
    assert.notEqual(texto, null, "después de guardarGastos() no hay nada guardado: termina primero el test anterior");
    assert.notEqual(texto, "[object Object]", "se guardó [object Object]: empaca el arreglo con JSON.stringify(gastos)");
    assert.equal(texto, JSON.stringify([CAFE]), "lo guardado debería ser JSON.stringify(gastos)");
  });
});

test("guarda el arreglo completo, no solo el último gasto", () => {
  revisar({}, ({ window }) => {
    guardarEstos(window, [CAFE, BUS]);
    assert.equal(guardadoComoArreglo(window).length, 2, "con 2 gastos en el arreglo, deberían quedar guardados los 2");
  });
});

test("con el arreglo vacío guarda []", () => {
  revisar({}, ({ window }) => {
    guardarEstos(window, []);
    assert.equal(guardado(window), "[]", "con gastos vacío, lo guardado debería ser el texto [] (así, al vaciar la lista, también se recuerda)");
  });
});

test("guarda en localStorage, no en sessionStorage", () => {
  revisar({}, ({ window }) => {
    guardarEstos(window, [CAFE]);
    assert.equal(window.sessionStorage.getItem(CLAVE_GASTOS), null, "los gastos deben durar aunque cierres el navegador: van en localStorage, no en sessionStorage");
    assert.notEqual(guardado(window), null, "no hay nada en localStorage después de guardarGastos()");
  });
});
