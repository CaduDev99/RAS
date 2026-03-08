// ... (funções setTipo e salvarDadosEAvancar continuam iguais)

async function gerarRelatorioFinal() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Recuperar TUDO do localStorage
    const tipoAtendimento = localStorage.getItem('tipo_atendimento') || "N/A";
    const p2 = JSON.parse(localStorage.getItem('dados_passo_2') || '{}');
    const p3 = JSON.parse(localStorage.getItem('dados_passo_3') || '{}');
    const protocolo = localStorage.getItem('protocolo_atual') || "PROT-0000";

    // --- MONTAGEM DO PDF (Mesma lógica anterior) ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RELATÓRIO DE ATENDIMENTO DE SOCORRISTA", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`PROTOCOLO: ${protocolo}`, 10, 35);
    doc.text(`TIPO: ${tipoAtendimento}`, 10, 42);
    doc.text(`DATA: ${new Date().toLocaleString()}`, 140, 35);
    doc.line(10, 45, 200, 45);

    // Seção Paciente
    doc.setFont("helvetica", "bold");
    doc.text("1. IDENTIFICAÇÃO DO PACIENTE", 10, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome: ${p2.nome || '---'} | Idade: ${p2.idade || '---'}`, 10, 65);
    
    // Sinais Vitais
    doc.setFont("helvetica", "bold");
    doc.text("2. QUADRO CLÍNICO E SINAIS VITAIS", 10, 80);
    doc.setFont("helvetica", "normal");
    doc.text(`PA: ${p2.pa || '--'} | FC: ${p2.fc || '--'} | SpO2: ${p2.spo2 || '--'} | HGT: ${p2.hgt || '--'}`, 10, 90);

    // Conduta
    doc.setFont("helvetica", "bold");
    doc.text("3. PROCEDIMENTOS E DESFECHO", 10, 105);
    doc.setFont("helvetica", "normal");
    const proc = doc.splitTextToSize(`Procedimentos: ${p3.procedimentos || '---'}`, 180);
    doc.text(proc, 10, 115);
    doc.text(`Destino: ${p3.destino || '---'}`, 10, 135);

    // Rodapé de segurança
    doc.setFontSize(8);
    doc.text("Este documento é uma simulação de atendimento.", 105, 285, { align: "center" });

    // 4. Salvar o arquivo
    doc.save(`Relatorio_${protocolo}.pdf`);
}