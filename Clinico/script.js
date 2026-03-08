// Função para salvar o tipo escolhido na Página 1
function setTipo(tipo) {
    localStorage.clear(); // Limpa atendimentos anteriores
    localStorage.setItem('tipo_ocorrencia', tipo);
}

// Função para salvar os dados da Página 2 ou 3
function salvarDadosEAvancar(passo, urlDestino) {
    // Seleciona todos os campos de entrada da página
    const campos = document.querySelectorAll('input, textarea, select');
    const dados = {};
    
    // Armazena o valor de cada campo usando o atributo 'name' como chave
    campos.forEach(campo => {
        if (campo.name) {
            dados[campo.name] = campo.value;
        }
    });

    // Salva no localStorage com a identificação do passo
    localStorage.setItem(`dados_passo_${passo}`, JSON.stringify(dados));
    
    // Encaminha para a próxima página
    window.location.href = urlDestino;
}

// Esta função será usada na sua ÚLTIMA página (Passo 3)
function finalizarERelatar() {
    // Primeiro salva os dados da última página
    const campos3 = document.querySelectorAll('input, textarea, select');
    const dados3 = {};
    campos3.forEach(c => { if(c.name) dados3[c.name] = c.value; });
    localStorage.setItem('dados_passo_3', JSON.stringify(dados3));

    // Agora gera o PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Recupera TUDO
    const tipo = localStorage.getItem('tipo_ocorrencia') || "N/A";
    const p2 = JSON.parse(localStorage.getItem('dados_passo_2') || '{}');
    const p3 = JSON.parse(localStorage.getItem('dados_passo_3') || '{}');
    
    // Protocolo Único
    const protocolo = "RES-" + Date.now().toString().slice(-6);

    // Layout do PDF
    doc.setFont("helvetica", "bold");
    doc.text("RELATÓRIO DE ATENDIMENTO PRÉ-HOSPITALAR", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`PROTOCOLO: ${protocolo}`, 10, 35);
    doc.text(`TIPO: ${tipo}`, 10, 42);
    doc.text(`DATA: ${new Date().toLocaleDateString()}`, 150, 35);
    doc.line(10, 45, 200, 45);

    // Seção Vítima
    doc.setFontSize(12);
    doc.text("1. INFORMAÇÕES DO PACIENTE", 10, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome: ${p2.nome || '---'} | Idade: ${p2.idade || '---'} | Sexo: ${p2.sexo || '---'}`, 10, 65);
    doc.text(`CPF: ${p2.cpf || '---'}`, 10, 72);
    
    doc.setFont("helvetica", "bold");
    doc.text("2. QUADRO CLÍNICO E SINAIS VITAIS", 10, 85);
    doc.setFont("helvetica", "normal");
    doc.text(`Queixa: ${p2.queixa || '---'}`, 10, 95);
    doc.text(`Sinais/Sintomas: ${p2.sinais_sintomas || '---'}`, 10, 102);
    doc.text(`P.A: ${p2.pa || '--'} | FC: ${p2.fc || '--'} | FR: ${p2.fr || '--'} | SpO2: ${p2.spo2 || '--'} | HGT: ${p2.hgt || '--'}`, 10, 112);

    // Seção Observações
    doc.text(`Observações: ${p2.observacoes || 'Nenhuma'}`, 10, 122);

    // Seção Final (Página 3)
    doc.setFont("helvetica", "bold");
    doc.text("3. CONDUTA E DESTINO", 10, 140);
    doc.setFont("helvetica", "normal");
    doc.text(`Procedimentos: ${p3.procedimentos || '---'}`, 10, 150);
    doc.text(`Médico Regulador: ${p3.medico || '---'}`, 10, 160);
    doc.text(`Encaminhamento: ${p3.local || '---'}`, 10, 167);

    // Rodapé e Download
    doc.save(`Relatorio_${protocolo}.pdf`);
    alert("Relatório gerado com sucesso! Protocolo: " + protocolo);
}