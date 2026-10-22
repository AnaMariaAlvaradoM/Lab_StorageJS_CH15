const test = require("node:test");
const assert = require("node:assert/strict");
const { revisar, gastosDe, guardadoComoArreglo, texto, clic, itemsDeLista, itemsDeCategorias, gastosDeEjemplo } = require("./utilidades");

function eliminar(document, descripcion) {
  const item = itemsDeLista(document).find((li) => li.textContent.trim().startsWith(descripcion + " -"));
  assert.ok(item, `no encuentro "${descripcion}" en la lista (Ejercicio 08)`);
  const boton = item.querySelector("button.eliminar");
  assert.ok(boton, `"${descripcion}" no tiene su <button class="eliminar"> (Ejercicio 08)`);
  clic(boton);
}

test("Eliminar saca ese gasto del arreglo", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ window, document }) => {
    eliminar(document, "Bus");
    const descripciones = gastosDe(window).map((g) => g.descripcion);
    assert.deepEqual(descripciones, ["Café", "Almuerzo", "Arriendo", "Cine"], "después de eliminar el Bus, gastos debería quedar sin él (usa splice con data-index)");
  });
});

test("Eliminar también lo saca de localStorage", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ window, document }) => {
    eliminar(document, "Bus");
    assert.equal(guardadoComoArreglo(window).length, 4, "después de eliminar, localStorage debería tener 4 gastos: llama a guardarGastos()");
  });
});

test("después de eliminar se recalculan TODOS los totales", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ document }) => {
    eliminar(document, "Bus");
    assert.equal(texto(document, "#totalHoy"), "$5.000", "sin el Bus, el total de hoy debería ser $5.000: llama a actualizarTodo(), no solo a mostrarLista()");
    assert.equal(itemsDeCategorias(document)[1], "Transporte: $0", "sin el Bus, Transporte debería quedar en $0");
  });
});

test("la lista se vuelve a pintar sin el gasto", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ document }) => {
    eliminar(document, "Bus");
    assert.equal(itemsDeLista(document).length, 4, "después de eliminar, la lista debería mostrar 4 gastos");
  });
});

test("un clic en el texto del gasto (fuera del botón) no elimina nada", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ window, document }) => {
    eliminar(document, "Bus");
    assert.equal(gastosDe(window).length, 4, "después de eliminar el Bus deberían quedar 4: termina primero el primer test");
    clic(itemsDeLista(document)[0]);
    assert.equal(gastosDe(window).length, 4, "un clic en el <li> (no en el botón) no debería eliminar nada: revisa que evento.target tenga la clase eliminar");
  });
});
