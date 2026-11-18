import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getData, hasData, removeData, saveData } from './storage'
import { obterDadosInstitucionais, salvarDadosInstitucionais } from './institution'

function criarLocalStorage() {
  const dados = new Map()

  return {
    getItem(chave) {
      return dados.has(chave) ? dados.get(chave) : null
    },
    setItem(chave, valor) {
      dados.set(chave, String(valor))
    },
    removeItem(chave) {
      dados.delete(chave)
    },
    clear() {
      dados.clear()
    },
  }
}

describe('serviço de persistência', () => {
  beforeEach(() => {
    globalThis.localStorage = criarLocalStorage()
  })

  afterEach(() => {
    delete globalThis.localStorage
    vi.restoreAllMocks()
  })

  it('retorna uma lista vazia quando a chave não existe', () => {
    expect(getData('matriculas')).toEqual([])
    expect(hasData('matriculas')).toBe(false)
  })

  it('salva e recupera dados usando o prefixo do UniPortal', () => {
    const matriculas = [{ id: 'mat-1', situacao: 'Ativa' }]

    expect(saveData('matriculas', matriculas)).toBe(true)
    expect(hasData('matriculas')).toBe(true)
    expect(getData('matriculas')).toEqual(matriculas)
  })

  it('preserva uma lista vazia já salva, sem tratá-la como chave ausente', () => {
    saveData('disciplinas', [])

    expect(hasData('disciplinas')).toBe(true)
    expect(getData('disciplinas')).toEqual([])
  })

  it('retorna lista vazia quando o conteúdo salvo não é um JSON válido', () => {
    globalThis.localStorage.setItem('uniportal_matriculas', '{invalido')

    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(getData('matriculas')).toEqual([])
  })

  it('remove dados persistidos', () => {
    saveData('matriculas', [{ id: 'mat-1' }])

    expect(removeData('matriculas')).toBe(true)
    expect(hasData('matriculas')).toBe(false)
    expect(getData('matriculas')).toEqual([])
  })

  it('não lança exceção quando o armazenamento não está disponível', () => {
    delete globalThis.localStorage
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(getData('matriculas')).toEqual([])
    expect(hasData('matriculas')).toBe(false)
    expect(saveData('matriculas', [])).toBe(false)
    expect(removeData('matriculas')).toBe(false)
  })
})

describe('serviço de dados institucionais', () => {
  beforeEach(() => {
    globalThis.localStorage = criarLocalStorage()
  })

  afterEach(() => {
    delete globalThis.localStorage
  })

  it('inicializa disciplinas de demonstração somente quando não existem dados', () => {
    const disciplinas = obterDadosInstitucionais('disciplinas')

    expect(disciplinas).toHaveLength(5)
    expect(getData('disciplinas')).toEqual(disciplinas)
  })

  it('não substitui uma lista vazia salva pelo usuário pelos dados iniciais', () => {
    salvarDadosInstitucionais('disciplinas', [])

    expect(obterDadosInstitucionais('disciplinas')).toEqual([])
  })
})
