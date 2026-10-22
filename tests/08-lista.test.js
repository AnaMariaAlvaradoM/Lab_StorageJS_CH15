const test = require("node:test");
const assert = require("node:assert/strict");
const { revisar, correr, itemsDeLista, gastosDeEjemplo } = require("./utilidades");

test("al abrir la página muestra un <li> por cada gasto", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ document }) => {
    assert.equal(itemsDeLista(document).length, 5, "con 5 gastos guardados, la lista debería tener 5 <li>");
  });
});

test("cada gasto se lee como Café - $5.000 (Comida)", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ document }) => {
    const items = itemsDeLista(document);
    assert.equal(items.length, 5, "con 5 gastos guardados, la lista debería tener 5 <li>: termina primero el test anterior");
    assert.ok(items[0].textContent.trim().startsWith("Café - $5.000 (Comida)"), `el primer gasto debería decir "Café - $5.000 (Comida)" y dice "${items[0].textContent.trim()}"`);
    assert.ok(items[3].textContent.trim().startsWith("Arriendo - $900.000 (Servicios)"), `el cuarto gasto debería decir "Arriendo - $900.000 (Servicios)" (usa formatearPesos)`);
  });
});

test("cada gasto tiene su botón Eliminar", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ document }) => {
    const items = itemsDeLista(document);
    assert.equal(items.length, 5, "con 5 gastos guardados, la lista debería tener 5 <li>");
    for (const item of items) {
      const boton = item.querySelector("button.eliminar");
      assert.ok(boton, 'cada <li> debería tener un <button class="eliminar">');
      assert.equal(boton.textContent.trim(), "Eliminar", 'el botón debería decir "Eliminar"');
    }
  });
});

test("el botón guarda la posición del gasto en data-index", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ document }) => {
    const items = itemsDeLista(document);
    assert.equal(items.length, 5, "con 5 gastos guardados, la lista debería tener 5 <li>");
    const posiciones = items.map((item) => (item.querySelector("button.eliminar") || {}).dataset?.index);
    assert.deepEqual(posiciones, ["0", "1", "2", "3", "4"], "cada botón debería tener data-index con su posición en gastos: 0, 1, 2, 3, 4 (boton.dataset.index = i)");
  });
});

test("pintar dos veces no duplica la lista", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ window, document }) => {
    correr(window, "mostrarLista(); mostrarLista();");
    assert.equal(itemsDeLista(document).length, 5, "después de pintar varias veces deberían seguir siendo 5: vacía listaGastos al inicio de mostrarLista");
  });
});
