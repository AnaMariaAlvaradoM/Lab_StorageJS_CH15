const test = require("node:test");
const assert = require("node:assert/strict");
const { revisar, revisarCodigo, correr, cuerpoDe, itemsDeCategorias, gastosDeEjemplo } = require("./utilidades");

const ESPERADO = ["Comida: $23.000", "Transporte: $2.950", "Entretenimiento: $22.000", "Servicios: $900.000", "Otros: $0"];

test("al abrir la página muestra el total de cada categoría", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ document }) => {
    assert.deepEqual(itemsDeCategorias(document), ESPERADO, "las categorías deberían verse así: " + ESPERADO.join(" · "));
  });
});

test("sin gastos aparecen las 5 categorías en $0", () => {
  revisar({}, ({ document }) => {
    const items = itemsDeCategorias(document);
    assert.equal(items.length, 5, "deberían aparecer las 5 categorías aunque no haya gastos (recorre CATEGORIAS)");
    assert.deepEqual(items, ["Comida: $0", "Transporte: $0", "Entretenimiento: $0", "Servicios: $0", "Otros: $0"], "sin gastos, todas las categorías deberían decir $0");
  });
});

test("pintar dos veces no duplica las categorías", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ window, document }) => {
    correr(window, "mostrarCategorias(); mostrarCategorias();");
    assert.equal(itemsDeCategorias(document).length, 5, "después de pintar varias veces deberían seguir siendo 5: vacía listaCategorias al inicio de mostrarCategorias");
  });
});

test("se recalcula cuando cambian los gastos", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ window, document }) => {
    correr(window, 'gastos.push({ descripcion: "Taxi", monto: 15000, categoria: "Transporte", fecha: new Date().toISOString() }); mostrarCategorias();');
    assert.equal(itemsDeCategorias(document)[1], "Transporte: $17.950", "con un taxi de $15.000, Transporte debería sumar $17.950");
  });
});

test("recorre CATEGORIAS y reutiliza sumarMontos", () => {
  revisarCodigo(() => {
    const codigo = cuerpoDe("mostrarCategorias");
    assert.match(codigo, /\bCATEGORIAS\b/, "mostrarCategorias debería recorrer el arreglo CATEGORIAS en vez de escribir 5 bloques iguales");
    assert.match(codigo, /\bsumarMontos\s*\(/, "mostrarCategorias debería usar sumarMontos (Ejercicio 06)");
  });
});
