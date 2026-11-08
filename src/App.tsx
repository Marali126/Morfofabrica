/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { PatientBar } from './components/PatientBar';
import { PatientHistoryModal } from './components/PatientHistoryModal';
import { BaseSelector } from './components/BaseSelector';
import { WordWorkshop, TentativaRegistro } from './components/WordWorkshop';
import { MorphemeDecomposition } from './components/MorphemeDecomposition';
import { MorphologicalRelatedness } from './components/MorphologicalRelatedness';
import { SyntacticClosure } from './components/SyntacticClosure';
import { AffixDictionary } from './components/AffixDictionary';
import { ClinicalReportModal } from './components/ClinicalReportModal';
import { Paciente, SessaoClinica, storageService } from './services/storageService';
import { PRESET_BASES } from './data/morphologyData';
import { Sparkles, Layers, Scissors, GitFork, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('oficina');
  const [workshopMode, setWorkshopMode] = useState<'selector' | 'workshop'>('workshop');

  // Pacientes e Prontuário Longitudinal
  const [pacientes, setPacientes] = useState<Paciente[]>(() => storageService.getPacientes());
  const [pacienteAtivo, setPacienteAtivo] = useState<Paciente>(() => {
    const list = storageService.getPacientes();
    const activeId = storageService.getPacienteAtivoId();
    return list.find((p) => p.id === activeId) || list[0] || {
      id: 'pac-padrao',
      nome: 'Paciente em Atendimento',
      idadeOuAno: 'Escolar',
      dataCadastro: Date.now(),
    };
  });
  const [sessoesPaciente, setSessoesPaciente] = useState<SessaoClinica[]>(() =>
    storageService.getSessoesPorPaciente(pacienteAtivo.id)
  );
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Sync sessions when active patient changes
  useEffect(() => {
    setSessoesPaciente(storageService.getSessoesPorPaciente(pacienteAtivo.id));
    storageService.setPacienteAtivoId(pacienteAtivo.id);
  }, [pacienteAtivo.id]);

  // Default initial bases selected for immediate play (ampliado com terr, pedr, cas, mar, livr, ferr, port, etc.)
  const [selectedBases, setSelectedBases] = useState<string[]>([
    'terr',
    'pedr',
    'cas',
    'mar',
    'livr',
    'ferr',
    'port',
    'flor',
    'dent',
    'feliz',
    'músic',
    'ativ',
  ]);

  const [tentativas, setTentativas] = useState<TentativaRegistro[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);

  const [subskillStats, setSubskillStats] = useState({
    decomposicaoAcertos: 0,
    decomposicaoTotal: 0,
    parentescoAcertos: 0,
    parentescoTotal: 0,
    sintaxeAcertos: 0,
    sintaxeTotal: 0,
  });

  const [isReportOpen, setIsReportOpen] = useState(false);

  // Patient handlers
  const handleCadastrarPaciente = (nome: string, idadeOuAno: string) => {
    const novo: Paciente = {
      id: `pac-${Date.now()}`,
      nome,
      idadeOuAno,
      dataCadastro: Date.now(),
    };
    const atualizados = storageService.salvarPaciente(novo);
    setPacientes(atualizados);
    setPacienteAtivo(novo);
  };

  const handleSelectPaciente = (paciente: Paciente) => {
    setPacienteAtivo(paciente);
  };

  const handleSalvarSessao = (notas?: string) => {
    const validWords = tentativas.filter((t) => t.certo).map((t) => t.palavra);
    const invalidWords = tentativas.filter((t) => !t.certo).map((t) => t.palavra);

    const novaSessao: SessaoClinica = {
      id: `sess-${Date.now()}`,
      pacienteId: pacienteAtivo.id,
      nomePaciente: pacienteAtivo.nome,
      dataTimestamp: Date.now(),
      dataFormatada: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      pontuacao: totalScore,
      palavrasValidas: validWords,
      palavrasInvalidas: invalidWords,
      stats: { ...subskillStats },
      notasClinicas: notas || '',
    };

    storageService.salvarSessao(novaSessao);
    setSessoesPaciente(storageService.getSessoesPorPaciente(pacienteAtivo.id));
  };

  const handleSessaoExcluida = () => {
    setSessoesPaciente(storageService.getSessoesPorPaciente(pacienteAtivo.id));
  };

  // Toggle base selection
  const handleToggleBase = (base: string) => {
    setSelectedBases((prev) =>
      prev.includes(base) ? prev.filter((b) => b !== base) : [...prev, base]
    );
  };

  const handleSelectAll = (bases: string[]) => {
    setSelectedBases(bases);
  };

  const handleClearSelection = () => {
    setSelectedBases([]);
  };

  const handleAddCustomBase = (custom: string) => {
    if (!selectedBases.includes(custom)) {
      setSelectedBases((prev) => [...prev, custom]);
    }
  };

  // Workshop word attempt registration
  const handleRegistrarTentativa = (novaTentativa: TentativaRegistro) => {
    setTentativas((prev) => [novaTentativa, ...prev]);
    if (novaTentativa.certo) {
      setTotalScore((sc) => sc + 10);
    }
  };

  // Score handlers for clinical subskills
  const handleScoreDecomposicao = (points: number, isCorrect: boolean) => {
    setTotalScore((sc) => sc + points);
    setSubskillStats((prev) => ({
      ...prev,
      decomposicaoAcertos: prev.decomposicaoAcertos + (isCorrect ? 1 : 0),
      decomposicaoTotal: prev.decomposicaoTotal + 1,
    }));
  };

  const handleScoreParentesco = (points: number, isCorrect: boolean) => {
    setTotalScore((sc) => sc + points);
    setSubskillStats((prev) => ({
      ...prev,
      parentescoAcertos: prev.parentescoAcertos + (isCorrect ? 1 : 0),
      parentescoTotal: prev.parentescoTotal + 1,
    }));
  };

  const handleScoreSintaxe = (points: number, isCorrect: boolean) => {
    setTotalScore((sc) => sc + points);
    setSubskillStats((prev) => ({
      ...prev,
      sintaxeAcertos: prev.sintaxeAcertos + (isCorrect ? 1 : 0),
      sintaxeTotal: prev.sintaxeTotal + 1,
    }));
  };

  const palavrasValidas = tentativas.filter((t) => t.certo);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Bar Contract Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          sound.playSnap();
          setActiveTab(tab);
        }}
        totalScore={totalScore}
        onOpenReport={() => {
          sound.playSnap();
          setIsReportOpen(true);
        }}
      />

      {/* Patient Management Bar */}
      <PatientBar
        pacientes={pacientes}
        pacienteAtivo={pacienteAtivo}
        onSelectPaciente={handleSelectPaciente}
        onCadastrarPaciente={handleCadastrarPaciente}
        onOpenHistorico={() => setIsHistoryOpen(true)}
        onSalvarSessao={handleSalvarSessao}
        totalSessoesPaciente={sessoesPaciente.length}
        totalScore={totalScore}
        palavrasValidasCount={palavrasValidas.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Switcher Hero / Contextual Strip */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                <span>Mara Daher</span>
                <span aria-hidden="true">·</span>
                <span>Fonoaudiologia</span>
                <span aria-hidden="true">·</span>
                <span>Linguagem e Aprendizagem</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display text-balance">
                Fábrica de Palavras & Consciência Morfológica
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
                Ambiente estruturado para treino explícito de morfologia derivacional, decomposição morfêmica,
                discriminação de falsos cognatos e adequação morfossintática em Língua Portuguesa.
              </p>
            </div>

            {/* Sub-modes if inside Workshop */}
            {activeTab === 'oficina' && (
              <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl shrink-0">
                <button
                  onClick={() => {
                    sound.playSnap();
                    setWorkshopMode('workshop');
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    workshopMode === 'workshop'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚙️ Montagem de Palavras
                </button>
                <button
                  onClick={() => {
                    sound.playSnap();
                    setWorkshopMode('selector');
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    workshopMode === 'selector'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌱 Escolher Bases ({selectedBases.length})
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Tab 1: Oficina de Palavras (Restructured with Pre-selected Bases & Free Assembly) */}
        {activeTab === 'oficina' && (
          <div>
            {workshopMode === 'selector' ? (
              <BaseSelector
                selectedBases={selectedBases}
                onToggleBase={handleToggleBase}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
                onAddCustomBase={handleAddCustomBase}
                onStartWorkshop={() => setWorkshopMode('workshop')}
              />
            ) : (
              <WordWorkshop
                selectedBases={selectedBases.length > 0 ? selectedBases : ['flor']}
                tentativas={tentativas}
                onRegistrarTentativa={handleRegistrarTentativa}
                onBackToSelector={() => setWorkshopMode('selector')}
              />
            )}
          </div>
        )}

        {/* Tab 2: Decomposição Morfêmica */}
        {activeTab === 'decomposicao' && (
          <MorphemeDecomposition onScoreGained={handleScoreDecomposicao} />
        )}

        {/* Tab 3: Julgamento de Parentesco Morfológico */}
        {activeTab === 'parentesco' && (
          <MorphologicalRelatedness onScoreGained={handleScoreParentesco} />
        )}

        {/* Tab 4: Fechamento Sintático e Escolha de Sufixo */}
        {activeTab === 'sintaxe' && (
          <SyntacticClosure onScoreGained={handleScoreSintaxe} />
        )}

        {/* Tab 5: Guia de Afixos & Fundamentação Teórica */}
        {activeTab === 'dicionario' && <AffixDictionary />}
      </main>

      {/* Clinical Report Modal */}
      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        selectedBases={selectedBases}
        tentativas={tentativas}
        totalScore={totalScore}
        patientName={pacienteAtivo.nome}
        stats={subskillStats}
      />

      {/* Patient History Modal */}
      <PatientHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        paciente={pacienteAtivo}
        sessoes={sessoesPaciente}
        onSessaoExcluida={handleSessaoExcluida}
      />

      {/* Editorial Clean Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Morfofábrica</span>
            <span aria-hidden="true">·</span>
            <span>Mara Daher Fonoaudiologia</span>
            <span aria-hidden="true">·</span>
            <span>Linguagem e Aprendizagem</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveTab('dicionario');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Pesquisas Clínicas
            </button>
            <button
              onClick={() => {
                setActiveTab('oficina');
                setWorkshopMode('selector');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Bases Pré-Selecionadas
            </button>
            <button
              onClick={() => setIsReportOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Exportar Relatório
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
