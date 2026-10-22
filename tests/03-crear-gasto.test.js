const test = require("node:test");
const assert = require("node:assert/strict");
const { revisar, evaluar } = require("./utilidades");

test("crea el gasto con descripción, monto y categoría", () => {
  revisar({}, ({ window }) => {
    const gasto = evaluar(window, 'crearGasto("Café", 5000, "Comida")');
    assert.ok(gasto && typeof gasto === "object", 'crearGasto("Café", 5000, "Comida") debería retornar un objeto (¿olvidaste el return?)');
    assert.equal(gasto.descripcion, "Café", 'la descripción debería ser "Café"');
    assert.equal(gasto.monto, 5000, "el monto debería ser el número 5000");
    assert.equal(gasto.categoria, "Comida", 'la categoría debería ser "Comida"');
  });
});

test("la fecha es texto con la fecha y hora de este momento", () => {
  revisar({}, ({ window }) => {
    const gasto = evaluar(window, 'crearGasto("Café", 5000, "Comida")');
    assert.ok(gasto && typeof gasto === "object", 'crearGasto("Café", 5000, "Comida") debería retornar un objeto');
    assert.equal(typeof gasto.fecha, "string", "la fecha debería ser texto: usa new Date().toISOString()");
    assert.match(gasto.fecha, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "la fecha debería tener el formato de toISOString(), por ejemplo 2026-10-22T13:05:00.000Z");
    assert.ok(Math.abs(Date.parse(gasto.fecha) - Date.now()) < 60000, "la fecha debería ser la de este momento (new Date())");
  });
});

test("quita los espacios al inicio y al final de la descripción", () => {
  revisar({}, ({ window }) => {
    const gasto = evaluar(window, 'crearGasto("   Bus  ", 2950, "Transporte")');
    assert.ok(gasto && typeof gasto === "object", 'crearGasto("   Bus  ", 2950, "Transporte") debería retornar un objeto');
    assert.equal(gasto.descripcion, "Bus", 'la descripción debería quedar "Bus" (usa trim)');
  });
});

test("sin descripción retorna null", () => {
  revisar({}, ({ window }) => {
    assert.equal(evaluar(window, 'crearGasto("", 5000, "Comida")'), null, 'crearGasto("", 5000, "Comida") debería retornar null');
    assert.equal(evaluar(window, 'crearGasto("    ", 5000, "Comida")'), null, 'crearGasto("    ", 5000, "Comida") debería retornar null (solo espacios cuenta como vacío)');
  });
});

test("con un monto que no es mayor que 0 retorna null", () => {
  revisar({}, ({ window }) => {
    const chicle = evaluar(window, 'crearGasto("Chicle", 1, "Otros")');
    assert.ok(chicle && chicle.monto === 1, 'crearGasto("Chicle", 1, "Otros") debería crear el gasto: 1 sí es mayor que 0');
    assert.equal(evaluar(window, 'crearGasto("Café", 0, "Comida")'), null, 'crearGasto("Café", 0, "Comida") debería retornar null');
    assert.equal(evaluar(window, 'crearGasto("Café", -500, "Comida")'), null, 'crearGasto("Café", -500, "Comida") debería retornar null');
    assert.equal(evaluar(window, 'crearGasto("Café", Number("abc"), "Comida")'), null, 'crearGasto("Café", NaN, "Comida") debería retornar null (revisa Number.isNaN)');
  });
});
