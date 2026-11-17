import { describe, expect, it } from 'vitest'
import {
  disciplinas,
  disciplinasConcluidas,
  horariosConflitam,
  obterVagasDisponiveis,
  validarMatricula,
} from './AcademicoContext'

describe('regras acadêmicas de matrícula', () => {
  it('matricula com sucesso quando todas as regras são atendidas', () => {
    const disciplina = disciplinas.find((item) => item.id === 'algoritmos-2')
    expect(validarMatricula(disciplina.id, [])).toEqual({
      sucesso: true,
      mensagem: 'Matrícula realizada com sucesso.',
    })
  })

  it('impede matrícula em disciplina inexistente', () => {
    expect(validarMatricula('inexistente', []).sucesso).toBe(false)
  })

  it('impede matrícula sem vagas e atualiza a ocupação', () => {
    const disciplina = disciplinas.find((item) => item.id === 'engenharia-software')
    disciplinasConcluidas.add('algoritmos-2')
    try {
      expect(obterVagasDisponiveis(disciplina, [])).toBe(0)
      expect(validarMatricula(disciplina.id, []).mensagem).toBe(
        'Não há vagas disponíveis nesta turma.',
      )
    } finally {
      disciplinasConcluidas.delete('algoritmos-2')
    }
  })

  it('impede matrícula duplicada', () => {
    const disciplina = disciplinas.find((item) => item.id === 'algoritmos-2')
    const matriculas = [
      { disciplinaId: disciplina.id, situacao: 'Ativa' },
    ]
    expect(validarMatricula(disciplina.id, matriculas).mensagem).toBe(
      'Você já está matriculado nesta disciplina.',
    )
  })

  it('impede conflito de horários', () => {
    const primeira = disciplinas.find((item) => item.id === 'algoritmos-1')
    const segunda = disciplinas.find((item) => item.id === 'banco-dados')
    expect(horariosConflitam(primeira.horarios, segunda.horarios)).toBe(true)
  })

  it('impede matrícula sem pré-requisitos', () => {
    const disciplina = disciplinas.find((item) => item.id === 'engenharia-software')
    expect(validarMatricula(disciplina.id, []).mensagem).toContain(
      'Pré-requisito não atendido',
    )
  })

  it('impede disciplina já concluída', () => {
    const disciplina = disciplinas.find((item) => item.id === 'algoritmos-1')
    expect(validarMatricula(disciplina.id, []).mensagem).toBe(
      'Você já concluiu esta disciplina.',
    )
  })

  it('recupera vaga quando a matrícula ativa é cancelada', () => {
    const disciplina = disciplinas.find((item) => item.id === 'algoritmos-2')
    const matriculas = [
      { disciplinaId: disciplina.id, situacao: 'Ativa' },
      { disciplinaId: disciplina.id, situacao: 'Cancelada' },
    ]
    expect(obterVagasDisponiveis(disciplina, matriculas)).toBe(2)
  })
})
