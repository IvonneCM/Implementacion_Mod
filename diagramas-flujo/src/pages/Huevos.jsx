import React, { useState } from 'react';
import '../styles/simulacion.css';

function poissonKnuth(lambda) {
  if (lambda <= 0) return 0;
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1.0;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function simularUna({
  dias,
  lambdaPoisson,
  pvuh,
  pvup,
  pRotos,
  pAPollo,
  pVendido,
  pMuertePollo,
  pSobrevivePollo,
  incluirDetalle = false,
}) {
  let THR = 0;
  let THH = 0;
  let TPS = 0;
  let THP = 0;
  let THPO = 0;
  let TPM = 0;
  let ingresoTotal = 0;

  const detalle = [];

  for (let d = 1; d <= dias; d++) {
    const huevosHoy = poissonKnuth(lambdaPoisson);
    let huevosRotosDia = 0;
    let huevosVendDia = 0;
    let pollosVivosDia = 0;
    let huevosAPollosDia = 0;
    let pollosMuertosDia = 0;

    for (let h = 0; h < huevosHoy; h++) {
      const rEH = Math.random();
      if (rEH < pRotos) {
        huevosRotosDia++;
      } else if (rEH < pRotos + pAPollo) {
        huevosAPollosDia++;
        const rEP = Math.random();
        if (rEP < pSobrevivePollo) {
          pollosVivosDia++;
        } else {
          pollosMuertosDia++;
        }
      } else if (rEH < pRotos + pAPollo + pVendido) {
        huevosVendDia++;
      }
    }

    const ingresoDia = huevosVendDia * pvuh + pollosVivosDia * pvup;
    ingresoTotal += ingresoDia;

    THR += huevosRotosDia;
    THH += huevosVendDia;
    TPS += pollosVivosDia;
    THP += huevosHoy;
    THPO += huevosAPollosDia;
    TPM += pollosMuertosDia;

    if (incluirDetalle) {
      detalle.push({
        dia: d,
        huevosHoy,
        huevosRotosDia,
        huevosVendDia,
        huevosAPollosDia,
        pollosVivosDia,
        pollosMuertosDia,
        ingresoDia,
      });
    }
  }

  return {
    THR,
    THH,
    TPS,
    THP,
    THPO,
    TPM,
    ingresoTotal,
    ingresoPromedioDia: dias > 0 ? ingresoTotal / dias : 0,
    detalle,
  };
}

function simularLote(params, numSimulaciones) {
  const resumenes = [];
  let agg = {
    THR: 0,
    THH: 0,
    TPS: 0,
    THP: 0,
    ingresoTotal: 0,
    ingresoPromedioDia: 0,
  };

  for (let i = 0; i < numSimulaciones; i++) {
    const r = simularUna({ ...params, incluirDetalle: i === numSimulaciones - 1 });
    resumenes.push({ idx: i + 1, ...r });
    agg.THR += r.THR;
    agg.THH += r.THH;
    agg.TPS += r.TPS;
    agg.THP += r.THP;
    agg.ingresoTotal += r.ingresoTotal;
    agg.ingresoPromedioDia += r.ingresoPromedioDia;
  }

  const n = Math.max(1, numSimulaciones);
  const promedios = {
    IGT: agg.ingresoTotal / n,
    IDP: agg.ingresoPromedioDia / n,
    THR: agg.THR / n,
    TPS: agg.TPS / n,
    TH: agg.THP / n,
  };

  return { resumenes, promedios };
}

export default function Huevos() {
  const [numSimulaciones, setNumSimulaciones] = useState(30);
  const [dias, setDias] = useState(10);
  const [lambdaPoisson, setLambdaPoisson] = useState(10);
  const [pvuh, setPvuh] = useState(1.0);
  const [pvup, setPvup] = useState(5.0);

  const [pRotos, setPRotos] = useState(0.2);
  const [pAPollo, setPAPollo] = useState(0.3);
  const [pVendido, setPVendido] = useState(0.5);
  const [pMuertePollo, setPMuertePollo] = useState(0.2);
  const [pSobrevivePollo, setPSobrevivePollo] = useState(0.8);

  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState('');

  const limpiar = () => {
    setNumSimulaciones('');
    setDias('');
    setLambdaPoisson('');
    setPvuh('');
    setPvup('');
    setPRotos('');
    setPAPollo('');
    setPVendido('');
    setPMuertePollo('');
    setPSobrevivePollo('');
    setResultados(null);
    setError('');
  };

  const formNum = (n, dec = 2) => Number(n).toFixed(dec);

  const validarEntradas = () => {
    if (!numSimulaciones || numSimulaciones <= 0) return 'Número de simulaciones inválido';
    if (!dias || dias <= 0) return 'Número de días inválido';
    const sumH = pRotos + pAPollo + pVendido;
    if (Math.abs(sumH - 1) > 1e-6) return 'Las probabilidades de huevo deben sumar 1';
    const sumP = pMuertePollo + pSobrevivePollo;
    if (Math.abs(sumP - 1) > 1e-6) return 'Las probabilidades del pollo deben sumar 1';
    return '';
  };

  const onSimular = () => {
    const msg = validarEntradas();
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    const { resumenes, promedios } = simularLote(
      { dias, lambdaPoisson, pvuh, pvup, pRotos, pAPollo, pVendido, pMuertePollo, pSobrevivePollo },
      numSimulaciones
    );
    setResultados({ resumenes, promedios });
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Simulación de Producción de Huevos y Pollos</h1>
      </header>

      <div className="content">
        <div className="problema-section">
          <h2 className="subtitulo">Parámetros y Resultados</h2>

          <div className="columnas">
            {/* Columna izquierda */}
            <div className="columna-izquierda">
              <div className="card">
                <h3>Configuración</h3>
                <div className="input-group">
                  <label>Número de simulaciones</label>
                  <input type="number" value={numSimulaciones} onChange={(e) => setNumSimulaciones(+e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Días por simulación</label>
                  <input type="number" value={dias} onChange={(e) => setDias(+e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Media Poisson</label>
                  <input type="number" value={lambdaPoisson} onChange={(e) => setLambdaPoisson(+e.target.value)} />
                </div>

                <div className="input-group">
                  <label>p(Huevo roto)</label>
                  <input type="number" value={pRotos} onChange={(e) => setPRotos(+e.target.value)} />
                </div>
                <div className="input-group">
                  <label>p(Huevo → Pollo)</label>
                  <input type="number" value={pAPollo} onChange={(e) => setPAPollo(+e.target.value)} />
                </div>
                <div className="input-group">
                  <label>p(Vendido)</label>
                  <input type="number" value={pVendido} onChange={(e) => setPVendido(+e.target.value)} />
                </div>
                <div className="input-group">
                  <label>p(Muerte Pollo)</label>
                  <input type="number" value={pMuertePollo} onChange={(e) => setPMuertePollo(+e.target.value)} />
                </div>
                <div className="input-group">
                  <label>p(Sobrevive Pollo)</label>
                  <input type="number" value={pSobrevivePollo} onChange={(e) => setPSobrevivePollo(+e.target.value)} />
                </div>

                <div className="input-group">
                  <label>Precio huevo</label>
                  <input type="number" value={pvuh} onChange={(e) => setPvuh(+e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Precio pollo</label>
                  <input type="number" value={pvup} onChange={(e) => setPvup(+e.target.value)} />
                </div>

                <button className="btn-simular" onClick={onSimular}>Simular</button>
                <button className="btn-limpiar" onClick={limpiar} style={{ marginLeft: '8px', background: '#bbb' }}>Limpiar</button>

                {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="columna-derecha">
              <div className="card">
                <h3>Resultados</h3>

                {!resultados ? (
                  <div className="sin-datos">Aún no hay datos.</div>
                ) : (
                  <>
                    <div className="tabla-container">
                      <table className="tabla-resultados">
                        <thead>
                          <tr>
                            <th>Sim</th>
                            <th>IGT (Ingreso Total)</th>
                            <th>IDP (Ingreso Día)</th>
                            <th>THR (Huevos Rotos)</th>
                            <th>TPS (Pollos Sobrev.)</th>
                            <th>TH (Huevos Totales)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultados.resumenes.map((r) => (
                            <tr key={r.idx}>
                              <td>{r.idx}</td>
                              <td>Bs {formNum(r.ingresoTotal)}</td>
                              <td>Bs {formNum(r.ingresoPromedioDia)}</td>
                              <td>{r.THR}</td>
                              <td>{r.TPS}</td>
                              <td>{r.THP}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="estadisticas">
                      <h4>Promedio de Resultados</h4>
                      <div className="estadisticas-grid">
                        <div className="stat-item"><span className="stat-label">IGT Promedio:</span><span className="stat-value">Bs {formNum(resultados.promedios.IGT)}</span></div>
                        <div className="stat-item"><span className="stat-label">IDP Promedio:</span><span className="stat-value">Bs {formNum(resultados.promedios.IDP)}</span></div>
                        <div className="stat-item"><span className="stat-label">THR Promedio:</span><span className="stat-value">{formNum(resultados.promedios.THR,0)}</span></div>
                        <div className="stat-item"><span className="stat-label">TPS Promedio:</span><span className="stat-value">{formNum(resultados.promedios.TPS,0)}</span></div>
                        <div className="stat-item"><span className="stat-label">TH Promedio:</span><span className="stat-value">{formNum(resultados.promedios.TH,0)}</span></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
