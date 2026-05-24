const cloudDetails = {
    aws: {
        name: 'Amazon Web Services (AWS)',
        icon: 'fab fa-aws',
        color: '#ff9900',
        year: '2006',
        description: 'Pioneira do mercado de cloud computing. Lancou o EC2 e S3, criando o modelo IaaS como conhecemos hoje.',
        pros: [
            'Mercado: 31 por cento (lider isolada)',
            'Mais de 200 servicos (a maior variedade)',
            'Presenca global: 32 regioes, 102 zonas de disponibilidade',
            'Ecossistema gigante de parceiros e certificacoes',
            'Escala massiva (Netflix, Airbnb, Spotify rodam na AWS)'
        ],
        cons: [
            'Precificacao complexa (facil de errar a conta)',
            'Curva de aprendizado ingreme',
            'Menos focada em integracao com software empresarial que a Azure'
        ],
        bestFor: 'Grandes empresas, startups em escala global, aplicacoes que precisam de alta disponibilidade'
    },
    azure: {
        name: 'Microsoft Azure',
        icon: 'fab fa-microsoft',
        color: '#0078d4',
        year: '2010',
        description: 'A cloud da Microsoft, com forte integracao no mundo corporativo. Nasceu como "Windows Azure" e evoluiu rapidamente.',
        pros: [
            'Mercado: 25 por cento (segundo lugar, crescendo rapido)',
            'Integracao perfeita com Windows Server, Active Directory, .NET, SQL Server',
            'Hibrido maduro (Azure Arc, Azure Stack)',
            'Parceria forte com Oracle, SAP e outras gigantes',
            'Otimo para empresas que ja usam licencas Microsoft'
        ],
        cons: [
            'Interface do portal pode ser confusa',
            'Documentacao menos organizada que a AWS',
            'Precos podem ser altos sem o desconto de licencas corporativas'
        ],
        bestFor: 'Empresas que ja vivem no ecossistema Microsoft, setor governamental, solucoes hibridas'
    },
    gcp: {
        name: 'Google Cloud Platform (GCP)',
        icon: 'fab fa-google',
        color: '#4285f4',
        year: '2011',
        description: 'A cloud que nasceu da experiencia do Google em big data, machine learning e rede de fibra otica global.',
        pros: [
            'Mercado: 11 por cento (terceiro, mas em crescimento acelerado)',
            'Especialista em BigQuery (data warehouse), TensorFlow, Vertex AI',
            'Rede de fibra otica propria (mais rapida entre regioes)',
            'Kubernetes nasceu no Google (GKE e referencia)',
            'Precos competitivos e modelo de descontos automaticos'
        ],
        cons: [
            'Menos servicos empresariais que AWS/Azure',
            'Menos regioes que AWS',
            'Suporte ao cliente pode ser mais lento para planos baixos'
        ],
        bestFor: 'Startups, empresas focadas em dados/IA, times que usam Kubernetes, analise de dados massivos'
    }
};

function updateUI(cloudId) {
    document.querySelectorAll('.cloud-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.cloud === cloudId) {
            card.classList.add('active');
        }
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.cloud === cloudId) {
            item.classList.add('active');
        }
    });

    const data = cloudDetails[cloudId];
    if (!data) return;

    const detailTitle = document.getElementById('detailTitle');
    detailTitle.innerHTML = `
        <i class="${data.icon}" style="color: ${data.color}"></i>
        <span style="color: ${data.color}; font-weight: bold;">${data.name}</span>
        <span style="font-size: 0.8rem; margin-left: 10px;">(Lancada em ${data.year})</span>
    `;

    const detailGrid = document.getElementById('detailGrid');
    detailGrid.innerHTML = `
        <div class="detail-item">
            <h4>Sobre a plataforma</h4>
            <p>${data.description}</p>
        </div>
        <div class="detail-item">
            <h4 style="color: ${data.color};">Pontos fortes</h4>
            <ul>
                ${data.pros.map(p => `<li>+ ${p}</li>`).join('')}
            </ul>
        </div>
        <div class="detail-item">
            <h4>Pontos de atencao</h4>
            <ul>
                ${data.cons.map(c => `<li>- ${c}</li>`).join('')}
            </ul>
        </div>
        <div class="detail-item">
            <h4>Melhor para</h4>
            <p>${data.bestFor}</p>
        </div>
    `;
}

document.querySelectorAll('.cloud-card').forEach(card => {
    card.addEventListener('click', () => {
        updateUI(card.dataset.cloud);
    });
});

document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', () => {
        updateUI(item.dataset.cloud);
    });
});

updateUI('aws');