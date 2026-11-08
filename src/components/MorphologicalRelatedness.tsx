import React, { useState, useEffect } from 'react';
import { ITENS_PARENTESCO, ParentescoItem } from '../data/morphologyData';
import { Check, X, Volume2, ArrowRight, Dices, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface MorphologicalRelatednessProps {
  onScoreGained: (points: number, isCorrect: boolean) => void;
}

export const MorphologicalRelatedness: React.FC<MorphologicalRelatednessProps> = ({ onScoreGained }) => {
  // Sorteia aleatoriamente 10 itens a cada jogada
  const [rodadaItens, setRodadaItens] = useState<ParentescoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filtroTransparencia, setFiltroTransparencia] = useState<string>('todos');
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState(false);
  const [rodadaFinalizada, setRodadaFinalizada] = useState(false);
  const [acertosNaRodada, setAcertosNaRodada] = useState(0);
  const [historicoRespostas, setHistoricoRespostas] = useState<{ item: ParentescoItem; acertou: boolean; escolhaUsuario: boolean }[]>([]);

  // Função para sortear 10 novos pares aleatórios (com filtro opcional por transparência de Carlisle)
  const iniciarNovaRodada = (filtro: string = filtroTransparencia) => {
    sound.playSnap();
    let pool = [...ITENS_PARENTESCO];

    if (filtro !== 'todos') {
      pool = pool.filter((item) => item.grauTransparencia === filtro);
    }

    const embaralhados = [...pool].sort(() => Math.random() - 0.5);
    const selecionados10 = embaralhados.slice(0, Math.min(10, embaralhados.length));
    setRodadaItens(selecionados10);
    setCurrentIndex(0);
    setUserChoice(null);
    setAnswered(false);
    setRodadaFinalizada(false);
    setAcertosNaRodada(0);
    setHistoricoRespostas([]);
  };

  const handleTrocarFiltro = (novoFiltro: string) => {
    setFiltroTransparencia(novoFiltro);
    iniciarNovaRodada(novoFiltro);
  };

  useEffect(() => {
    iniciarNovaRodada('todos');
  }, []);

  const currentItem = rodadaItens[currentIndex];

  const handleAnswer = (choice: boolean) => {
    if (answered || !currentItem) return;
    setUserChoice(choice);
    setAnswered(true);

    const isHit = choice === currentItem.temParentesco;
    if (isHit) {
      setAcertosNaRodada((prev) => prev + 1);
      sound.playSuccess();
      try {
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
      } catch {}
      onScoreGained(10, true);
    } else {
      sound.playNotice();
      onScoreGained(0, false);
    }

    setHistoricoRespostas((prev) => [
      ...prev,
      { item: currentItem, acertou: isHit, escolhaUsuario: choice },
    ]);
  };

  const handleNext = () => {
    setUserChoice(null);
    setAnswered(false);

    if (currentIndex < rodadaItens.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finalizou a rodada de 10
      setRodadaFinalizada(true);
      sound.playSuccess();
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {}
    }
  };

  if (!currentItem && !rodadaFinalizada) {
    return null;
  }

  const renderBadgeTransparencia = (grau: string) => {
    switch (grau) {
      case 'transparente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
            <span>🟢 Transparente (Carlisle Nível 1)</span>
          </span>
        );
      case 'opacidade_fonologica':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-[10px] font-bold uppercase tracking-wider border border-amber-300">
            <span>🟡 Opacidade Fonológica (Deslocamento de Acento / Timbre)</span>
          </span>
        );
      case 'opacidade_alomorfica':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-100 text-orange-950 text-[10px] font-bold uppercase tracking-wider border border-orange-300">
            <span>🟠 Opacidade Alomórfica (Alteração Ortográfica do Radical)</span>
          </span>
        );
      case 'opacidade_etimologica':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-fuchsia-100 text-fuchsia-950 text-[10px] font-bold uppercase tracking-wider border border-fuchsia-300">
            <span>🔴 Opacidade Etimológica Erudita (Raiz Greco-Latina)</span>
          </span>
        );
      case 'distrator_fonologico':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider">
            <span>⚠️ Distrator Fonológico (Falso Amigo Acústico)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 tracking-wide uppercase mb-1">
              <span>Consciência Relacional & Psicolinguística</span>
              <span aria-hidden="true">·</span>
              <span className="text-orange-600">Continuum de Transparência de Joanne Carlisle</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Julgamento de Parentesco Morfológico
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
              Avalie se o par compartilha o mesmo radical e raiz de significado. Explore desde relações <strong>transparentes</strong> (como <em>flor/florista</em>) até pares com <strong>opacidade fonológica</strong> (como <em>músico/musicista</em>), <strong>alomorfia</strong> (<em>infeliz/infelicidade</em>) ou <strong>raízes eruditas</strong> (<em>noite/noturno</em>).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => iniciarNovaRodada(filtroTransparencia)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Dices className="w-4 h-4 text-cyan-700" />
              <span>Sortear 10 Novos Pares</span>
            </button>
          </div>
        </div>

        {/* Filter Strip by Morphological Transparency (Carlisle Continuum) */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase text-slate-400 mr-1">
            Filtro Clínico:
          </span>
          <button
            onClick={() => handleTrocarFiltro('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filtroTransparencia === 'todos'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🌟 Todos ({ITENS_PARENTESCO.length})
          </button>
          <button
            onClick={() => handleTrocarFiltro('transparente')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filtroTransparencia === 'transparente'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
          >
            🟢 Transparentes (ex: flor/florista)
          </button>
          <button
            onClick={() => handleTrocarFiltro('opacidade_fonologica')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filtroTransparencia === 'opacidade_fonologica'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            🟡 Opacidade Fonológica (músico/musicista)
          </button>
          <button
            onClick={() => handleTrocarFiltro('opacidade_alomorfica')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filtroTransparencia === 'opacidade_alomorfica'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200'
            }`}
          >
            🟠 Opacidade Alomórfica (infeliz/infelicidade, pão/padeiro)
          </button>
          <button
            onClick={() => handleTrocarFiltro('opacidade_etimologica')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filtroTransparencia === 'opacidade_etimologica'
                ? 'bg-fuchsia-600 text-white shadow-xs'
                : 'bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-200'
            }`}
          >
            🔴 Opacidade Erudita (noite/noturno)
          </button>
          <button
            onClick={() => handleTrocarFiltro('distrator_fonologico')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filtroTransparencia === 'distrator_fonologico'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
            }`}
          >
            ⚠️ Falsos Cognatos (sapato/sapa)
          </button>
        </div>
      </div>

      {/* Se a rodada foi concluída */}
      {rodadaFinalizada ? (
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 via-fuchsia-500 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900 font-display">
              Rodada Concluída!
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Você acertou <strong className="text-cyan-800 font-bold">{acertosNaRodada} de {rodadaItens.length} pares</strong> ({Math.round((acertosNaRodada / (rodadaItens.length || 1)) * 100)}% de precisão).
            </p>
          </div>

          {/* Histórico da rodada com categorização de transparência */}
          <div className="text-left space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200 max-h-72 overflow-y-auto">
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block mb-2">
              Resumo Metalinguístico dos Pares:
            </span>
            {historicoRespostas.map((h, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-xs space-y-1 border ${
                  h.acertou ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{h.acertou ? '✓' : '✗'}</span>
                    <span className="font-semibold text-sm">
                      <strong>{h.item.palavraBase}</strong> ↔ <strong>{h.item.palavraCandidata}</strong>
                    </span>
                  </div>
                  <div>
                    {renderBadgeTransparencia(h.item.grauTransparencia)}
                  </div>
                </div>
                {h.item.detalheClinicoTransparencia && (
                  <p className="text-[11px] text-slate-600 pl-5 leading-relaxed">
                    💡 {h.item.detalheClinicoTransparencia}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => iniciarNovaRodada(filtroTransparencia)}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-fuchsia-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Dices className="w-4 h-4" />
              <span>Jogar Nova Rodada (Sortear 10 Novos Pares)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Card do Par Atual */
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          {/* Progress bar dos 10 itens */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Par {currentIndex + 1} de {rodadaItens.length} da rodada</span>
              <span className="text-cyan-800 font-bold">{acertosNaRodada} acertos</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 via-fuchsia-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / (rodadaItens.length || 10)) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
              Comparação de Par #{currentIndex + 1} de {rodadaItens.length}
            </span>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {/* Palavra 1 - Base (Ciano) */}
              <div className="p-6 rounded-2xl bg-cyan-50/80 border-2 border-cyan-300 text-center min-w-48 shadow-2xs">
                <span className="block text-[10px] font-bold uppercase text-cyan-800 tracking-wider mb-1">
                  Palavra Base
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-cyan-950 font-display">
                    {currentItem.palavraBase}
                  </span>
                  <button
                    onClick={() => sound.speakWord(currentItem.palavraBase)}
                    className="p-1 text-cyan-600 hover:text-cyan-800 cursor-pointer"
                    title="Ouvir"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm shrink-0">
                VS
              </div>

              {/* Palavra 2 - Testada (Coral/Laranja) */}
              <div className="p-6 rounded-2xl bg-orange-50/80 border-2 border-orange-300 text-center min-w-48 shadow-2xs">
                <span className="block text-[10px] font-bold uppercase text-orange-800 tracking-wider mb-1">
                  Palavra Testada
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-orange-950 font-display">
                    {currentItem.palavraCandidata}
                  </span>
                  <button
                    onClick={() => sound.speakWord(currentItem.palavraCandidata)}
                    className="p-1 text-orange-600 hover:text-orange-800 cursor-pointer"
                    title="Ouvir"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base font-semibold text-slate-800 mt-6 max-w-md mx-auto">
              A palavra <strong>"{currentItem.palavraCandidata}"</strong> vem e faz parte da mesma família morfológica de <strong>"{currentItem.palavraBase}"</strong>?
            </p>
          </div>

          {/* Action Buttons */}
          {!answered ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <button
                onClick={() => handleAnswer(true)}
                className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xs cursor-pointer"
              >
                <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                <span>Sim, são parentes morfológicos!</span>
              </button>

              <button
                onClick={() => handleAnswer(false)}
                className="p-4 rounded-xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-100/80 text-rose-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xs cursor-pointer"
              >
                <X className="w-5 h-5 text-rose-600 stroke-[3]" />
                <span>Não, é só som parecido (distrator)!</span>
              </button>
            </div>
          ) : (
            <div className="max-w-xl mx-auto space-y-4">
              {/* Feedback Box */}
              <div
                className={`p-5 rounded-2xl border ${
                  userChoice === currentItem.temParentesco
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {userChoice === currentItem.temParentesco ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      ✓
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      ✕
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-base font-bold">
                        {userChoice === currentItem.temParentesco
                          ? 'Correto! Excelente julgamento relacional (+10 pts)'
                          : 'Atenção à relação morfêmica!'}
                      </h4>
                      {renderBadgeTransparencia(currentItem.grauTransparencia)}
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed">
                      {currentItem.explicacao}
                    </p>

                    {currentItem.detalheClinicoTransparencia && (
                      <div className="p-3 rounded-xl bg-white/80 border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">
                          💡 Análise da Fonoaudiologia (Joanne Carlisle):
                        </strong>
                        {currentItem.detalheClinicoTransparencia}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleNext}
                  className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{currentIndex < rodadaItens.length - 1 ? 'Próximo Par' : 'Ver Resultado da Rodada'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
