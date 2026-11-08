/**
 * Base de Conhecimento Morfológico em Língua Portuguesa
 * Fundamentada na Ciência da Leitura e no Modelo Multidimensional de Consciência Morfológica
 * e estudos de aquisição derivacional na Fonoaudiologia.
 */

export type GrauTransparencia =
  | 'transparente'           // Carlisle Nível 1: Fonológica e Ortograficamente Transparente (ex: flor / florista, port / porteiro, mar / marinho)
  | 'opacidade_fonologica'   // Carlisle Nível 2: Deslocamento de Acento Tônico ou Timbre (ex: músico / musicista, dúvida / duvidoso, fábrica / fabricação)
  | 'opacidade_alomorfica'   // Carlisle Nível 3: Alomorfia Grafofonêmica do Radical (ex: infeliz / infelicidade, luz / lucidez, pão / padeiro, ferr / ferrugem)
  | 'opacidade_etimologica'  // Carlisle Nível 4: Raiz Erudita Greco-Latina Supletiva (ex: noite / noturno, olho / ocular, cidade / urbano)
  | 'distrator_fonologico';  // Distrator Fonológico / Falso Cognato (ex: sapato / sapa, mar / martelo, pato / patologia)

export interface PresetBase {
  id: string;
  base: string;
  significado: string;
  categoria: 'cotidiano' | 'derivacional' | 'cientifico';
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  classeGramatical: 'substantivo' | 'adjetivo' | 'verbo' | 'raiz';
  dicaFono: string;
  derivacoesComuns: string[];
  grauTransparencia?: GrauTransparencia;
  exemploTransparencia?: string;
}

export interface AfixoItem {
  afixo: string;
  tipo: 'prefixo' | 'sufixo';
  significado: string;
  classeResultante?: string;
  exemplo: string;
  dicaClinica: string;
}

export interface PalavraValida {
  palavra: string;
  base: string;
  prefixo?: string;
  vogalTematica?: string | null;
  sufixo1?: string;
  sufixo2?: string;
  classe: 'substantivo' | 'adjetivo' | 'verbo' | 'advérbio';
  definicao: string;
  exemploUso: string;
}

export interface DecomposicaoItem {
  id: string;
  palavra: string;
  prefixo: string | null;
  radical: string;
  sufixo1: string | null;
  sufixo2: string | null;
  significado: string;
  dica: string;
}

export interface ParentescoItem {
  id: string;
  palavraBase: string;
  palavraCandidata: string;
  temParentesco: boolean;
  explicacao: string;
  tipo: 'derivacao_real' | 'distrator_fonologico' | 'pseudomorfema';
  grauTransparencia: GrauTransparencia;
  detalheClinicoTransparencia?: string;
}

export interface FechamentoSintaticoOpcao {
  texto: string;
  classe: string;
  sufixo: string;
  correta: boolean;
  prefixo?: string | null;
  radical?: string;
  vogalTematica?: string | null;
  sufixo1?: string | null;
}

export interface FechamentoSintaticoItem {
  id: string;
  fraseComLacuna: string;
  baseOriginal: string;
  opcoes: FechamentoSintaticoOpcao[];
  respostaCorreta: string;
  justificativaSintatica: string;
}

// -------------------------------------------------------------
// 1. BASES E RADICAIS PRÉ-SELECIONADOS (Categorizados por Nível)
// -------------------------------------------------------------
export const PRESET_BASES: PresetBase[] = [
  // Nível 1: Cotidiano e Concreto (Iniciante - 1º ao 3º ano / Fase Inicial)
  {
    id: 'base-flor',
    base: 'flor',
    significado: 'Parte reprodutiva e perfumada das plantas / vegetação',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'flor -> florista (relação fonológica e ortográfica 100% transparente)',
    dicaFono: 'Clássico exemplo de relação morfológica transparente (Joanne Carlisle): o radical "flor" mantém som e grafia idênticos em florista, floreira, etc.',
    derivacoesComuns: ['florista', 'floreira', 'floreiro', 'florescer', 'reflorestar', 'desflorestar', 'florestal', 'florzinha']
  },
  {
    id: 'base-terr',
    base: 'terr',
    significado: 'Solo, terra cultivável, chão ou planeta (família de terra)',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'opacidade_alomorfica',
    exemploTransparencia: 'terr + a = terra; terr + estre = terrestre (alomorfia do radical)',
    dicaFono: 'O radical invariante é "terr-". Com a vogal temática "a" forma a primitiva "terra"; com afixos forma "terrestre", "terreno", "subterrâneo", "aterrar", "enterrar", "terreiro".',
    derivacoesComuns: ['terra', 'terrestre', 'subterrâneo', 'terreno', 'aterrar', 'enterrar', 'terreiro', 'terremoto']
  },
  {
    id: 'base-pedr',
    base: 'pedr',
    significado: 'Matéria mineral dura e sólida da natureza; rocha',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'pedr + a = pedra; pedr + eiro = pedreiro',
    dicaFono: 'Radical invariante "pedr-". Com a vogal temática "a" forma "pedra"; com sufixos forma "pedreiro", "pedreira", "pedregulho", "empedrar".',
    derivacoesComuns: ['pedra', 'pedreiro', 'pedreira', 'pedregulho', 'empedrar', 'pedrada', 'pedrinha']
  },
  {
    id: 'base-cas',
    base: 'cas',
    significado: 'Construção destinada a moradia / abrigo familiar',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'cas + a = casa; cas + eiro = caseiro',
    dicaFono: 'Radical consonantal "cas-". Com a vogal temática "a" forma "casa"; com sufixos forma "caseiro", "caseira", "casarão", "casinha", "casamento".',
    derivacoesComuns: ['casa', 'caseiro', 'caseira', 'casarão', 'casinha', 'casamento', 'descasar']
  },
  {
    id: 'base-mar',
    base: 'mar',
    significado: 'Grande massa de água salgada',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'mar -> marinheiro, marinho (radical transparente)',
    dicaFono: 'Ajuda a diferenciar relações morfológicas reais (marítimo, marinheiro) de falsos cognatos (martelo).',
    derivacoesComuns: ['marinheiro', 'marinheira', 'marítimo', 'marina', 'maremoto', 'submarino', 'marinho']
  },
  {
    id: 'base-livr',
    base: 'livr',
    significado: 'Obra impressa ou manuscrita em folhas encadernadas',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'livr + o = livro; livr + eiro = livreiro; livr + aria = livraria',
    dicaFono: 'Radical invariante "livr-". Com a vogal temática "o" forma "livro"; com sufixos forma "livraria", "livreiro", "livrinho". Distinguir do falso amigo "livre" (liberdade).',
    derivacoesComuns: ['livro', 'livreiro', 'livreira', 'livraria', 'livrinho', 'livreco']
  },
  {
    id: 'base-ferr',
    base: 'ferr',
    significado: 'Metal maleável e resistente / instrumento de ferro',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'opacidade_alomorfica',
    exemploTransparencia: 'ferr + o = ferro; ferr + ugem = ferrugem; ferr + eiro = ferreiro',
    dicaFono: 'Radical "ferr-". Com vogal "o" forma "ferro"; com o sufixo "-ugem" forma "ferrugem"; com "-eiro" forma "ferreiro"; com "-agem" forma "ferragem" e "-adura" em "ferradura".',
    derivacoesComuns: ['ferro', 'ferrugem', 'ferreiro', 'ferreira', 'ferragem', 'ferradura', 'enferrujar', 'ferroso']
  },
  {
    id: 'base-port',
    base: 'port',
    significado: 'Abertura para entrada e saída de edifícios / passagem',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'port + a = porta; port + eiro = porteiro; port + aria = portaria',
    dicaFono: 'Radical "port-". Com a vogal "a" forma "porta"; com sufixos forma "porteiro", "porteira", "portaria", "portão", "portinhola". Com sufixo pátrio forma "português".',
    derivacoesComuns: ['porta', 'porteiro', 'porteira', 'portaria', 'portão', 'portinhola', 'português']
  },
  {
    id: 'base-dente',
    base: 'dent',
    significado: 'Estrutura dura na boca usada na mastigação',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'dent + i + ção = dentição; dent + ista = dentista',
    dicaFono: 'Excelente para trabalhar vogal de ligação: "dent" + "i" + "ção" = dentição; "dent" + "ista" = dentista; "dental", "dentadura".',
    derivacoesComuns: ['dentição', 'dentista', 'dentadura', 'dental', 'desdentado', 'dentinho']
  },
  {
    id: 'base-sol',
    base: 'sol',
    significado: 'Estrela central do nosso sistema / claridade e calor',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'sol -> solar, ensolarado',
    dicaFono: 'Base monossilábica de alta produtividade com prefixação (antissolar, insolado) e sufixação (solar, ensolarado).',
    derivacoesComuns: ['solar', 'ensolarado', 'antissolar', 'insolado', 'solzinho']
  },
  {
    id: 'base-vento',
    base: 'vent',
    significado: 'Ar em movimento natural',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'vent + o = vento; vent + ania = ventania',
    dicaFono: 'Permite explorar o sufixo coletivo/intensivo -ania (ventania) e o adjetivo -oso (ventoso).',
    derivacoesComuns: ['ventania', 'ventoso', 'ventilar', 'ventilador', 'reventar']
  },
  {
    id: 'base-papel',
    base: 'papel',
    significado: 'Material fino feito de fibras vegetais para escrita',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'substantivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'papel -> papelaria, papeleiro',
    dicaFono: 'Facilita ensinar o sufixo de estabelecimento/local (-aria: papelaria) e agente (-eiro: papeleiro).',
    derivacoesComuns: ['papelaria', 'papeleiro', 'papeleira', 'papelão', 'empapelar', 'papelada']
  },
  {
    id: 'base-bel',
    base: 'bel',
    significado: 'Que tem beleza, harmonia e agrada aos sentidos',
    categoria: 'cotidiano',
    nivel: 'iniciante',
    classeGramatical: 'adjetivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'bel + o = belo; bel + eza = beleza',
    dicaFono: 'Trabalha a transformação de adjetivo em substantivo abstrato com -eza (beleza) e verbo com -eza/-ecer.',
    derivacoesComuns: ['beleza', 'embelezar', 'embelezamento', 'belíssimo', 'belamente']
  },

  // Nível 2: Produtividade Derivacional e Metalinguística (Intermediário - 4º ao 6º ano)
  {
    id: 'base-musico',
    base: 'músic',
    significado: 'Arte dos sons, melodia e harmonia / profissional da música',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'substantivo',
    grauTransparencia: 'opacidade_fonologica',
    exemploTransparencia: 'músico (proparoxítona) -> musicista (paroxítona, perda do acento agudo)',
    dicaFono: 'Caso paradigmático da fonoaudiologia americana (Joanne Carlisle): a base "músico" é proparoxítona com acento agudo; ao receber "-ista", torna-se "musicista", paroxítona, perdendo o acento gráfico e alterando o ritmo silábico.',
    derivacoesComuns: ['músico', 'música', 'musicista', 'musical', 'musicalidade', 'musicologia']
  },
  {
    id: 'base-duvida',
    base: 'dúvid',
    significado: 'Incerteza, estado de hesitação ou questionamento reflexivo',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'substantivo',
    grauTransparencia: 'opacidade_fonologica',
    exemploTransparencia: 'dúvida (proparoxítona) -> duvidoso (paroxítona, perda do acento)',
    dicaFono: 'Opacidade fonológica com deslocamento de acento tônico (stress shift): a proparoxítona "dúvida" perde o acento ao formar o adjetivo "duvidoso" e o verbo "duvidar".',
    derivacoesComuns: ['dúvida', 'duvidoso', 'duvidar', 'indubitável', 'duvidosamente']
  },
  {
    id: 'base-fabrica',
    base: 'fábric',
    significado: 'Estabelecimento industrial de manufatura ou produção',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'substantivo',
    grauTransparencia: 'opacidade_fonologica',
    exemploTransparencia: 'fábrica (proparoxítona) -> fabricação (oxítona), fabricante (paroxítona)',
    dicaFono: 'Opacidade fonológica por deslocamento métrico: a raiz proparoxítona "fábrica" perde o acento ao derivar "fabricação" e "fabricante".',
    derivacoesComuns: ['fábrica', 'fabricação', 'fabricante', 'fabricar', 'pré-fabricado']
  },
  {
    id: 'base-feliz',
    base: 'feliz',
    significado: 'Sentimento de contentamento e bem-estar',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'adjetivo',
    grauTransparencia: 'opacidade_alomorfica',
    exemploTransparencia: 'feliz + dade = felicidade / infelicidade (z vira c)',
    dicaFono: 'Clássico na intervenção morfológica: combina prefixo de oposição (in-feliz) com alomorfia ortográfica (z -> c) antes de -idade (felicidade, infelicidade).',
    derivacoesComuns: ['infeliz', 'felizmente', 'infelizmente', 'felicidade', 'infelicidade']
  },
  {
    id: 'base-luz',
    base: 'luz',
    significado: 'Radiação eletromagnética visível que ilumina os objetos',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'substantivo',
    grauTransparencia: 'opacidade_alomorfica',
    exemploTransparencia: 'luz -> lucidez (z vira c), luminoso (raiz lumin-)',
    dicaFono: 'Apresenta alomorfia ortográfica (z -> c em lucidez) e reativação da raiz etimológica latina (lumin- em luminoso, iluminação).',
    derivacoesComuns: ['lucidez', 'luminoso', 'iluminar', 'luzir', 'reluzente']
  },
  {
    id: 'base-pao',
    base: 'pão',
    significado: 'Alimento básico de farinha e água fermentada',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'substantivo',
    grauTransparencia: 'opacidade_alomorfica',
    exemploTransparencia: 'pão -> padeiro, panificação (raiz arcaica/latina pan-)',
    dicaFono: 'Opacidade alomórfica marcante: o ditongo nasal "-ão" resgata a raiz histórica "pan-" e a forma "padeir-" em padeiro e panificadora.',
    derivacoesComuns: ['pão', 'padeiro', 'padeira', 'padaria', 'panificação', 'panetone']
  },
  {
    id: 'base-noite',
    base: 'noit',
    significado: 'Período entre o pôr do sol e o amanhecer / escuridão',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'substantivo',
    grauTransparencia: 'opacidade_etimologica',
    exemploTransparencia: 'noite -> noitada (transparente) vs noturno (opacidade etimológica culta)',
    dicaFono: 'Excelente para contrastar transparência (noite -> anoitecer, noitada) com opacidade erudita da raiz latina noct- (noturno, noctívago).',
    derivacoesComuns: ['anoitecer', 'noitada', 'noturno', 'noitinha', 'pernoitar']
  },
  {
    id: 'base-ativ',
    base: 'ativ',
    significado: 'Que age, opera ou está em funcionamento',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'adjetivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'ativ + ar = ativar; ativ + idade = atividade',
    dicaFono: 'Rico em sufixos múltiplos (ativ-ar, ativ-idade, des-ativ-ação, in-ativ-o).',
    derivacoesComuns: ['ativar', 'atividade', 'desativar', 'desativação', 'reativar', 'inativo', 'ativamente']
  },
  {
    id: 'base-form',
    base: 'form',
    significado: 'Aspecto exterior, molde, estrutura organizada',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'raiz',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'form + a = forma; form + ação = formação',
    dicaFono: 'Alta produtividade prefixal: trans-, re-, con-, in-, de- (transformação, reforma, conformar).',
    derivacoesComuns: ['formar', 'formação', 'reforma', 'reformatar', 'deformar', 'conformidade', 'transformar']
  },
  {
    id: 'base-just',
    base: 'just',
    significado: 'Conforme à lei, à equidade ou à razão',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'adjetivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'just + o = justo; in + just + o = injusto',
    dicaFono: 'Ótimo para discutir significado de afixos: in- (injusto, injustiça) e -ificar (justificar).',
    derivacoesComuns: ['justiça', 'injusto', 'injustiça', 'justificar', 'justificativa', 'justamente']
  },
  {
    id: 'base-leal',
    base: 'leal',
    significado: 'Fiel aos seus compromissos, sincero e digno',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'adjetivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'leal -> lealdade, desleal',
    dicaFono: 'Demonstra a prefixação com des- (desleal) e a sufixação com -dade (lealdade, deslealdade).',
    derivacoesComuns: ['lealdade', 'desleal', 'deslealdade', 'lealmente', 'deslealmente']
  },
  {
    id: 'base-human',
    base: 'human',
    significado: 'Relativo à espécie humana, à empatia ou sensibilidade',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'adjetivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'human + o = humano; human + izar = humanizar',
    dicaFono: 'Envolve prefixos (desumano, inumano) e sufixos eruditos (-idade, -itário, -izar: humanizar).',
    derivacoesComuns: ['humanidade', 'humano', 'desumano', 'humanizar', 'humanitário', 'humanismo']
  },
  {
    id: 'base-cant',
    base: 'cant',
    significado: 'Emitir sons musicais com a voz',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'verbo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'cant + ar = cantar; cant + or = cantor',
    dicaFono: 'Derivação deverbal típica: cantar -> cantor (agente), canção (ação/resultado), cantarolar.',
    derivacoesComuns: ['cantar', 'cantor', 'cantora', 'canção', 'cantarolar', 'encantar', 'desencanto']
  },
  {
    id: 'base-real',
    base: 'real',
    significado: 'Que existe de fato, verdadeiro / relativo à realeza',
    categoria: 'derivacional',
    nivel: 'intermediario',
    classeGramatical: 'adjetivo',
    grauTransparencia: 'transparente',
    exemploTransparencia: 'real -> realidade, realizar',
    dicaFono: 'Permite estudar polissemia e afixos: real -> realidade, realizar, irreal, realização.',
    derivacoesComuns: ['realidade', 'realizar', 'realização', 'irreal', 'irrealizável', 'realmente']
  },

  // Nível 3: Morfologia Científica & Raízes Greco-Latinas (Avançado - Morfologia Gerativa e Vocabulário Acadêmico)
  {
    id: 'base-bio',
    base: 'bio',
    significado: 'Radical grego que significa "vida"',
    categoria: 'cientifico',
    nivel: 'avancado',
    classeGramatical: 'raiz',
    dicaFono: 'Favorece o vocabulário acadêmico e a morfologia composicional (biologia, biografia, biosfera).',
    derivacoesComuns: ['biologia', 'biológico', 'biografia', 'antibiótico', 'biodiversidade', 'bioma']
  },
  {
    id: 'base-graf',
    base: 'graf',
    significado: 'Radical grego que significa "escrita", "registro" ou "descrição"',
    categoria: 'cientifico',
    nivel: 'avancado',
    classeGramatical: 'raiz',
    dicaFono: 'Permite trabalhar ortografia, orto-grafia, foto-grafia, tele-grafia e cali-grafia.',
    derivacoesComuns: ['grafia', 'ortografia', 'fotografia', 'biografia', 'geografia', 'gráfico']
  },
  {
    id: 'base-fono',
    base: 'fono',
    significado: 'Radical grego que significa "som" ou "voz"',
    categoria: 'cientifico',
    nivel: 'avancado',
    classeGramatical: 'raiz',
    dicaFono: 'Especialmente relevante na Fonoaudiologia: fonoaudiologia, telefone, microfone, afonia, sinfonia.',
    derivacoesComuns: ['fonoaudiologia', 'telefone', 'microfone', 'afonia', 'sinfonia', 'fonética']
  },
  {
    id: 'base-cron',
    base: 'cron',
    significado: 'Radical grego que significa "tempo"',
    categoria: 'cientifico',
    nivel: 'avancado',
    classeGramatical: 'raiz',
    dicaFono: 'Promove a compreensão de palavras complexas: cronômetro, crônica, sincronizar, anacrônico.',
    derivacoesComuns: ['cronologia', 'cronômetro', 'sincronizar', 'anacrônico', 'crônica']
  },
  {
    id: 'base-termo',
    base: 'termo',
    significado: 'Radical grego que significa "calor" ou "temperatura"',
    categoria: 'cientifico',
    nivel: 'avancado',
    classeGramatical: 'raiz',
    dicaFono: 'Ensina a reconhecer o significado constante em contextos científicos: termômetro, térmico, termostato.',
    derivacoesComuns: ['termômetro', 'térmico', 'termostato', 'isotérmico', 'geotérmico']
  },
  {
    id: 'base-hidr',
    base: 'hidr',
    significado: 'Radical grego que significa "água"',
    categoria: 'cientifico',
    nivel: 'avancado',
    classeGramatical: 'raiz',
    dicaFono: 'Excelente para des- (desidratação), re- (reidratar) e sufixação adjetiva (hídrico).',
    derivacoesComuns: ['hidratação', 'desidratação', 'reidratar', 'hídrico', 'hidrografia', 'hidrelétrica']
  }
];

// -------------------------------------------------------------
// 2. AFIXOS DETALHADOS COM METADADOS SEMÂNTICOS E GRAMATICAIS
// -------------------------------------------------------------
export const PREFIXOS_CATALOGO: AfixoItem[] = [
  {
    afixo: 'des',
    tipo: 'prefixo',
    significado: 'Negação, ação inversa, privação ou afastamento',
    exemplo: 'desleal, desativar, descongelar',
    dicaClinica: 'Indica desfazer uma ação ou o oposto direto de uma qualidade.'
  },
  {
    afixo: 'in',
    tipo: 'prefixo',
    significado: 'Negação ou privação (torna-se "im" antes de p/b, ou "i" antes de l/r)',
    exemplo: 'infeliz, invisível, inativo',
    dicaClinica: 'Prefixo de negação mais frequente em português para adjetivos.'
  },
  {
    afixo: 'im',
    tipo: 'prefixo',
    significado: 'Variante de "in-" antes das consoantes bilabiais P e B',
    exemplo: 'impossível, imperfeito, imbatível',
    dicaClinica: 'Excelente para trabalhar a regra ortográfica fonológica (m antes de p e b).'
  },
  {
    afixo: 're',
    tipo: 'prefixo',
    significado: 'Repetição, retorno ao estado anterior ou intensidade',
    exemplo: 'refazer, reativar, reflorestar, reorganizar',
    dicaClinica: 'Muito produtivo na linguagem infantil para expressar repetição ("fazer de novo").'
  },
  {
    afixo: 'anti',
    tipo: 'prefixo',
    significado: 'Oposição direta, combate ou contraposição',
    exemplo: 'antivírus, antissocial, antialérgico',
    dicaClinica: 'Importante para vocabulário científico e da saúde.'
  },
  {
    afixo: 'contra',
    tipo: 'prefixo',
    significado: 'Posição oposta, contrariedade ou reação',
    exemplo: 'contraindicação, contra-ataque, contragolpe',
    dicaClinica: 'Trabalha a ideia relacional de direção contrária.'
  },
  {
    afixo: 'sub',
    tipo: 'prefixo',
    significado: 'Abaixo, sob, posição inferior ou menor intensidade',
    exemplo: 'subterrâneo, submarino, sublinhar',
    dicaClinica: 'Prefixo de valor espacial muito útil para conexões conceituais.'
  },
  {
    afixo: 'super',
    tipo: 'prefixo',
    significado: 'Acima, além, excesso, grau muito elevado',
    exemplo: 'superaquecer, superpoder, supermercado',
    dicaClinica: 'Muito motivador para crianças na fase de expansão vocabular.'
  },
  {
    afixo: 'pré',
    tipo: 'prefixo',
    significado: 'Anterioridade no tempo ou no espaço (antes de)',
    exemplo: 'pré-aquecer, pré-escola, pré-história',
    dicaClinica: 'Trabalha a noção temporal de anterioridade.'
  },
  {
    afixo: 'a',
    tipo: 'prefixo',
    significado: 'Privação, ausência (grego) ou aproximação (latino)',
    exemplo: 'anormal, atípico, afonia',
    dicaClinica: 'Ensina a identificar a perda de uma qualidade.'
  }
];

export const SUFIXOS_CATALOGO: AfixoItem[] = [
  // Nominalizadores (formam substantivos)
  {
    afixo: 'eza',
    tipo: 'sufixo',
    significado: 'Estado, qualidade ou condição abstrata (de adjetivos)',
    classeResultante: 'Substantivo abstrato',
    exemplo: 'belo -> beleza, nobre -> nobreza',
    dicaClinica: 'Dica ortográfica fonoaudiológica: sufixo de adjetivo vira substantivo com Z.'
  },
  {
    afixo: 'dade',
    tipo: 'sufixo',
    significado: 'Qualidade ou estado derivado de adjetivo (-idade)',
    classeResultante: 'Substantivo abstrato',
    exemplo: 'leal -> lealdade, feliz -> felicidade',
    dicaClinica: 'Fundamental para mudança de classe gramatical e consciência morfossintática.'
  },
  {
    afixo: 'ção',
    tipo: 'sufixo',
    significado: 'Ação ou o resultado de uma ação verbal',
    classeResultante: 'Substantivo de ação',
    exemplo: 'formar -> formação, ativar -> ativação',
    dicaClinica: 'Excelente para derivar substantivos a partir de verbos.'
  },
  {
    afixo: 'ista',
    tipo: 'sufixo',
    significado: 'Profissão, ocupação, seguidor ou especialista',
    classeResultante: 'Substantivo de agente',
    exemplo: 'dente -> dentista, flor -> florista, arte -> artista',
    dicaClinica: 'Altamente transparente e intuitivo para crianças.'
  },
  {
    afixo: 'eiro',
    tipo: 'sufixo',
    significado: 'Ofício, ocupação masculina, objeto contentor ou árvore frutífera',
    classeResultante: 'Substantivo',
    exemplo: 'mar -> marinheiro, papel -> papeleiro, flor -> floreiro, terra -> terreiro',
    dicaClinica: 'Muito comum em profissões tradicionais, utensílios e derivados de solo.'
  },
  {
    afixo: 'eira',
    tipo: 'sufixo',
    significado: 'Objeto contentor, profissão feminina ou árvore/planta frutífera',
    classeResultante: 'Substantivo',
    exemplo: 'flor -> floreira, papel -> papeleira, café -> cafeteira, mar -> marinheira',
    dicaClinica: 'Indica recipientes, utensílios (cafeteira, floreira) ou ocupações femininas.'
  },
  {
    afixo: 'aria',
    tipo: 'sufixo',
    significado: 'Lugar de venda, oficina, coleção ou ação coletiva',
    classeResultante: 'Substantivo de lugar',
    exemplo: 'livro -> livraria, papel -> papelaria',
    dicaClinica: 'Associa a base a um espaço físico de comércio ou produção.'
  },
  {
    afixo: 'mento',
    tipo: 'sufixo',
    significado: 'Ato, processo ou resultado de uma ação',
    classeResultante: 'Substantivo',
    exemplo: 'descongelar -> descongelamento, reflorestar -> reflorestamento',
    dicaClinica: 'Frequente em derivações com múltiplos afixos.'
  },
  {
    afixo: 'ugem',
    tipo: 'sufixo',
    significado: 'Substância residual, camada superficial ou alteração por oxidação/depósito',
    classeResultante: 'Substantivo',
    exemplo: 'ferr -> ferrugem, pena -> penugem, lã -> lanugem, raba -> rabugem',
    dicaClinica: 'Sufixo formador de substantivos que indicam resíduo, crosta superficial ou revestimento.'
  },
  {
    afixo: 'ês',
    tipo: 'sufixo',
    significado: 'Origem, procedência pátria, ocupação social ou título masculino',
    classeResultante: 'Substantivo/Adjetivo pátrio',
    exemplo: 'port -> português, frança -> francês, campo -> camponês, corte -> cortês',
    dicaClinica: 'Formador de adjetivos pátrios e títulos masculinos grafados obrigatoriamente com S e acento circunflexo.'
  },
  {
    afixo: 'esa',
    tipo: 'sufixo',
    significado: 'Feminino de títulos de nobreza, procedência ou ocupação social',
    classeResultante: 'Substantivo/Adjetivo feminino',
    exemplo: 'barão -> baronesa, marquês -> marquesa, duque -> duquesa, príncipe -> princesa, campo -> camponesa',
    dicaClinica: 'Dica ortográfica fonoaudiológica crucial: títulos de nobreza e femininos pátrios são sempre grafados com ESA (com S); não confundir com -EZA (com Z) que deriva de adjetivos (belo -> beleza).'
  },
  {
    afixo: 'ice',
    tipo: 'sufixo',
    significado: 'Qualidade, comportamento típico ou atitude (por vezes pejorativo)',
    classeResultante: 'Substantivo',
    exemplo: 'meninice, tolice, burrice',
    dicaClinica: 'Diferencia a grafia -ice (substantivo) da forma verbal -isse.'
  },

  // Adjetivadores (formam adjetivos)
  {
    afixo: 'oso',
    tipo: 'sufixo',
    significado: 'Cheio de, que possui abundância ou qualidade destacada',
    classeResultante: 'Adjetivo',
    exemplo: 'vento -> ventoso, amor -> amoroso',
    dicaClinica: 'Sufixo adjetivo grafado com S e som /z/.'
  },
  {
    afixo: 'al',
    tipo: 'sufixo',
    significado: 'Relativo a, pertencente a, próprio de',
    classeResultante: 'Adjetivo',
    exemplo: 'floresta -> florestal, dente -> dental',
    dicaClinica: 'Forma adjetivos relacionais muito comuns no dia a dia.'
  },
  {
    afixo: 'ável',
    tipo: 'sufixo',
    significado: 'Que pode ser realizado ou que merece ser (possibilidade)',
    classeResultante: 'Adjetivo de possibilidade',
    exemplo: 'amar -> amável, suportar -> suportável',
    dicaClinica: 'Morfema passivo com valor semântico de capacidade.'
  },
  {
    afixo: 'ível',
    tipo: 'sufixo',
    significado: 'Capacidade ou possibilidade para verbos de 2ª/3ª conjugação',
    classeResultante: 'Adjetivo de possibilidade',
    exemplo: 'ver/vis -> visível, resistir -> resistível',
    dicaClinica: 'Ensina o contraste semântico com prefixo (in-vis-ível).'
  },

  // Verbalizadores (formam verbos)
  {
    afixo: 'ar',
    tipo: 'sufixo',
    significado: 'Verbo de 1ª conjugação (ação, estado ou processo)',
    classeResultante: 'Verbo',
    exemplo: 'canto -> cantar, terra -> aterrar',
    dicaClinica: 'Conjugação mais produtiva do português moderno.'
  },
  {
    afixo: 'izar',
    tipo: 'sufixo',
    significado: 'Tornar-se, transformar em ou produzir (de bases que não possuem S no radical)',
    classeResultante: 'Verbo',
    exemplo: 'humano -> humanizar, canal -> canalizar, fértil -> fertilizar',
    dicaClinica: 'Trabalha a regra ortográfica fonoaudiológica: sufixo grego -izar com Z quando o radical de origem NÃO possui a letra S.'
  },
  {
    afixo: 'isar',
    tipo: 'sufixo',
    significado: 'Formação verbal a partir de bases primitivas que já possuem S no radical (is + ar)',
    classeResultante: 'Verbo',
    exemplo: 'pesquisa -> pesquisar, análise -> analisar, aviso -> avisar, friso -> frisar',
    dicaClinica: 'Dica de ouro fonoaudiológica: se a raiz primitiva já tem a letra S (pesquis-a, analis-e, avis-o), o verbo conserva o S (-isar); se não tem S, usa-se o sufixo -izar com Z.'
  },
  {
    afixo: 'escer',
    tipo: 'sufixo',
    significado: 'Ação que começa ou se desenvolve gradualmente (incoativo)',
    classeResultante: 'Verbo',
    exemplo: 'flor -> florescer, noite -> anoitecer',
    dicaClinica: 'Rico para trabalhar aspectos temporais e processos graduais.'
  },

  // Adverbializador
  {
    afixo: 'mente',
    tipo: 'sufixo',
    significado: 'De maneira, modo ou forma específica (cria advérbios)',
    classeResultante: 'Advérbio de modo',
    exemplo: 'feliz -> felizmente, claro -> claramente, leal -> lealmente',
    dicaClinica: 'Sufixo formador de advérbios mais importante da língua portuguesa.'
  },

  // Diminutivos / Flexivos
  {
    afixo: 'inho',
    tipo: 'sufixo',
    significado: 'Diminutivo de afeto, carinho ou tamanho reduzido',
    classeResultante: 'Substantivo/Adjetivo afetivo',
    exemplo: 'flor -> florzinha/florzinha, dente -> dentinho',
    dicaClinica: 'Excelente para crianças em fase de transição fonológico-morfológica.'
  }
];

// -------------------------------------------------------------
// 3. DICIONÁRIO DE VALIDAÇÃO DE PALAVRAS DERIVADAS (PORTUGUÊS)
// -------------------------------------------------------------
export const DICIONARIO_DERIVACOES: Record<string, PalavraValida> = {
  // Flor
  'florista': { palavra: 'florista', base: 'flor', sufixo1: 'ista', classe: 'substantivo', definicao: 'Pessoa que cultiva ou vende flores.', exemploUso: 'Comprei rosas perfumadas com a florista da praça.' },
  'floreira': { palavra: 'floreira', base: 'flor', vogalTematica: 'e', sufixo1: 'eira', classe: 'substantivo', definicao: 'Vaso ou suporte ornamental para colocar flores.', exemploUso: 'Colocamos uma floreira florida na janela.' },
  'floreiro': { palavra: 'floreiro', base: 'flor', vogalTematica: 'e', sufixo1: 'eiro', classe: 'substantivo', definicao: 'Vaso destinado a receber flores decorativas.', exemploUso: 'O floreiro de cristal brilhava sobre a mesa.' },
  'florescer': { palavra: 'florescer', base: 'flor', sufixo1: 'escer', classe: 'verbo', definicao: 'Dar flores ou prosperar.', exemploUso: 'As árvores voltam a florescer na primavera.' },
  'reflorestar': { palavra: 'reflorestar', base: 'flor', prefixo: 're', sufixo1: 'ar', classe: 'verbo', definicao: 'Plantar novas árvores onde a mata foi retirada.', exemploUso: 'O projeto ajudou a reflorestar a serra.' },
  'desflorestar': { palavra: 'desflorestar', base: 'flor', prefixo: 'des', sufixo1: 'ar', classe: 'verbo', definicao: 'Retirar as árvores de uma área florestal.', exemploUso: 'É proibido desflorestar áreas de preservação.' },
  'florestal': { palavra: 'florestal', base: 'flor', sufixo1: 'al', classe: 'adjetivo', definicao: 'Relativo à floresta ou aos bosques.', exemploUso: 'O guarda florestal protege os animais.' },

  // Mar
  'marinheiro': { palavra: 'marinheiro', base: 'mar', sufixo1: 'eiro', classe: 'substantivo', definicao: 'Pessoa que trabalha em embarcações ou na marinha.', exemploUso: 'O marinheiro experiente navegou durante a tempestade.' },
  'marinheira': { palavra: 'marinheira', base: 'mar', sufixo1: 'eira', classe: 'substantivo', definicao: 'Mulher que atua em embarcações ou na tripulação da marinha.', exemploUso: 'A marinheira manobrou o navio até o porto.' },
  'marítimo': { palavra: 'marítimo', base: 'mar', sufixo1: 'al', classe: 'adjetivo', definicao: 'Pertencente ou relativo ao mar.', exemploUso: 'O comércio marítimo conecta países pelo oceano.' },
  'submarino': { palavra: 'submarino', base: 'mar', prefixo: 'sub', sufixo1: 'al', classe: 'substantivo', definicao: 'Embarcação capaz de navegar sob as águas do mar.', exemploUso: 'O submarino explorou as profundezas do oceano.' },

  // Sol
  'solar': { palavra: 'solar', base: 'sol', sufixo1: 'al', classe: 'adjetivo', definicao: 'Relativo ao Sol ou movido por sua energia.', exemploUso: 'Instalamos painéis de energia solar no telhado.' },
  'ensolarado': { palavra: 'ensolarado', base: 'sol', sufixo1: 'oso', classe: 'adjetivo', definicao: 'Cheio de sol e claridade.', exemploUso: 'Hoje é um domingo ensolarado perfeito para passear.' },
  'antissolar': { palavra: 'antissolar', base: 'sol', prefixo: 'anti', sufixo1: 'al', classe: 'adjetivo', definicao: 'Que protege contra os raios do sol.', exemploUso: 'Use sempre filtro antissolar para cuidar da pele.' },

  // Terr (Radical terr-)
  'terra': { palavra: 'terra', base: 'terr', vogalTematica: 'a', classe: 'substantivo', definicao: 'Solo cultivável, chão firme ou o planeta Terra.', exemploUso: 'A terra úmida acolheu as sementes na horta.' },
  'terrestre': { palavra: 'terrestre', base: 'terr', vogalTematica: 'e', sufixo1: 'al', classe: 'adjetivo', definicao: 'Pertencente à Terra ou que vive em terra firme.', exemploUso: 'O elefante é o maior mamífero terrestre.' },
  'terreno': { palavra: 'terreno', base: 'terr', vogalTematica: 'e', sufixo1: 'no', classe: 'substantivo', definicao: 'Espaço ou extensão de terra delimitada.', exemploUso: 'O terreno ao lado foi reservado para o parquinho.' },
  'terreiro': { palavra: 'terreiro', base: 'terr', sufixo1: 'eiro', classe: 'substantivo', definicao: 'Área plana de terra limpa ao redor da residência.', exemploUso: 'As aves ciscavam calmas no terreiro.' },
  'terreira': { palavra: 'terreira', base: 'terr', sufixo1: 'eira', classe: 'substantivo', definicao: 'Porção ou montículo de terra fértil.', exemploUso: 'A terreira foi preparada para o cultivo de flores.' },
  'subterrâneo': { palavra: 'subterrâneo', base: 'terr', prefixo: 'sub', sufixo1: 'al', classe: 'adjetivo', definicao: 'Que se encontra abaixo da superfície da terra.', exemploUso: 'O trem metropolitano passa pelo túnel subterrâneo.' },
  'aterrar': { palavra: 'aterrar', base: 'terr', prefixo: 'a', sufixo1: 'ar', classe: 'verbo', definicao: 'Cobrir com terra ou pousar no solo.', exemploUso: 'O avião conseguiu aterrar com total segurança.' },
  'enterrar': { palavra: 'enterrar', base: 'terr', prefixo: 'en', sufixo1: 'ar', classe: 'verbo', definicao: 'Colocar sob a terra, sepultar ou plantar sementes.', exemploUso: 'Vamos enterrar as mudas de ipê no canteiro.' },
  'desterro': { palavra: 'desterro', base: 'terr', prefixo: 'des', classe: 'substantivo', definicao: 'Ato de expulsar da própria terra ou pátria.', exemploUso: 'O poeta viveu anos no desterro.' },

  // Dente
  'dentição': { palavra: 'dentição', base: 'dent', vogalTematica: 'i', sufixo1: 'ção', classe: 'substantivo', definicao: 'Conjunto dos dentes ou processo de nascimento e desenvolvimento dos dentes.', exemploUso: 'A primeira dentição do bebê surge por volta dos seis meses.' },
  'dentista': { palavra: 'dentista', base: 'dent', vogalTematica: 'i', sufixo1: 'ista', classe: 'substantivo', definicao: 'Profissional da saúde responsável pelo cuidado dos dentes.', exemploUso: 'Fui ao dentista para fazer uma limpeza preventiva.' },
  'dentadura': { palavra: 'dentadura', base: 'dent', sufixo1: 'eza', classe: 'substantivo', definicao: 'Conjunto de dentes ou prótese dentária.', exemploUso: 'A dentadura devolve a capacidade mastigatória.' },
  'dental': { palavra: 'dental', base: 'dent', sufixo1: 'al', classe: 'adjetivo', definicao: 'Relativo aos dentes.', exemploUso: 'O fio dental é indispensável na higiene diária.' },
  'desdentado': { palavra: 'desdentado', base: 'dent', prefixo: 'des', sufixo1: 'oso', classe: 'adjetivo', definicao: 'Que perdeu ou não possui dentes.', exemploUso: 'O bebê desdentado sorriu com doçura.' },

  // Vento
  'ventania': { palavra: 'ventania', base: 'vent', sufixo1: 'aria', classe: 'substantivo', definicao: 'Vento forte, tempestuoso e repentino.', exemploUso: 'A ventania balançou os galhos mais altos da mangueira.' },
  'ventoso': { palavra: 'ventoso', base: 'vent', sufixo1: 'oso', classe: 'adjetivo', definicao: 'Onde há muito vento.', exemploUso: 'A praia estava muito ventosa no final da tarde.' },
  'ventilar': { palavra: 'ventilar', base: 'vent', sufixo1: 'ar', classe: 'verbo', definicao: 'Renovar o ar de um ambiente.', exemploUso: 'Abra as janelas para ventilar a sala.' },

  // Papel
  'papelaria': { palavra: 'papelaria', base: 'papel', sufixo1: 'aria', classe: 'substantivo', definicao: 'Loja onde se vendem papéis, cadernos e material escolar.', exemploUso: 'Comprei lápis de cor e folhas na papelaria.' },
  'papeleiro': { palavra: 'papeleiro', base: 'papel', sufixo1: 'eiro', classe: 'substantivo', definicao: 'Pessoa que fabrica, vende ou recolhe papel.', exemploUso: 'O papeleiro organiza a reciclagem no bairro.' },
  'papeleira': { palavra: 'papeleira', base: 'papel', sufixo1: 'eira', classe: 'substantivo', definicao: 'Cesto ou recipiente específico para descarte e coleta de papéis.', exemploUso: 'Descarte o rascunho na papeleira de reciclagem.' },

  // Bel
  'beleza': { palavra: 'beleza', base: 'bel', vogalTematica: 'e', sufixo1: 'za', classe: 'substantivo', definicao: 'Qualidade do que é belo, harmônico ou agradável.', exemploUso: 'A beleza do pôr do sol encantou a todos.' },
  'embelezar': { palavra: 'embelezar', base: 'bel', sufixo1: 'izar', classe: 'verbo', definicao: 'Tornar belo, enfeitar ou adornar.', exemploUso: 'Plantamos flores coloridas para embelezar o jardim.' },
  'belamente': { palavra: 'belamente', base: 'bel', sufixo1: 'mente', classe: 'advérbio', definicao: 'De maneira bela e encantadora.', exemploUso: 'A bailarina dançou belamente no palco.' },

  // Feliz
  'infeliz': { palavra: 'infeliz', base: 'feliz', prefixo: 'in', classe: 'adjetivo', definicao: 'Que não é feliz; triste, desventurado.', exemploUso: 'Ele ficou infeliz ao receber a notícia triste.' },
  'felizmente': { palavra: 'felizmente', base: 'feliz', sufixo1: 'mente', classe: 'advérbio', definicao: 'De modo feliz; por sorte ou para o bem.', exemploUso: 'Felizmente todos conseguiram chegar a tempo.' },
  'infelizmente': { palavra: 'infelizmente', base: 'feliz', prefixo: 'in', sufixo1: 'mente', classe: 'advérbio', definicao: 'Com infelicidade; lamentavelmente.', exemploUso: 'Infelizmente a chuva cancelou o piquenique.' },
  'felicidade': { palavra: 'felicidade', base: 'feliz', sufixo1: 'dade', classe: 'substantivo', definicao: 'Estado de quem é feliz, bem-estar profundo.', exemploUso: 'A chegada das férias trouxe imensa felicidade.' },
  'infelicidade': { palavra: 'infelicidade', base: 'feliz', prefixo: 'in', sufixo1: 'dade', classe: 'substantivo', definicao: 'Estado de desventura, falta de felicidade.', exemploUso: 'Ela superou cada infelicidade com resiliência.' },

  // Ativ
  'ativar': { palavra: 'ativar', base: 'ativ', sufixo1: 'ar', classe: 'verbo', definicao: 'Colocar em atividade ou funcionamento.', exemploUso: 'Basta pressionar o botão para ativar o alarme.' },
  'atividade': { palavra: 'atividade', base: 'ativ', sufixo1: 'dade', classe: 'substantivo', definicao: 'Ação, trabalho ou ocupação.', exemploUso: 'Concluímos a atividade pedagógica em grupo.' },
  'desativar': { palavra: 'desativar', base: 'ativ', prefixo: 'des', sufixo1: 'ar', classe: 'verbo', definicao: 'Interromper o funcionamento de algo.', exemploUso: 'Não esqueça de desativar as luzes ao sair.' },
  'desativação': { palavra: 'desativação', base: 'ativ', prefixo: 'des', sufixo1: 'ção', classe: 'substantivo', definicao: 'Ato de desativar.', exemploUso: 'A desativação do motor evitou superaquecimento.' },
  'reativar': { palavra: 'reativar', base: 'ativ', prefixo: 're', sufixo1: 'ar', classe: 'verbo', definicao: 'Ativar novamente aquilo que estava parado.', exemploUso: 'A biblioteca decidiu reativar o clube de leitura.' },
  'inativo': { palavra: 'inativo', base: 'ativ', prefixo: 'in', sufixo1: 'o', classe: 'adjetivo', definicao: 'Que não está em atividade ou movimento.', exemploUso: 'A conta ficou inativa durante seis meses.' },
  'ativamente': { palavra: 'ativamente', base: 'ativ', sufixo1: 'mente', classe: 'advérbio', definicao: 'De modo ativo, com energia e participação.', exemploUso: 'Ela participou ativamente dos debates na aula.' },

  // Form
  'formar': { palavra: 'formar', base: 'form', sufixo1: 'ar', classe: 'verbo', definicao: 'Dar forma, constituir ou graduar-se.', exemploUso: 'Vamos nos formar na universidade este ano.' },
  'formação': { palavra: 'formação', base: 'form', sufixo1: 'ção', classe: 'substantivo', definicao: 'Ação de formar, instrução ou composição.', exemploUso: 'A fonoaudióloga tem excelente formação continuada.' },
  'reforma': { palavra: 'reforma', base: 'form', prefixo: 're', sufixo1: 'a', classe: 'substantivo', definicao: 'Modificação para melhor ou renovação.', exemploUso: 'A escola concluiu a reforma do parquinho.' },
  'deformar': { palavra: 'deformar', base: 'form', prefixo: 'des', sufixo1: 'ar', classe: 'verbo', definicao: 'Alterar a forma natural de algo.', exemploUso: 'O calor excessivo pode deformar o plástico.' },
  'conformidade': { palavra: 'conformidade', base: 'form', sufixo1: 'dade', classe: 'substantivo', definicao: 'Acordo, correspondência ou igualdade.', exemploUso: 'O relatório está em conformidade com as diretrizes.' },

  // Just
  'justiça': { palavra: 'justiça', base: 'just', sufixo1: 'eza', classe: 'substantivo', definicao: 'Princípio moral de dar a cada um o que lhe é devido.', exemploUso: 'A justiça é o pilar de uma sociedade pacífica.' },
  'injusto': { palavra: 'injusto', base: 'just', prefixo: 'in', sufixo1: 'o', classe: 'adjetivo', definicao: 'Que não é justo; parcial, incorreto.', exemploUso: 'Foi uma decisão injusta com os participantes.' },
  'injustiça': { palavra: 'injustiça', base: 'just', prefixo: 'in', sufixo1: 'eza', classe: 'substantivo', definicao: 'Ato ou estado contrário à justiça.', exemploUso: 'Não devemos aceitar a injustiça social.' },
  'justificar': { palavra: 'justificar', base: 'just', sufixo1: 'izar', classe: 'verbo', definicao: 'Apresentar motivos justos para algo.', exemploUso: 'O aluno soube justificar a sua resposta.' },
  'justamente': { palavra: 'justamente', base: 'just', sufixo1: 'mente', classe: 'advérbio', definicao: 'De modo justo ou exatamente.', exemploUso: 'O prêmio foi concedido justamente ao melhor projeto.' },

  // Leal
  'lealdade': { palavra: 'lealdade', base: 'leal', sufixo1: 'dade', classe: 'substantivo', definicao: 'Qualidade ou virtude de quem é leal.', exemploUso: 'A lealdade do cão com seu dono é exemplar.' },
  'desleal': { palavra: 'desleal', base: 'leal', prefixo: 'des', classe: 'adjetivo', definicao: 'Que trai a confiança ou age com falsidade.', exemploUso: 'É reprovável qualquer competição desleal.' },
  'deslealdade': { palavra: 'deslealdade', base: 'leal', prefixo: 'des', sufixo1: 'dade', classe: 'substantivo', definicao: 'Ato ou comportamento de quem é desleal.', exemploUso: 'A deslealdade quebrou a amizade antiga.' },
  'lealmente': { palavra: 'lealmente', base: 'leal', sufixo1: 'mente', classe: 'advérbio', definicao: 'De maneira leal e sincera.', exemploUso: 'Trabalhou lealmente durante vinte anos na empresa.' },

  // Human
  'humanidade': { palavra: 'humanidade', base: 'human', sufixo1: 'dade', classe: 'substantivo', definicao: 'O conjunto de todos os seres humanos ou sentimento de bondade.', exemploUso: 'A vacina salvou milhões de vidas na humanidade.' },
  'humano': { palavra: 'humano', base: 'human', sufixo1: 'o', classe: 'adjetivo', definicao: 'Pertencente ou relativo ao homem; sensível.', exemploUso: 'Errar é humano, mas aprender é essencial.' },
  'desumano': { palavra: 'desumano', base: 'human', prefixo: 'des', sufixo1: 'o', classe: 'adjetivo', definicao: 'Cruel, sem piedade ou desprovido de compaixão.', exemploUso: 'Condições precárias de trabalho são desumanas.' },
  'humanizar': { palavra: 'humanizar', base: 'human', sufixo1: 'izar', classe: 'verbo', definicao: 'Tornar humano, acolhedor ou afável.', exemploUso: 'O hospital busca humanizar o atendimento aos pacientes.' },

  // Cant
  'cantar': { palavra: 'cantar', base: 'cant', sufixo1: 'ar', classe: 'verbo', definicao: 'Produzir sons musicais modulados pela voz.', exemploUso: 'O coral vai cantar hinos no encerramento.' },
  'cantor': { palavra: 'cantor', base: 'cant', sufixo1: 'or', classe: 'substantivo', definicao: 'Pessoa que canta profissionalmente ou por arte.', exemploUso: 'O jovem cantor emocionou a plateia.' },
  'canção': { palavra: 'canção', base: 'cant', sufixo1: 'ção', classe: 'substantivo', definicao: 'Composição musical com letra para ser cantada.', exemploUso: 'Aquela canção me lembra a infância.' },
  'encantar': { palavra: 'encantar', base: 'cant', sufixo1: 'ar', classe: 'verbo', definicao: 'Fascinar, seduzir ou lançar encanto.', exemploUso: 'A peça de teatro soube encantar crianças e adultos.' },

  // Real
  'realidade': { palavra: 'realidade', base: 'real', sufixo1: 'dade', classe: 'substantivo', definicao: 'O que existe de fato; o mundo real.', exemploUso: 'Encarar a realidade com coragem traz crescimento.' },
  'realizar': { palavra: 'realizar', base: 'real', sufixo1: 'izar', classe: 'verbo', definicao: 'Concretizar, fazer acontecer ou tornar real.', exemploUso: 'Com dedicação você vai realizar todos os seus sonhos.' },
  'realização': { palavra: 'realização', base: 'real', sufixo1: 'ção', classe: 'substantivo', definicao: 'Ato ou efeito de realizar; conquista.', exemploUso: 'A formatura foi uma grande realização pessoal.' },
  'irreal': { palavra: 'irreal', base: 'real', prefixo: 'in', classe: 'adjetivo', definicao: 'Que não é real; fictício, ilusório.', exemploUso: 'Aquele cenário de fantasia parecia quase irreal.' },
  'realmente': { palavra: 'realmente', base: 'real', sufixo1: 'mente', classe: 'advérbio', definicao: 'De fato, verdadeiramente.', exemploUso: 'A palestra foi realmente inspiradora.' },

  // Greco-Latinas (Bio, Graf, Fono, Cron, Termo, Hidr)
  'biologia': { palavra: 'biologia', base: 'bio', sufixo1: 'al', classe: 'substantivo', definicao: 'Ciência que estuda os seres vivos e seus processos vitais.', exemploUso: 'Na aula de biologia observamos células ao microscópio.' },
  'biografia': { palavra: 'biografia', base: 'bio', classe: 'substantivo', definicao: 'História escrita sobre a vida de uma pessoa.', exemploUso: 'Li a biografia fascinante de Marie Curie.' },
  'antibiótico': { palavra: 'antibiótico', base: 'bio', prefixo: 'anti', classe: 'substantivo', definicao: 'Substância medicinal que combate bactérias nocivas à vida.', exemploUso: 'O médico receitou um antibiótico para tratar a infecção.' },
  'ortografia': { palavra: 'ortografia', base: 'graf', classe: 'substantivo', definicao: 'Conjunto de regras para a escrita correta das palavras.', exemploUso: 'O conhecimento morfológico melhora a ortografia dos alunos.' },
  'fotografia': { palavra: 'fotografia', base: 'graf', classe: 'substantivo', definicao: 'Registro de imagens por meio da luz.', exemploUso: 'A fotografia guardou a lembrança daquele momento.' },
  'fonoaudiologia': { palavra: 'fonoaudiologia', base: 'fono', classe: 'substantivo', definicao: 'Ciência da saúde que estuda a comunicação humana, linguagem e audição.', exemploUso: 'A fonoaudiologia estimula a consciência morfológica na alfabetização.' },
  'telefone': { palavra: 'telefone', base: 'fono', prefixo: 'tele', classe: 'substantivo', definicao: 'Aparelho que transmite sons e vozes à distância.', exemploUso: 'Recebi um telefonema com ótimas notícias.' },
  'cronômetro': { palavra: 'cronômetro', base: 'cron', classe: 'substantivo', definicao: 'Instrumento para medir intervalos de tempo com exatidão.', exemploUso: 'O treinador usou o cronômetro para medir o tempo da corrida.' },
  'sincronizar': { palavra: 'sincronizar', base: 'cron', sufixo1: 'izar', classe: 'verbo', definicao: 'Fazer coincidir no tempo ou colocar no mesmo ritmo.', exemploUso: 'Vamos sincronizar nossos relógios antes da largada.' },
  'termômetro': { palavra: 'termômetro', base: 'termo', classe: 'substantivo', definicao: 'Instrumento que mede a temperatura corporal ou ambiental.', exemploUso: 'A mãe usou o termômetro para verificar a febre.' },
  'desidratação': { palavra: 'desidratação', base: 'hidr', prefixo: 'des', sufixo1: 'ção', classe: 'substantivo', definicao: 'Perda excessiva de água e líquidos no organismo.', exemploUso: 'Beba água nos dias quentes para evitar a desidratação.' },
  'reidratar': { palavra: 'reidratar', base: 'hidr', prefixo: 're', sufixo1: 'ar', classe: 'verbo', definicao: 'Repor a água e os eletrólitos perdidos pelo corpo.', exemploUso: 'O soro caseiro ajuda a reidratar o paciente rapidamente.' },

  // Ferr (Radical ferr-)
  'ferro': { palavra: 'ferro', base: 'ferr', vogalTematica: 'o', classe: 'substantivo', definicao: 'Metal resistente e abundante na crosta terrestre.', exemploUso: 'O portão foi forjado em ferro maciço.' },
  'ferrugem': { palavra: 'ferrugem', base: 'ferr', sufixo1: 'ugem', classe: 'substantivo', definicao: 'Camada avermelhada resultante da oxidação do ferro pelo ar e umidade.', exemploUso: 'Removemos a ferrugem da bicicleta antiga antes de pintar.' },
  'ferreiro': { palavra: 'ferreiro', base: 'ferr', sufixo1: 'eiro', classe: 'substantivo', definicao: 'Artesão ou profissional que forja e molda o ferro.', exemploUso: 'O ferreiro moldou a ferradura na bigorna com destreza.' },
  'ferreira': { palavra: 'ferreira', base: 'ferr', sufixo1: 'eira', classe: 'substantivo', definicao: 'Mulher que trabalha na forja do ferro ou oficina de ferraria.', exemploUso: 'A jovem ferreira fabrica peças artísticas de metal.' },
  'ferragem': { palavra: 'ferragem', base: 'ferr', sufixo1: 'agem', classe: 'substantivo', definicao: 'Conjunto de peças ou artefatos de ferro para construção.', exemploUso: 'Compramos as ferragens para instalar a porta.' },
  'ferradura': { palavra: 'ferradura', base: 'ferr', sufixo1: 'adura', classe: 'substantivo', definicao: 'Peça de ferro em forma de U para proteger o casco do cavalo.', exemploUso: 'O cavalo ganhou ferraduras novas para a cavalgada.' },
  'enferrujar': { palavra: 'enferrujar', base: 'ferr', prefixo: 'en', sufixo1: 'ar', classe: 'verbo', definicao: 'Cobrir-se de ferrugem ou oxidar.', exemploUso: 'Guarde os instrumentos em local seco para não enferrujar.' },

  // Pedr (Radical pedr-)
  'pedra': { palavra: 'pedra', base: 'pedr', vogalTematica: 'a', classe: 'substantivo', definicao: 'Matéria mineral dura e sólida da natureza; rocha.', exemploUso: 'Havia pedras decorativas no jardim da praça.' },
  'pedreiro': { palavra: 'pedreiro', base: 'pedr', sufixo1: 'eiro', classe: 'substantivo', definicao: 'Profissional da construção civil que constrói com pedras e tijolos.', exemploUso: 'O pedreiro assentou os blocos da casa com prumo perfeito.' },
  'pedreira': { palavra: 'pedreira', base: 'pedr', sufixo1: 'eira', classe: 'substantivo', definicao: 'Local onde se extraem pedras ou trabalho árduo.', exemploUso: 'A pedreira forneceu o granito para o calçamento.' },
  'pedregulho': { palavra: 'pedregulho', base: 'pedr', sufixo1: 'egulho', classe: 'substantivo', definicao: 'Fragmento ou pequenas pedras arredondadas.', exemploUso: 'Caminhamos sobre o pedregulho da margem do rio.' },

  // Cas (Radical cas-)
  'casa': { palavra: 'casa', base: 'cas', vogalTematica: 'a', classe: 'substantivo', definicao: 'Construção destinada à habitação familiar.', exemploUso: 'A casa acolhedora tinha cheiro de café passado.' },
  'caseiro': { palavra: 'caseiro', base: 'cas', sufixo1: 'eiro', classe: 'substantivo', definicao: 'Pessoa que cuida de uma casa de campo ou algo preparado em casa.', exemploUso: 'O bolo caseiro de cenoura ficou delicioso.' },
  'caseira': { palavra: 'caseira', base: 'cas', sufixo1: 'eira', classe: 'substantivo', definicao: 'Mulher zeladora ou refeição preparada em ambiente doméstico.', exemploUso: 'A comida caseira da vovó é inigualável.' },
  'casarão': { palavra: 'casarão', base: 'cas', sufixo1: 'ão', classe: 'substantivo', definicao: 'Casa muito grande e antiga, de valor histórico.', exemploUso: 'O casarão colonial foi restaurado pela cidade.' },
  'casamento': { palavra: 'casamento', base: 'cas', sufixo1: 'mento', classe: 'substantivo', definicao: 'União conjugal ou celebração matrimonial.', exemploUso: 'Todos celebraram o casamento com alegria.' },

  // Livr (Radical livr-)
  'livro': { palavra: 'livro', base: 'livr', vogalTematica: 'o', classe: 'substantivo', definicao: 'Conjunto de folhas encadernadas com texto ou ilustrações.', exemploUso: 'Abri o livro de contos e viajei pela história.' },
  'livreiro': { palavra: 'livreiro', base: 'livr', sufixo1: 'eiro', classe: 'substantivo', definicao: 'Pessoa que comercializa ou cuida de livros.', exemploUso: 'O livreiro recomendou uma excelente leitura.' },
  'livreira': { palavra: 'livreira', base: 'livr', sufixo1: 'eira', classe: 'substantivo', definicao: 'Mulher que comercializa livros.', exemploUso: 'A livreira organizou o festival literário da escola.' },
  'livraria': { palavra: 'livraria', base: 'livr', sufixo1: 'aria', classe: 'substantivo', definicao: 'Estabelecimento comercial dedicado à venda de livros.', exemploUso: 'Passamos a tarde folheando novidades na livraria.' },

  // Port (Radical port-)
  'porta': { palavra: 'porta', base: 'port', vogalTematica: 'a', classe: 'substantivo', definicao: 'Abertura com batente e folha móvel para entrar e sair.', exemploUso: 'Feche a porta com cuidado para não bater.' },
  'porteiro': { palavra: 'porteiro', base: 'port', sufixo1: 'eiro', classe: 'substantivo', definicao: 'Profissional encarregado de vigiar e atender a porta de entrada.', exemploUso: 'O porteiro cumprimentou os moradores pela manhã.' },
  'porteira': { palavra: 'porteira', base: 'port', sufixo1: 'eira', classe: 'substantivo', definicao: 'Porta rústica de cercas em propriedades rurais.', exemploUso: 'Abra a porteira para o trator passar.' },
  'portaria': { palavra: 'portaria', base: 'port', sufixo1: 'aria', classe: 'substantivo', definicao: 'Local de entrada de um edifício onde fica a recepção.', exemploUso: 'As correspondências são entregues na portaria.' },
  'portão': { palavra: 'portão', base: 'port', sufixo1: 'ão', classe: 'substantivo', definicao: 'Porta de grandes dimensões para entrada de veículos.', exemploUso: 'O portão automático abriu sem ruídos.' },
  'português': { palavra: 'português', base: 'port', sufixo1: 'ês', classe: 'adjetivo', definicao: 'Natural de Portugal ou relativo à Língua Portuguesa.', exemploUso: 'Estudamos a gramática da língua portuguesa.' },

  // Músic (Radical músic- / music-) - Paradigma Carlisle de Opacidade Fonológica
  'música': { palavra: 'música', base: 'músic', vogalTematica: 'a', classe: 'substantivo', definicao: 'Arte de combinar sons de maneira harmoniosa.', exemploUso: 'A música clássica acalmou o ambiente.' },
  'músico': { palavra: 'músico', base: 'músic', vogalTematica: 'o', classe: 'substantivo', definicao: 'Pessoa que toca um instrumento ou compõe obras musicais (proparoxítona).', exemploUso: 'O músico afinou o violino com precisão.' },
  'musicista': { palavra: 'musicista', base: 'músic', sufixo1: 'ista', classe: 'substantivo', definicao: 'Intérprete ou executante virtuoso da música (sofreu mudança métrica: paroxítona, perdeu o acento gráfico).', exemploUso: 'A consagrada musicista apresentou um concerto no teatro.' },
  'musical': { palavra: 'musical', base: 'músic', sufixo1: 'al', classe: 'adjetivo', definicao: 'Relativo à música ou que possui talento sonoro.', exemploUso: 'Assistimos a um emocionante espetáculo musical.' },
  'musicalidade': { palavra: 'musicalidade', base: 'músic', sufixo1: 'dade', classe: 'substantivo', definicao: 'Sensibilidade ou talento para a melodia e ritmo.', exemploUso: 'A poesia de Cecília Meireles transborda musicalidade.' },

  // Dúvid, Fábric, Noit, Luz, Pão
  'duvidoso': { palavra: 'duvidoso', base: 'dúvid', sufixo1: 'oso', classe: 'adjetivo', definicao: 'Que desperta dúvida ou incerteza (mudança do acento de dúvida).', exemploUso: 'O resultado da pesquisa ainda é duvidoso.' },
  'fabricação': { palavra: 'fabricação', base: 'fábric', sufixo1: 'ção', classe: 'substantivo', definicao: 'Ato de fabricar produtos em série (deslocamento métrico de fábrica).', exemploUso: 'A fabricação de brinquedos obedece a normas de segurança.' },
  'fabricante': { palavra: 'fabricante', base: 'fábric', sufixo1: 'ante', classe: 'substantivo', definicao: 'Empresa ou pessoa que produz mercadorias.', exemploUso: 'O fabricante garantiu a qualidade do equipamento.' },
  'noturno': { palavra: 'noturno', base: 'noit', sufixo1: 'al', classe: 'adjetivo', definicao: 'Relativo à noite (opacidade etimológica da raiz latina).', exemploUso: 'A coruja é uma ave de hábitos tipicamente noturnos.' },
  'lucidez': { palavra: 'lucidez', base: 'luz', sufixo1: 'ez', classe: 'substantivo', definicao: 'Clareza mental e capacidade de raciocínio límpido (alomorfia z -> c).', exemploUso: 'O idoso manteve total lucidez até os cem anos.' },
  'padeiro': { palavra: 'padeiro', base: 'pão', sufixo1: 'eiro', classe: 'substantivo', definicao: 'Profissional que prepara e assa pães (resgate da raiz histórica pan-).', exemploUso: 'O padeiro tirou pães quentinhos do forno logo cedo.' },
  'padeira': { palavra: 'padeira', base: 'pão', sufixo1: 'eira', classe: 'substantivo', definicao: 'Mulher que prepara e comercializa pães na padaria.', exemploUso: 'A padeira assou fornadas frescas de pão de queijo.' }
};

// -------------------------------------------------------------
// 4. ITENS DO MÓDULO DE DECOMPOSIÇÃO MORFÊMICA
// -------------------------------------------------------------
export const ITENS_DECOMPOSICAO: DecomposicaoItem[] = [
  {
    id: 'dec-1',
    palavra: 'infelizmente',
    prefixo: 'in',
    radical: 'feliz',
    sufixo1: 'mente',
    sufixo2: null,
    significado: 'De maneira contrária à felicidade; com pesar.',
    dica: 'Observe o prefixo de negação "in-" e o sufixo formador de advérbio "-mente".'
  },
  {
    id: 'dec-2',
    palavra: 'reflorestamento',
    prefixo: 're',
    radical: 'flor',
    sufixo1: 'esta',
    sufixo2: 'mento',
    significado: 'Ação e processo de plantar novas árvores e recuperar a mata.',
    dica: 'Contém prefixo de repetição "re-", radical "flor" e o sufixo nominalizador "-mento".'
  },
  {
    id: 'dec-3',
    palavra: 'deslealdade',
    prefixo: 'des',
    radical: 'leal',
    sufixo1: 'dade',
    sufixo2: null,
    significado: 'Qualidade ou comportamento de quem age com traição à lealdade.',
    dica: 'O prefixo "des-" inverte o valor positivo da qualidade "leal".'
  },
  {
    id: 'dec-4',
    palavra: 'dentista',
    prefixo: null,
    radical: 'dent',
    sufixo1: 'ista',
    sufixo2: null,
    significado: 'Especialista profissional nos cuidados e saúde dos dentes.',
    dica: 'Não tem prefixo; tem o radical "dent" e o sufixo de profissão "-ista".'
  },
  {
    id: 'dec-5',
    palavra: 'desativação',
    prefixo: 'des',
    radical: 'ativ',
    sufixo1: 'a',
    sufixo2: 'ção',
    significado: 'Ato de retirar a atividade ou interromper o funcionamento.',
    dica: 'Veja como "des-" desfaz e "-ção" cria o nome da ação a partir de "ativar".'
  },
  {
    id: 'dec-6',
    palavra: 'subterrâneo',
    prefixo: 'sub',
    radical: 'terr',
    sufixo1: 'âneo',
    sufixo2: null,
    significado: 'Localizado por baixo da superfície do solo ou da terra.',
    dica: 'Prefixo espacial "sub-" significa "embaixo de", unido ao radical "terr".'
  },
  {
    id: 'dec-7',
    palavra: 'antivírus',
    prefixo: 'anti',
    radical: 'vírus',
    sufixo1: null,
    sufixo2: null,
    significado: 'Que age contra a proliferação ou ataque de vírus.',
    dica: '"Anti-" expressa oposição ou combate direto ao radical "vírus".'
  },
  {
    id: 'dec-8',
    palavra: 'beleza',
    prefixo: null,
    radical: 'bel',
    sufixo1: 'eza',
    sufixo2: null,
    significado: 'Qualidade ou propriedade daquilo que é belo.',
    dica: 'Radical adjetivo "bel" transformado em substantivo abstrato pelo sufixo "-eza".'
  }
];

// -------------------------------------------------------------
// 5. ITENS DO MÓDULO DE PARENTESCO MORFOLÓGICO (Morphological Relatedness)
// Testa discriminação entre parentesco real vs. distrator ortográfico/fonológico
// -------------------------------------------------------------
export const ITENS_PARENTESCO: ParentescoItem[] = [
  {
    id: 'par-1',
    palavraBase: 'flor',
    palavraCandidata: 'florista',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Florista" é a pessoa que cultiva e vende "flores". Compartilham radical e campo de sentido.',
    detalheClinicoTransparencia: 'Transparente (Carlisle Nível 1): O radical "flor" permanece fonológica e ortograficamente idêntico na palavra derivada, sem alteração de acento ou fonema.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-2',
    palavraBase: 'mar',
    palavraCandidata: 'martelo',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! Embora comecem com as mesmas letras, "martelo" vem do latim martellus (ferramenta) e não tem relação morfológica com "mar" aquático. É um distrator fonológico!',
    detalheClinicoTransparencia: 'Distrator Fonológico: Semelhança acústico-silábica superficial inicial sem qualquer conexão etimológica ou semântica com o radical.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-3',
    palavraBase: 'sol',
    palavraCandidata: 'soldado',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Soldado" vem do soldo (moeda antiga de pagamento militar), nada tem a ver com o "sol" celeste.',
    detalheClinicoTransparencia: 'Distrator Fonológico: Coincidência gráfica de superfície (soldo vs sol) sem relação de sentido ou raiz morfológica real.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-4',
    palavraBase: 'dente',
    palavraCandidata: 'dentista',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! O "dentista" é o profissional dedicado aos cuidados do "dente". A raiz morfológica é a mesma.',
    detalheClinicoTransparencia: 'Transparente (Carlisle Nível 1): A raiz consonantal "dent-" é mantida de forma direta e regular com o sufixo de profissão "-ista".',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-5',
    palavraBase: 'casa',
    palavraCandidata: 'casaco',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Casaco" é uma peça de vestuário e não deriva do substantivo "casa". O som é parecido por mera coincidência gráfica.',
    detalheClinicoTransparencia: 'Distrator Fonológico: A semelhança sonora "cas-" induz a falso parentesco se a criança não avaliar o significado de moradia.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-6',
    palavraBase: 'vento',
    palavraCandidata: 'ventania',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Ventania" é uma grande intensidade de "vento". Derivação sufixal plena.',
    detalheClinicoTransparencia: 'Transparente: Radical "vent-" plenamente reconhecível na audição e na escrita, facilitando o mapeamento grafofonêmico.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-7',
    palavraBase: 'porta',
    palavraCandidata: 'portaria',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! A "portaria" é o local de recepção onde fica a "porta" principal do edifício.',
    detalheClinicoTransparencia: 'Transparente: A base "port" mantém-se intacta unida ao sufixo locativo "-aria".',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-8',
    palavraBase: 'pato',
    palavraCandidata: 'patologia',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! Embora comece com as mesmas letras "pato", "patologia" vem do radical grego pathos (doença, sofrimento) e logos (estudo), não tendo relação alguma com a ave "pato". É um falso amigo gráfico/fonológico!',
    detalheClinicoTransparencia: 'Distrator Morfofonológico: Ilustra a colisão entre uma palavra do léxico cotidiano infantil ("pato") e um étimo grego erudito ("pathos").',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-9',
    palavraBase: 'feliz',
    palavraCandidata: 'infelicidade',
    temParentesco: true,
    grauTransparencia: 'opacidade_alomorfica',
    explicacao: 'Sim! "Infelicidade" é formada pelo radical de "feliz" com o prefixo "in-" e o sufixo "-idade". Família idêntica.',
    detalheClinicoTransparencia: 'Opacidade Alomórfica (Carlisle Nível 3): A base "feliz" sofre acomodação ortográfica obrigatória (z -> c) ao receber o sufixo "-idade", formando "infelicidade" (e não infelizdade).',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-10',
    palavraBase: 'livro',
    palavraCandidata: 'livraria',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Livraria" é a loja onde se comercializam "livros".',
    detalheClinicoTransparencia: 'Transparente: Queda regular da vogal temática átona "o" para anexar o sufixo de comércio "-aria" sem alteração do radical livr-.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-11',
    palavraBase: 'galo',
    palavraCandidata: 'galope',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Galope" é a marcha rápida do cavalo (origem germânica) e não tem relação com o "galo" aviário.',
    detalheClinicoTransparencia: 'Distrator Fonológico: Semelhança nas primeiras sílabas sem parentesco etimológico real.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-12',
    palavraBase: 'terra',
    palavraCandidata: 'terremoto',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Terremoto" significa literalmente "movimento da terra" (terra + moto). Relação morfológica composicional real.',
    detalheClinicoTransparencia: 'Transparente: Composição morfológica em que o radical "terr" e o étimo latino "moto" (movimento) se unem de forma explícita.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-13',
    palavraBase: 'chuva',
    palavraCandidata: 'chuvisco',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Chuvisco" é uma chuva fina e leve. Deriva diretamente da base "chuva".',
    detalheClinicoTransparencia: 'Transparente: Derivação diminutiva/atenuativa direta da base "chuv-".',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-14',
    palavraBase: 'chuva',
    palavraCandidata: 'churrasco',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Churrasco" é uma carne grelhada ao fogo e nada tem a ver com a água da "chuva". É apenas uma semelhança sonora inicial.',
    detalheClinicoTransparencia: 'Distrator Fonológico: Início sonoro compartilhado ("chu-") sem relação de raiz.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-15',
    palavraBase: 'fogo',
    palavraCandidata: 'fogueira',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Fogueira" é o acúmulo de lenha acesa com "fogo".',
    detalheClinicoTransparencia: 'Transparente: O dígrafo "gu" preserva a pronúncia oclusiva velar /g/ do radical fog-.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-16',
    palavraBase: 'mão',
    palavraCandidata: 'mamão',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! O fruto tropical "mamão" não é uma mão grande! A semelhança gráfica não possui parentesco etimológico.',
    detalheClinicoTransparencia: 'Pseudomorfema / Distrator: A terminação "-ão" aparenta ser aumentativo de "mão", mas é raiz indígena/tupi.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-17',
    palavraBase: 'mão',
    palavraCandidata: 'manusear',
    temParentesco: true,
    grauTransparencia: 'opacidade_alomorfica',
    explicacao: 'Sim! "Manusear" vem do latim manus (mão) e significa literalmente mexer ou trabalhar com as mãos.',
    detalheClinicoTransparencia: 'Opacidade Alomórfica: Reativação da raiz latina manus- (trabalhar com a mão), afastando-se do ditongo popular "mão".',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-18',
    palavraBase: 'pedra',
    palavraCandidata: 'pedregulho',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Pedregulho" é um fragmento ou conjunto de pequenas pedras.',
    detalheClinicoTransparencia: 'Transparente: Derivação aumentativa/coletiva com preservação do radical pedr-.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-19',
    palavraBase: 'pedra',
    palavraCandidata: 'pedestre',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Pedestre" vem do latim pedis (pé), designando quem anda a pé, e não tem relação com o mineral "pedra"!',
    detalheClinicoTransparencia: 'Falso Cognato Etimológico: Coincidência sonora com "pedra", mas originado do étimo pedis (pé).',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-20',
    palavraBase: 'pé',
    palavraCandidata: 'pedestre',
    temParentesco: true,
    grauTransparencia: 'opacidade_etimologica',
    explicacao: 'Sim! "Pedestre" é quem se desloca usando os próprios pés (do étimo latino pedis/pé).',
    detalheClinicoTransparencia: 'Opacidade Etimológica Culta (Carlisle Nível 4): O termo culto resgata o radical latino pedis- para quem anda a pé.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-21',
    palavraBase: 'braço',
    palavraCandidata: 'abraço',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Abraço" é a ação de envolver carinhosamente alguém com os braços (ad + braço).',
    detalheClinicoTransparencia: 'Transparente: Derivação parassintética transparente com o prefixo "a-" e a base "braço".',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-22',
    palavraBase: 'luz',
    palavraCandidata: 'lustre',
    temParentesco: true,
    grauTransparencia: 'opacidade_etimologica',
    explicacao: 'Sim! "Lustre" provém da raiz latina de iluminação (lustrare/lux) para designar a peça que espalha luz.',
    detalheClinicoTransparencia: 'Opacidade Etimológica: Conexão histórica entre a raiz lux/lustrare e o substantivo contemporâneo.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-23',
    palavraBase: 'luz',
    palavraCandidata: 'lula',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Lula" é um molusco marinho e não tem relação morfológica com a luminosidade da "luz".',
    detalheClinicoTransparencia: 'Distrator Fonológico: Semelhança da sílaba "lu-" sem relação morfológica.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-24',
    palavraBase: 'carta',
    palavraCandidata: 'carteiro',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! O "carteiro" é o profissional encarregado de entregar correspondências e cartas.',
    detalheClinicoTransparencia: 'Transparente: Sufixo profissional "-eiro" agregado diretamente à base carta.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-25',
    palavraBase: 'carta',
    palavraCandidata: 'cartaz',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Cartaz" deriva do italiano cartoccio (aviso impresso afixado em parede), com rota derivacional diferente da carta epistolar.',
    detalheClinicoTransparencia: 'Distrator Fonológico: Falsa correlação induzida pelo radical cart-.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-26',
    palavraBase: 'bolo',
    palavraCandidata: 'boliche',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Boliche" é um jogo esportivo de pinos (do inglês bowling) e nada tem a ver com a massa doce de "bolo".',
    detalheClinicoTransparencia: 'Distrator Fonológico: Coincidência acústica da sílaba inicial "bol-".',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-27',
    palavraBase: 'bolo',
    palavraCandidata: 'bolinho',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Bolinho" é uma porção pequena de bolo (derivação com sufixo diminutivo -inho).',
    detalheClinicoTransparencia: 'Transparente: Derivação avaliativa diminutiva direta.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-28',
    palavraBase: 'sapato',
    palavraCandidata: 'sapataria',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Sapataria" é o estabelecimento comercial onde se fabricam, consertam ou vendem sapatos.',
    detalheClinicoTransparencia: 'Transparente: Sufixo de comércio "-aria" anexado sem alteração da base sapat-.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-29',
    palavraBase: 'sapato',
    palavraCandidata: 'sapo',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! O anfíbio "sapo" não tem nenhum parentesco morfológico com o calçado "sapato"!',
    detalheClinicoTransparencia: 'Distrator Fonológico: Semelhança acústico-gráfica inicial com espécies biológicas.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-30',
    palavraBase: 'pato',
    palavraCandidata: 'patinho',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Patinho" é o filhote ou a forma afetuosa da ave "pato".',
    detalheClinicoTransparencia: 'Transparente: Diminutivo regular e imediato.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-31',
    palavraBase: 'mar',
    palavraCandidata: 'marinho',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Marinho" é tudo aquilo que vive no mar ou é próprio do oceano.',
    detalheClinicoTransparencia: 'Transparente: Radical mar- preservado integralmente na audição e leitura.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-32',
    palavraBase: 'sol',
    palavraCandidata: 'ensolarado',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Ensolarado" qualifica o dia repleto de claridade e calor do sol.',
    detalheClinicoTransparencia: 'Transparente: Parassíntese regular (en- + sol + -ado).',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-33',
    palavraBase: 'casa',
    palavraCandidata: 'caseiro',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Caseiro" refere-se àquilo preparado em casa com carinho ou ao zelador de uma propriedade.',
    detalheClinicoTransparencia: 'Transparente: O radical cas- mantém o fonema /z/ e a grafia com S.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-34',
    palavraBase: 'vento',
    palavraCandidata: 'ventre',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Ventre" refere-se à região do abdômen/barriga e não possui ligação com as correntes de ar do "vento".',
    detalheClinicoTransparencia: 'Distrator Fonológico: Coincidência inicial "vent-" sem convergência de significado anatômico/meteorológico.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-35',
    palavraBase: 'livro',
    palavraCandidata: 'livre',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Livre" vem de liberdade, enquanto "livro" vem do latim liber (a entrecasca da árvore usada para escrever). Raízes distintas!',
    detalheClinicoTransparencia: 'Falso Cognato Histórico: Homofonia superficial entre étimos latinos distintos (liber/livro vs liber/livre).',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-36',
    palavraBase: 'leal',
    palavraCandidata: 'desleal',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Desleal" é formado pela raiz "leal" com o prefixo de negação "des-".',
    detalheClinicoTransparencia: 'Transparente: Prefixação de oposição com radical totalmente conservado.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-37',
    palavraBase: 'dente',
    palavraCandidata: 'dentadura',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Dentadura" é o conjunto de dentes ou prótese dental.',
    detalheClinicoTransparencia: 'Transparente: Sufixo coletivo "-adura" anexado diretamente à raiz dent-.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-38',
    palavraBase: 'peixe',
    palavraCandidata: 'peixaria',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Peixaria" é o local de venda de peixes frescos.',
    detalheClinicoTransparencia: 'Transparente: Sufixo locativo com manutenção integral do radical peix-.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-39',
    palavraBase: 'peixe',
    palavraCandidata: 'peito',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Peito" é a parte anterior do tórax humano e não deriva do animal "peixe". Apenas sons iniciais coincidentes!',
    detalheClinicoTransparencia: 'Distrator Fonológico: Semelhança do ditongo inicial "pei-".',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-40',
    palavraBase: 'boca',
    palavraCandidata: 'bocado',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Bocado" é uma porção de comida que cabe de uma só vez na "boca".',
    detalheClinicoTransparencia: 'Transparente: Relação metonímica clara da porção alimentar cabível na boca.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-41',
    palavraBase: 'sapato',
    palavraCandidata: 'sapa',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Sapato" (calçado para os pés) e "sapa" (escavação, pá de sapador ou trincheira) não possuem qualquer parentesco morfológico ou de significado. É um falso amigo estritamente fonológico!',
    detalheClinicoTransparencia: 'Distrator Fonológico / Falso Amigo: Início idêntico ("sap-") que desafia a consciência morfológica da criança.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-42',
    palavraBase: 'sapato',
    palavraCandidata: 'sapateiro',
    temParentesco: true,
    grauTransparencia: 'transparente',
    explicacao: 'Sim! "Sapateiro" é o artesão/profissional que conserta ou fabrica "sapatos". Compartilham a mesma família morfológica.',
    detalheClinicoTransparencia: 'Transparente: Agente profissional ligado ao substantivo concreto primário.',
    tipo: 'derivacao_real'
  },

  // -------------------------------------------------------------
  // NOVOS ITENS EXCLUSIVOS: CONTINUUM DE TRANSPARÊNCIA VS. OPACIDADE
  // Baseados nos estudos de Joanne Carlisle (2000, 2003, 2010), Apel e Tyler & Nagy
  // -------------------------------------------------------------
  {
    id: 'par-43',
    palavraBase: 'músico',
    palavraCandidata: 'musicista',
    temParentesco: true,
    grauTransparencia: 'opacidade_fonologica',
    explicacao: 'Sim! "Musicista" é quem executa ou estuda música profissionalmente. Compartilham a mesma raiz, mas com opacidade fonológica marcante!',
    detalheClinicoTransparencia: 'Opacidade Fonológica por Deslocamento de Acento Tônico (Stress Shift - Carlisle): A palavra base "músico" é proparoxítona (/’mu.zi.ku/) com acento agudo; ao receber o sufixo "-ista", a sílaba tônica se desloca para a penúltima sílaba, formando "musicista" (/mu.zi’sis.tɐ/), paroxítona, perdendo o acento gráfico. Crianças com dificuldades de leitura frequentemente falham aqui por não ouvirem mais o acento primitivo!',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-44',
    palavraBase: 'músico',
    palavraCandidata: 'museu',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Museu" deriva do grego mouseion (templo das musas) para guardar relíquias históricas, e não de "músico". É uma coincidência sonora inicial!',
    detalheClinicoTransparencia: 'Distrator Fonológico: Coincidência da sílaba inicial "mus-" sem conexão morfológica derivacional direta.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-45',
    palavraBase: 'dúvida',
    palavraCandidata: 'duvidoso',
    temParentesco: true,
    grauTransparencia: 'opacidade_fonologica',
    explicacao: 'Sim! "Duvidoso" é aquilo que gera dúvida ou incerteza. Compartilham a raiz com alteração de acento tônico.',
    detalheClinicoTransparencia: 'Opacidade Fonológica (Stress Shift): A proparoxítona acentuada "dúvida" perde o acento gráfico e sofre deslocamento prosódico ao formar o adjetivo paroxítono "duvidoso" e o verbo "duvidar".',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-46',
    palavraBase: 'dúvida',
    palavraCandidata: 'dueto',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Dueto" é uma composição musical para duas vozes (do italiano duetto / latim duo) e não tem ligação com a incerteza da "dúvida".',
    detalheClinicoTransparencia: 'Distrator Fonológico: Semelhança das letras iniciais "du-" sem parentesco de significado.',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-47',
    palavraBase: 'fábrica',
    palavraCandidata: 'fabricação',
    temParentesco: true,
    grauTransparencia: 'opacidade_fonologica',
    explicacao: 'Sim! "Fabricação" é o processo de manufatura realizado dentro de uma "fábrica".',
    detalheClinicoTransparencia: 'Opacidade Fonológica por Deslocamento Métrico: A base proparoxítona "fábrica" perde o acento gráfico ao derivar a oxítona "fabricação" e a paroxítona "fabricante".',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-48',
    palavraBase: 'fábrica',
    palavraCandidata: 'fabuloso',
    temParentesco: false,
    grauTransparencia: 'distrator_fonologico',
    explicacao: 'Não! "Fabuloso" vem do latim fabula (história inventada, mito), enquanto "fábrica" vem de fabricare (construir com arte). Raízes distintas!',
    detalheClinicoTransparencia: 'Distrator Fonológico: Falso amigo sonoro entre a raiz industrial "fabric-" e a raiz literária "fabul-".',
    tipo: 'distrator_fonologico'
  },
  {
    id: 'par-49',
    palavraBase: 'fogo',
    palavraCandidata: 'fogaréu',
    temParentesco: true,
    grauTransparencia: 'opacidade_fonologica',
    explicacao: 'Sim! "Fogaréu" é um fogo muito grande e alto. Pertencem à mesma família morfológica.',
    detalheClinicoTransparencia: 'Opacidade Fonológica por Mudança de Timbre Vocálico (Vowel Shift): Em "fogo" a vogal tônica é fechada (/o/), mas em "fogaréu" e "fogareiro" o timbre passa para aberto (/ɔ/), desafiando a percepção auditiva infantil.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-50',
    palavraBase: 'luz',
    palavraCandidata: 'lucidez',
    temParentesco: true,
    grauTransparencia: 'opacidade_alomorfica',
    explicacao: 'Sim! "Lucidez" é a capacidade de raciocinar com clareza mental e iluminação do pensamento. Mesma família de "luz"!',
    detalheClinicoTransparencia: 'Opacidade Alomórfica Ortográfica (Carlisle Nível 3): A base "luz" termina com Z, mas a derivação exige a troca de Z por C ("lucid-ez"), alterando a representação ortográfica da raiz.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-51',
    palavraBase: 'pão',
    palavraCandidata: 'padeiro',
    temParentesco: true,
    grauTransparencia: 'opacidade_alomorfica',
    explicacao: 'Sim! O "padeiro" é o artesão que amassa e assa pães frescos. Compartilham a mesma raiz etimológica histórica!',
    detalheClinicoTransparencia: 'Opacidade Alomórfica Histórica: A terminação nasal popular "pão" resgata a raiz histórica arcaica "pan-" e a forma "padeir-", sem transparência superficial direta para a criança.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-52',
    palavraBase: 'ferro',
    palavraCandidata: 'ferrugem',
    temParentesco: true,
    grauTransparencia: 'opacidade_alomorfica',
    explicacao: 'Sim! "Ferrugem" é a camada oxidada que se forma sobre o ferro pelo contato com o ar e a água. Sufixo "-ugem" anexado à raiz "ferr-".',
    detalheClinicoTransparencia: 'Opacidade Alomórfica: Junção da raiz mineral "ferr-" com o sufixo residual "-ugem", exigindo compreensão da transformação física e semântica do material.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-53',
    palavraBase: 'noite',
    palavraCandidata: 'noturno',
    temParentesco: true,
    grauTransparencia: 'opacidade_etimologica',
    explicacao: 'Sim! "Noturno" refere-se àquilo que acontece ou vive durante a "noite". Compartilham a família etimológica culta latina!',
    detalheClinicoTransparencia: 'Opacidade Etimológica Erudita (Carlisle Nível 4): A forma popular "noite" contrasta com a raiz erudita latina "nocturnus" ("noturno"). Exige consciência metalinguística refinada e vocabulário acadêmico.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-54',
    palavraBase: 'olho',
    palavraCandidata: 'ocular',
    temParentesco: true,
    grauTransparencia: 'opacidade_etimologica',
    explicacao: 'Sim! "Ocular" é aquilo que é relativo ao "olho" ou à visão (ex: exame ocular). Derivam da mesma raiz latina oculus!',
    detalheClinicoTransparencia: 'Opacidade Etimológica Culta: O substantivo vernacular "olho" relaciona-se semanticamente ao adjetivo erudito latino "ocular" (oculus), sem preservar grafia ou som superficial.',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-55',
    palavraBase: 'dente',
    palavraCandidata: 'odontologia',
    temParentesco: true,
    grauTransparencia: 'opacidade_etimologica',
    explicacao: 'Sim! A "odontologia" é a ciência médica especializada no estudo e cuidado dos "dentes". A raiz grega odonto- significa dente!',
    detalheClinicoTransparencia: 'Opacidade Erudita Grega: O termo científico resgata a raiz grega "odous / odontos" em oposição ao étimo latino vernacular "dente".',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-56',
    palavraBase: 'cidade',
    palavraCandidata: 'urbano',
    temParentesco: true,
    grauTransparencia: 'opacidade_etimologica',
    explicacao: 'Sim! "Urbano" qualifica tudo o que é próprio ou característico da "cidade". Provém do étimo latino urbs (cidade).',
    detalheClinicoTransparencia: 'Opacidade Supletiva Erudita: Relação relacional abstrata entre o substantivo comum "cidade" (civitas) e o adjetivo relacional "urbano" (urbs).',
    tipo: 'derivacao_real'
  },
  {
    id: 'par-57',
    palavraBase: 'água',
    palavraCandidata: 'aquático',
    temParentesco: true,
    grauTransparencia: 'opacidade_etimologica',
    explicacao: 'Sim! "Aquático" qualifica seres ou esportes que vivem ou acontecem na "água". Compartilham a raiz latina aqua.',
    detalheClinicoTransparencia: 'Opacidade Etimológica: A raiz latina "aqua" preserva o "qu" em aquático, aquário e aqueduto, em contraste com a forma popular "água".',
    tipo: 'derivacao_real'
  }
];

// -------------------------------------------------------------
// 6. ITENS DE FECHAMENTO SINTÁTICO & ESCOLHA DE SUFIXO
// Avalia a capacidade de escolher a derivação correta para a função na oração
// com destaque para radical (ciano), vogal temática (preta) e afixos (coral/fúcsia)
// -------------------------------------------------------------
export const ITENS_FECHAMENTO_SINTATICO: FechamentoSintaticoItem[] = [
  {
    id: 'sint-1',
    fraseComLacuna: 'Aquele atleta correu com extraordinária ______ até cruzar a linha de chegada.',
    baseOriginal: 'rápido',
    opcoes: [
      { texto: 'rapidez', classe: 'Substantivo abstrato', sufixo: '-ez', correta: true, radical: 'rapid', vogalTematica: null, sufixo1: 'ez' },
      { texto: 'rápido', classe: 'Adjetivo', sufixo: '—', correta: false, radical: 'rápid', vogalTematica: 'o', sufixo1: null },
      { texto: 'rapidamente', classe: 'Advérbio de modo', sufixo: '-mente', correta: false, radical: 'rapid', vogalTematica: 'a', sufixo1: 'mente' }
    ],
    respostaCorreta: 'rapidez',
    justificativaSintatica: 'A preposição "com" acompanhada do adjetivo "extraordinária" exige um substantivo núcleo ("com rapidez").'
  },
  {
    id: 'sint-2',
    fraseComLacuna: 'Ele explicou todas as dúvidas da turma de maneira muito ______.',
    baseOriginal: 'claro',
    opcoes: [
      { texto: 'clara', classe: 'Adjetivo feminino', sufixo: '-a', correta: true, radical: 'clar', vogalTematica: 'a', sufixo1: null },
      { texto: 'claridade', classe: 'Substantivo', sufixo: '-idade', correta: false, radical: 'clar', vogalTematica: 'i', sufixo1: 'dade' },
      { texto: 'clarear', classe: 'Verbo', sufixo: '-ear', correta: false, radical: 'clar', vogalTematica: 'e', sufixo1: 'ar' }
    ],
    respostaCorreta: 'clara',
    justificativaSintatica: 'A locução "de maneira..." qualifica o substantivo feminino "maneira", exigindo a concordância com o adjetivo flexionado no feminino ("de maneira muito clara").'
  },
  {
    id: 'sint-3',
    fraseComLacuna: 'Os pesquisadores comemoraram uma grande ______ no laboratório.',
    baseOriginal: 'descobrir',
    opcoes: [
      { texto: 'descoberta', classe: 'Substantivo de resultado', sufixo: '—', correta: true, prefixo: 'des', radical: 'cobert', vogalTematica: 'a', sufixo1: null },
      { texto: 'descobridor', classe: 'Substantivo de agente', sufixo: '-dor', correta: false, prefixo: 'des', radical: 'cobri', vogalTematica: null, sufixo1: 'dor' },
      { texto: 'descobre', classe: 'Forma verbal', sufixo: '-e', correta: false, prefixo: 'des', radical: 'cobr', vogalTematica: 'e', sufixo1: null }
    ],
    respostaCorreta: 'descoberta',
    justificativaSintatica: 'Após o artigo indefinido "uma" e o adjetivo "grande", a sintaxe da frase exige o substantivo feminino que designa o achado ("uma grande descoberta").'
  },
  {
    id: 'sint-4',
    fraseComLacuna: 'O jovem sempre demonstrou total ______ com seus companheiros de equipe.',
    baseOriginal: 'leal',
    opcoes: [
      { texto: 'leal', classe: 'Adjetivo', sufixo: '—', correta: false, radical: 'leal', vogalTematica: null, sufixo1: null },
      { texto: 'lealdade', classe: 'Substantivo abstrato', sufixo: '-dade', correta: true, radical: 'leal', vogalTematica: null, sufixo1: 'dade' },
      { texto: 'lealmente', classe: 'Advérbio', sufixo: '-mente', correta: false, radical: 'leal', vogalTematica: null, sufixo1: 'mente' }
    ],
    respostaCorreta: 'lealdade',
    justificativaSintatica: 'O adjetivo "total" qualifica um substantivo ("total lealdade").'
  },
  {
    id: 'sint-5',
    fraseComLacuna: 'Para proteger a natureza, os voluntários decidiram ______ a margem do rio.',
    baseOriginal: 'flor',
    opcoes: [
      { texto: 'reflorestar', classe: 'Verbo no infinitivo', sufixo: '-ar', correta: true, prefixo: 're', radical: 'flor', vogalTematica: 'a', sufixo1: 'estar' },
      { texto: 'florestal', classe: 'Adjetivo', sufixo: '-al', correta: false, radical: 'flor', vogalTematica: null, sufixo1: 'estal' },
      { texto: 'reflorestamento', classe: 'Substantivo', sufixo: '-mento', correta: false, prefixo: 're', radical: 'flor', vogalTematica: null, sufixo1: 'estamento' }
    ],
    respostaCorreta: 'reflorestar',
    justificativaSintatica: 'Após o verbo auxiliar "decidiram", o complemento oracional direto requer um verbo no infinitivo ("decidiram reflorestar").'
  },
  {
    id: 'sint-6',
    fraseComLacuna: 'A nova máquina facilitou as tarefas com incrível ______ e precisão.',
    baseOriginal: 'fácil',
    opcoes: [
      { texto: 'facilidade', classe: 'Substantivo abstrato', sufixo: '-idade', correta: true, radical: 'facil', vogalTematica: 'i', sufixo1: 'dade' },
      { texto: 'facilitar', classe: 'Verbo', sufixo: '-ar', correta: false, radical: 'facil', vogalTematica: 'i', sufixo1: 'tar' },
      { texto: 'facilmente', classe: 'Advérbio', sufixo: '-mente', correta: false, radical: 'facil', vogalTematica: null, sufixo1: 'mente' }
    ],
    respostaCorreta: 'facilidade',
    justificativaSintatica: 'Coordena-se com o substantivo "precisão" antecedido de preposição ("com facilidade e precisão").'
  }
];

// -------------------------------------------------------------
// 7. INFORMAÇÕES CIENTÍFICAS E DIRETRIZES CLÍNICAS EM FONOAUDIOLOGIA
// -------------------------------------------------------------
export const INFO_CIENTIFICA_MORFOLOGIA = {
  autor: 'Mara Daher — Fonoaudiologia',
  titulacao: 'Linguagem e Aprendizagem | Prática Baseada em Evidências',
  contribuicoes: [
    {
      titulo: 'Modelo Multidimensional da Consciência Morfológica',
      descricao: 'A consciência morfológica compreende sub-habilidades distintas e complementares: identificação de afixos, representações grafêmico-mentais (MGRs), consciência relacional (parentesco) e fechamento morfossintático.'
    },
    {
      titulo: 'Intervenção Estruturada em Linguagem e Alfabetização',
      descricao: 'Instrumentos fonoaudiológicos padronizados comprovam que avaliar subtestes específicos permite traçar perfis diagnósticos exatos e direcionar atividades sob medida para cada paciente em idade escolar.'
    },
    {
      titulo: 'Intervenção Multilinguística na Leitura e Escrita',
      descricao: 'Pesquisas contemporâneas comprovam que trabalhar explicitamente os morfemas reduz erros ortográficos opacos, melhora a decodificação de palavras polissilábicas e expande o vocabulário acadêmico de forma significativamente mais rápida.'
    },
    {
      titulo: 'Continuum de Transparência vs. Opacidade Morfológica (Joanne Carlisle)',
      descricao: 'Pioneira na fonoaudiologia e psicolinguística da leitura, Joanne F. Carlisle demonstrou que a consciência morfológica progride em um continuum: de palavras transparentes (flor -> florista, onde som e grafia do radical são 100% idênticos) para palavras com opacidade fonológica/deslocamento de acento tônico (músico -> musicista, dúvida -> duvidoso, fábrica -> fabricação), opacidade alomórfica do radical (infeliz -> infelicidade, luz -> lucidez, pão -> padeiro) e opacidade erudita etimológica (noite -> noturno, olho -> ocular, dente -> odontologia). Crianças com dislexia e transtorno do desenvolvimento da linguagem (TDL) dominam os pares transparentes, mas sofrem colapso nos pares com opacidade prosódica ou alomórfica.'
    },
    {
      titulo: 'Morfologia Gerativa e Raízes Produtivas',
      descricao: 'O ensino sistemático de morfemas e alomorfias frequentes capacita a criança a deduzir o significado e a ortografia correta de milhares de palavras derivadas não previamente memorizadas.'
    }
  ],
  orientacoesClinicas: [
    'Avalie e registre separadamente o desempenho do paciente em itens Transparentes vs. Itens Opacos (com deslocamento de acento como músico/musicista ou alomorfia como infelicidade).',
    'Nunca trate a morfologia de maneira descontextualizada: relacione sempre forma, significado e função sintática.',
    'Estimule a discriminação entre semelhança sonora superficial e relação de sentido real (evitando distratores como mar/martelo, sapato/sapa, pato/patologia).',
    'Destaque as adaptações de alomorfia da base (ex: feliz -> felic + i + dade = infelicidade/felicidade; ferr + ugem = ferrugem).',
    'Ensine a regra ortográfica fonoaudiológica dos sufixos: títulos com ESA (marquesa/baronesa) vs substantivos de adjetivo com EZA (beleza/certeza); verbos em ISAR com base em S (pesquisar) vs IZAR sem S (humanizar).',
    'Permita que a criança manipule visualmente as peças de palavras (prefixos, radicais, vogal temática e sufixos) antes da escrita.',
    'Utilize o relatório de desempenho e a exportação em PDF para monitorar ganhos longitudinais nas metas terapêuticas do plano individualizado.'
  ]
};
