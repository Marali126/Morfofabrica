import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

export type ActiveTab = 'oficina' | 'decomposicao' | 'parentesco' | 'sintaxe' | 'dicionario' | 'guia';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  totalScore: number;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  totalScore,
  onOpenReport,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Brand accent bar on top of the header inspired by logo gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-fuchsia-500 to-cyan-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single brand cluster with Mara Daher logo */}
        <button
          onClick={() => onSelectTab('oficina')}
          className="flex items-center gap-3 text-left transition-opacity hover:opacity-90 cursor-pointer shrink-0"
        >
          <img
            src="/assets/aistudio/LOGO_COLORIDO_c1b52ad9.png"
            alt="Mara Daher Fonoaudiologia - Linguagem e Aprendizagem"
            className="h-11 w-auto object-contain shrink-0 drop-shadow-xs"
          />
          <div className="hidden sm:block border-l border-slate-200 pl-3">
            <span className="block text-sm font-extrabold text-slate-800 tracking-tight font-display">
              Morfofábrica
            </span>
            <span className="block text-[10px] text-slate-500 font-medium">
              Consciência Morfológica
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wide text-slate-600">
          <button
            onClick={() => onSelectTab('oficina')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1.5 border-b-2 cursor-pointer ${
              activeTab === 'oficina'
                ? 'text-cyan-700 border-cyan-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Oficina de Palavras
          </button>
          <button
            onClick={() => onSelectTab('decomposicao')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1.5 border-b-2 cursor-pointer ${
              activeTab === 'decomposicao'
                ? 'text-cyan-700 border-cyan-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Decomposição Morfêmica
          </button>
          <button
            onClick={() => onSelectTab('parentesco')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1.5 border-b-2 cursor-pointer ${
              activeTab === 'parentesco'
                ? 'text-cyan-700 border-cyan-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Parentesco Relacional
          </button>
          <button
            onClick={() => onSelectTab('sintaxe')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1.5 border-b-2 cursor-pointer ${
              activeTab === 'sintaxe'
                ? 'text-cyan-700 border-cyan-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Fechamento Sintático
          </button>
          <button
            onClick={() => onSelectTab('dicionario')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1.5 border-b-2 cursor-pointer ${
              activeTab === 'dicionario'
                ? 'text-cyan-700 border-cyan-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Guia de Afixos & Morfologia
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 bg-gradient-to-r from-orange-50 via-fuchsia-50/50 to-cyan-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-bold text-slate-900 tabular-nums">{totalScore}</span>
            <span className="text-slate-500 font-medium">pts</span>
          </div>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 via-fuchsia-600 to-cyan-600 hover:from-orange-600 hover:via-fuchsia-700 hover:to-cyan-700 rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Relatório Clínico</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer / horizontal scroll strip */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2.5 border-t border-slate-100 overflow-x-auto text-xs font-semibold text-slate-600 bg-slate-50/70">
        <button
          onClick={() => onSelectTab('oficina')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'oficina' ? 'bg-cyan-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Oficina
        </button>
        <button
          onClick={() => onSelectTab('decomposicao')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'decomposicao' ? 'bg-cyan-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Decomposição
        </button>
        <button
          onClick={() => onSelectTab('parentesco')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'parentesco' ? 'bg-cyan-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Parentesco
        </button>
        <button
          onClick={() => onSelectTab('sintaxe')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'sintaxe' ? 'bg-cyan-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sintaxe
        </button>
        <button
          onClick={() => onSelectTab('dicionario')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'dicionario' ? 'bg-cyan-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Afixos & Teoria
        </button>
      </div>
    </header>
  );
};
