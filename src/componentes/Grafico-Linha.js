import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { subMonths, format } from 'date-fns';
import ptLocale from 'date-fns/locale/pt-BR';

const GraficoLinha = ({ dadosFinanceiros }) => {
    const graficoRef = useRef(null);
    useEffect(() => {
        const fetchData = async () => {
            try {          
                const dataAtual = new Date();
                const primeiroDiaDoMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
                const labels = Array.from({ length: 7 }, (_, index) => {
                    const mes = subMonths(primeiroDiaDoMesAtual, index);
                    return format(mes, 'MMMM', { locale: ptLocale });
                }).reverse();
                const dadosPorMes = labels.map((mes) => {
                    const dadosDoMes = dadosFinanceiros.filter((dados) => {
                        const data = new Date(dados.data);
                        return format(data, 'MMMM', { locale: ptLocale }) === mes;
                    });
                    const totalEntrada = dadosDoMes.reduce((acc, item) => acc + (item.entrada || 0), 0);
                    const totalSaida = dadosDoMes.reduce((acc, item) => acc + (item.saida || 0), 0);
                    return totalEntrada - totalSaida;
                });
                const ctx = graficoRef.current.getContext('2d');
                const data = {
                    labels: labels,
                    datasets: [{
                        label: 'Total',
                        data: dadosPorMes,
                        fill: false,
                        borderColor: '#194328',
                        tension: 0.1
                    }]
                };
                if (graficoRef.current.chart) {
                    graficoRef.current.chart.destroy();
                }
                graficoRef.current.chart = new Chart(ctx, {
                    type: 'line',
                    data: data,
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                            }
                        }
                    }
                });
            } catch (error) {
                console.error("Erro ao buscar dados financeiros:", error.message);
            }
        };
        fetchData();
    }, [dadosFinanceiros]);

    return (
        <div>
            <canvas ref={graficoRef}></canvas>
        </div>
    );
};

export default GraficoLinha;
