const test = require("node:test");
const assert = require("node:assert/strict");
const { revisar, revisarCodigo, evaluar, correr, texto, cuerpoDe, gastosDeEjemplo } = require("./utilidades");

test("sumarMontos suma los montos de la lista", () => {
  revisar({}, ({ window }) => {
    const lista = JSON.stringify(gastosDeEjemplo().slice(0, 2));
    assert.equal(evaluar(window, `sumarMontos(${lista})`), 7950, "sumarMontos([Café 5000, Bus 2950]) debería retornar 7950");
  });
});

test("sumarMontos de una lista vacía es 0", () => {
  revisar({}, ({ window }) => {
    assert.equal(evaluar(window, "sumarMontos([])"), 0, "sumarMontos([]) debería retornar 0 (¿le diste a reduce el valor inicial 0?)");
  });
});

test("al abrir la página muestra el total de hoy y el del mes", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ document }) => {
    assert.equal(texto(document, "#totalHoy"), "$7.950", "el total de hoy debería ser $7.950 (Café + Bus), con formatearPesos");
    assert.equal(texto(document, "#totalMes"), "$25.950", "el total del mes debería ser $25.950 (Café + Bus + Almuerzo): el arriendo es del mes pasado y el cine del año pasado");
  });
});

test("sin gastos, los dos totales vuelven a $0", () => {
  revisar({ gastos: gastosDeEjemplo() }, ({ window, document }) => {
    assert.equal(texto(document, "#totalHoy"), "$7.950", "al abrir la página el total de hoy debería ser $7.950: termina primero el test anterior");
    correr(window, "gastos = []; mostrarTotales();");
    assert.equal(texto(document, "#totalHoy"), "$0", "sin gastos, el total de hoy debería ser $0");
    assert.equal(texto(document, "#totalMes"), "$0", "sin gastos, el total del mes debería ser $0");
  });
});

test("usa reduce y reutiliza tus funciones del Ejercicio 05", () => {
  revisarCodigo(() => {
    assert.match(cuerpoDe("sumarMontos"), /\.reduce\s*\(/, "sumarMontos debería usar .reduce() (lo pide el enunciado)");
    const totales = cuerpoDe("mostrarTotales");
    for (const funcion of ["esDeHoy", "esDeEsteMes", "sumarMontos"]) {
      assert.match(totales, new RegExp(`\\b${funcion}\\b`), `mostrarTotales debería usar ${funcion} en vez de repetir esa lógica`);
    }
  });
});
