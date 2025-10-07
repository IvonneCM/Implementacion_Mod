import React, { useState } from 'react';
import '../styles/simulacion.css';
import { simularInventario } from '../funciones/azucarSimu';

// ======= COMPONENTE PRINCIPAL =======
export default function SimulacionEventos() {
  const valoresIniciales = {
    horizonDays: 27,
    numSimulaciones: 10,
    capacity: 700,
    meanDemand: 100,
    orderCost: 100,
    carryCostPerKgDay: 0.1,
    unitAcqCost: 3.5,
    unitSellPrice: 5.0,
    initialInventory: 700,
    reviewPeriod: 7,
    leadMin: 1,
    leadMax: 3,
  };

  const [parametros, setParametros] = useState(valoresIniciales);
  const [tablaSimulaciones, setTablaSimulaciones] = useState([]);
  const [promedios, setPromedios] = useState(null);

  const actualizarParametro = (campo, valor) => {
    setParametros((prev) => ({ ...prev, [campo]: valor }));
  };

  const ejecutarSimulacion = () => {
    const resultados = [];
    let inventarioAcum = 0;
    let costoTotalAcum = 0;
    let gananciaAcum = 0;
    let demandaInsatisfechaAcum = 0;

    for (let i = 0; i < parametros.numSimulaciones; i++) {
      const salida = simularInventario(parametros);
      const { resultados: r, tabla } = salida;

      resultados.push({
        Simulación: i + 1,
        GananciaNeta: parseFloat(r.GananciaNeta),
        CostoTotal: parseFloat(r.CostoTotal),
        DemandaInsatisfecha: parseFloat(r.DemandaInsatisfecha),
      });

      inventarioAcum += tabla.reduce((acc, d) => acc + parseFloat(d.Inventario), 0) / tabla.length;
      costoTotalAcum += parseFloat(r.CostoTotal);
      gananciaAcum += parseFloat(r.GananciaNeta);
      demandaInsatisfechaAcum += parseFloat(r.DemandaInsatisfecha);
    }

    const promedioInventario = (inventarioAcum / parametros.numSimulaciones).toFixed(2);
    const promedioCosto = (costoTotalAcum / parametros.numSimulaciones).toFixed(2);
    const promedioGanancia = (gananciaAcum / parametros.numSimulaciones).toFixed(2);
    const promedioDemandaInsatisfecha = (demandaInsatisfechaAcum / parametros.numSimulaciones).toFixed(2);

    setTablaSimulaciones(resultados);
    setPromedios({
      inventarioProm: promedioInventario,
      costoProm: promedioCosto,
      gnetProm: promedioGanancia,
      demandaInsatisfechaProm: promedioDemandaInsatisfecha,
    });
  };

  const limpiar = () => {
    setParametros({
      horizonDays: '',
      numSimulaciones: '',
      capacity: '',
      meanDemand: '',
      orderCost: '',
      carryCostPerKgDay: '',
      unitAcqCost: '',
      unitSellPrice: '',
      initialInventory: '',
      reviewPeriod: '',
      leadMin: '',
      leadMax: '',
    });
    setTablaSimulaciones([]);
    setPromedios(null);
  };  

  return (
    <div className="container">
      <header className="header">
        <h1>Simulación de Inventario de Azúcar</h1>
      </header>

      <div className="content">
        <div className="problema-section">
          <h2 className="subtitulo">Agencia de Azúcar</h2>
          <div className="columnas">

            {/* Columna Izquierda */}
            <div className="columna-izquierda">
              <div className="card">
                <h3>Parámetros de la Simulación</h3>

                <div className="input-group">
                  <label>Número de simulaciones:</label>
                  <input
                    type="number"
                    min="1"
                    value={parametros.numSimulaciones}
                    onChange={(e) => actualizarParametro('numSimulaciones', parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="input-group">
                  <label>Días del horizonte:</label>
                  <input
                    type="number"
                    min="1"
                    value={parametros.horizonDays}
                    onChange={(e) => actualizarParametro('horizonDays', parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="parametros-section">
                  <h4>Parámetros del Inventario</h4>

                  <div className="input-group">
                    <label>Capacidad (kg):</label>
                    <input
                      type="number"
                      value={parametros.capacity}
                      onChange={(e) => actualizarParametro('capacity', Number(e.target.value) || 0)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Inventario inicial (kg):</label>
                    <input
                      type="number"
                      value={parametros.initialInventory}
                      onChange={(e) => actualizarParametro('initialInventory', Number(e.target.value) || 0)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Periodo de revisión (días):</label>
                    <input
                      type="number"
                      min="1"
                      value={parametros.reviewPeriod}
                      onChange={(e) => actualizarParametro('reviewPeriod', Number(e.target.value) || 1)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Lead time mínimo (días):</label>
                    <input
                      type="number"
                      min="0"
                      value={parametros.leadMin}
                      onChange={(e) => actualizarParametro('leadMin', Number(e.target.value) || 0)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Lead time máximo (días):</label>
                    <input
                      type="number"
                      min="0"
                      value={parametros.leadMax}
                      onChange={(e) => actualizarParametro('leadMax', Number(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="parametros-section">
                  <h4>Demanda y Costos</h4>

                  <div className="input-group">
                    <label>Demanda media (kg/día):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={parametros.meanDemand}
                      onChange={(e) => actualizarParametro('meanDemand', Number(e.target.value) || 0)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Costo de orden (Bs):</label>
                    <input
                      type="number"
                      value={parametros.orderCost}
                      onChange={(e) => actualizarParametro('orderCost', Number(e.target.value) || 0)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Costo inventario (Bs/kg/día):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={parametros.carryCostPerKgDay}
                      onChange={(e) => actualizarParametro('carryCostPerKgDay', Number(e.target.value) || 0)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Costo adquisición/unidad (Bs):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={parametros.unitAcqCost}
                      onChange={(e) => actualizarParametro('unitAcqCost', Number(e.target.value) || 0)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Precio venta/unidad (Bs):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={parametros.unitSellPrice}
                      onChange={(e) => actualizarParametro('unitSellPrice', Number(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="acciones">
                  <button className="btn-simular" onClick={ejecutarSimulacion}>
                    Simular
                  </button>
                  <button className="btn-simular btn-secundario" onClick={limpiar}>
                    Limpiar
                  </button>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="columna-derecha">
              <div className="card">
                <h3>Resultados de la Simulación</h3>

                <div className="tabla-container">
                  <table className="tabla-resultados">
                    <thead>
                      <tr>
                        <th>SIM</th>
                        <th>GNETA (Bs)</th>
                        <th>CTOT (Bs)</th>
                        <th>DIT (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tablaSimulaciones.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="sin-datos">
                            Ejecuta las simulaciones para ver resultados
                          </td>
                        </tr>
                      ) : (
                        tablaSimulaciones.map((r) => (
                          <tr key={r.Simulación}>
                            <td>{r.Simulación}</td>
                            <td>{r.GananciaNeta.toFixed(2)}</td>
                            <td>{r.CostoTotal.toFixed(2)}</td>
                            <td>{r.DemandaInsatisfecha.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {promedios && (
                  <div className="estadisticas">
                    <h4>Promedio de Resultados</h4>
                    <div className="estadisticas-grid">
                      <div className="stat-item">
                        <span className="stat-label">Inventario Promedio (UNID)</span>
                        <span className="stat-value">{promedios.inventarioProm}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">CTOT (Bs.):</span>
                        <span className="stat-value">{promedios.costoProm}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">GNETA (Bs.):</span>
                        <span className="stat-value">{promedios.gnetProm}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">DIT (kg) (Demanda Insatisfecha):</span>
                        <span className="stat-value">{promedios.demandaInsatisfechaProm}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
