const test = require("node:test");
const assert = require("node:assert/strict");
const { revisar, gastosDe, texto, elemento, clic, elegirFiltro, itemsDeLista, gastosDeEjemplo, CLAVE_FILTRO } = require("./utilidades");

function descripciones(document) {
  return itemsDeLista(document).map((li) => li.textContent.trim().split(" - ")[0]);
}

test("al elegir Comida la lista muestra solo los gastos de comida", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ document }) => {
    elegirFiltro(document, "Comida");
    assert.deepEqual(descripciones(document), ["Café", "Almuerzo"], "con el filtro en Comida, la lista debería mostrar solo Café y Almuerzo");
    assert.equal(texto(document, "#totalMes"), "$25.950", "el filtro solo cambia la lista: el total del mes sigue siendo $25.950");
  });
});

test("el filtro se guarda en sessionStorage, no en localStorage", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ window, document }) => {
    elegirFiltro(document, "Comida");
    assert.equal(window.sessionStorage.getItem(CLAVE_FILTRO), "Comida", `el filtro debería guardarse en sessionStorage con la clave "${CLAVE_FILTRO}"`);
    assert.equal(window.localStorage.getItem(CLAVE_FILTRO), null, "el filtro es solo de esta visita: no va en localStorage");
  });
});

test("al recargar la pestaña el filtro sigue puesto", () => {
  revisar({ gastos: gastosDeEjemplo(), filtro: "Comida" }, ({ document }) => {
    assert.equal(elemento(document, "#filtroLista").value, "Comida", "si sessionStorage dice Comida, al abrir la página el select debería mostrar Comida (cargarFiltro)");
    assert.deepEqual(descripciones(document), ["Café", "Almuerzo"], "al abrir la página con el filtro en Comida, la lista debería mostrar solo Café y Almuerzo");
  });
});

test("con filtro, Eliminar borra el gasto correcto", () => {
  revisar({ gastos: gastosDeEjemplo(), filtro: "Comida" }, ({ window, document }) => {
    const items = itemsDeLista(document);
    assert.equal(items.length, 2, "al abrir con el filtro en Comida deberían verse 2 gastos: termina primero el test anterior");
    const boton = items[1].querySelector("button.eliminar");
    assert.equal(boton && boton.dataset.index, "2", "el Almuerzo está en la posición 2 de gastos: con filtro, data-index sigue siendo la posición en el arreglo, no en la lista");
    clic(boton);
    assert.deepEqual(gastosDe(window).map((g) => g.descripcion), ["Café", "Bus", "Arriendo", "Cine"], "al eliminar el Almuerzo con el filtro puesto, debería salir el Almuerzo y no otro gasto");
  });
});

test("volver a Todas muestra otra vez los 5 gastos", () => {
  revisar({ gastos: gastosDeEjemplo(), filtro: "Comida" }, ({ document }) => {
    assert.equal(itemsDeLista(document).length, 2, "al abrir con el filtro en Comida deberían verse 2 gastos");
    elegirFiltro(document, "Todas");
    assert.equal(itemsDeLista(document).length, 5, "con el filtro en Todas deberían verse los 5 gastos");
  });
});
