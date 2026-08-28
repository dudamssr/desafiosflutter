let dados = [];

async function carregarDados() {
    try {
        const resposta = await fetch("dados.csv");

        if (!resposta.ok) {
            throw new Error("Não foi possível encontrar o arquivo dados.csv");
        }

        const texto = await resposta.text();

        const linhas = texto.trim().split(/\r?\n/);

        linhas.shift();

        dados = linhas.map(linha => {
            const colunas = linha.split(";");

            return {
                data: colunas[0].trim(),
                hora: colunas[1].trim(),
                semana: colunas[2].trim()
            };
        });

        criarDashboard();

    } catch (erro) {
        console.error(erro);

        alert("Erro ao carregar os dados. Verifique se o arquivo dados.csv está na mesma pasta do index.html.");
    }
}

function criarDashboard() {
    const total = dados.length;

    document.getElementById("total").textContent = total;

    const porDia = {};

    dados.forEach(item => {
        if (!porDia[item.data]) {
            porDia[item.data] = 0;
        }

        porDia[item.data]++;
    });

    const media = total / Object.keys(porDia).length;

    document.getElementById("media").textContent = Math.round(media);

    const pico = Math.max(...Object.values(porDia));

    document.getElementById("pico").textContent = pico;

    const porHora = {};

    dados.forEach(item => {
        const hora = item.hora.substring(0, 2);

        if (!porHora[hora]) {
            porHora[hora] = 0;
        }

        porHora[hora]++;
    });

    const maiorQuantidadeHora = Math.max(...Object.values(porHora));

    const horarioPico = Object.keys(porHora)
        .find(hora => porHora[hora] === maiorQuantidadeHora);

    document.querySelector(".laranja")
        .parentElement
        .querySelector("strong")
        .textContent = horarioPico + ":00";

    criarGraficoDiario(porDia);
    criarGraficoSemanal();
}

function criarGraficoDiario(porDia) {
    const dias = Object.keys(porDia);
    const valores = Object.values(porDia);

    const ctx = document.getElementById("graficoDiario");

    new Chart(ctx, {
        type: "line",

        data: {
            labels: dias,

            datasets: [{
                label: "Aberturas",
                data: valores,
                borderWidth: 3,
                tension: 0.3,
                fill: true
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        }
    });
}

function criarGraficoSemanal() {
    const semanas = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
    };

    dados.forEach(item => {
        semanas[item.semana]++;
    });

    const ctx = document.getElementById("graficoSemanal");

    new Chart(ctx, {
        type: "bar",

        data: {
            labels: [
                "Semana 1",
                "Semana 2",
                "Semana 3",
                "Semana 4",
                "Semana 5"
            ],

            datasets: [{
                label: "Aberturas",

                data: [
                    semanas["1"],
                    semanas["2"],
                    semanas["3"],
                    semanas["4"],
                    semanas["5"]
                ],

                borderWidth: 1
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

carregarDados();