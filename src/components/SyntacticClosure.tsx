import React, { useState } from 'react';
import { ITENS_FECHAMENTO_SINTATICO, FechamentoSintaticoItem } from '../data/morphologyData';
import { CheckCircle2, ArrowRight, BookOpen, Volume2, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { MorphemeBreakdown } from './MorphemeBreakdown';

interface SyntacticClosureProps {
  onScoreGained: (points: number, isCorrect: boolean) => void;
}

export const SyntacticClosure: React.FC<SyntacticClosureProps> = ({ onScoreGained }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hits, setHits] = useState(0);

  const currentItem: FechamentoSintaticoItem = ITENS_FECHAMENTO_SINTATICO[currentIndex];

  const handleSelectOption = (word: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedWord(word);
    setIsAnswered(true);

    if (isCorrect) {
      sound.playSuccess();
      setHits((h) => h + 1);
      try {
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
      } catch {}
      onScoreGained(10, true);
    } else {
      sound.playNotice();
      onScoreGained(0, false);
    }
  };

  const handleNext = () => {
    setSelectedWord(null);
    setIsAnswered(false);
    if (currentIndex < ITENS_FECHAMENTO_SINTATICO.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Replace gap with blank or user selected word
  const sentenceDisplay = currentItem.fraseComLacuna.replace(
    '______',
    selectedWord ? `【${selectedWord}】` : '______'
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 tracking-wide uppercase mb-1">
              <span>Fechamento Morfossintático</span>
              <span aria-hidden="true">·</span>
              <span className="text-orange-600">Escolha Derivacional & Contexto</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Fechamento Sintático e Adequação Morfológica
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Complete a oração escolhendo a palavra com o sufixo morfologicamente adequado à função gramatical exigida pela frase (substantivo, adjetivo, verbo ou advérbio).
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="block text-xs font-semibold text-slate-500 uppercase">Item</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {currentIndex + 1} / {ITENS_FECHAMENTO_SINTATICO.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Sentence Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        {/* Sentence Prompt */}
        <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-slate-200/70 mb-8">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
            Base Lexical de Origem: <strong className="text-amber-800 font-display text-sm">{currentItem.baseOriginal}</strong>
          </span>

          <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed max-w-2xl mx-auto">
            {sentenceDisplay}
          </p>

          <button
            onClick={() => sound.speakWord(sentenceDisplay.replace(/[【】_]/g, ''))}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir frase</span>
          </button>
        </div>

        {/* Morphological Choices with Exact Color Highlight Requested */}
        <div className="max-w-xl mx-auto space-y-4 mb-8">
          <div className="text-center">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Selecione a forma derivada correta:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-orange-500 inline-block" />
                <span className="text-orange-700">Prefixo</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-cyan-600 inline-block" />
                <span className="text-cyan-800">Radical</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-black inline-block" />
                <span className="text-black font-extrabold">Vogal Temática</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-fuchsia-600 inline-block" />
                <span className="text-fuchsia-800">Sufixo</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentItem.opcoes.map((op) => {
              const isSelected = selectedWord === op.texto;
              let btnClass = 'border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/30 bg-white text-slate-800 shadow-2xs';

              if (isAnswered) {
                if (op.correta) {
                  btnClass = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-300 shadow-xs';
                } else if (isSelected && !op.correta) {
                  btnClass = 'border-rose-400 bg-rose-50/80 text-rose-950';
                } else {
                  btnClass = 'opacity-40 border-slate-200 bg-slate-50 text-slate-500';
                }
              }

              return (
                <button
                  key={op.texto}
                  onClick={() => handleSelectOption(op.texto, op.correta)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${btnClass}`}
                >
                  <MorphemeBreakdown
                    segments={{
                      prefixo: op.prefixo,
                      radical: op.radical || op.texto,
                      vogalTematica: op.vogalTematica,
                      sufixo: op.sufixo1 || op.sufixo,
                    }}
                    size="lg"
                  />
                  <span className="block text-[11px] text-slate-500 font-semibold">{op.classe}</span>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                    {op.sufixo}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Syntactic Explanation Feedback */}
        {isAnswered && (
          <div className="max-w-xl mx-auto space-y-4">
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm ${
                selectedWord === currentItem.respostaCorreta
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {selectedWord === currentItem.respostaCorreta ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                    ✕
                  </div>
                )}
                <div>
                  <strong className="block text-sm font-bold">
                    {selectedWord === currentItem.respostaCorreta
                      ? 'Acerto! Fechamento morfossintático perfeito (+10 pts)'
                      : `A resposta correta é "${currentItem.respostaCorreta}"`}
                  </strong>
                  <p className="mt-1 leading-relaxed text-xs sm:text-sm">
                    {currentItem.justificativaSintatica}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>Próxima Oração</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
