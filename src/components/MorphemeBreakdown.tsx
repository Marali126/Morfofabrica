import React from 'react';

export interface MorphemeSegments {
  prefixo?: string | null;
  radical: string;
  vogalTematica?: string | null;
  sufixo?: string | null;
  sufixo2?: string | null;
}

interface MorphemeBreakdownProps {
  segments: MorphemeSegments;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLegend?: boolean;
  className?: string;
}

/**
 * Componente que renderiza palavras com distinção morfológica estrita solicitada pela fonoaudióloga:
 * - Prefixo: Cor Coral/Laranja (#EA580C)
 * - Base ou Radical: Cor Ciano/Turquesa (#0891B2)
 * - Vogal Temática ou de Ligação: PRETA (#000000 / text-black font-black)
 * - Sufixo(s): Cor Fúcsia/Magenta (#C026D3 / #A855F7)
 */
export const MorphemeBreakdown: React.FC<MorphemeBreakdownProps> = ({
  segments,
  size = 'md',
  showLegend = false,
  className = '',
}) => {
  const { prefixo, radical, vogalTematica, sufixo, sufixo2 } = segments;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm sm:text-base',
    lg: 'text-lg sm:text-xl',
    xl: 'text-2xl sm:text-3xl',
  }[size];

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className={`inline-flex items-baseline tracking-normal font-bold font-display ${sizeClasses}`}>
        {/* 1. Prefixo em Coral/Laranja */}
        {prefixo && (
          <span
            className="text-orange-600 bg-orange-50/80 px-1 py-0.5 rounded-l-md border-b-2 border-orange-500 transition-colors"
            title="Prefixo"
          >
            {prefixo}
          </span>
        )}

        {/* 2. Base ou Radical em Ciano/Turquesa */}
        <span
          className={`text-cyan-700 bg-cyan-50/80 px-1.5 py-0.5 font-extrabold border-b-2 border-cyan-600 transition-colors ${
            !prefixo ? 'rounded-l-md' : ''
          } ${!vogalTematica && !sufixo ? 'rounded-r-md' : ''}`}
          title="Radical / Base"
        >
          {radical}
        </span>

        {/* 3. Vogal Temática ou de Ligação em PRETO */}
        {vogalTematica && (
          <span
            className="text-black font-black bg-slate-200/90 px-1 py-0.5 border-b-2 border-black transition-colors"
            title="Vogal Temática / Ligação"
          >
            {vogalTematica}
          </span>
        )}

        {/* 4. Sufixo 1 em Fúcsia/Magenta */}
        {sufixo && (
          <span
            className={`text-fuchsia-700 bg-fuchsia-50/80 px-1 py-0.5 border-b-2 border-fuchsia-500 transition-colors ${
              !sufixo2 ? 'rounded-r-md' : ''
            }`}
            title="Sufixo Derivacional"
          >
            {sufixo}
          </span>
        )}

        {/* 5. Sufixo 2 (se houver) em Violeta/Índigo */}
        {sufixo2 && (
          <span
            className="text-indigo-700 bg-indigo-50/80 px-1 py-0.5 rounded-r-md border-b-2 border-indigo-500 transition-colors"
            title="Sufixo Secundário"
          >
            {sufixo2}
          </span>
        )}
      </div>

      {showLegend && (
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold mt-2 text-slate-600">
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
            <span className="text-black font-bold">Vogal Temática</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-fuchsia-600 inline-block" />
            <span className="text-fuchsia-800">Sufixo</span>
          </span>
        </div>
      )}
    </div>
  );
};
