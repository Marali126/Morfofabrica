import React, { useState } from 'react';
import { PRESET_BASES } from '../data/morphologyData';
import { Plus, Check, Sparkles, Info, Layers } from 'lucide-react';
import { sound } from '../utils/audio';

interface BaseSelectorProps {
  selectedBases: string[];
  onToggleBase: (base: string) => void;
  onSelectAll: (bases: string[]) => void;
  onClearSelection: () => void;
  onAddCustomBase: (base: string) => void;
  onStartWorkshop: () => void;
}

export const BaseSelector: React.FC<BaseSelectorProps> = ({
  selectedBases,
  onToggleBase,
  onSelectAll,
  onClearSelection,
  onAddCustomBase,
  onStartWorkshop,
}) => {
  const [filterLevel, setFilterLevel] = useState<'todos' | 'iniciante' | 'intermediario' | 'avancado'>('todos');
  const [customInput, setCustomInput] = useState('');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const filteredBases = PRESET_BASES.filter((b) => {
    if (filterLevel === 'todos') return true;
    return b.nivel === filterLevel;
  });

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customInput.trim().toLowerCase();
    if (!clean) return;
    onAddCustomBase(clean);
    setCustomInput('');
    sound.playSnap();
  };

  const handleSelectCurrentCategory = () => {
    const basesToAdd = filteredBases.map((b) => b.base);
    const unique = Array.from(new Set([...selectedBases, ...basesToAdd]));
    onSelectAll(unique);
    sound.playSnap();
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner with Mara Daher clinical brand style */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs relative overflow-hidden">
        {/* Subtle decorative brand glow in the background */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-orange-400/10 via-fuchsia-400/10 to-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 tracking-wide uppercase mb-1">
              <span>Ciência da Leitura & Fonoaudiologia</span>
              <span aria-hidden="true">·</span>
              <span className="text-orange-600">Intervenção Multilinguística</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Bases e Radicais Pré-Selecionados
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              Selecione as bases lexicais para a oficina de montagem de palavras. 
              As bases foram organizadas por transparência derivacional e produtividade morfológica, 
              seguindo os princípios de intervenção em linguagem e aprendizagem de Mara Daher.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Selecionadas</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {selectedBases.length} <span className="text-xs font-medium text-slate-400">bases</span>
              </span>
            </div>
            <button
              onClick={() => {
                sound.playSuccess();
                onStartWorkshop();
              }}
              disabled={selectedBases.length === 0}
              className={`px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 ${
                selectedBases.length > 0
                  ? 'bg-gradient-to-r from-orange-500 via-fuchsia-600 to-cyan-600 hover:from-orange-600 hover:to-cyan-700 text-white cursor-pointer hover:shadow-md hover:-translate-y-0.5'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Iniciar Oficina ({selectedBases.length})</span>
            </button>
          </div>
        </div>

        {/* Level Filters & Category Actions */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setFilterLevel('todos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filterLevel === 'todos' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas as Bases ({PRESET_BASES.length})
            </button>
            <button
              onClick={() => setFilterLevel('iniciante')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filterLevel === 'iniciante' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌱 Nível 1: Cotidiano (1º-3º ano)
            </button>
            <button
              onClick={() => setFilterLevel('intermediario')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filterLevel === 'intermediario' ? 'bg-white text-cyan-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ Nível 2: Derivacional (4º-6º ano)
            </button>
            <button
              onClick={() => setFilterLevel('avancado')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filterLevel === 'avancado' ? 'bg-white text-fuchsia-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔬 Nível 3: Greco-Latinas (Científico)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectCurrentCategory}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              + Marcar categoria
            </button>
            {selectedBases.length > 0 && (
              <button
                onClick={() => {
                  onClearSelection();
                  sound.playSnap();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                ✕ Desmarcar todas
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Bases with Mara Daher Color Integration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBases.map((item) => {
          const isSelected = selectedBases.includes(item.base);
          const isTipOpen = expandedTip === item.id;

          return (
            <div
              key={item.id}
              onClick={() => {
                sound.playSnap();
                onToggleBase(item.base);
              }}
              className={`relative group rounded-2xl p-4.5 transition-all cursor-pointer text-left border ${
                isSelected
                  ? 'bg-cyan-50/70 border-cyan-400 ring-2 ring-cyan-400/30 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-2xl font-black tracking-wide font-display ${
                      isSelected ? 'text-cyan-950' : 'text-slate-900'
                    }`}
                  >
                    {item.base}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {item.classeGramatical}
                  </span>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'border border-slate-300 text-transparent group-hover:border-slate-400'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Carlisle Transparency Badge */}
              {item.grauTransparencia && (
                <div className="mt-2">
                  {item.grauTransparencia === 'transparente' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
                      🟢 Transparente (Carlisle)
                    </span>
                  )}
                  {item.grauTransparencia === 'opacidade_fonologica' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 inline-block">
                      🟡 Opacidade Fonológica (Acento)
                    </span>
                  )}
                  {item.grauTransparencia === 'opacidade_alomorfica' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-900 border border-orange-200 inline-block">
                      🟠 Alomorfia do Radical
                    </span>
                  )}
                  {item.grauTransparencia === 'opacidade_etimologica' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-fuchsia-50 text-fuchsia-900 border border-fuchsia-200 inline-block">
                      🔴 Opacidade Erudita
                    </span>
                  )}
                </div>
              )}

              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {item.significado}
              </p>

              {/* Sample derivations */}
              <div className="mt-3.5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                  <span className="font-semibold text-slate-600">Família derivacional:</span>
                  <span className="font-bold text-cyan-800 tabular-nums">
                    {item.derivacoesComuns.length} palavras
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.derivacoesComuns.slice(0, 3).map((w, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                    >
                      {w}
                    </span>
                  ))}
                  {item.derivacoesComuns.length > 3 && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500">
                      +{item.derivacoesComuns.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Clinical note toggle */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedTip(isTipOpen ? null : item.id);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-cyan-700 hover:text-cyan-900 transition-colors cursor-pointer"
                >
                  <Info className="w-3 h-3" />
                  <span>{isTipOpen ? 'Ocultar dica fonoaudiológica' : 'Ver dica fonoaudiológica'}</span>
                </button>

                {isTipOpen && (
                  <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-cyan-50/80 via-white to-orange-50/50 border border-cyan-200/80 text-[11px] text-slate-800 leading-relaxed shadow-2xs">
                    <strong className="text-cyan-900">Dica Fonoaudiológica:</strong> {item.dicaFono}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Base Addition Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Layers className="w-4 h-4 text-cyan-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Adicionar Base Personalizada da Sessão
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          O fonoaudiólogo pode cadastrar raízes e palavras-alvo específicas do plano terapêutico individual (ex: <em>amig, cas, paz, livr, cant</em>).
        </p>

        <form onSubmit={handleAddCustom} className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Digite a base ou radical (ex: amig, livr, paz, cant)..."
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Base</span>
          </button>
        </form>
      </div>
    </div>
  );
};
