import React, { useState } from 'react';
import { ITENS_DECOMPOSICAO, DecomposicaoItem } from '../data/morphologyData';
import { Volume2, CheckCircle2, HelpCircle, ArrowRight, RotateCcw, Scissors, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface MorphemeDecompositionProps {
  onScoreGained: (points: number, isCorrect: boolean) => void;
}

export const MorphemeDecomposition: React.FC<MorphemeDecompositionProps> = ({ onScoreGained }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedParts, setSelectedParts] = useState<{
    prefixo: string;
    radical: string;
    sufixo: string;
  }>({ prefixo: '', radical: '', sufixo: '' });
  const [activeSlot, setActiveSlot] = useState<'prefixo' | 'radical' | 'sufixo'>('radical');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentItem: DecomposicaoItem = ITENS_DECOMPOSICAO[currentIndex];

  // Candidates morphemes to pick from (contains real parts + distractors)
  const candidatePool = React.useMemo(() => {
    const list: string[] = [];
    if (currentItem.prefixo) list.push(currentItem.prefixo);
    list.push(currentItem.radical);
    if (currentItem.sufixo1) list.push(currentItem.sufixo1);
    if (currentItem.sufixo2) list.push(currentItem.sufixo2);

    // Add 2 plausible distractors for clinical discrimination
    const distractors = ['in', 'des', 'dade', 'ção', 'mente', 'al', 'ar'].filter(
      (d) => !list.includes(d)
    );
    return Array.from(new Set([...list, ...distractors.slice(0, 2)])).sort(() => 0.5 - Math.random());
  }, [currentIndex, currentItem]);

  const handlePickMorpheme = (m: string) => {
    sound.playSnap();
    setSelectedParts((prev) => ({
      ...prev,
      [activeSlot]: m,
    }));
    // Cycle to next empty slot
    if (activeSlot === 'prefixo') setActiveSlot('radical');
    else if (activeSlot === 'radical') setActiveSlot('sufixo');
  };

  const handleClearSlot = (slot: 'prefixo' | 'radical' | 'sufixo') => {
    sound.playSnap();
    setSelectedParts((prev) => ({ ...prev, [slot]: '' }));
    setActiveSlot(slot);
    setChecked(false);
  };

  const handleCheck = () => {
    const expectedPref = currentItem.prefixo || '';
    const expectedRad = currentItem.radical;
    const expectedSuf1 = currentItem.sufixo1 || '';

    const prefOk = (selectedParts.prefixo || '').trim().toLowerCase() === expectedPref.toLowerCase();
    const radOk = (selectedParts.radical || '').trim().toLowerCase() === expectedRad.toLowerCase();
    const sufOk =
      !currentItem.sufixo1 ||
      (selectedParts.sufixo || '').trim().toLowerCase() === expectedSuf1.toLowerCase() ||
      Boolean(currentItem.sufixo2 && selectedParts.sufixo.includes(currentItem.sufixo2));

    const allOk = Boolean(prefOk && radOk && sufOk);
    setChecked(true);
    setIsCorrect(allOk);

    if (allOk) {
      sound.playSuccess();
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      } catch {}
      onScoreGained(15, true);
    } else {
      sound.playNotice();
      onScoreGained(0, false);
    }
  };

  const handleNext = () => {
    setChecked(false);
    setIsCorrect(false);
    setShowHint(false);
    setSelectedParts({ prefixo: '', radical: '', sufixo: '' });
    setActiveSlot('radical');
    if (currentIndex < ITENS_DECOMPOSICAO.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Overview Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 tracking-wide uppercase mb-1">
              <span>Consciência Morfológica</span>
              <span aria-hidden="true">·</span>
              <span className="text-orange-600">Decomposição & Segmentação</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Segmentação e Isolamento de Morfemas
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Identifique as unidades constitutivas mínimas de significado (prefixo, radical e sufixo). 
              A habilidade de segmentar palavras derivadas polissilábicas é o preditor mais forte de fluência ortográfica e leitura decodificada.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="block text-xs font-semibold text-slate-500 uppercase">Progresso</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {currentIndex + 1} / {ITENS_DECOMPOSICAO.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Decomposition Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        {/* Word Display */}
        <div className="text-center py-6 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Palavra-Alvo para Decomposição
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 font-display tracking-tight">
              {currentItem.palavra}
            </span>
            <button
              onClick={() => sound.speakWord(currentItem.palavra)}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 transition-colors cursor-pointer"
              title="Ouvir palavra"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 italic">
            "{currentItem.significado}"
          </p>
        </div>

        {/* Drop Slots */}
        <div className="my-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-cyan-700" />
              <span>Slots de Segmentação Morfêmica</span>
            </span>
            <span className="text-xs text-slate-500">
              Clique em um slot para ativá-lo, depois selecione o morfema correspondente.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Slot Prefixo - Orange */}
            <div
              onClick={() => setActiveSlot('prefixo')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                activeSlot === 'prefixo'
                  ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-300/50 shadow-sm'
                  : 'border-slate-200 hover:border-orange-300 bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-orange-700 mb-1">
                <span>1. Prefixo</span>
                {selectedParts.prefixo && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearSlot('prefixo');
                    }}
                    className="hover:text-orange-900"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="h-10 flex items-center justify-center text-lg font-bold text-orange-900">
                {selectedParts.prefixo ? `${selectedParts.prefixo}–` : (
                  <span className="text-xs text-slate-400 font-normal">Nenhum / Vazio</span>
                )}
              </div>
            </div>

            {/* Slot Radical - Cyan */}
            <div
              onClick={() => setActiveSlot('radical')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                activeSlot === 'radical'
                  ? 'border-cyan-600 bg-cyan-50/70 ring-2 ring-cyan-300/50 shadow-sm'
                  : 'border-slate-200 hover:border-cyan-300 bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-cyan-800 mb-1">
                <span>2. Radical / Base</span>
                {selectedParts.radical && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearSlot('radical');
                    }}
                    className="hover:text-cyan-900"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="h-10 flex items-center justify-center text-lg font-bold text-cyan-950 font-display">
                {selectedParts.radical || (
                  <span className="text-xs text-slate-400 font-normal">Selecione o Radical</span>
                )}
              </div>
            </div>

            {/* Slot Sufixo - Fuchsia */}
            <div
              onClick={() => setActiveSlot('sufixo')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                activeSlot === 'sufixo'
                  ? 'border-fuchsia-500 bg-fuchsia-50/70 ring-2 ring-fuchsia-300/50 shadow-sm'
                  : 'border-slate-200 hover:border-fuchsia-300 bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-fuchsia-800 mb-1">
                <span>3. Sufixo(s)</span>
                {selectedParts.sufixo && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearSlot('sufixo');
                    }}
                    className="hover:text-fuchsia-900"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="h-10 flex items-center justify-center text-lg font-bold text-fuchsia-950">
                {selectedParts.sufixo ? `–${selectedParts.sufixo}` : (
                  <span className="text-xs text-slate-400 font-normal">Nenhum / Vazio</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Morphemes Selection Palette */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
            Morfemas Disponíveis para Inserir no Slot Ativo (
            <span className={
              activeSlot === 'prefixo' ? 'text-orange-700 font-black' :
              activeSlot === 'radical' ? 'text-cyan-800 font-black' : 'text-fuchsia-800 font-black'
            }>
              {activeSlot.toUpperCase()}
            </span>
            ):
          </span>
          <div className="flex flex-wrap gap-2">
            {candidatePool.map((part) => (
              <button
                key={part}
                onClick={() => handlePickMorpheme(part)}
                className={`px-4 py-2 rounded-lg bg-white border text-sm font-bold shadow-2xs transition-all hover:scale-105 cursor-pointer ${
                  activeSlot === 'prefixo'
                    ? 'border-slate-200 hover:border-orange-400 hover:bg-orange-50 text-orange-950'
                    : activeSlot === 'radical'
                    ? 'border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 text-cyan-950'
                    : 'border-slate-200 hover:border-fuchsia-400 hover:bg-fuchsia-50 text-fuchsia-950'
                }`}
              >
                {part}
              </button>
            ))}
            <button
              onClick={() => {
                sound.playSnap();
                setSelectedParts((p) => ({ ...p, [activeSlot]: '' }));
              }}
              className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              (Deixar slot vazio)
            </button>
          </div>
        </div>

        {/* Clinical Hint */}
        <div className="mb-6">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-cyan-700 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Ocultar dica fonoaudiológica' : 'Precisa de ajuda? Ver dica fonoaudiológica'}</span>
          </button>
          {showHint && (
            <div className="mt-2 p-3 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs text-cyan-950 leading-relaxed">
              💡 <strong>Dica de Análise:</strong> {currentItem.dica}
            </div>
          )}
        </div>

        {/* Results & Feedback */}
        {checked && (
          <div
            className={`p-4 rounded-xl border text-sm mb-6 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-2">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                  ✕
                </div>
              )}
              <div>
                <strong className="block font-bold">
                  {isCorrect ? 'Excelente! Segmentação Correta (+15 pts)' : 'Segmentação Incompleta ou Incorreta'}
                </strong>
                <p className="text-xs mt-1.5 leading-relaxed">
                  A estrutura morfológica de <strong>"{currentItem.palavra}"</strong> é composta por:{' '}
                  {currentItem.prefixo ? <span className="text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded font-bold border border-orange-200">[{currentItem.prefixo}-]</span> : <span className="text-slate-400">[sem prefixo]</span>}{' '}
                  + <span className="text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded font-black border border-cyan-200">[{currentItem.radical}]</span> +{' '}
                  <span className="text-fuchsia-800 bg-fuchsia-50 px-1.5 py-0.5 rounded font-bold border border-fuchsia-200">
                    [-{currentItem.sufixo1}{currentItem.sufixo2 ? ` -${currentItem.sufixo2}` : ''}]
                  </span>.
                </p>
                <p className="text-xs mt-1.5 text-slate-600">
                  {currentItem.dica}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bottom Bar */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              setSelectedParts({ prefixo: '', radical: '', sufixo: '' });
              setChecked(false);
              sound.playSnap();
            }}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recomeçar esta palavra</span>
          </button>

          <div className="flex items-center gap-3">
            {!checked ? (
              <button
                onClick={handleCheck}
                disabled={!selectedParts.radical}
                className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  selectedParts.radical
                    ? 'bg-gradient-to-r from-orange-500 to-cyan-600 hover:from-orange-600 hover:to-cyan-700 text-white cursor-pointer hover:shadow'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                Conferir Decomposição
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <span>Próxima Palavra</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
