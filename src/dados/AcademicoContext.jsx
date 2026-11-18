/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useRef, useState } from 'react'
import { getData, saveData } from '../services/storage'
import { turmaServico } from '../services/turmaServico'

const AcademicoContext = createContext(null)

export function horariosConflitam(primeira, segunda) {
  return primeira.some((horario) =>
    segunda.some(
      (outro) =>
        horario.dia === outro.dia &&
        horario.inicio < outro.fim &&
        outro.inicio < horario.fim,
    ),
  )
}

export function obterVagasDisponiveis(disciplina, matriculas) {
  return (
    disciplina.vagas -
    matriculas.filter(
      (m) => m.situacao === 'Ativa' && m.disciplinaId === disciplina.id,
    ).length
  )
}

export function validarMatricula(disciplinaId, matriculasAtuais, disciplinas, disciplinasConcluidas) {
  const disciplina = disciplinas.find((item) => item.id === disciplinaId)
  if (!disciplina) {
    return { sucesso: false, mensagem: 'Disciplina não encontrada.' }
  }

  const matriculasAtivas = matriculasAtuais.filter((m) => m.situacao === 'Ativa')

  if (disciplinasConcluidas.has(disciplina.id)) {
    return { sucesso: false, mensagem: 'Você já concluiu esta disciplina.' }
  }

  if (matriculasAtivas.some((m) => m.disciplinaId === disciplina.id)) {
    return { sucesso: false, mensagem: 'Você já está matriculado nesta disciplina.' }
  }

  const faltantes = disciplina.preRequisitos.filter(
    (req) => !disciplinasConcluidas.has(req),
  )
  if (faltantes.length > 0) {
    const nomes = faltantes
      .map((id) => disciplinas.find((item) => item.id === id)?.nome)
      .filter(Boolean)
    return {
      sucesso: false,
      mensagem: `Pré-requisito não atendido: ${nomes.join(', ')}.`,
    }
  }

  if (obterVagasDisponiveis(disciplina, matriculasAtuais) <= 0) {
    return { sucesso: false, mensagem: 'Não há vagas disponíveis nesta turma.' }
  }

  const conflito = matriculasAtivas
    .map((m) => disciplinas.find((item) => item.id === m.disciplinaId))
    .find((d) => d && horariosConflitam(d.horarios, disciplina.horarios))

  if (conflito) {
    return {
      sucesso: false,
      mensagem: `Conflito de horário com ${conflito.nome}.`,
    }
  }

  return { sucesso: true, mensagem: 'Matrícula realizada com sucesso.' }
}

function turmasParaDisciplinas(turmas) {
  return turmas.map((turma) => ({
    id: String(turma.id),
    codigo: turma.codigo,
    nome: turma.disciplina,
    professor: turma.professor,
    vagas: turma.vagasTotais,
    preRequisitos: [],
    horarios: (turma.dias || []).map((dia) => ({
      dia,
      inicio: turma.inicio || '',
      fim: turma.fim || '',
    })),
  }))
}

export function AcademicoProvider({ children }) {
  const [matriculas, setMatriculas] = useState(() => {
    const salvas = getData('matriculas')
    return Array.isArray(salvas) ? salvas : []
  })
  const matriculasRef = useRef(matriculas)

  const [disciplinasConcluidasIds, setDisciplinasConcluidasIds] = useState(() => {
    const salvas = getData('disciplinas-concluidas')
    return Array.isArray(salvas) ? salvas : []
  })

  const atualizarMatriculas = (proximas) => {
    matriculasRef.current = proximas
    setMatriculas(proximas)
    saveData('matriculas', proximas)
  }

  const disciplinas = turmasParaDisciplinas(turmaServico.listar())
  const disciplinasConcluidas = new Set(disciplinasConcluidasIds)
  const matriculasAtivas = matriculas.filter((m) => m.situacao === 'Ativa')
  const vagasDisponiveis = (disciplina) => obterVagasDisponiveis(disciplina, matriculas)

  const matricular = (disciplinaId) => {
    const matriculasAtuais = matriculasRef.current
    const validacao = validarMatricula(disciplinaId, matriculasAtuais, disciplinas, disciplinasConcluidas)
    if (!validacao.sucesso) return validacao

    const novas = [
      ...matriculasAtuais,
      {
        id: `${disciplinaId}-${Date.now()}-${matriculasAtuais.length}`,
        disciplinaId,
        situacao: 'Ativa',
        data: new Date().toLocaleDateString('pt-BR'),
      },
    ]
    atualizarMatriculas(novas)
    turmaServico.atualizarOcupacao(Number(disciplinaId), 1)
    return { sucesso: true, mensagem: 'Matrícula realizada com sucesso.' }
  }

  const cancelarMatricula = (matriculaId) => {
    const matricula = matriculasRef.current.find((m) => m.id === matriculaId)
    if (!matricula || matricula.situacao !== 'Ativa') {
      return { sucesso: false, mensagem: 'Esta matrícula não está ativa.' }
    }

    const atualizadas = matriculasRef.current.map((m) =>
      m.id === matriculaId ? { ...m, situacao: 'Cancelada' } : m,
    )
    atualizarMatriculas(atualizadas)
    turmaServico.atualizarOcupacao(Number(matricula.disciplinaId), -1)
    return { sucesso: true, mensagem: 'Matrícula cancelada com sucesso.' }
  }

  const concluirDisciplina = (disciplinaId) => {
    if (disciplinasConcluidasIds.includes(disciplinaId)) return
    const atualizadas = [...disciplinasConcluidasIds, disciplinaId]
    setDisciplinasConcluidasIds(atualizadas)
    saveData('disciplinas-concluidas', atualizadas)
  }

  return (
    <AcademicoContext.Provider
      value={{
        disciplinas,
        matriculas,
        matriculasAtivas,
        disciplinasConcluidas,
        vagasDisponiveis,
        matricular,
        cancelarMatricula,
        concluirDisciplina,
      }}
    >
      {children}
    </AcademicoContext.Provider>
  )
}

export function useAcademico() {
  const contexto = useContext(AcademicoContext)
  if (!contexto) {
    throw new Error('useAcademico deve ser usado dentro de AcademicoProvider.')
  }
  return contexto
}
