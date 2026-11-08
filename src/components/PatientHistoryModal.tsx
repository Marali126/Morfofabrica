import React from 'react';
import { Paciente, SessaoClinica, storageService } from '../services/storageService';
import { X, Calendar, Trophy, Trash2, FileText, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface PatientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
  sessoes: SessaoClinica[];
  onSessaoExcluida: () => void;
}

export const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({
  isOpen,
  onClose,
  paciente,
  sessoes,
  onSessaoExcluida,
}) => {
  if (!isOpen || !paciente) return null;

  const handleDelete = (sessaoId: string) => {
    if (confirm('Deseja excluir o registro desta sessão do histórico?')) {
      storageService.excluirSessao(sessaoId);
      sound.playSnap();
      onSessaoExcluida();
    }
  };

  const totalPontosHistorico = sessoes.reduce((acc, s) => acc + s.pontuacao, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-400/40 text-cyan-300 flex items-center justify-center text-base font-bold">
              {paciente.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold font-display">
                Prontuário Longitudinal: {paciente.nome}
              </h3>
              <p className="text-xs text-slate-300">
                {paciente.idadeOuAno || 'Paciente em acompanhamento fonoaudiológico'} · {sessoes.length} sessões registradas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Summary KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total de Sessões
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block tabular-nums">
                {sessoes.length}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200 text-center">
              <span className="block text-[11px] font-bold text-cyan-800 uppercase tracking-wider">
                Pontuação Acumulada
              </span>
              <span className="text-2xl font-black text-cyan-950 mt-1 block tabular-nums">
                {totalPontosHistorico} pts
              </span>
            </div>

            <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 text-center">
              <span className="block text-[11px] font-bold text-orange-800 uppercase tracking-wider">
                Palavras Válidas Formadas
              </span>
              <span className="text-2xl font-black text-orange-950 mt-1 block tabular-nums">
                {sessoes.reduce((acc, s) => acc + (s.palavrasValidas?.length || 0), 0)}
              </span>
            </div>
          </div>

          {/* Timeline of Sessions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-700" />
              <span>Evolução por Sessão Registrada</span>
            </h4>

            {sessoes.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  Nenhuma sessão anterior salva ainda para {paciente.nome}.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ao concluir uma intervenção, clique no botão "Salvar Sessão no Prontuário" para guardar o progresso.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessoes.map((s, idx) => {
                  const pctPar = s.stats?.parentescoTotal ? Math.round((s.stats.parentescoAcertos / s.stats.parentescoTotal) * 100) : 0;
                  const pctDec = s.stats?.decomposicaoTotal ? Math.round((s.stats.decomposicaoAcertos / s.stats.decomposicaoTotal) * 100) : 0;
                  const pctSin = s.stats?.sintaxeTotal ? Math.round((s.stats.sintaxeAcertos / s.stats.sintaxeTotal) * 100) : 0;

                  return (
                    <div
                      key={s.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-cyan-100 text-cyan-900 font-bold text-xs flex items-center justify-center">
                            #{sessoes.length - idx}
                          </span>
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{s.dataFormatada}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-lg">
                            ⭐ {s.pontuacao} pts
                          </span>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Excluir registro da sessão"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Accuracy indicators */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 font-medium block">Síntese (Oficina)</span>
                          <span className="font-bold text-slate-800">{s.palavrasValidas?.length || 0} palavras</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 font-medium block">Decomposição</span>
                          <span className="font-bold text-slate-800">{s.stats?.decomposicaoAcertos || 0}/{s.stats?.decomposicaoTotal || 0} ({pctDec}%)</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 font-medium block">Parentesco (10 pares)</span>
                          <span className="font-bold text-slate-800">{s.stats?.parentescoAcertos || 0}/{s.stats?.parentescoTotal || 0} ({pctPar}%)</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 font-medium block">Sintaxe</span>
                          <span className="font-bold text-slate-800">{s.stats?.sintaxeAcertos || 0}/{s.stats?.sintaxeTotal || 0} ({pctSin}%)</span>
                        </div>
                      </div>

                      {/* Palavras Válidas produzidas */}
                      {s.palavrasValidas && s.palavrasValidas.length > 0 && (
                        <div className="text-[11px]">
                          <span className="font-bold text-emerald-800 block mb-1">
                            ✓ Palavras formadas com êxito ({s.palavrasValidas.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {s.palavrasValidas.map((w, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notas do Fonoaudiólogo */}
                      {s.notasClinicas && (
                        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950">
                          <strong>Parecer Fonoaudiológico:</strong> {s.notasClinicas}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Dados salvos com segurança no armazenamento local do navegador.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
