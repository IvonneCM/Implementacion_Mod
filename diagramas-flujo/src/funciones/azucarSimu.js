// azucarSimu.js

// ======= FUNCIONES AUXILIARES =======
function expRand(mean) {
    const u = Math.random();
    return -Math.log(1 - u) * mean;
  }
  
  function uniformRand(a, b) {
    return a + (b - a) * Math.random();
  }
  
  // ======= FUNCIÓN PRINCIPAL =======
  export function simularInventario({
    horizonDays = 27,
    capacity = 700,
    meanDemand = 100,
    orderCost = 100,
    carryCostPerKgDay = 0.1,
    unitAcqCost = 3.5,
    unitSellPrice = 5.0,
    initialInventory = capacity,
  }) {
    const reviewPeriod = 7;
    const leadMin = 1;
    const leadMax = 3;
  
    let CD = 0;
    let IAZU = initialInventory;
    let PAZU = 0;
    let TENT = "-";
    let pendingOrders = [];
  
    let CTORD = 0;
    let CTADQ = 0;
    let CTINV = 0;
    let CTOT = 0;
  
    let totalDemand = 0;
    let totalSold = 0;
    let totalLost = 0;
    let revenue = 0;
  
    const tabla = [];
  
    for (CD = 1; CD <= horizonDays; CD++) {
      // === Llegadas de pedidos previos ===
      for (let i = pendingOrders.length - 1; i >= 0; i--) {
        if (pendingOrders[i].arrivalDay <= CD) {
          const qty = pendingOrders[i].qty;
          IAZU = Math.min(IAZU + qty, capacity);
          pendingOrders.splice(i, 1);
        }
      }
  
      PAZU = 0;
      if (CD % reviewPeriod === 0) {
        const orderQty = Math.max(0, capacity - IAZU);
        if (orderQty > 0) {
          PAZU = orderQty;
          let lead = Math.round(uniformRand(leadMin, leadMax));
          lead = Math.min(3, Math.max(1, lead));
          const arrivalDay = CD + lead;
          pendingOrders.push({ qty: orderQty, arrivalDay });
          TENT = lead;
  
          CTORD += orderCost;
          CTADQ += orderQty * unitAcqCost;
        }
      } else {
        if (pendingOrders.length > 0) {
          const next = Math.min(...pendingOrders.map(o => o.arrivalDay - CD));
          TENT = Math.max(0, next);
        } else {
          TENT = Infinity;
        }
      }
  
      // === Demanda diaria ===
      const DAZU = Math.round(expRand(meanDemand));
      totalDemand += DAZU;
  
      const sold = Math.min(IAZU, DAZU);
      const lost = Math.max(0, DAZU - sold);
      totalSold += sold;
      totalLost += lost;
      revenue += sold * unitSellPrice;
  
      IAZU -= sold;
      CTINV += IAZU * carryCostPerKgDay;
      CTOT = CTORD + CTADQ + CTINV;
  
      tabla.push({
        Día: CD,
        Inventario: IAZU.toFixed(2),
        Demanda: DAZU.toFixed(2),
        Pedido: PAZU.toFixed(2),
        TiempoEntrega: isFinite(TENT) ? TENT.toFixed(2) : "-",
        CostoOrden: CTORD.toFixed(2),
        CostoAdquisicion: CTADQ.toFixed(2),
        CostoInventario: CTINV.toFixed(2),
        CostoTotal: CTOT.toFixed(2),
        PerdidaAcumulada: totalLost.toFixed(2),
      });
    }
  
    const resultados = {
      DemandaTotal: totalDemand.toFixed(2),
      TotalVendido: totalSold.toFixed(2),
      DemandaInsatisfecha: totalLost.toFixed(2),
      CostoTotal: CTOT.toFixed(2),
      Ingresos: revenue.toFixed(2),
      GananciaNeta: (revenue - CTOT).toFixed(2),
      NivelServicio: ((totalSold / totalDemand) * 100).toFixed(2) + "%",
    };
  
    return { tabla, resultados };
  }
  