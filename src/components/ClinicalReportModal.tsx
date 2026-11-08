import React, { useState } from 'react';
import { TentativaRegistro } from './WordWorkshop';
import { X, Copy, Check, Printer, FileText, Sparkles, User, Calendar, Download } from 'lucide-react';
import { sound } from '../utils/audio';
import { jsPDF } from 'jspdf';

interface ClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBases: string[];
  tentativas: TentativaRegistro[];
  totalScore: number;
  patientName?: string;
  stats: {
    decomposicaoAcertos: number;
    decomposicaoTotal: number;
    parentescoAcertos: number;
    parentescoTotal: number;
    sintaxeAcertos: number;
    sintaxeTotal: number;
  };
}

export const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({
  isOpen,
  onClose,
  selectedBases,
  tentativas,
  totalScore,
  patientName: initialPatientName,
  stats,
}) => {
  const [patientName, setPatientName] = useState(initialPatientName || 'Paciente / Aprendiz');
  const [sessionNotes, setSessionNotes] = useState('');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (initialPatientName) {
      setPatientName(initialPatientName);
    }
  }, [initialPatientName]);

  if (!isOpen) return null;

  const validAttempts = tentativas.filter((t) => t.certo);
  const invalidAttempts = tentativas.filter((t) => !t.certo);
  const accuracyOficina = tentativas.length > 0 ? Math.round((validAttempts.length / tentativas.length) * 100) : 0;

  const pctDec = stats.decomposicaoTotal > 0 ? Math.round((stats.decomposicaoAcertos / stats.decomposicaoTotal) * 100) : 0;
  const pctPar = stats.parentescoTotal > 0 ? Math.round((stats.parentescoAcertos / stats.parentescoTotal) * 100) : 0;
  const pctSin = stats.sintaxeTotal > 0 ? Math.round((stats.sintaxeAcertos / stats.sintaxeTotal) * 100) : 0;

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const generateReportText = () => {
    return `=====================================================
RELATÓRIO DE SESSÃO EM CONSCIÊNCIA MORFOLÓGICA
Mara Daher — Fonoaudiologia | Linguagem e Aprendizagem
=====================================================
Data da Sessão: ${currentDate}
Paciente/Aprendiz: ${patientName}
Pontuação Global Acumulada: ${totalScore} pontos

1. OFICINA DE SÍNTESE MORFOLÓGICA (MONTAGEM DE PALAVRAS):
- Bases trabalhadas: ${selectedBases.join(', ') || 'Nenhuma base registrada'}
- Total de tentativas: ${tentativas.length}
- Palavras válidas formadas: ${validAttempts.length} (${accuracyOficina}%)
- Pseudopalavras / Inválidas sinalizadas: ${invalidAttempts.length}
- Palavras válidas: ${validAttempts.map((v) => v.palavra).join(', ') || 'Nenhuma'}
- Palavras não existentes tentadas: ${invalidAttempts.map((v) => v.palavra).join(', ') || 'Nenhuma'}

2. SUBTESTES CLÍNICOS E METALINGUÍSTICOS (AVALIAÇÃO DE CONSCIÊNCIA MORFOLÓGICA):
- Decomposição e Segmentação Morfêmica: ${stats.decomposicaoAcertos}/${stats.decomposicaoTotal} acertos (${pctDec}%)
- Julgamento de Parentesco Relacional (Falsos Cognatos): ${stats.parentescoAcertos}/${stats.parentescoTotal} acertos (${pctPar}%)
- Fechamento Morfossintático (Escolha de Sufixo): ${stats.sintaxeAcertos}/${stats.sintaxeTotal} acertos (${pctSin}%)

3. PARECER CLÍNICO FONOAUDIOLÓGICO:
${
  pctPar >= 70
    ? '• Excelente discernimento relacional: o paciente discrimina com precisão radicais genuínos de distratores meramente fonológicos (ex: mar vs martelo; sapato vs sapa).'
    : '• Recomendada estimulação adicional na discriminação entre semelhança sonora superficial e raiz morfológica real.'
}
${
  pctDec >= 70
    ? '• Boa capacidade de isolamento de afixos (prefixos de oposição e sufixos nominalizadores).'
    : '• Sugere-se continuar o trabalho com cartões móveis destacando o radical invariante.'
}
${
  sessionNotes
    ? `\nObservações Específicas do Terapeuta:\n${sessionNotes}`
    : ''
}
=====================================================
Gerado via Morfofábrica - Plataforma de Consciência Morfológica`;
  };

  const handleCopy = () => {
    sound.playSuccess();
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    sound.playSuccess();
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const darkColor: [number, number, number] = [15, 23, 42];

    // Top Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 28, 'F');

    // Colored Accent Stripe (Mara Daher Brand Gradient: Coral -> Cyan)
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 28, 105, 2, 'F');
    doc.setFillColor(8, 145, 178);
    doc.rect(105, 28, 105, 2, 'F');

    // Header Titles
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('MARA DAHER — FONOAUDIOLOGIA', 14, 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text('Linguagem e Aprendizagem · Morfofábrica (Consciência Morfológica)', 14, 17);
    doc.text(`Data do Relatório: ${currentDate}`, 14, 22);

    let y = 38;

    // Patient Identification Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 20, 2, 2, 'FD');

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(`Paciente / Aprendiz: ${patientName}`, 18, y + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Pontuação Acumulada: ${totalScore} pts   |   Bases Trabalhadas: ${selectedBases.join(', ') || 'Todas'}`, 18, y + 14.5);

    y += 26;

    // KPI Blocks (3 Columns)
    // 1. Oficina de Palavras
    doc.setFillColor(240, 253, 250);
    doc.setDrawColor(153, 246, 228);
    doc.roundedRect(14, y, 58, 22, 2, 2, 'FD');
    doc.setTextColor(8, 145, 178);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('OFICINA DE SÍNTESE', 18, y + 5.5);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text(`${validAttempts.length} válidas (${accuracyOficina}%)`, 18, y + 13);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`${tentativas.length} tentativas totais`, 18, y + 18.5);

    // 2. Parentesco Relacional
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(254, 215, 170);
    doc.roundedRect(76, y, 58, 22, 2, 2, 'FD');
    doc.setTextColor(194, 65, 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('PARENTESCO RELACIONAL', 80, y + 5.5);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text(`${stats.parentescoAcertos}/${stats.parentescoTotal} (${pctPar}%)`, 80, y + 13);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Falsos Cognatos & Raízes', 80, y + 18.5);

    // 3. Sintaxe e Decomposição
    doc.setFillColor(253, 244, 255);
    doc.setDrawColor(245, 208, 254);
    doc.roundedRect(138, y, 58, 22, 2, 2, 'FD');
    doc.setTextColor(162, 28, 175);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('SINTAXE & DECOMPOSIÇÃO', 142, y + 5.5);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text(`Sin: ${pctSin}%  |  Dec: ${pctDec}%`, 142, y + 13);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Afixos e Classes Gramaticais', 142, y + 18.5);

    y += 28;

    // Seção 1: Síntese Morfológica
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('1. Palavras Válidas Construídas na Oficina:', 14, y);
    y += 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const validWordsList = validAttempts.length > 0 ? validAttempts.map((v) => v.palavra).join(', ') : 'Nenhuma palavra registrada nesta sessão.';
    const splitValidWords = doc.splitTextToSize(validWordsList, 182);
    doc.text(splitValidWords, 14, y);
    y += splitValidWords.length * 4.5 + 4;

    // Seção 2: Desempenho nos Subtestes
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('2. Avaliação de Subtestes Metalinguísticos:', 14, y);
    y += 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Julgamento de Parentesco: ${stats.parentescoAcertos} de ${stats.parentescoTotal} acertos (${pctPar}% de precisão na distinção de falsos amigos fonológicos).`, 14, y);
    y += 4.5;
    doc.text(`• Decomposição Morfêmica: ${stats.decomposicaoAcertos} de ${stats.decomposicaoTotal} acertos (${pctDec}% no isolamento de prefixos, radicais e sufixos).`, 14, y);
    y += 4.5;
    doc.text(`• Fechamento Morfossintático: ${stats.sintaxeAcertos} de ${stats.sintaxeTotal} acertos (${pctSin}% na escolha de sufixo adequado ao contexto oracional).`, 14, y);
    y += 7.5;

    // Seção 3: Parecer e Conduta Fonoaudiológica
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('3. Parecer Fonoaudiológico & Recomendações:', 14, y);
    y += 5.5;

    const recomendacaoPar = pctPar >= 70
      ? '• Excelente discernimento relacional: o aprendiz distingue com precisão radicais genuínos de distratores meramente fonológicos (ex: mar vs. martelo; sapato vs. sapa).'
      : '• Recomendada estimulação adicional na discriminação entre semelhança sonora superficial e raiz morfológica real.';

    const recomendacaoDec = pctDec >= 70
      ? '• Boa capacidade de isolamento de afixos (prefixos de oposição e sufixos nominalizadores).'
      : '• Sugere-se continuar o trabalho com cartões móveis destacando o radical invariante e a vogal temática.';

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const splitRec1 = doc.splitTextToSize(recomendacaoPar, 182);
    doc.text(splitRec1, 14, y);
    y += splitRec1.length * 4.2 + 2;

    const splitRec2 = doc.splitTextToSize(recomendacaoDec, 182);
    doc.text(splitRec2, 14, y);
    y += splitRec2.length * 4.2 + 4;

    if (sessionNotes && sessionNotes.trim()) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(180, 83, 9);
      doc.text('Observações Específicas do Terapeuta:', 14, y);
      y += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const splitNotes = doc.splitTextToSize(sessionNotes, 182);
      doc.text(splitNotes, 14, y);
      y += splitNotes.length * 4.2 + 5;
    }

    // Assinatura e Rodapé
    y = Math.max(y + 8, 260);
    doc.setDrawColor(203, 213, 225);
    doc.line(14, y, 90, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Mara Daher', 14, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Fonoaudiologia | Linguagem e Aprendizagem', 14, y + 7.5);

    // Save and download PDF file
    const safeName = (patientName || 'Paciente').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Relatorio_Morfofabrica_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/LOGO_COLORIDO_c1b52ad9.png"
              alt="Mara Daher Fonoaudiologia"
              className="h-10 w-auto object-contain bg-white rounded-lg p-1"
            />
            <div>
              <h3 className="text-base font-bold font-display">
                Relatório Clínico de Atendimento
              </h3>
              <p className="text-xs text-slate-400">
                Mara Daher · Fonoaudiologia | Linguagem e Aprendizagem
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Patient identification fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>Nome do Paciente / Aluno</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Data do Atendimento</span>
              </label>
              <div className="text-xs font-semibold text-slate-700 py-2">
                {currentDate}
              </div>
            </div>
          </div>

          {/* Subskills Metrics Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Desempenho por Sub-habilidade Morfológica
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-center">
                <span className="block text-[10px] font-bold uppercase text-amber-800">
                  Síntese (Oficina)
                </span>
                <span className="text-xl font-bold text-slate-900 mt-1 block tabular-nums">
                  {validAttempts.length}
                </span>
                <span className="text-[10px] text-slate-500">
                  {accuracyOficina}% de precisão
                </span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/70 text-center">
                <span className="block text-[10px] font-bold uppercase text-rose-800">
                  Decomposição
                </span>
                <span className="text-xl font-bold text-slate-900 mt-1 block tabular-nums">
                  {stats.decomposicaoAcertos}/{stats.decomposicaoTotal}
                </span>
                <span className="text-[10px] text-slate-500">
                  {pctDec}% acerto
                </span>
              </div>

              <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-200/70 text-center">
                <span className="block text-[10px] font-bold uppercase text-sky-800">
                  Parentesco Relacional
                </span>
                <span className="text-xl font-bold text-slate-900 mt-1 block tabular-nums">
                  {stats.parentescoAcertos}/{stats.parentescoTotal}
                </span>
                <span className="text-[10px] text-slate-500">
                  {pctPar}% acerto
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-center">
                <span className="block text-[10px] font-bold uppercase text-emerald-800">
                  Fechamento Sintático
                </span>
                <span className="text-xl font-bold text-slate-900 mt-1 block tabular-nums">
                  {stats.sintaxeAcertos}/{stats.sintaxeTotal}
                </span>
                <span className="text-[10px] text-slate-500">
                  {pctSin}% acerto
                </span>
              </div>
            </div>
          </div>

          {/* Words formed list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Inventário de Palavras da Sessão
            </h4>

            {validAttempts.length > 0 ? (
              <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/60">
                <span className="text-[11px] font-bold text-emerald-800 block mb-2">
                  ✓ Derivações Válidas Produzidas ({validAttempts.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {validAttempts.map((v, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold"
                    >
                      {v.palavra}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Nenhuma derivação registrada na oficina até o momento.
              </p>
            )}

            {invalidAttempts.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-200/60">
                <span className="text-[11px] font-bold text-rose-800 block mb-2">
                  ✗ Formações Sinalizadas como Não Existentes ({invalidAttempts.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {invalidAttempts.map((v, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-semibold"
                    >
                      {v.palavra}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Therapist Qualitative Notes Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
              Observações Clínicas e Conduta (Fonoaudiólogo / Terapeuta)
            </label>
            <textarea
              rows={3}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Descreva o engajamento do paciente, estratégias metafonológicas observadas ou metas para o próximo plano terapêutico..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-500">
            Total da Sessão: <strong className="text-amber-600 font-bold">{totalScore} pontos</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-cyan-600 hover:from-orange-600 hover:to-cyan-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Relatório em PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar para Prontuário</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
