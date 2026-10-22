const test = require("node:test");
const assert = require("node:assert/strict");
const { revisar, evaluar, fechas } = require("./utilidades");

function pregunta(window, funcion, fecha) {
  return evaluar(window, `${funcion}({ descripcion: "Prueba", monto: 1000, categoria: "Otros", fecha: "${fecha}" })`);
}

test("esDeHoy reconoce un gasto de hoy, aunque sea de otra hora", () => {
  const f = fechas();
  revisar({}, ({ window }) => {
    assert.equal(pregunta(window, "esDeHoy", f.hoy), true, "esDeHoy(gasto de hoy) debería retornar true");
    assert.equal(pregunta(window, "esDeHoy", f.hoyOtraHora), true, "esDeHoy(gasto de hoy a otra hora) debería retornar true (compara día, mes y año, no el texto completo)");
  });
});

test("esDeHoy rechaza un gasto de otro día de este mes", () => {
  const f = fechas();
  revisar({}, ({ window }) => {
    assert.equal(pregunta(window, "esDeHoy", f.esteMesOtroDia), false, "esDeHoy(gasto de otro día de este mes) debería retornar false");
  });
});

test("esDeHoy rechaza el mismo día y mes del año pasado", () => {
  const f = fechas();
  revisar({}, ({ window }) => {
    assert.equal(pregunta(window, "esDeHoy", f.hoy), true, "esDeHoy(gasto de hoy) debería retornar true: termina primero el primer test");
    assert.equal(pregunta(window, "esDeHoy", f.hoyAnioPasado), false, "esDeHoy(mismo día y mes, pero del año pasado) debería retornar false (¿comparaste el año con getFullYear?)");
  });
});

test("esDeEsteMes reconoce los gastos de este mes", () => {
  const f = fechas();
  revisar({}, ({ window }) => {
    assert.equal(pregunta(window, "esDeEsteMes", f.hoy), true, "esDeEsteMes(gasto de hoy) debería retornar true");
    assert.equal(pregunta(window, "esDeEsteMes", f.esteMesOtroDia), true, "esDeEsteMes(gasto de otro día de este mes) debería retornar true");
  });
});

test("esDeEsteMes rechaza el mes pasado y el mismo mes del año pasado", () => {
  const f = fechas();
  revisar({}, ({ window }) => {
    assert.equal(pregunta(window, "esDeEsteMes", f.mesPasado), false, "esDeEsteMes(gasto del mes pasado) debería retornar false");
    assert.equal(pregunta(window, "esDeEsteMes", f.anioPasado), false, "esDeEsteMes(gasto de este mismo mes, pero del año pasado) debería retornar false (compara también el año)");
  });
});
