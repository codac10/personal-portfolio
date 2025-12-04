// DATOS REALES DEL PORTFOLIO
const portfolioData = {
    // Compras de BTC (mantén los precios históricos exactos)
    comprasBTC: [
        { fecha: "2021-06-05", euros: 20.00, precioBTC: 29221.08 },
        { fecha: "2021-06-20", euros: 80.00, precioBTC: 30071.78 },
        { fecha: "2021-08-25", euros: 20.00, precioBTC: 41589.11 },
        { fecha: "2021-09-09", euros: 50.00, precioBTC: 39233.23 },
        { fecha: "2021-10-25", euros: 34.08, precioBTC: 54303.45 },
        { fecha: "2021-12-15", euros: 30.61, precioBTC: 43307.63 },
        { fecha: "2023-04-15", euros: 150.00, precioBTC: 27307.81 },
        { fecha: "2023-05-19", euros: 600.00, precioBTC: 24855.89 },
        { fecha: "2023-12-07", euros: 300.00, precioBTC: 40122.91 },
        { fecha: "2024-01-04", euros: 200.00, precioBTC: 40360.08 },
        { fecha: "2024-03-20", euros: 700.00, precioBTC: 62092.18 },
        { fecha: "2024-06-02", euros: 600.00, precioBTC: 62428.63 },
        { fecha: "2024-06-27", euros: 800.00, precioBTC: 57532.42 },
        { fecha: "2024-08-05", euros: 500.00, precioBTC: 49304.35 },
        { fecha: "2024-08-28", euros: 700.00, precioBTC: 53060.82 },
        { fecha: "2024-11-01", euros: 120.00, precioBTC: 63918.38 }
    ],
    
    // Compras de MSTR
    comprasMSTR: [
        { fecha: "2024-06-09", acciones: 1.01, precioEUR: 322 },
        { fecha: "2024-06-25", acciones: 1.05, precioEUR: 314 },
        { fecha: "2024-07-30", acciones: 1.70, precioEUR: 326 },
        { fecha: "2024-08-31", acciones: 2.08, precioEUR: 337 },
        { fecha: "2024-10-08", acciones: 5.00, precioEUR: 178 },
        { fecha: "2024-11-07", acciones: 1.00, precioEUR: 249 },
        { fecha: "2024-11-11", acciones: 1.00, precioEUR: 281 },
        { fecha: "2024-12-24", acciones: 1.00, precioEUR: 342 }
    ],
    
    // Precios actuales (actualiza estos manualmente)
    preciosActuales: {
        btcEUR: 80000,  // Precio actual de BTC en EUR
        mstrEUR: 179,   // Precio actual de MSTR en EUR (188 USD × 0.95)
        usdToEUR: 0.95  // Tipo de cambio USD a EUR
    }
};

// Calcular totales de BTC
function calcularBTC() {
    const totalInvertido = portfolioData.comprasBTC.reduce((sum, c) => sum + c.euros, 0);
    const totalBTC = portfolioData.comprasBTC.reduce((sum, c) => sum + (c.euros / c.precioBTC), 0);
    const valorActual = totalBTC * portfolioData.preciosActuales.btcEUR;
    const rendimiento = ((valorActual - totalInvertido) / totalInvertido) * 100;
    
    return {
        activo: "Bitcoin (BTC)",
        cantidad: totalBTC.toFixed(8),
        invertido: totalInvertido,
        valorActual: valorActual,
        rendimiento: rendimiento,
        tipo: "Cripto"
    };
}

// Calcular totales de MSTR
function calcularMSTR() {
    const totalAcciones = portfolioData.comprasMSTR.reduce((sum, c) => sum + c.acciones, 0);
    const totalInvertidoEUR = portfolioData.comprasMSTR.reduce((sum, c) => sum + (c.acciones * c.precioEUR), 0);
    const valorActualEUR = totalAcciones * portfolioData.preciosActuales.mstrEUR;
    const rendimiento = ((valorActualEUR - totalInvertidoEUR) / totalInvertidoEUR) * 100;
    
    return {
        activo: "MicroStrategy (MSTR)",
        cantidad: totalAcciones.toFixed(2),
        invertido: totalInvertidoEUR,
        valorActual: valorActualEUR,
        rendimiento: rendimiento,
        tipo: "Acción"
    };
}

// Generar evolución histórica (últimos 12 meses)
function generarEvolucionHistorica() {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const año = 2024;
    
    // Precios históricos aproximados de BTC en EUR (ajusta según necesites)
    const preciosHistoricos = [
        42000, 50000, 65000, 62000, 60000, 58000, 
        53000, 50000, 55000, 63000, 85000, 95000
    ];
    
    const valores = preciosHistoricos.map((precio, index) => {
        const btc = calcularBTC();
        const valorBTC = parseFloat(btc.cantidad) * precio;
        
        // MSTR solo desde junio
        let valorMSTR = 0;
        if (index >= 5) { // Junio en adelante
            const mstr = calcularMSTR();
            const precioMSTRHistorico = 250 + (index - 5) * 15; // Aproximación en EUR
            valorMSTR = parseFloat(mstr.cantidad) * precioMSTRHistorico;
        }
        
        return Math.round(valorBTC + valorMSTR);
    });
    
    return { meses, valores };
}

// Calcular métricas del portfolio
function calcularMetricas() {
    const btc = calcularBTC();
    const mstr = calcularMSTR();
    
    const valorTotal = btc.valorActual + mstr.valorActual;
    const inversionTotal = btc.invertido + mstr.invertido;
    const rendimientoTotal = ((valorTotal - inversionTotal) / inversionTotal) * 100;
    
    const mejorActivo = btc.rendimiento > mstr.rendimiento ? "Bitcoin" : "MicroStrategy";
    const mejorRendimiento = Math.max(btc.rendimiento, mstr.rendimiento);
    
    return {
        valorTotal,
        rendimientoTotal,
        mejorActivo,
        mejorRendimiento,
        inversiones: [btc, mstr]
    };
}

// Actualizar tarjetas de resumen
function actualizarResumen() {
    const metricas = calcularMetricas();

    document.getElementById('valorTotal').textContent = 
        `€${metricas.valorTotal.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    const rendimientoElement = document.getElementById('rendimientoTotal');
    rendimientoElement.textContent = `${metricas.rendimientoTotal.toFixed(2)}%`;
    rendimientoElement.className = metricas.rendimientoTotal >= 0 ? 'value positivo' : 'value negativo';

    document.getElementById('mejorInversion').textContent = 
        `${metricas.mejorActivo} (+${metricas.mejorRendimiento.toFixed(1)}%)`;
}

// Crear gráfico de evolución
function crearGraficoEvolucion() {
    const ctx = document.getElementById('evolucionChart').getContext('2d');
    const historico = generarEvolucionHistorica();
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: historico.meses,
            datasets: [{
                label: 'Valor del Portfolio (€)',
                data: historico.valores,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `€${context.parsed.y.toLocaleString('es-ES')}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString('es-ES');
                        }
                    }
                }
            }
        }
    });
}

// Crear gráfico de distribución
function crearGraficoDistribucion() {
    const ctx = document.getElementById('distribucionChart').getContext('2d');
    const metricas = calcularMetricas();
    
    const labels = metricas.inversiones.map(inv => inv.activo);
    const valores = metricas.inversiones.map(inv => inv.valorActual);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: [
                    '#667eea',
                    '#764ba2'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const porcentaje = ((context.parsed / total) * 100).toFixed(1);
                            return `€${context.parsed.toLocaleString('es-ES', {maximumFractionDigits: 0})} (${porcentaje}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Llenar tabla de inversiones
function llenarTabla() {
    const tbody = document.getElementById('tablaBody');
    tbody.innerHTML = '';
    const metricas = calcularMetricas();

    metricas.inversiones.forEach(inv => {
        const esPositivo = inv.rendimiento >= 0;
        const precioPromedio = inv.invertido / parseFloat(inv.cantidad);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${inv.activo}</strong><br><small>${inv.tipo}</small></td>
            <td>${inv.cantidad}</td>
            <td>€${precioPromedio.toLocaleString('es-ES', {maximumFractionDigits: 2})}</td>
            <td>€${(inv.valorActual / parseFloat(inv.cantidad)).toLocaleString('es-ES', {maximumFractionDigits: 2})}</td>
            <td class="${esPositivo ? 'positivo' : 'negativo'}">
                ${esPositivo ? '▲' : '▼'} ${inv.rendimiento.toFixed(2)}%
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Actualizar fecha
function actualizarFecha() {
    const ahora = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('lastUpdate').textContent = ahora.toLocaleDateString('es-ES', opciones);
}

// Inicializar todo cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarResumen();
    crearGraficoEvolucion();
    crearGraficoDistribucion();
    llenarTabla();
    actualizarFecha();
});