import { describe, expect, it } from 'vitest'
import {
  horariosConflitam,
  obterVagasDisponiveis,
  validarMatricula,
} from './AcademicoContext'

const disciplinas = [
  {
    id: 'algoritmos-1',
    codigo: 'INF101',
    nome: 'Algoritmos e Programação I',
    professor: 'Mariana Costa',
    vagas: 2,
    preRequisitos: [],
    horarios: [
      { dia: 'Segunda', inicio: '08:00', fim: '10:00' },
      { dia: 'Quarta', inicio: '08:00', fim: '10:00' },
    ],
  },
  {
    id: 'algoritmos-2',
    codigo: 'INF201',
    nome: 'Algoritmos e Programação II',
    professor: 'Rafael Lima',
    vagas: 3,
    preRequisitos: ['algoritmos-1'],
    horarios: [
      { dia: 'Terça', inicio: '08:00', fim: '10:00' },
      { dia: 'Quinta', inicio: '08:00', fim: '10:00' },
    ],
  },
  {
    id: 'banco-dados',
    codigo: 'INF301',
    nome: 'Banco de Dados',
    professor: 'Ana Souza',
    vagas: 1,
    preRequisitos: ['algoritmos-1'],
    horarios: [
      { dia: 'Segunda', inicio: '08:00', fim: '10:00' },
      { dia: 'Quarta', inicio: '10:00', fim: '12:00' },
    ],
  },
  {
    id: 'engenharia-software',
    codigo: 'INF401',
    nome: 'Engenharia de Software',
    professor: 'Carlos Mendes',
    vagas: 0,
    preRequisitos: ['algoritmos-2'],
    horarios: [
      { dia: 'Terça', inicio: '10:00', fim: '12:00' },
      { dia: 'Quinta', inicio: '10:00', fim: '12:00' },
    ],
  },
]

const disciplinasConcluidas = new Set(['algoritmos-1'])

describe('regras acadêmicas de matrícula', () => {
  it('matricula com sucesso quando todas as regras são atendidas', () => {
    const disciplina = disciplinas.find((item) => item.id === 'algoritmos-2')
    expect(validarMatricula(disciplina.id, [], disciplinas, disciplinasConcluidas)).toEqual({
      sucesso: true,
      mensagem: 'Matrícula realizada com sucesso.',
    })
  })

  it('impede matrícula em disciplina inexistente', () => {
    expect(validarMatricula('inexistente', [], disciplinas, disciplinasConcluidas).sucesso).toBe(false)
  })

  it('impede matrícula sem vagas', () => {
    const disciplina = disciplinas.find((item) => item.id === 'engenharia-software')
    const comPreReqs = new Set(['algoritmos-1', 'algoritmos-2'])
    expect(obterVagasDisponiveis(disciplina, [])).toBe(0)
    expect(validarMatricula(disciplina.id, [], disciplinas, comPreReqs).mensagem).toBe(
      'Não há vagas disponíveis nesta turma.',
    )
  })

  it('impede matrícula duplicada', () => {
    const disciplina = disciplinas.find((item) => item.id === 'algoritmos-2')
    const matriculas = [{ disciplinaId: disciplina.id, situacao: 'Ativa' }]
    expect(validarMatricula(disciplina.id, matriculas, disciplinas, disciplinasConcluidas).mensagem).toBe(
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
    expect(
      validarMatricula(disciplina.id, [], disciplinas, new Set()).mensagem,
    ).toContain('Pré-requisito não atendido')
  })

  it('impede disciplina já concluída', () => {
    const disciplina = disciplinas.find((item) => item.id === 'algoritmos-1')
    expect(validarMatricula(disciplina.id, [], disciplinas, disciplinasConcluidas).mensagem).toBe(
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
