import React, { useState } from 'react';
import { Paciente, storageService } from '../services/storageService';
import { User, Plus, Clock, Save, CheckCircle, ChevronDown } from 'lucide-react';
import { sound } from '../utils/audio';

interface PatientBarProps {
  pacientes: Paciente[];
  pacienteAtivo: Paciente;
  onSelectPaciente: (paciente: Paciente) => void;
  onCadastrarPaciente: (nome: string, idadeOuAno: string) => void;
  onOpenHistorico: () => void;
  onSalvarSessao: (notas?: string) => void;
  totalSessoesPaciente: number;
  totalScore: number;
  palavrasValidasCount: number;
}

export const PatientBar: React.FC<PatientBarProps> = ({
  pacientes,
  pacienteAtivo,
  onSelectPaciente,
  onCadastrarPaciente,
  onOpenHistorico,
  onSalvarSessao,
  totalSessoesPaciente,
  totalScore,
  palavrasValidasCount,
}) => {
  const [isModalNovoOpen, setIsModalNovoOpen] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoAno, setNovoAno] = useState('');
  const [isSalvarModalOpen, setIsSalvarModalOpen] = useState(false);
  const [notasClinicas, setNotasClinicas] = useState('');
  const [salvoFeedback, setSalvoFeedback] = useState(false);

  const handleCadastrarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;
    onCadastrarPaciente(novoNome.trim(), novoAno.trim() || 'Escolar');
    setNovoNome('');
    setNovoAno('');
    setIsModalNovoOpen(false);
    sound.playSuccess();
  };

  const handleConfirmarSalvar = () => {
    onSalvarSessao(notasClinicas);
    setIsSalvarModalOpen(false);
    setNotasClinicas('');
    setSalvoFeedback(true);
    sound.playSuccess();
    setTimeout(() => setSalvoFeedback(false), 3500);
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Patient Selector Strip */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="p-1 rounded-md bg-cyan-50 text-cyan-700">
                <User className="w-4 h-4" />
              </span>
              <span className="hidden sm:inline">Paciente em Atendimento:</span>
            </div>

            <div className="relative inline-block">
              <select
                aria-label="Selecionar Paciente"
                value={pacienteAtivo.id}
                onChange={(e) => {
                  const p = pacientes.find((item) => item.id === e.target.value);
                  if (p) {
                    sound.playSnap();
                    onSelectPaciente(p);
                  }
                }}
                className="appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-2xs"
              >
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} {p.idadeOuAno ? `(${p.idadeOuAno})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={() => {
                sound.playSnap();
                setIsModalNovoOpen(true);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100/80 border border-cyan-200/80 rounded-lg transition-colors cursor-pointer"
              title="Cadastrar novo paciente"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Paciente</span>
            </button>
          </div>

          {/* Right Action: Historic & Save Session */}
          <div className="flex items-center gap-2">
            {salvoFeedback && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg animate-fade-in">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sessão salva no prontuário!</span>
              </span>
            )}

            <button
              onClick={() => {
                sound.playSnap();
                onOpenHistorico();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg border border-slate-200/80 transition-colors cursor-pointer"
              title="Visualizar histórico e evolução longitudinal deste paciente"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Prontuário</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                {totalSessoesPaciente}
              </span>
            </button>

            <button
              onClick={() => {
                sound.playSnap();
                setIsSalvarModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-cyan-600 hover:from-orange-600 hover:to-cyan-700 rounded-lg shadow-2xs hover:shadow transition-all cursor-pointer"
              title="Salvar resultados desta sessão no histórico de longo prazo"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Sessão</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Novo Paciente */}
      {isModalNovoOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-scale-up">
            <div className="px-5 py-4 bg-gradient-to-r from-orange-500 to-cyan-600 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold font-display">Cadastrar Novo Paciente</h3>
              <button
                onClick={() => setIsModalNovoOpen(false)}
                className="text-white/80 hover:text-white text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCadastrarSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Completo do Paciente *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ex: Gabriel Rocha"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Idade ou Escolaridade
                </label>
                <input
                  type="text"
                  placeholder="Ex: 9 anos / 4º ano fundamental"
                  value={novoAno}
                  onChange={(e) => setNovoAno(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalNovoOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg shadow-sm cursor-pointer"
                >
                  Cadastrar e Selecionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Salvar Sessão no Prontuário */}
      {isSalvarModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-scale-up">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold font-display">
                  Salvar Sessão Clínica: {pacienteAtivo.nome}
                </h3>
              </div>
              <button
                onClick={() => setIsSalvarModalOpen(false)}
                className="text-white/80 hover:text-white text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-slate-500 block">Pontos da Sessão</span>
                  <span className="text-xl font-bold text-cyan-900">{totalScore} pts</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-slate-500 block">Palavras Formadas</span>
                  <span className="text-xl font-bold text-orange-900">{palavrasValidasCount}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parecer / Anotações Fonoaudiológicas da Sessão (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Ótimo desempenho na identificação de alomorfia em -dade (infelicidade). Necessita reforço na discriminação de falsos cognatos (pato/patologia)."
                  value={notasClinicas}
                  onChange={(e) => setNotasClinicas(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs text-cyan-950">
                ℹ️ Esta sessão será armazenada de forma duradoura no navegador da sua clínica para que você acompanhe a evolução de <strong>{pacienteAtivo.nome}</strong> ao longo das semanas.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSalvarModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarSalvar}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-cyan-600 hover:from-orange-600 hover:to-cyan-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Confirmar e Salvar no Prontuário
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
