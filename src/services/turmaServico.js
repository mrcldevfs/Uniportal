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

export const turmaServico = {
  listar() {
    const dados = localStorage.getItem(CHAVE_STORAGE);
    if (!dados) {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(turmasIniciais));
      return turmasIniciais;
    }
    
    // Garante que registros antigos tenham as propriedades de vagas preenchidas
    const turmas = JSON.parse(dados);
    return turmas.map(t => ({
      ...t,
      vagasTotais: Number(t.vagasTotais) || 40,
      vagasOcupadas: Number(t.vagasOcupadas) || 0
    }));
  },

  salvar(turma) {
    const turmas = this.listar();
    if (turma.id) {
      const index = turmas.findIndex(t => t.id === turma.id);
      if (index !== -1) {
        turmas[index] = turma;
      }
    } else {
      turma.id = Date.now();
      turma.vagasTotais = Number(turma.vagasTotais) || 0;
      turma.vagasOcupadas = Number(turma.vagasOcupadas) || 0;
      turmas.push(turma);
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