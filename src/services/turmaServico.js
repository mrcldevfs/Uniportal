import { getData, hasData, saveData } from './storage'
import { nomeDoDia } from './horarios'

const CHAVE = 'turmas'
const CHAVE_LEGADA = '@Uniportal:turmas'

function parsearDias(texto) {
  if (Array.isArray(texto)) return texto.map(d => nomeDoDia(d) ?? d).filter(Boolean)
  if (!texto) return []
  return texto
    .split(/\s*[,eE]\s*/)
    .map(d => nomeDoDia(d.trim()))
    .filter(Boolean)
}

function parsearHorario(texto) {
  if (!texto || typeof texto !== 'string') return { inicio: '', fim: '' }
  const match = texto.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/)
  return match ? { inicio: match[1], fim: match[2] } : { inicio: texto, fim: '' }
}

function normalizarTurma(t) {
  const disciplinas = getData('disciplinas')
  const professores = getData('professores')
  const disciplinaLegada = !t.disciplinaId && t.disciplina
    ? disciplinas.find((disciplina) => disciplina.nome === t.disciplina)
    : null
  const professorLegado = !t.professorId && t.professor
    ? professores.find((professor) => professor.nome === t.professor)
    : null

  const base = {
    ...t,
    professorId: t.professorId ?? professorLegado?.id ?? null,
    disciplinaId: t.disciplinaId ?? disciplinaLegada?.id ?? null,
    vagasTotais: Number(t.vagasTotais) || 40,
    vagasOcupadas: Number(t.vagasOcupadas) || 0,
  }
  if (Array.isArray(t.dias) && t.inicio !== undefined) return base
  const { inicio, fim } = parsearHorario(t.horario || '')
  return { ...base, dias: parsearDias(t.diasSemana || ''), inicio, fim }
}

const turmasIniciais = [
  {
    id: 1,
    codigo: 'TURMA-2026-1',
    disciplina: 'Desenvolvimento Web',
    disciplinaId: 'disc-2',
    professor: 'Ana Carolina Souza',
    professorId: 'prof-1',
    periodo: '2º período',
    turno: 'Noturno',
    dias: ['Segunda', 'Quarta'],
    inicio: '19:10',
    fim: '22:35',
    vagasTotais: 40,
    vagasOcupadas: 0,
  },
  {
    id: 2,
    codigo: 'TURMA-2026-2',
    disciplina: 'Banco de Dados',
    disciplinaId: 'disc-3',
    professor: 'Bruno Martins',
    professorId: 'prof-2',
    periodo: '3º período',
    turno: 'Noturno',
    dias: ['Terça', 'Quinta'],
    inicio: '19:10',
    fim: '22:35',
    vagasTotais: 35,
    vagasOcupadas: 0,
  },
]

export const turmaServico = {
  listar() {
    // Migra dados da chave legada, se existir
    if (!localStorage.getItem(`uniportal_${CHAVE}`) && localStorage.getItem(CHAVE_LEGADA)) {
      try {
        const antigos = JSON.parse(localStorage.getItem(CHAVE_LEGADA))
        saveData(CHAVE, antigos.map(normalizarTurma))
        localStorage.removeItem(CHAVE_LEGADA)
      } catch { /* ignora erros de parse */ }
    }

    const dados = getData(CHAVE)
    if (!hasData(CHAVE)) {
      saveData(CHAVE, turmasIniciais)
      return turmasIniciais
    }
    const normalizadas = dados.map(normalizarTurma)
    const mudou = normalizadas.some((turma, indice) => {
      const original = dados[indice]
      return String(turma.disciplinaId ?? '') !== String(original.disciplinaId ?? '') ||
        String(turma.professorId ?? '') !== String(original.professorId ?? '')
    })
    if (mudou) saveData(CHAVE, normalizadas)
    return normalizadas
  },

  salvar(turma) {
    const turmas = this.listar()
    const normalizada = normalizarTurma(turma)
    if (normalizada.id) {
      const idx = turmas.findIndex(t => t.id === normalizada.id)
      if (idx !== -1) turmas[idx] = normalizada
      else turmas.push(normalizada)
    } else {
      normalizada.id = Date.now()
      turmas.push(normalizada)
    }
    saveData(CHAVE, turmas)
    return normalizada
  },

  remover(id) {
    const turmas = this.listar().filter(t => t.id !== id)
    saveData(CHAVE, turmas)
    return turmas
  },

  atualizarOcupacao(turmaId, delta) {
    const turmas = this.listar()
    const turma = turmas.find(t => String(t.id) === String(turmaId))
    if (!turma) return
    turma.vagasOcupadas = Math.max(0, turma.vagasOcupadas + delta)
    saveData(CHAVE, turmas)
  },
}
