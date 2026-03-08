// 1. Salva o tipo de ocorrência escolhido na Página 1
function setTipo(tipo) {
    localStorage.clear(); // Limpa dados de ocorrências anteriores
    localStorage.setItem('tipo_ocorrencia', tipo);
}

// 2. Função para salvar dados ao mudar de página (Use na Pag 2 e 3)
// Chame essa função no botão "Próximo" das outras páginas
function salvarDadosEAvancar(passo, urlDestino) {
    const inputs = document.querySelectorAll('input, textarea, select');
    const dados = {};
    
    inputs.forEach(input => {
        if (input.name) dados[input.name] = input.value;
    });

    localStorage.setItem(`dados_passo_${passo}`, JSON.stringify(dados));
    window.location.href = urlDestino;
}

// 3. Função para Gerar o Protocolo e o PDF (Chamar no "Finalizar" da Pag 3)
function gerarRelatorioFinal() {
    // Importa o jsPDF (certifique-se de carregar a lib na pag 3)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Recupera todos os dados salvos no navegador
    const tipo = localStorage.getItem('tipo_ocorrencia') || "N/A";
    const p2 = JSON.parse(localStorage.getItem('dados_passo_2') || '{}');
    const p3 = JSON.parse(localStorage.getItem('dados_passo_3') || '{}');
    
    // Gera Protocolo: DATA + HORA + RANDOM
    const agora = new Date();
    const protocolo = `PROT-${agora.getFullYear()}${agora.getTime().toString().slice(-4)}`;

    // --- Montagem do Layout do PDF ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("RELATÓRIO DE ATENDIMENTO - APH", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Protocolo: ${protocolo}`, 10, 35);
    doc.text(`Tipo: ${tipo}`, 10, 42);
    doc.text(`Data/Hora: ${agora.toLocaleString()}`, 130, 35);
    doc.line(10, 45, 200, 45);

    // Seção Vítima (Dados da Página 2)
    doc.setFont("helvetica", "bold");
    doc.text("DADOS DO PACIENTE E SINAIS VITAIS", 10, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome: ${p2.nome || 'Não informado'}`, 10, 65);
    doc.text(`Queixa: ${p2.queixa || 'Não informado'}`, 10, 72);
    doc.text(`PA: ${p2.pa || '--'} | FC: ${p2.fc || '--'} | SpO2: ${p2.spo2 || '--'}`, 10, 79);

    // Seção Conduta (Dados da Página 3)
    doc.setFont("helvetica", "bold");
    doc.text("CONDUTA E DESFECHO", 10, 95);
    doc.setFont("helvetica", "normal");
    const conduta = doc.splitTextToSize(`Procedimentos: ${p3.procedimentos || 'N/A'}`, 180);
    doc.text(conduta, 10, 105);
    doc.text(`Médico Regulador: ${p3.medico || 'N/A'}`, 10, 130);
    doc.text(`Encaminhamento: ${p3.local || 'N/A'}`, 10, 137);

    // Assinatura Virtual
    doc.line(60, 170, 150, 170);
    doc.text("Assinatura do Socorrista Responsável", 105, 175, { align: "center" });

    // Download
    doc.save(`Ocorrencia_${protocolo}.pdf`);
    
    alert("Protocolo Gerado: " + protocolo);
}