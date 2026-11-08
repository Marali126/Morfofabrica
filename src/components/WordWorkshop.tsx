import React, { useState, useMemo } from 'react';
import {
  PREFIXOS_CATALOGO,
  SUFIXOS_CATALOGO,
  DICIONARIO_DERIVACOES,
  PRESET_BASES,
  PalavraValida,
} from '../data/morphologyData';
import { Volume2, CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Sparkles, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';
import { analisarMorfologia, WordAnalysis } from '../utils/morphologyEngine';
import { MorphemeBreakdown } from './MorphemeBreakdown';
import confetti from 'canvas-confetti';

export interface TentativaRegistro {
  id: string;
  base: string;
  palavra: string;
  prefixo: string | null;
  radical: string;
  vogalTematica: string | null;
  sufixo1: string | null;
  sufixo2: string | null;
  certo: boolean;
  definicao?: string;
  classe?: string;
  houveModificacao?: boolean;
  explicacaoModificacao?: string;
  timestamp: number;
}

interface WordWorkshopProps {
  selectedBases: string[];
  tentativas: TentativaRegistro[];
  onRegistrarTentativa: (t: TentativaRegistro) => void;
  onBackToSelector: () => void;
}

export const WordWorkshop: React.FC<WordWorkshopProps> = ({
  selectedBases,
  tentativas,
  onRegistrarTentativa,
  onBackToSelector,
}) => {
  const [currentBaseIdx, setCurrentBaseIdx] = useState(0);
  const [selectedPref, setSelectedPref] = useState<string | null>(null);
  const [selectedVogal, setSelectedVogal] = useState<string | null>(null);
  const [selectedSuf1, setSelectedSuf1] = useState<string | null>(null);
  const [selectedSuf2, setSelectedSuf2] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'warn' | 'info' } | null>(null);

  const currentBase = selectedBases[currentBaseIdx] || 'flor';
  const basePresetInfo = PRESET_BASES.find((b) => b.base === currentBase);

  // Analysis with morphophonological adaptation (alomorfia do radical, ex: feliz + dade -> infelicidade, dent + i + ção -> dentição)
  const analysis: WordAnalysis = useMemo(() => {
    return analisarMorfologia(currentBase, selectedPref, selectedSuf1, selectedSuf2, selectedVogal);
  }, [currentBase, selectedPref, selectedSuf1, selectedSuf2, selectedVogal]);

  const hasAffixes = Boolean(selectedPref || selectedVogal || selectedSuf1 || selectedSuf2);

  // Check if assembled word is verified in our lexicon
  const dictMatch: PalavraValida | undefined = DICIONARIO_DERIVACOES[analysis.palavraFinal];

  // Current base attempts
  const currentBaseAttempts = tentativas.filter((t) => t.base === currentBase);
  const alreadyAttempted = currentBaseAttempts.some((t) => t.palavra === analysis.palavraFinal);

  const handleSpeak = (word: string) => {
    sound.speakWord(word);
  };

  const handleTogglePref = (pref: string) => {
    sound.playSnap();
    if (selectedPref === pref) {
      setSelectedPref(null);
    } else {
      setSelectedPref(pref);
    }
    setFeedbackMsg(null);
  };

  const handleToggleVogal = (vogal: string) => {
    sound.playSnap();
    if (selectedVogal === vogal) {
      setSelectedVogal(null);
    } else {
      setSelectedVogal(vogal);
    }
    setFeedbackMsg(null);
  };

  const handleToggleSuf = (suf: string) => {
    sound.playSnap();
    if (selectedSuf1 === suf) {
      setSelectedSuf1(null);
    } else if (selectedSuf2 === suf) {
      setSelectedSuf2(null);
    } else if (!selectedSuf1) {
      setSelectedSuf1(suf);
    } else if (!selectedSuf2) {
      setSelectedSuf2(suf);
    } else {
      // replace suf1
      setSelectedSuf1(suf);
    }
    setFeedbackMsg(null);
  };

  const clearAffixes = () => {
    setSelectedPref(null);
    setSelectedVogal(null);
    setSelectedSuf1(null);
    setSelectedSuf2(null);
    setFeedbackMsg(null);
  };

  const handleRegistrar = (isCerto: boolean) => {
    if (!hasAffixes) {
      setFeedbackMsg({ text: 'Selecione ao menos uma vogal, prefixo ou sufixo para montar a palavra.', type: 'warn' });
      sound.playNotice();
      return;
    }

    if (alreadyAttempted) {
      setFeedbackMsg({ text: `A palavra "${analysis.palavraFinal}" já foi registrada nesta sessão para esta base.`, type: 'info' });
      sound.playNotice();
      return;
    }

    const novoRegistro: TentativaRegistro = {
      id: `tent-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      base: currentBase,
      palavra: analysis.palavraFinal,
      prefixo: analysis.prefixo,
      radical: analysis.radical,
      vogalTematica: analysis.vogalTematica,
      sufixo1: analysis.sufixo1,
      sufixo2: analysis.sufixo2,
      certo: isCerto,
      definicao: dictMatch?.definicao || analysis.definicao,
      classe: dictMatch?.classe || analysis.classeGramatical,
      houveModificacao: analysis.houveModificacao,
      explicacaoModificacao: analysis.explicacaoModificacao,
      timestamp: Date.now(),
    };

    onRegistrarTentativa(novoRegistro);

    if (isCerto) {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.7 },
          colors: ['#0891b2', '#ea580c', '#c026d3'],
        });
      } catch {
        // Confetti optional
      }
      setFeedbackMsg({
        text: `Excelente! Palavra "${analysis.palavraFinal}" validada com sucesso (+10 pts)!`,
        type: 'success',
      });
    } else {
      sound.playNotice();
      setFeedbackMsg({
        text: `Registrado: "${analysis.palavraFinal}" foi classificada como não existente/pseudopalavra.`,
        type: 'info',
      });
    }

    clearAffixes();
  };

  const handleNextBase = () => {
    clearAffixes();
    if (currentBaseIdx < selectedBases.length - 1) {
      setCurrentBaseIdx((prev) => prev + 1);
    } else {
      setCurrentBaseIdx(0);
    }
  };

  const handlePrevBase = () => {
    clearAffixes();
    if (currentBaseIdx > 0) {
      setCurrentBaseIdx((prev) => prev - 1);
    } else {
      setCurrentBaseIdx(selectedBases.length - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Session Progress Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBackToSelector}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            ← Trocar Bases
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <span className="text-xs text-slate-500">
            Base <strong className="text-cyan-800 font-bold">{currentBaseIdx + 1}</strong> de {selectedBases.length}
          </span>
        </div>

        {/* Base Navigation Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <button
            onClick={handlePrevBase}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
            title="Base anterior"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            {selectedBases.map((b, idx) => (
              <button
                key={b}
                onClick={() => {
                  clearAffixes();
                  setCurrentBaseIdx(idx);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  idx === currentBaseIdx
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextBase}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
            title="Próxima base"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Assembly Stage */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        {/* Base Header & Speech Therapy Context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
              Base / Radical em Estudo
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
                {currentBase}
              </h2>
              <button
                onClick={() => handleSpeak(currentBase)}
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 transition-colors cursor-pointer"
                title="Ouvir pronúncia da base"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            {basePresetInfo && (
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                {basePresetInfo.significado}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div>
              <span className="block font-bold text-slate-800 text-base tabular-nums">
                {currentBaseAttempts.filter((t) => t.certo).length}
              </span>
              <span>Palavras válidas</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="block font-bold text-slate-800 text-base tabular-nums">
                {currentBaseAttempts.length}
              </span>
              <span>Tentativas</span>
            </div>
          </div>
        </div>

        {/* Visual Morphological Slots Canvas */}
        <div className="my-8 py-6 px-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Matriz de Montagem Morfológica
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-full">
            {/* Slot Prefixo - Coral/Laranja */}
            <div
              className={`min-w-24 sm:min-w-28 px-4 py-3 rounded-xl text-center border-2 transition-all ${
                selectedPref
                  ? 'bg-orange-50 border-orange-400 text-orange-900 font-bold shadow-xs'
                  : 'bg-white border-dashed border-slate-300 text-slate-400 font-medium'
              }`}
            >
              <span className="block text-[10px] uppercase font-bold text-orange-700 mb-0.5">
                Prefixo
              </span>
              <span className="text-base sm:text-lg">
                {selectedPref ? `${selectedPref}-` : '—'}
              </span>
            </div>

            <span className="text-slate-300 font-bold text-xl">+</span>

            {/* Slot Base / Radical - Ciano */}
            <div className="min-w-28 sm:min-w-32 px-5 py-3.5 rounded-xl text-center bg-cyan-600 text-white font-black shadow-md border-2 border-cyan-700">
              <span className="block text-[10px] uppercase font-bold text-cyan-100 mb-0.5">
                Radical Base
              </span>
              <span className="text-lg sm:text-xl font-display tracking-wide">
                {currentBase}
              </span>
            </div>

            <span className="text-slate-300 font-bold text-xl">+</span>

            {/* Slot Vogal Temática / Ligação - PRETO */}
            <div
              className={`min-w-20 sm:min-w-24 px-3.5 py-3 rounded-xl text-center border-2 transition-all ${
                selectedVogal
                  ? 'bg-black text-white font-black border-black shadow-xs ring-2 ring-slate-400'
                  : 'bg-white border-dashed border-slate-300 text-slate-400 font-medium'
              }`}
            >
              <span className={`block text-[10px] uppercase font-bold mb-0.5 ${selectedVogal ? 'text-slate-300' : 'text-slate-400'}`}>
                Vogal
              </span>
              <span className="text-base sm:text-lg font-black font-display">
                {selectedVogal ? `-${selectedVogal}-` : '—'}
              </span>
            </div>

            <span className="text-slate-300 font-bold text-xl">+</span>

            {/* Slot Sufixo 1 - Fúcsia */}
            <div
              className={`min-w-24 sm:min-w-28 px-4 py-3 rounded-xl text-center border-2 transition-all ${
                selectedSuf1
                  ? 'bg-fuchsia-50 border-fuchsia-400 text-fuchsia-900 font-bold shadow-xs'
                  : 'bg-white border-dashed border-slate-300 text-slate-400 font-medium'
              }`}
            >
              <span className="block text-[10px] uppercase font-bold text-fuchsia-700 mb-0.5">
                Sufixo 1
              </span>
              <span className="text-base sm:text-lg">
                {selectedSuf1 ? `-${selectedSuf1}` : '—'}
              </span>
            </div>

            <span className="text-slate-300 font-bold text-xl">+</span>

            {/* Slot Sufixo 2 - Azul Índigo/Céu */}
            <div
              className={`min-w-24 sm:min-w-28 px-4 py-3 rounded-xl text-center border-2 transition-all ${
                selectedSuf2
                  ? 'bg-sky-50 border-sky-400 text-sky-900 font-bold shadow-xs'
                  : 'bg-white border-dashed border-slate-300 text-slate-400 font-medium'
              }`}
            >
              <span className="block text-[10px] uppercase font-bold text-sky-700 mb-0.5">
                Sufixo 2 (opc.)
              </span>
              <span className="text-base sm:text-lg">
                {selectedSuf2 ? `-${selectedSuf2}` : '—'}
              </span>
            </div>
          </div>

          {/* Formed Word Result Preview with Exact Color Scheme:
              - Prefixo: Coral
              - Radical: Ciano
              - Vogal Temática: PRETA
              - Sufixo: Fúcsia
          */}
          {hasAffixes ? (
            <div className="mt-7 text-center space-y-3 w-full max-w-xl">
              <div className="flex items-center justify-center gap-3">
                <MorphemeBreakdown
                  segments={{
                    prefixo: analysis.prefixo,
                    radical: analysis.radical,
                    vogalTematica: analysis.vogalTematica,
                    sufixo: analysis.sufixo1,
                    sufixo2: analysis.sufixo2,
                  }}
                  size="xl"
                  showLegend={true}
                />
                <button
                  onClick={() => handleSpeak(analysis.palavraFinal)}
                  className="p-2 rounded-xl text-slate-400 hover:text-cyan-700 hover:bg-white transition-colors cursor-pointer shrink-0 shadow-2xs"
                  title="Ouvir palavra montada"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Special Allomorphy & Morphophonological Alert (e.g. infeliz dade -> infelicidade) */}
              {analysis.houveModificacao && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs text-left shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-amber-900">
                        Adaptação Morfofonológica (Alomorfia do Radical)
                      </strong>
                      <p className="mt-1 leading-relaxed">
                        {analysis.explicacaoModificacao}
                      </p>
                      <p className="mt-1 font-semibold text-amber-800">
                        Palavra resultante legítima: <strong className="text-slate-900 underline">{analysis.palavraFinal}</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lexicon feedback */}
              {dictMatch ? (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dicionário ({dictMatch.classe}): {dictMatch.definicao}</span>
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  Formação livre. Avalie se a palavra existe na Língua Portuguesa ou é uma pseudopalavra.
                </div>
              )}
            </div>
          ) : (
            <p className="mt-5 text-xs text-slate-500 italic">
              Clique nas vogais, prefixos ou sufixos abaixo para experimentar combinações morfológicas.
            </p>
          )}

          {hasAffixes && (
            <button
              onClick={clearAffixes}
              className="mt-3 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar afixos e vogal selecionados</span>
            </button>
          )}
        </div>

        {/* Feedback message banner */}
        {feedbackMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold mb-6 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : feedbackMsg.type === 'warn'
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {feedbackMsg.text}
          </div>
        )}

        {/* 1. Tray de Vogal Temática / Ligação - PRETO (Solicitada para dentição, terra, etc.) */}
        <div className="p-4 rounded-2xl border-2 border-black/80 bg-slate-100/70 mb-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-black inline-block" />
              <span className="text-xs font-black text-black uppercase tracking-wider">
                Vogal Temática ou de Ligação (Destaque em PRETO)
              </span>
            </div>
            {selectedVogal && (
              <button
                onClick={() => setSelectedVogal(null)}
                className="text-[11px] text-slate-700 hover:text-black hover:underline cursor-pointer font-bold self-start sm:self-auto"
              >
                ✕ Remover vogal
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['a', 'e', 'i', 'o'].map((v) => {
              const isSelected = selectedVogal === v;
              return (
                <button
                  key={v}
                  onClick={() => handleToggleVogal(v)}
                  className={`w-11 h-11 rounded-xl text-base font-black transition-all cursor-pointer flex items-center justify-center shadow-2xs ${
                    isSelected
                      ? 'bg-black text-white ring-3 ring-cyan-500/60 scale-105 shadow-md'
                      : 'bg-white text-black border-2 border-black/80 hover:bg-slate-200'
                  }`}
                  title={`Vogal temática/ligação "${v}"`}
                >
                  {v}
                </button>
              );
            })}
            <button
              onClick={() => setSelectedVogal(null)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                !selectedVogal
                  ? 'bg-slate-200 text-slate-800 border-slate-300 font-extrabold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              (Sem vogal temática)
            </button>
          </div>
          <p className="text-[11px] text-slate-600 mt-2">
            💡 <strong>Dica Fonoaudiológica:</strong> Conecta o radical aos sufixos consonantais (ex: <strong>dent</strong> + <strong className="text-black font-black">i</strong> + <strong>ção</strong> = <strong>dentição</strong>; <strong>terr</strong> + <strong className="text-black font-black">a</strong> = <strong>terra</strong>; <strong>form</strong> + <strong className="text-black font-black">a</strong> + <strong>ção</strong> = <strong>formação</strong>; <strong>flor</strong> + <strong className="text-black font-black">e</strong> + <strong>ira</strong> = <strong>floreira</strong>).
          </p>
        </div>

        {/* 2. Affixes Trays: Prefixos & Sufixos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prefixos Panel - Laranja/Coral */}
          <div className="p-4.5 rounded-2xl border border-orange-200 bg-orange-50/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>⇐ Prefixos Disponíveis</span>
              </span>
              {selectedPref && (
                <button
                  onClick={() => setSelectedPref(null)}
                  className="text-[11px] text-orange-600 hover:underline cursor-pointer font-bold"
                >
                  ✕ Desmarcar
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PREFIXOS_CATALOGO.map((p) => {
                const isSelected = selectedPref === p.afixo;
                return (
                  <button
                    key={p.afixo}
                    onClick={() => handleTogglePref(p.afixo)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-xs ring-2 ring-orange-400/50 scale-105'
                        : 'bg-white hover:bg-orange-50 text-slate-700 border border-slate-200 hover:border-orange-300'
                    }`}
                    title={p.significado}
                  >
                    {p.afixo}–
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-600 mt-2.5">
              Adiciona valor de negação (des-, in-), repetição (re-) ou oposição (anti-).
            </p>
          </div>

          {/* Sufixos Panel - Fúcsia/Ciano (com eiro e eira em destaque no início) */}
          <div className="p-4.5 rounded-2xl border border-fuchsia-200 bg-fuchsia-50/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-fuchsia-700 uppercase tracking-wider">
                ⇒ Sufixos Disponíveis (1 ou 2)
              </span>
              {(selectedSuf1 || selectedSuf2) && (
                <button
                  onClick={() => {
                    setSelectedSuf1(null);
                    setSelectedSuf2(null);
                  }}
                  className="text-[11px] text-fuchsia-600 hover:underline cursor-pointer font-bold"
                >
                  ✕ Desmarcar todos
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {SUFIXOS_CATALOGO.map((s) => {
                const isSuf1 = selectedSuf1 === s.afixo;
                const isSuf2 = selectedSuf2 === s.afixo;

                return (
                  <button
                    key={s.afixo}
                    onClick={() => handleToggleSuf(s.afixo)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSuf1
                        ? 'bg-fuchsia-600 text-white shadow-xs ring-2 ring-fuchsia-400/50 scale-105'
                        : isSuf2
                        ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-400/50 scale-105'
                        : 'bg-white hover:bg-fuchsia-50 text-slate-700 border border-slate-200 hover:border-fuchsia-300'
                    }`}
                    title={`${s.significado} (${s.classeResultante || 'Derivado'})`}
                  >
                    –{s.afixo}
                    {isSuf1 && ' ①'}
                    {isSuf2 && ' ②'}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-600 mt-2.5">
              ① = 1º sufixo derivacional (fúcsia) · ② = 2º sufixo encadeado (azul).
            </p>
          </div>
        </div>

        {/* Action Buttons to Register Word */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleRegistrar(true)}
              disabled={!hasAffixes || alreadyAttempted}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                hasAffixes && !alreadyAttempted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{alreadyAttempted ? 'Palavra Já Registrada' : '✓ Palavra Existe (+10 pts)'}</span>
            </button>

            <button
              onClick={() => handleRegistrar(false)}
              disabled={!hasAffixes || alreadyAttempted}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                hasAffixes && !alreadyAttempted
                  ? 'bg-white border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer'
                  : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>✗ Não Existe / Pseudopalavra</span>
            </button>
          </div>

          <button
            onClick={handleNextBase}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
          >
            <span>Próxima Base ({currentBaseIdx + 2 <= selectedBases.length ? `${currentBaseIdx + 2}/${selectedBases.length}` : 'Reiniciar'})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Session attempts history for current base with MorphemeBreakdown */}
        {currentBaseAttempts.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-3">
              Tentativas Registradas nesta Base ({currentBaseAttempts.length})
            </span>
            <div className="flex flex-wrap gap-2.5">
              {currentBaseAttempts.map((t) => (
                <div
                  key={t.id}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                    t.certo
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/70 border-rose-200 text-rose-950'
                  }`}
                >
                  <span className="font-bold">{t.certo ? '✓' : '✗'}</span>
                  <MorphemeBreakdown
                    segments={{
                      prefixo: t.prefixo,
                      radical: t.radical,
                      vogalTematica: t.vogalTematica,
                      sufixo: t.sufixo1,
                      sufixo2: t.sufixo2,
                    }}
                    size="sm"
                  />
                  {t.classe && (
                    <span className="text-[10px] opacity-75 font-normal">({t.classe})</span>
                  )}
                  <button
                    onClick={() => handleSpeak(t.palavra)}
                    className="p-0.5 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Ouvir palavra"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
