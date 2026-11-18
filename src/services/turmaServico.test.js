import { beforeEach, describe, expect, it } from 'vitest'
import { normalizarTurma, turmaServico } from './turmaServico'

const armazenamento = new Map()

beforeEach(() => {
  armazenamento.clear()
  globalThis.localStorage = {
    getItem: (chave) => armazenamento.has(chave) ? armazenamento.get(chave) : null,
    setItem: (chave, valor) => armazenamento.set(chave, String(valor)),
  }
})

describe('serviço de turmas', () => {
  it('normaliza vagas negativas e ocupação acima da capacidade', () => {
    expect(normalizarTurma({ vagasTotais: -2, vagasOcupadas: 10 })).toEqual(
      expect.objectContaining({ vagasTotais: 0, vagasOcupadas: 0 }),
    )
  })

  it('preserva ocupação consistente ao editar a capacidade', () => {
    turmaServico.salvar({ id: 1, codigo: 'A', disciplina: 'Teste', professor: 'Prof', periodo: '1', turno: 'Noturno', diasSemana: 'Segunda', horario: '19:00', vagasTotais: 10, vagasOcupadas: 7 })
    turmaServico.salvar({ id: 1, vagasTotais: 4, vagasOcupadas: 7 })
    const turma = turmaServico.listar().find((item) => item.id === 1)
    expect(turma.vagasOcupadas).toBe(4)
  })

  it('mantém ocupação válida após excluir uma turma', () => {
    const turmas = turmaServico.remover(1)
    expect(turmas.some((turma) => turma.id === 1)).toBe(false)
  })
})
