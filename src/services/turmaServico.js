// Serviço para gerenciar turmas e ofertas acadêmicas (Pessoa 2)

const CHAVE_STORAGE = '@Uniportal:turmas';

const turmasIniciais = [
  { 
    id: 1, 
    codigo: 'TURMA-2026-1', 
    disciplina: 'Desenvolvimento Web', 
    professor: 'Ana Carolina Souza', 
    periodo: '2º período', 
    turno: 'Noturno', 
    diasSemana: 'Segunda e Quarta', 
    horario: '19:10 - 22:35', 
    vagasTotais: 40, 
    vagasOcupadas: 15 
  },
  { 
    id: 2, 
    codigo: 'TURMA-2026-2', 
    disciplina: 'Banco de Dados', 
    professor: 'Bruno Martins', 
    periodo: '3º período', 
    turno: 'Noturno', 
    diasSemana: 'Terça e Quinta', 
    horario: '19:10 - 22:35', 
    vagasTotais: 35, 
    vagasOcupadas: 20 
  }
];

function numeroNaoNegativo(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? Math.max(0, Math.floor(numero)) : 0;
}

export function normalizarTurma(turma) {
  const vagasTotais = numeroNaoNegativo(turma.vagasTotais);
  const vagasOcupadas = Math.min(
    numeroNaoNegativo(turma.vagasOcupadas),
    vagasTotais,
  );

  return {
    ...turma,
    vagasTotais,
    vagasOcupadas,
  };
}

export const turmaServico = {
  listar() {
    let dados;
    try {
      dados = localStorage.getItem(CHAVE_STORAGE);
    } catch {
      return turmasIniciais.map(normalizarTurma);
    }
    if (!dados) {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(turmasIniciais));
      return turmasIniciais.map(normalizarTurma);
    }

    try {
      const turmas = JSON.parse(dados);
      if (!Array.isArray(turmas)) throw new Error('Formato inválido');
      return turmas.map(normalizarTurma);
    } catch {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(turmasIniciais));
      return turmasIniciais.map(normalizarTurma);
    }
  },

  salvar(turma) {
    const turmas = this.listar();
    if (turma.id) {
      const index = turmas.findIndex(t => t.id === turma.id);
      if (index !== -1) {
        const ocupadasInformadas =
          turma.vagasOcupadas === '' || turma.vagasOcupadas === undefined
            ? turmas[index].vagasOcupadas
            : turma.vagasOcupadas;
        turmas[index] = normalizarTurma({ ...turmas[index], ...turma, vagasOcupadas: ocupadasInformadas });
      }
    } else {
      turma.id = Date.now();
      turmas.push(normalizarTurma(turma));
    }
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(turmas));
    return turma;
  },

  remover(id) {
    let turmas = this.listar();
    turmas = turmas.filter(t => t.id !== id);
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(turmas));
    return turmas;
  }
};