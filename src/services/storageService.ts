/**
 * Serviço de Persistência Local para Pacientes e Sessões Clínicas
 * Salva e recupera dados entre sessões usando LocalStorage com fallback em memória.
 */

export interface Paciente {
  id: string;
  nome: string;
  idadeOuAno?: string;
  dataCadastro: number;
}

export interface SessaoClinica {
  id: string;
  pacienteId: string;
  nomePaciente: string;
  dataTimestamp: number;
  dataFormatada: string;
  pontuacao: number;
  palavrasValidas: string[];
  palavrasInvalidas: string[];
  stats: {
    decomposicaoAcertos: number;
    decomposicaoTotal: number;
    parentescoAcertos: number;
    parentescoTotal: number;
    sintaxeAcertos: number;
    sintaxeTotal: number;
  };
  notasClinicas: string;
}

const STORAGE_KEYS = {
  PACIENTES: 'morfofabrica_pacientes_v2',
  SESSOES: 'morfofabrica_sessoes_v2',
  PACIENTE_ATIVO: 'morfofabrica_paciente_ativo_v2',
};

// Pacientes padrão iniciais para demonstração fonoaudiológica imediata
const PACIENTES_INICIAIS: Paciente[] = [
  { id: 'pac-1', nome: 'Lucas Silva', idadeOuAno: '4º ano fundamental', dataCadastro: Date.now() - 86400000 * 7 },
  { id: 'pac-2', nome: 'Beatriz Santos', idadeOuAno: '3º ano fundamental', dataCadastro: Date.now() - 86400000 * 3 },
  { id: 'pac-3', nome: 'Enzo Oliveira', idadeOuAno: '5º ano fundamental', dataCadastro: Date.now() - 86400000 * 1 },
];

export const storageService = {
  getPacientes(): Paciente[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PACIENTES);
      if (data) return JSON.parse(data);
      // Inicializa com pacientes modelo
      localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(PACIENTES_INICIAIS));
      return PACIENTES_INICIAIS;
    } catch {
      return PACIENTES_INICIAIS;
    }
  },

  salvarPaciente(novoPaciente: Paciente): Paciente[] {
    try {
      const lista = this.getPacientes();
      const index = lista.findIndex((p) => p.id === novoPaciente.id);
      let atualizada: Paciente[];
      if (index >= 0) {
        atualizada = lista.map((p) => (p.id === novoPaciente.id ? novoPaciente : p));
      } else {
        atualizada = [novoPaciente, ...lista];
      }
      localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(atualizada));
      return atualizada;
    } catch {
      return [novoPaciente];
    }
  },

  excluirPaciente(id: string): Paciente[] {
    try {
      const lista = this.getPacientes().filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(lista));
      return lista;
    } catch {
      return [];
    }
  },

  getPacienteAtivoId(): string {
    try {
      const id = localStorage.getItem(STORAGE_KEYS.PACIENTE_ATIVO);
      if (id) return id;
      const pacs = this.getPacientes();
      return pacs[0]?.id || 'pac-1';
    } catch {
      return 'pac-1';
    }
  },

  setPacienteAtivoId(id: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.PACIENTE_ATIVO, id);
    } catch {}
  },

  getSessoes(): SessaoClinica[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSOES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getSessoesPorPaciente(pacienteId: string): SessaoClinica[] {
    const sessoes = this.getSessoes();
    return sessoes.filter((s) => s.pacienteId === pacienteId).sort((a, b) => b.dataTimestamp - a.dataTimestamp);
  },

  salvarSessao(sessao: SessaoClinica): SessaoClinica[] {
    try {
      const sessoes = this.getSessoes();
      const filtradas = sessoes.filter((s) => s.id !== sessao.id);
      const atualizadas = [sessao, ...filtradas];
      localStorage.setItem(STORAGE_KEYS.SESSOES, JSON.stringify(atualizadas));
      return atualizadas;
    } catch {
      return [sessao];
    }
  },

  excluirSessao(sessaoId: string): SessaoClinica[] {
    try {
      const sessoes = this.getSessoes().filter((s) => s.id !== sessaoId);
      localStorage.setItem(STORAGE_KEYS.SESSOES, JSON.stringify(sessoes));
      return sessoes;
    } catch {
      return [];
    }
  },
};
