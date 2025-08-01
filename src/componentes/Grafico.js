import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const obterDadosGrafico = (dados, tipo) => {
    const chaves = ['femeas', 'machos', 'filhotes'];
    const rotulos = chaves.map((chave) => chave.charAt(0).toUpperCase() + chave.slice(1));
    const valores = chaves.map((chave) => Object.values(dados).reduce((acc, item) => {
        if (item && typeof item === 'object' && chave in item) {
            return acc + item[chave];
        }
        return acc;
    }, 0));
    return {
        labels: rotulos,
        datasets: [{
            label: 'Quantidade',
            data: valores,
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)', 'rgb(255, 159, 64)'],
            borderWidth: 1
        }]
    };
};

const criarGrafico = (ctx, tipo, dados) => {
    return new Chart(ctx, {
        type: tipo,
        data: dados,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

const Grafico = ({ dadosBovinos, tipo }) => {
    const graficoRef = useRef(null);

    useEffect(() => {
        const ctx = graficoRef.current.getContext('2d');
        const dados = obterDadosGrafico(dadosBovinos, tipo);

        if (graficoRef.current.chart) {
            graficoRef.current.chart.destroy();
        }

        graficoRef.current.chart = criarGrafico(ctx, 'bar', dados);
    }, [dadosBovinos, tipo]);

    return (
        <div>
            <canvas ref={graficoRef}></canvas>
        </div>
    );
};

export default Grafico;

