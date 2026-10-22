const test = require("node:test");
const assert = require("node:assert/strict");
const { revisar, correr, gastosDe, guardadoComoArreglo, elemento, escribirGasto } = require("./utilidades");

test("al hacer clic en Agregar, gastos tiene el gasto nuevo", () => {
  revisar({}, ({ window, document }) => {
    escribirGasto(document, "Café", "5000", "Comida");
    const gastos = gastosDe(window);
    assert.equal(gastos.length, 1, "después de agregar un gasto, el arreglo gastos debería tener 1 (¿hiciste gastos.push?)");
    assert.equal(gastos[0].descripcion, "Café", 'la descripción debería ser "Café"');
    assert.equal(gastos[0].monto, 5000, "el monto debería ser el NÚMERO 5000: lo escrito en el input es texto, conviértelo con Number");
  });
});

test("después de agregar limpia la descripción y el monto", () => {
  revisar({}, ({ window, document }) => {
    escribirGasto(document, "Café", "5000", "Comida");
    assert.equal(gastosDe(window).length, 1, "después de agregar un gasto, el arreglo gastos debería tener 1: termina primero el test anterior");
    assert.equal(elemento(document, "#inputDescripcion").value, "", "la descripción debería quedar vacía después de agregar");
    assert.equal(elemento(document, "#inputMonto").value, "", "el monto debería quedar vacío después de agregar");
  });
});

test("guarda en localStorage al agregar", () => {
  revisar({}, ({ document, window }) => {
    escribirGasto(document, "Café", "5000", "Comida");
    escribirGasto(document, "Bus", "2950", "Transporte");
    assert.equal(guardadoComoArreglo(window).length, 2, "después de agregar 2 gastos, localStorage debería tener los 2");
  });
});

test("con el monto vacío no agrega nada", () => {
  revisar({}, ({ window, document }) => {
    escribirGasto(document, "Café", "5000", "Comida");
    escribirGasto(document, "Almuerzo", "", "Comida");
    escribirGasto(document, "", "3000", "Otros");
    assert.equal(gastosDe(window).length, 1, "de 3 intentos solo 1 era válido: si crearGasto retorna null, agregarGasto no debería hacer nada (return)");
  });
});

test("vuelve a pintar todo después de agregar", () => {
  revisar({}, ({ window, document }) => {
    correr(window, "var vecesPintado = 0; actualizarTodo = function () { vecesPintado++; };");
    escribirGasto(document, "Café", "5000", "Comida");
    assert.equal(window.eval("vecesPintado"), 1, "después de agregar un gasto deberías llamar a actualizarTodo() una vez");
  });
});
