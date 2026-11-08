import React, { useState } from 'react';
import {
  PREFIXOS_CATALOGO,
  SUFIXOS_CATALOGO,
  PRESET_BASES,
  INFO_CIENTIFICA_MORFOLOGIA,
} from '../data/morphologyData';
import { BookOpen, GraduationCap, Award, Search, Sparkles, CheckCircle2 } from 'lucide-react';

export const AffixDictionary: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'prefixos' | 'sufixos' | 'grecolatinas' | 'teoria'>('teoria');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrefixos = PREFIXOS_CATALOGO.filter(
    (p) =>
      p.afixo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.significado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSufixos = SUFIXOS_CATALOGO.filter(
    (s) =>
      s.afixo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.significado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.classeResultante && s.classeResultante.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const grecolatinas = PRESET_BASES.filter((b) => b.categoria === 'cientifico');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 tracking-wide uppercase mb-1">
              <span>Fonoaudiologia & Ciência da Leitura</span>
              <span aria-hidden="true">·</span>
              <span className="text-orange-600">Linguagem e Aprendizagem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Guia Científico & Dicionário Morfêmico
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              Consulte as bases da intervenção em consciência morfológica e explore o catálogo semântico de prefixos, sufixos e raízes produtivas em Português.
            </p>
          </div>
        </div>

        {/* Sub Navigation Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveSubTab('teoria')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === 'teoria'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎓 Fundamentação Científica
            </button>
            <button
              onClick={() => setActiveSubTab('prefixos')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === 'prefixos'
                  ? 'bg-white text-orange-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Prefixos ({PREFIXOS_CATALOGO.length})
            </button>
            <button
              onClick={() => setActiveSubTab('sufixos')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === 'sufixos'
                  ? 'bg-white text-fuchsia-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sufixos ({SUFIXOS_CATALOGO.length})
            </button>
            <button
              onClick={() => setActiveSubTab('grecolatinas')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === 'grecolatinas'
                  ? 'bg-white text-cyan-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raízes Greco-Latinas ({grecolatinas.length})
            </button>
          </div>

          {activeSubTab !== 'teoria' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por significado ou afixo..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Subtab 1: Fundamentação Científica */}
      {activeSubTab === 'teoria' && (
        <div className="space-y-6">
          {/* Mara Daher Profile Spotlight */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/aistudio/LOGO_COLORIDO_c1b52ad9.png"
                  alt="Mara Daher Fonoaudiologia"
                  className="h-16 w-auto object-contain drop-shadow-xs"
                />
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-display">
                    {INFO_CIENTIFICA_MORFOLOGIA.autor}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {INFO_CIENTIFICA_MORFOLOGIA.titulacao}
                  </p>
                </div>
              </div>
              <div className="text-xs text-cyan-900 bg-cyan-50 border border-cyan-200 px-3.5 py-1.5 rounded-xl font-bold">
                Prática Baseada em Evidências Clínicas
              </div>
            </div>

            <div className="my-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Princípios da Intervenção em Consciência Morfológica e Alfabetização
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INFO_CIENTIFICA_MORFOLOGIA.contribuicoes.map((c, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <h5 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{c.titulo}</span>
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {c.descricao}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-fuchsia-500/10 to-cyan-500/10 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-orange-600" />
                <span>Diretrizes de Intervenção Clínica Recomendadas</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-800 leading-relaxed">
                {INFO_CIENTIFICA_MORFOLOGIA.orientacoesClinicas.map((o, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-700 font-bold">•</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Prefixos */}
      {activeSubTab === 'prefixos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrefixos.map((p) => (
            <div key={p.afixo} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold font-display text-rose-800">
                  {p.afixo}–
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                  Prefixo
                </span>
              </div>
              <p className="text-xs font-medium text-slate-800 mb-2">
                {p.significado}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-600 space-y-1">
                <div>
                  <strong>Exemplos:</strong> {p.exemplo}
                </div>
                <div className="text-slate-500">
                  <strong>Dica Clínica:</strong> {p.dicaClinica}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 3: Sufixos */}
      {activeSubTab === 'sufixos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSufixos.map((s) => (
            <div key={s.afixo} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold font-display text-sky-800">
                  –{s.afixo}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                  {s.classeResultante || 'Sufixo'}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-800 mb-2">
                {s.significado}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-600 space-y-1">
                <div>
                  <strong>Exemplos:</strong> {s.exemplo}
                </div>
                <div className="text-slate-500">
                  <strong>Dica Clínica:</strong> {s.dicaClinica}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 4: Raízes Greco-Latinas */}
      {activeSubTab === 'grecolatinas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grecolatinas.map((r) => (
            <div key={r.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold font-display text-purple-900">
                  {r.base}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-800">
                  Raiz Científica
                </span>
              </div>
              <p className="text-xs font-medium text-slate-800 mb-2">
                {r.significado}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-600 space-y-1">
                <div>
                  <strong>Derivações:</strong> {r.derivacoesComuns.join(', ')}
                </div>
                <div className="text-slate-500">
                  <strong>Foco Fonoaudiológico:</strong> {r.dicaFono}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
