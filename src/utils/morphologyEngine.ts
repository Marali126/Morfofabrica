/**
 * Motor de Síntese e Alomorfia Morfológica (Língua Portuguesa)
 * Trata adaptações morfofonológicas de radicais (ex: feliz + dade -> infelicidade / felicidade)
 * e decompõe qualquer palavra nas quatro partes canônicas:
 * 1. Prefixo
 * 2. Radical ou Base
 * 3. Vogal Temática ou de Ligação
 * 4. Sufixo(s)
 */

export interface WordAnalysis {
  palavraFinal: string;
  palavraConcatenadaCrua: string;
  houveModificacao: boolean;
  explicacaoModificacao?: string;
  prefixo: string | null;
  radical: string;
  vogalTematica: string | null;
  sufixo1: string | null;
  sufixo2: string | null;
  classeGramatical?: string;
  definicao?: string;
}

interface AdaptationRule {
  base: string;
  prefixoRequerido?: string | null; // null = sem prefixo, string = com esse prefixo, undefined = qualquer
  vogalRequerida?: string | null;
  sufixoRequerido?: string;
  sufixoRequerido2?: string;
  palavraReal: string;
  radicalGrafico: string;
  vogalTematica: string | null;
  sufixoReal: string | null;
  sufixoReal2?: string | null;
  explicacao: string;
  classe: string;
  definicao: string;
}

const REGRAS_ALOMORFIA: AdaptationRule[] = [
  // Feliz + dade -> infelicidade / felicidade
  {
    base: 'feliz',
    prefixoRequerido: 'in',
    sufixoRequerido: 'dade',
    palavraReal: 'infelicidade',
    radicalGrafico: 'felic',
    vogalTematica: 'i',
    sufixoReal: 'dade',
    explicacao: 'Atenção: A base "feliz" sofre modificação fonético-morfológica (alomorfia). O "z" final vira "c" e recebe a vogal de ligação "i" antes do sufixo "-dade", formando "infelicidade" (a forma "infelizdade" não existe!).',
    classe: 'Substantivo abstrato',
    definicao: 'Estado ou condição de quem não é feliz; adversidade ou tristeza.',
  },
  {
    base: 'feliz',
    prefixoRequerido: null,
    sufixoRequerido: 'dade',
    palavraReal: 'felicidade',
    radicalGrafico: 'felic',
    vogalTematica: 'i',
    sufixoReal: 'dade',
    explicacao: 'Atenção: A base "feliz" sofre modificação (alomorfia do radical). O "z" final vira "c" e recebe a vogal de ligação "i", formando "felicidade" (a forma "felizdade" não existe!).',
    classe: 'Substantivo abstrato',
    definicao: 'Estado de quem é feliz; contentamento profundo e bem-estar.',
  },
  // Feliz + mente -> felizmente / infelizmente
  {
    base: 'feliz',
    prefixoRequerido: 'in',
    sufixoRequerido: 'mente',
    palavraReal: 'infelizmente',
    radicalGrafico: 'feliz',
    vogalTematica: null,
    sufixoReal: 'mente',
    explicacao: 'O advérbio mantém a base "feliz" com o prefixo negativo "in-" e o sufixo modal "-mente".',
    classe: 'Advérbio de modo',
    definicao: 'Lamentavelmente; com infelicidade.',
  },
  {
    base: 'feliz',
    prefixoRequerido: null,
    sufixoRequerido: 'mente',
    palavraReal: 'felizmente',
    radicalGrafico: 'feliz',
    vogalTematica: null,
    sufixoReal: 'mente',
    explicacao: 'Formação regular de advérbio de modo unindo a base com o sufixo "-mente".',
    classe: 'Advérbio de modo',
    definicao: 'De modo feliz; felizmente.',
  },

  // Ativ + dade -> atividade
  {
    base: 'ativ',
    sufixoRequerido: 'dade',
    palavraReal: 'atividade',
    radicalGrafico: 'ativ',
    vogalTematica: 'i',
    sufixoReal: 'dade',
    explicacao: 'Recebe a vogal de ligação "i" entre o radical consonantal e o sufixo "-dade".',
    classe: 'Substantivo abstrato',
    definicao: 'Qualidade ou estado de ativo; ação ou exercício.',
  },
  // Ativ + ar -> ativar
  {
    base: 'ativ',
    sufixoRequerido: 'ar',
    palavraReal: 'ativar',
    radicalGrafico: 'ativ',
    vogalTematica: 'a',
    sufixoReal: 'r',
    explicacao: 'Formação verbal com a vogal temática "a" da 1ª conjugação.',
    classe: 'Verbo',
    definicao: 'Tornar ativo, acionar ou estimular.',
  },
  // Des + ativ + ar -> desativar
  {
    base: 'ativ',
    prefixoRequerido: 'des',
    sufixoRequerido: 'ar',
    palavraReal: 'desativar',
    radicalGrafico: 'ativ',
    vogalTematica: 'a',
    sufixoReal: 'r',
    explicacao: 'Prefixo de reversão "des-" + radical "ativ" + vogal temática "a" + sufixo desinencial "-r".',
    classe: 'Verbo',
    definicao: 'Interromper o funcionamento de.',
  },
  // Des + ativ + ção -> desativação
  {
    base: 'ativ',
    prefixoRequerido: 'des',
    sufixoRequerido: 'ção',
    palavraReal: 'desativação',
    radicalGrafico: 'ativ',
    vogalTematica: 'a',
    sufixoReal: 'ção',
    explicacao: 'Radical "ativ" com vogal temática "a" e o sufixo nominalizador de ação "-ção".',
    classe: 'Substantivo',
    definicao: 'Ato de desativar.',
  },
  // Re + ativ + ar -> reativar
  {
    base: 'ativ',
    prefixoRequerido: 're',
    sufixoRequerido: 'ar',
    palavraReal: 'reativar',
    radicalGrafico: 'ativ',
    vogalTematica: 'a',
    sufixoReal: 'r',
    explicacao: 'Prefixo de repetição "re-" associado ao verbo derivado "ativar".',
    classe: 'Verbo',
    definicao: 'Ativar novamente.',
  },

  // Flor + ista -> florista
  {
    base: 'flor',
    sufixoRequerido: 'ista',
    palavraReal: 'florista',
    radicalGrafico: 'flor',
    vogalTematica: null,
    sufixoReal: 'ista',
    explicacao: 'Sufixo de ocupação/agente "-ista" ligado diretamente ao radical.',
    classe: 'Substantivo de agente',
    definicao: 'Pessoa que cultiva ou comercializa flores.',
  },
  // Flor + eiro -> floreira
  {
    base: 'flor',
    sufixoRequerido: 'eiro',
    palavraReal: 'floreira',
    radicalGrafico: 'flor',
    vogalTematica: null,
    sufixoReal: 'eira',
    explicacao: 'Sufixo derivacional que indica recipiente ou suporte para flores.',
    classe: 'Substantivo',
    definicao: 'Suporte ou vaso decorativo para plantas floridas.',
  },
  // Re + flor + ar -> reflorestar
  {
    base: 'flor',
    prefixoRequerido: 're',
    sufixoRequerido: 'ar',
    palavraReal: 'reflorestar',
    radicalGrafico: 'flor',
    vogalTematica: 'a',
    sufixoReal: 'estar',
    explicacao: 'Derivação parassintética/prefixal-sufixal com o infixo "est" e vogal temática "a".',
    classe: 'Verbo',
    definicao: 'Plantar novas árvores e reflorestar áreas degradadas.',
  },

  // Bel + eza -> beleza
  {
    base: 'bel',
    sufixoRequerido: 'eza',
    palavraReal: 'beleza',
    radicalGrafico: 'bel',
    vogalTematica: null,
    sufixoReal: 'eza',
    explicacao: 'Sufixo nominalizador "-eza" (grafado com Z para adjetivos que viram substantivos abstratos).',
    classe: 'Substantivo abstrato',
    definicao: 'Qualidade daquilo que agrada pela harmonia.',
  },
  // Em + bel + izar -> embelezar
  {
    base: 'bel',
    sufixoRequerido: 'izar',
    palavraReal: 'embelezar',
    radicalGrafico: 'bel',
    vogalTematica: 'e',
    sufixoReal: 'zar',
    explicacao: 'O radical recebe o prefixo "em-" e a vogal temática "e" antes do sufixo verbalizador "-zar".',
    classe: 'Verbo',
    definicao: 'Tornar belo, ornar ou enfeitar.',
  },

  // Terr (Radical terr-) + a -> terra
  {
    base: 'terr',
    vogalRequerida: 'a',
    palavraReal: 'terra',
    radicalGrafico: 'terr',
    vogalTematica: 'a',
    sufixoReal: null,
    explicacao: 'O radical invariante é "terr-". Com a vogal temática "a", forma a palavra primitiva "terra".',
    classe: 'Substantivo',
    definicao: 'Solo, terra cultivável ou planeta Terra.',
  },
  // Terr + estre -> terrestre
  {
    base: 'terr',
    sufixoRequerido: 'estre',
    palavraReal: 'terrestre',
    radicalGrafico: 'terr',
    vogalTematica: 'e',
    sufixoReal: 'stre',
    explicacao: 'O radical é "terr-". Recebe a vogal "e" e o sufixo "-stre", formando "terrestre".',
    classe: 'Adjetivo',
    definicao: 'Pertencente ou relativo ao planeta Terra.',
  },
  {
    base: 'terr',
    sufixoRequerido: 'al',
    palavraReal: 'terrestre',
    radicalGrafico: 'terr',
    vogalTematica: 'e',
    sufixoReal: 'stre',
    explicacao: 'O radical é "terr-". Recebe a vogal "e" e o sufixo "-stre", formando "terrestre".',
    classe: 'Adjetivo',
    definicao: 'Pertencente ou relativo ao planeta Terra.',
  },
  // Terr + eiro -> terreiro
  {
    base: 'terr',
    sufixoRequerido: 'eiro',
    palavraReal: 'terreiro',
    radicalGrafico: 'terr',
    vogalTematica: null,
    sufixoReal: 'eiro',
    explicacao: 'Radical "terr-" + sufixo contentor/lugar "-eiro" = terreiro.',
    classe: 'Substantivo',
    definicao: 'Área plana de terra limpa ao redor de uma moradia.',
  },
  // Terr + eira -> terreira
  {
    base: 'terr',
    sufixoRequerido: 'eira',
    palavraReal: 'terreira',
    radicalGrafico: 'terr',
    vogalTematica: null,
    sufixoReal: 'eira',
    explicacao: 'Radical "terr-" + sufixo "-eira" = terreira.',
    classe: 'Substantivo',
    definicao: 'Porção ou montículo de terra cultivável.',
  },
  // Sub + terr + âneo -> subterrâneo
  {
    base: 'terr',
    prefixoRequerido: 'sub',
    palavraReal: 'subterrâneo',
    radicalGrafico: 'terr',
    vogalTematica: null,
    sufixoReal: 'âneo',
    explicacao: 'Prefixo "sub-" + radical "terr" + sufixo adjetivo "-âneo".',
    classe: 'Adjetivo',
    definicao: 'Situado abaixo da superfície do solo.',
  },
  // A + terr + ar -> aterrar
  {
    base: 'terr',
    prefixoRequerido: 'a',
    sufixoRequerido: 'ar',
    palavraReal: 'aterrar',
    radicalGrafico: 'terr',
    vogalTematica: 'a',
    sufixoReal: 'r',
    explicacao: 'Prefixo "a-" + radical "terr" + vogal temática "a" + sufixo desinencial "-r".',
    classe: 'Verbo',
    definicao: 'Cobrir com terra ou pousar no solo.',
  },
  // En + terr + ar -> enterrar
  {
    base: 'terr',
    prefixoRequerido: 'en',
    sufixoRequerido: 'ar',
    palavraReal: 'enterrar',
    radicalGrafico: 'terr',
    vogalTematica: 'a',
    sufixoReal: 'r',
    explicacao: 'Prefixo "en-" + radical "terr" + vogal temática "a" + sufixo desinencial "-r".',
    classe: 'Verbo',
    definicao: 'Colocar sob a terra, sepultar ou plantar sementes.',
  },

  // Dente + i + ção -> dentição (exemplo fonoaudiológico de vogal de ligação)
  {
    base: 'dent',
    sufixoRequerido: 'ção',
    palavraReal: 'dentição',
    radicalGrafico: 'dent',
    vogalTematica: 'i',
    sufixoReal: 'ção',
    explicacao: 'Excelente exemplo de vogal de ligação: o radical consonantal "dent-" necessita da vogal "i" para se ligar ao sufixo "-ção", formando "dentição"!',
    classe: 'Substantivo',
    definicao: 'Conjunto dos dentes ou processo de nascimento e desenvolvimento dos dentes.',
  },
  // Dente + ista -> dentista
  {
    base: 'dent',
    sufixoRequerido: 'ista',
    palavraReal: 'dentista',
    radicalGrafico: 'dent',
    vogalTematica: 'i',
    sufixoReal: 'sta',
    explicacao: 'O radical "dent-" com a vogal/sufixo "-ista" forma a profissão "dentista".',
    classe: 'Substantivo de profissão',
    definicao: 'Profissional da saúde responsável pelo cuidado dos dentes.',
  },
  // Dente + al -> dental
  {
    base: 'dent',
    sufixoRequerido: 'al',
    palavraReal: 'dental',
    radicalGrafico: 'dent',
    vogalTematica: null,
    sufixoReal: 'al',
    explicacao: 'Radical "dent" com o sufixo relacional "-al".',
    classe: 'Adjetivo',
    definicao: 'Relativo aos dentes.',
  },

  // Mar + eiro -> marinheiro
  {
    base: 'mar',
    sufixoRequerido: 'eiro',
    palavraReal: 'marinheiro',
    radicalGrafico: 'mar',
    vogalTematica: 'i',
    sufixoReal: 'nheiro',
    explicacao: 'O radical "mar" recebe o elemento de ligação "inh" com a terminação "-eiro".',
    classe: 'Substantivo',
    definicao: 'Aquele que navega pelos mares.',
  },
  // Mar + eira -> marinheira
  {
    base: 'mar',
    sufixoRequerido: 'eira',
    palavraReal: 'marinheira',
    radicalGrafico: 'mar',
    vogalTematica: 'i',
    sufixoReal: 'nheira',
    explicacao: 'O radical "mar" com a terminação feminina "-eira" forma "marinheira".',
    classe: 'Substantivo',
    definicao: 'Mulher que atua em embarcações marinhas.',
  },
  // Sub + mar -> submarino
  {
    base: 'mar',
    prefixoRequerido: 'sub',
    sufixoRequerido: 'al',
    palavraReal: 'submarino',
    radicalGrafico: 'mar',
    vogalTematica: 'i',
    sufixoReal: 'no',
    explicacao: 'Prefixo "sub-" (abaixo) + radical "mar" + vogal de ligação "i" + "-no".',
    classe: 'Substantivo',
    definicao: 'Embarcação que navega sob a água.',
  },

  // Form + ção -> formação
  {
    base: 'form',
    sufixoRequerido: 'ção',
    palavraReal: 'formação',
    radicalGrafico: 'form',
    vogalTematica: 'a',
    sufixoReal: 'ção',
    explicacao: 'O radical "form" recebe a vogal temática "a" da 1ª conjugação antes do sufixo de ação "-ção".',
    classe: 'Substantivo de ação',
    definicao: 'Ato de formar; instrução ou constituição.',
  },
  // Re + form + a -> reforma
  {
    base: 'form',
    prefixoRequerido: 're',
    sufixoRequerido: 'a',
    palavraReal: 'reforma',
    radicalGrafico: 'form',
    vogalTematica: 'a',
    sufixoReal: null,
    explicacao: 'Derivação regressiva com prefixo "re-" e desinência temática "a".',
    classe: 'Substantivo',
    definicao: 'Renovação ou modificação benéfica.',
  },

  // Just + eza -> justiça
  {
    base: 'just',
    sufixoRequerido: 'eza',
    palavraReal: 'justiça',
    radicalGrafico: 'just',
    vogalTematica: 'i',
    sufixoReal: 'ça',
    explicacao: 'O radical "just" recebe a vogal temática "i" e a desinência nominal "-ça" (justiça).',
    classe: 'Substantivo abstrato',
    definicao: 'Princípio moral de retidão e equidade.',
  },

  // Leal + dade -> lealdade / deslealdade
  {
    base: 'leal',
    prefixoRequerido: 'des',
    sufixoRequerido: 'dade',
    palavraReal: 'deslealdade',
    radicalGrafico: 'leal',
    vogalTematica: null,
    sufixoReal: 'dade',
    explicacao: 'Prefixo de negação "des-" + radical "leal" + sufixo de qualidade "-dade".',
    classe: 'Substantivo abstrato',
    definicao: 'Ato ou comportamento desleal.',
  },
  {
    base: 'leal',
    prefixoRequerido: null,
    sufixoRequerido: 'dade',
    palavraReal: 'lealdade',
    radicalGrafico: 'leal',
    vogalTematica: null,
    sufixoReal: 'dade',
    explicacao: 'Radical "leal" diretamente unido ao sufixo abstrato "-dade".',
    classe: 'Substantivo abstrato',
    definicao: 'Qualidade ou virtude de quem é fiel.',
  },

  // Human + dade -> humanidade
  {
    base: 'human',
    sufixoRequerido: 'dade',
    palavraReal: 'humanidade',
    radicalGrafico: 'human',
    vogalTematica: 'i',
    sufixoReal: 'dade',
    explicacao: 'Recebe a vogal de ligação "i" entre o radical "human-" e o sufixo "-dade".',
    classe: 'Substantivo abstrato',
    definicao: 'O conjunto de todos os seres humanos; sentimento de compaixão.',
  },
  // Real + dade -> realidade
  {
    base: 'real',
    sufixoRequerido: 'dade',
    palavraReal: 'realidade',
    radicalGrafico: 'real',
    vogalTematica: 'i',
    sufixoReal: 'dade',
    explicacao: 'Recebe a vogal de ligação "i" entre a base "real" e o sufixo "-dade".',
    classe: 'Substantivo',
    definicao: 'A existência concreta dos fatos e coisas.',
  },

  // Ferr (Radical ferr-)
  {
    base: 'ferr',
    sufixoRequerido: 'ugem',
    palavraReal: 'ferrugem',
    radicalGrafico: 'ferr',
    vogalTematica: null,
    sufixoReal: 'ugem',
    explicacao: 'O radical "ferr-" recebe diretamente o sufixo "-ugem", indicando a camada avermelhada de oxidação do metal ferro.',
    classe: 'Substantivo',
    definicao: 'Camada avermelhada resultante da oxidação do ferro pelo ar e umidade.',
  },
  {
    base: 'ferr',
    sufixoRequerido: 'eiro',
    palavraReal: 'ferreiro',
    radicalGrafico: 'ferr',
    vogalTematica: null,
    sufixoReal: 'eiro',
    explicacao: 'Radical "ferr-" + sufixo de profissão/ofício "-eiro" = ferreiro.',
    classe: 'Substantivo de profissão',
    definicao: 'Artesão ou profissional que forja e molda o ferro na bigorna.',
  },
  {
    base: 'ferr',
    sufixoRequerido: 'eira',
    palavraReal: 'ferreira',
    radicalGrafico: 'ferr',
    vogalTematica: null,
    sufixoReal: 'eira',
    explicacao: 'Radical "ferr-" + sufixo feminino "-eira" = ferreira.',
    classe: 'Substantivo',
    definicao: 'Mulher que trabalha na forja de ferro ou oficina de ferraria.',
  },
  {
    base: 'ferr',
    vogalRequerida: 'o',
    palavraReal: 'ferro',
    radicalGrafico: 'ferr',
    vogalTematica: 'o',
    sufixoReal: null,
    explicacao: 'O radical invariante é "ferr-". Com a vogal temática "o", forma a primitiva "ferro".',
    classe: 'Substantivo',
    definicao: 'Metal resistente e abundante na natureza.',
  },

  // Pedr (Radical pedr-)
  {
    base: 'pedr',
    vogalRequerida: 'a',
    palavraReal: 'pedra',
    radicalGrafico: 'pedr',
    vogalTematica: 'a',
    sufixoReal: null,
    explicacao: 'O radical invariante é "pedr-". Com a vogal temática "a", forma a palavra primitiva "pedra".',
    classe: 'Substantivo',
    definicao: 'Matéria mineral dura e sólida da natureza; rocha.',
  },
  {
    base: 'pedr',
    sufixoRequerido: 'eiro',
    palavraReal: 'pedreiro',
    radicalGrafico: 'pedr',
    vogalTematica: null,
    sufixoReal: 'eiro',
    explicacao: 'Radical "pedr-" + sufixo ocupacional "-eiro" = pedreiro.',
    classe: 'Substantivo de profissão',
    definicao: 'Profissional da construção civil que constrói com pedras e tijolos.',
  },
  {
    base: 'pedr',
    sufixoRequerido: 'eira',
    palavraReal: 'pedreira',
    radicalGrafico: 'pedr',
    vogalTematica: null,
    sufixoReal: 'eira',
    explicacao: 'Radical "pedr-" + sufixo "-eira" = pedreira (local de extração de pedras).',
    classe: 'Substantivo de lugar',
    definicao: 'Local onde se extraem pedras ou trabalho árduo.',
  },
  {
    base: 'pedr',
    sufixoRequerido: 'egulho',
    palavraReal: 'pedregulho',
    radicalGrafico: 'pedr',
    vogalTematica: null,
    sufixoReal: 'egulho',
    explicacao: 'Radical "pedr-" + sufixo aumentativo/coletivo "-egulho" = pedregulho.',
    classe: 'Substantivo',
    definicao: 'Conjunto de pequenas pedras arredondadas.',
  },

  // Cas (Radical cas-)
  {
    base: 'cas',
    vogalRequerida: 'a',
    palavraReal: 'casa',
    radicalGrafico: 'cas',
    vogalTematica: 'a',
    sufixoReal: null,
    explicacao: 'Radical consonantal "cas-". Com a vogal temática "a", forma a palavra primitiva "casa".',
    classe: 'Substantivo',
    definicao: 'Construção destinada à moradia e abrigo familiar.',
  },
  {
    base: 'cas',
    sufixoRequerido: 'eiro',
    palavraReal: 'caseiro',
    radicalGrafico: 'cas',
    vogalTematica: null,
    sufixoReal: 'eiro',
    explicacao: 'Radical "cas-" + sufixo "-eiro" = caseiro.',
    classe: 'Substantivo/Adjetivo',
    definicao: 'Pessoa que cuida de uma casa de campo ou algo preparado em casa.',
  },
  {
    base: 'cas',
    sufixoRequerido: 'eira',
    palavraReal: 'caseira',
    radicalGrafico: 'cas',
    vogalTematica: null,
    sufixoReal: 'eira',
    explicacao: 'Radical "cas-" + sufixo "-eira" = caseira.',
    classe: 'Substantivo/Adjetivo',
    definicao: 'Mulher zeladora ou comida caseira feita em casa.',
  },

  // Port (Radical port-)
  {
    base: 'port',
    vogalRequerida: 'a',
    palavraReal: 'porta',
    radicalGrafico: 'port',
    vogalTematica: 'a',
    sufixoReal: null,
    explicacao: 'Radical "port-". Com a vogal temática "a", forma a palavra primitiva "porta".',
    classe: 'Substantivo',
    definicao: 'Abertura para entrada e saída de edifícios.',
  },
  {
    base: 'port',
    sufixoRequerido: 'eiro',
    palavraReal: 'porteiro',
    radicalGrafico: 'port',
    vogalTematica: null,
    sufixoReal: 'eiro',
    explicacao: 'Radical "port-" + sufixo de agente "-eiro" = porteiro.',
    classe: 'Substantivo de profissão',
    definicao: 'Profissional encarregado de vigiar a porta de entrada.',
  },
  {
    base: 'port',
    sufixoRequerido: 'eira',
    palavraReal: 'porteira',
    radicalGrafico: 'port',
    vogalTematica: null,
    sufixoReal: 'eira',
    explicacao: 'Radical "port-" + sufixo "-eira" = porteira (cercas rurais).',
    classe: 'Substantivo',
    definicao: 'Porta rústica de cercas em propriedades rurais.',
  },
  {
    base: 'port',
    sufixoRequerido: 'aria',
    palavraReal: 'portaria',
    radicalGrafico: 'port',
    vogalTematica: null,
    sufixoReal: 'aria',
    explicacao: 'Radical "port-" + sufixo locativo "-aria" = portaria.',
    classe: 'Substantivo de lugar',
    definicao: 'Local de entrada de um edifício onde fica a recepção.',
  },
  {
    base: 'port',
    sufixoRequerido: 'ês',
    palavraReal: 'português',
    radicalGrafico: 'port',
    vogalTematica: 'u',
    sufixoReal: 'guês',
    explicacao: 'Radical "port-" adaptado com o sufixo pátrio "-ês" e elemento de ligação "ugu" = português.',
    classe: 'Adjetivo pátrio',
    definicao: 'Natural de Portugal ou relativo à Língua Portuguesa.',
  },

  // Livr (Radical livr-)
  {
    base: 'livr',
    vogalRequerida: 'o',
    palavraReal: 'livro',
    radicalGrafico: 'livr',
    vogalTematica: 'o',
    sufixoReal: null,
    explicacao: 'Radical invariante "livr-". Com a vogal temática "o", forma a palavra primitiva "livro".',
    classe: 'Substantivo',
    definicao: 'Conjunto de folhas encadernadas com texto.',
  },
  {
    base: 'livr',
    sufixoRequerido: 'eiro',
    palavraReal: 'livreiro',
    radicalGrafico: 'livr',
    vogalTematica: null,
    sufixoReal: 'eiro',
    explicacao: 'Radical "livr-" + sufixo de profissão "-eiro" = livreiro.',
    classe: 'Substantivo',
    definicao: 'Pessoa que comercializa ou cuida de livros.',
  },
  {
    base: 'livr',
    sufixoRequerido: 'eira',
    palavraReal: 'livreira',
    radicalGrafico: 'livr',
    vogalTematica: null,
    sufixoReal: 'eira',
    explicacao: 'Radical "livr-" + sufixo "-eira" = livreira.',
    classe: 'Substantivo',
    definicao: 'Mulher que comercializa livros.',
  },
  {
    base: 'livr',
    sufixoRequerido: 'aria',
    palavraReal: 'livraria',
    radicalGrafico: 'livr',
    vogalTematica: null,
    sufixoReal: 'aria',
    explicacao: 'Radical "livr-" + sufixo locativo/comércio "-aria" = livraria.',
    classe: 'Substantivo de lugar',
    definicao: 'Estabelecimento comercial dedicado à venda de livros.',
  },

  // Músic (Radical músic- / music-) - Fenômeno de Opacidade Fonológica (Carlisle)
  {
    base: 'músic',
    sufixoRequerido: 'ista',
    palavraReal: 'musicista',
    radicalGrafico: 'music',
    vogalTematica: null,
    sufixoReal: 'ista',
    explicacao: 'Atenção Fonoaudiológica (Opacidade Fonológica por Deslocamento de Acento Tônico - Joanne Carlisle): A base "músico" é proparoxítona (/’mu.zi.ku/) com acento agudo. Ao receber o sufixo "-ista", o acento tônico se desloca para a penúltima sílaba (/mu.zi’sis.tɐ/), paroxítona, e a palavra perde o acento gráfico, tornando-se "musicista"!',
    classe: 'Substantivo de profissão',
    definicao: 'Intérprete ou executante virtuoso da música.',
  },
  {
    base: 'music',
    sufixoRequerido: 'ista',
    palavraReal: 'musicista',
    radicalGrafico: 'music',
    vogalTematica: null,
    sufixoReal: 'ista',
    explicacao: 'Atenção Fonoaudiológica (Opacidade Fonológica de Joanne Carlisle): Deslocamento de acento tônico e perda de acento gráfico de "músico" para "musicista".',
    classe: 'Substantivo de profissão',
    definicao: 'Intérprete ou executante virtuoso da música.',
  },
  {
    base: 'músic',
    sufixoRequerido: 'al',
    palavraReal: 'musical',
    radicalGrafico: 'music',
    vogalTematica: null,
    sufixoReal: 'al',
    explicacao: 'Radical "music-" sem acento gráfico ao receber o sufixo oxítono "-al" = musical.',
    classe: 'Adjetivo',
    definicao: 'Relativo à música ou com harmonia sonora.',
  },
  {
    base: 'músic',
    vogalRequerida: 'o',
    palavraReal: 'músico',
    radicalGrafico: 'músic',
    vogalTematica: 'o',
    sufixoReal: null,
    explicacao: 'Palavra proparoxítona primitiva "músico" com acento agudo no "u".',
    classe: 'Substantivo',
    definicao: 'Pessoa que toca ou compõe música.',
  },
  {
    base: 'músic',
    vogalRequerida: 'a',
    palavraReal: 'música',
    radicalGrafico: 'músic',
    vogalTematica: 'a',
    sufixoReal: null,
    explicacao: 'Palavra proparoxítona primitiva "música" com acento agudo no "u".',
    classe: 'Substantivo',
    definicao: 'Arte de combinar sons melodiosos.',
  }
];

/**
 * Analisa a combinação de Afixos + Base e aplica alomorfia legítima em Português
 */
export function analisarMorfologia(
  base: string,
  prefixo: string | null,
  sufixo1: string | null,
  sufixo2: string | null,
  vogalManual?: string | null
): WordAnalysis {
  let baseNorm = base.toLowerCase().trim();
  if (baseNorm === 'terra') baseNorm = 'terr';

  const prefNorm = prefixo ? prefixo.toLowerCase().trim() : null;
  const suf1Norm = sufixo1 ? sufixo1.toLowerCase().trim() : null;
  const suf2Norm = sufixo2 ? sufixo2.toLowerCase().trim() : null;
  const vogalNorm = vogalManual ? vogalManual.toLowerCase().trim() : null;

  const rawClean = `${prefNorm || ''}${baseNorm}${vogalNorm || ''}${suf1Norm || ''}${suf2Norm || ''}`;

  // Procura regra de adaptação morfofonológica
  const regra = REGRAS_ALOMORFIA.find((r) => {
    if (r.base !== baseNorm) return false;
    if (r.prefixoRequerido !== undefined) {
      if (r.prefixoRequerido === null && prefNorm) return false;
      if (r.prefixoRequerido !== null && prefNorm !== r.prefixoRequerido) return false;
    }
    if (r.vogalRequerida !== undefined) {
      if (r.vogalRequerida === null && vogalNorm) return false;
      if (r.vogalRequerida !== null && vogalNorm !== r.vogalRequerida) return false;
    }
    if (r.sufixoRequerido && suf1Norm !== r.sufixoRequerido && suf2Norm !== r.sufixoRequerido) {
      return false;
    }
    return true;
  });

  if (regra) {
    return {
      palavraFinal: regra.palavraReal,
      palavraConcatenadaCrua: rawClean,
      houveModificacao: regra.palavraReal.toLowerCase() !== rawClean,
      explicacaoModificacao: regra.explicacao,
      prefixo: prefNorm,
      radical: regra.radicalGrafico,
      vogalTematica: vogalNorm || regra.vogalTematica,
      sufixo1: regra.sufixoReal,
      sufixo2: suf2Norm && suf2Norm !== regra.sufixoReal ? suf2Norm : null,
      classeGramatical: regra.classe,
      definicao: regra.definicao,
    };
  }

  // Trata construções enriquecidas com a vogal temática manual
  if (vogalNorm) {
    // Ex: dent + i + ção = dentição
    if (baseNorm === 'dent' && vogalNorm === 'i' && suf1Norm === 'ção') {
      return {
        palavraFinal: 'dentição',
        palavraConcatenadaCrua: 'dentição',
        houveModificacao: false,
        prefixo: prefNorm,
        radical: 'dent',
        vogalTematica: 'i',
        sufixo1: 'ção',
        sufixo2: suf2Norm,
        classeGramatical: 'Substantivo',
        definicao: 'Conjunto ou processo de nascimento e desenvolvimento dos dentes.',
      };
    }
    // Ex: terr + a = terra
    if (baseNorm === 'terr' && vogalNorm === 'a' && !suf1Norm) {
      return {
        palavraFinal: 'terra',
        palavraConcatenadaCrua: 'terra',
        houveModificacao: false,
        prefixo: prefNorm,
        radical: 'terr',
        vogalTematica: 'a',
        sufixo1: null,
        sufixo2: null,
        classeGramatical: 'Substantivo',
        definicao: 'Solo cultivável, chão firme ou o planeta Terra.',
      };
    }
    // Ex: flor + e + ira = floreira
    if (baseNorm === 'flor' && vogalNorm === 'e' && (suf1Norm === 'ira' || suf1Norm === 'eira')) {
      return {
        palavraFinal: 'floreira',
        palavraConcatenadaCrua: 'floreira',
        houveModificacao: false,
        prefixo: prefNorm,
        radical: 'flor',
        vogalTematica: 'e',
        sufixo1: 'ira',
        sufixo2: suf2Norm,
        classeGramatical: 'Substantivo',
        definicao: 'Vaso ou suporte ornamental para colocar flores.',
      };
    }
    // Ex: form + a + ção = formação
    if (baseNorm === 'form' && vogalNorm === 'a' && suf1Norm === 'ção') {
      return {
        palavraFinal: 'formação',
        palavraConcatenadaCrua: 'formação',
        houveModificacao: false,
        prefixo: prefNorm,
        radical: 'form',
        vogalTematica: 'a',
        sufixo1: 'ção',
        sufixo2: suf2Norm,
        classeGramatical: 'Substantivo',
        definicao: 'Ato de formar; instrução ou constituição.',
      };
    }
    // Ex: ativ + a + ção = ativação
    if (baseNorm === 'ativ' && vogalNorm === 'a' && suf1Norm === 'ção') {
      return {
        palavraFinal: 'ativação',
        palavraConcatenadaCrua: 'ativação',
        houveModificacao: false,
        prefixo: prefNorm,
        radical: 'ativ',
        vogalTematica: 'a',
        sufixo1: 'ção',
        sufixo2: suf2Norm,
        classeGramatical: 'Substantivo',
        definicao: 'Ato de ativar ou estimular.',
      };
    }
    // Ex: bel + e + za = beleza
    if (baseNorm === 'bel' && vogalNorm === 'e' && (suf1Norm === 'za' || suf1Norm === 'eza')) {
      return {
        palavraFinal: 'beleza',
        palavraConcatenadaCrua: 'beleza',
        houveModificacao: false,
        prefixo: prefNorm,
        radical: 'bel',
        vogalTematica: 'e',
        sufixo1: 'za',
        sufixo2: suf2Norm,
        classeGramatical: 'Substantivo',
        definicao: 'Qualidade daquilo que agrada pela harmonia.',
      };
    }

    return {
      palavraFinal: rawClean,
      palavraConcatenadaCrua: rawClean,
      houveModificacao: false,
      prefixo: prefNorm,
      radical: baseNorm,
      vogalTematica: vogalNorm,
      sufixo1: suf1Norm,
      sufixo2: suf2Norm,
    };
  }

  // Decomposição padrão heurística
  let radicalPadrao = baseNorm;
  let vogalTematicaPadrao: string | null = null;
  let sufixoPadrao = suf1Norm;

  if (suf1Norm === 'dade' && !baseNorm.endsWith('i')) {
    vogalTematicaPadrao = 'i';
  } else if (suf1Norm === 'mente' && (baseNorm.endsWith('a') || baseNorm.endsWith('o'))) {
    vogalTematicaPadrao = 'a';
    radicalPadrao = baseNorm.slice(0, -1);
  } else if (suf1Norm && ['a', 'e', 'i', 'o', 'u'].includes(suf1Norm[0]) && ['a', 'e', 'o'].includes(baseNorm.slice(-1))) {
    radicalPadrao = baseNorm.slice(0, -1);
  }

  return {
    palavraFinal: rawClean,
    palavraConcatenadaCrua: rawClean,
    houveModificacao: false,
    prefixo: prefNorm,
    radical: radicalPadrao,
    vogalTematica: vogalTematicaPadrao,
    sufixo1: sufixoPadrao,
    sufixo2: suf2Norm,
  };
}
