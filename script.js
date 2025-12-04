// DATOS DEL PORTFOLIO (Modifica estos valores con tus inversiones reales)
const portfolioData = {
    inversiones: [
        {
            activo: "Apple Inc. (AAPL)",
            cantidad: 10,
            precioCompra: 150,
            precioActual: 185,
            tipo: "Acción"
        },
        {
            activo: "Microsoft (MSFT)",
            cantidad: 8,
            precioCompra: 300,
            precioActual: 340,
            tipo: "Acción"
        },
        {
            activo: "Bitcoin (BTC)",
            cantidad: 0.5,
            precioCompra: 40000,
            precioActual: 45000,
            tipo: "Cripto"
        },
        {
            activo: "Ethereum (ETH)",
            cantidad: 2,
            precioCompra: 2500,
            precioActual: 2800,
            tipo: "Cripto"
        },
        {
            activo: "S&P 500 ETF (SPY)",
            cantidad: 15,
            precioCompra: 400,
            precioActual: 430,
            tipo: "ETF"
        }
    ],
    // Datos históricos del valor total del portfolio (últimos 12 meses)
    evolucionHistorica: {
        meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        valores: [15000, 15500, 14800, 16200, 17000, 16500, 18000, 18500, 17800, 19200, 20500, 21800]
    }
};

// Calcular métricas del portfolio
function calcularMetricas() {
    let valorTotal = 0;
    let inversionTotal = 0;
    let mejorActivo = "";
    let mejorRendimiento = -Infinity;

    portfolioData.inversiones.forEach(inv => {
        const valorActual = inv.cantidad * inv.precioActual;
        const valorCompra = inv.cantidad * inv.precioCompra;
        const rendimiento = ((inv.precioActual - inv.precioCompra) / inv.precioCompra) * 100;

        valorTotal += valorActual;
        inversionTotal += valorCompra;

        if (rendimiento > mejorRendimiento) {
            mejorRendimiento = rendimiento;
            mejorActivo = inv.activo;
        }
    });

    const rendimientoTotal = ((valorTotal - inversionTotal) / inversionTotal) * 100;

    return {
        valorTotal,
        rendimientoTotal,
        mejorActivo,
        mejorRendimiento
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
        `${metricas.mejorActivo.split(' ')[0]} (+${metricas.mejorRendimiento.toFixed(1)}%)`;
}

// Crear gráfico de evolución
function crearGraficoEvolucion() {
    const ctx = document.getElementById('evolucionChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: portfolioData.evolucionHistorica.meses,
            datasets: [{
                label: 'Valor del Portfolio (€)',
                data: portfolioData.evolucionHistorica.valores,
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
    
    const labels = portfolioData.inversiones.map(inv => inv.activo.split(' ')[0]);
    const valores = portfolioData.inversiones.map(inv => inv.cantidad * inv.precioActual);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#4facfe',
                    '#43e97b'
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
                            return `€${context.parsed.toLocaleString('es-ES')} (${porcentaje}%)`;
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

    portfolioData.inversiones.forEach(inv => {
        const rendimiento = ((inv.precioActual - inv.precioCompra) / inv.precioCompra) * 100;
        const esPositivo = rendimiento >= 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${inv.activo}</strong><br><small>${inv.tipo}</small></td>
            <td>${inv.cantidad}</td>
            <td>€${inv.precioCompra.toLocaleString('es-ES')}</td>
            <td>€${inv.precioActual.toLocaleString('es-ES')}</td>
            <td class="${esPositivo ? 'positivo' : 'negativo'}">
                ${esPositivo ? '▲' : '▼'} ${rendimiento.toFixed(2)}%
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