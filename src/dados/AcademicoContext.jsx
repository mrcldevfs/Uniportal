/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useRef, useState } from 'react'
import { getData, saveData } from '../services/storage'

export const disciplinas = [
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

export const disciplinasConcluidas = new Set(['algoritmos-1'])
const AcademicoContext = createContext(null)

export function horariosConflitam(primeira, segunda) {
  return primeira.some((horario) =>
    segunda.some(
      (outroHorario) =>
        horario.dia === outroHorario.dia &&
        horario.inicio < outroHorario.fim &&
        outroHorario.inicio < horario.fim,
    ),
  )
}

export function obterVagasDisponiveis(disciplina, matriculas) {
  return disciplina.vagas -
    matriculas.filter(
      (matricula) =>
        matricula.situacao === 'Ativa' &&
        matricula.disciplinaId === disciplina.id,
    ).length
}

export function validarMatricula(disciplinaId, matriculasAtuais) {
  const disciplina = disciplinas.find((item) => item.id === disciplinaId)
  if (!disciplina) {
    return { sucesso: false, mensagem: 'Disciplina não encontrada.' }
  }

  const matriculasAtivas = matriculasAtuais.filter(
    (matricula) => matricula.situacao === 'Ativa',
  )

  if (disciplinasConcluidas.has(disciplina.id)) {
    return { sucesso: false, mensagem: 'Você já concluiu esta disciplina.' }
  }

  if (matriculasAtivas.some((matricula) => matricula.disciplinaId === disciplina.id)) {
    return { sucesso: false, mensagem: 'Você já está matriculado nesta disciplina.' }
  }

  const faltantes = disciplina.preRequisitos.filter(
    (preRequisito) => !disciplinasConcluidas.has(preRequisito),
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
    .map((matricula) => disciplinas.find((item) => item.id === matricula.disciplinaId))
    .find((matriculaDisciplina) =>
      matriculaDisciplina
        ? horariosConflitam(matriculaDisciplina.horarios, disciplina.horarios)
        : false,
    )
  if (conflito) {
    return {
      sucesso: false,
      mensagem: `Conflito de horário com ${conflito.nome}.`,
    }
  }

  return { sucesso: true, mensagem: 'Matrícula realizada com sucesso.' }
}

export function AcademicoProvider({ children }) {
  const [matriculas, setMatriculas] = useState(() => {
    const salvas = getData('matriculas')
    return Array.isArray(salvas) ? salvas : []
  })
  const matriculasRef = useRef(matriculas)
  const [concluidas, setConcluidas] = useState(() => {
    const salvas = getData('disciplinasConcluidas')
    if (!Array.isArray(salvas)) return new Set(disciplinasConcluidas)

    const idsValidos = salvas.filter((id) => disciplinas.some((disciplina) => disciplina.id === id))
    const conjunto = new Set(disciplinasConcluidas)
    idsValidos.forEach((id) => conjunto.add(id))
    disciplinasConcluidas.clear()
    conjunto.forEach((id) => disciplinasConcluidas.add(id))
    return conjunto
  })

  const atualizarMatriculas = (proximasMatriculas) => {
    matriculasRef.current = proximasMatriculas
    setMatriculas(proximasMatriculas)
    saveData('matriculas', proximasMatriculas)
  }

  const matriculasAtivas = matriculas.filter(
    (matricula) => matricula.situacao === 'Ativa',
  )

  const vagasDisponiveis = (disciplina) =>
    obterVagasDisponiveis(disciplina, matriculas)

  const matricular = (disciplinaId) => {
    const matriculasAtuais = matriculasRef.current
    const validacao = validarMatricula(disciplinaId, matriculasAtuais)
    if (!validacao.sucesso) return validacao

    const disciplina = disciplinas.find((item) => item.id === disciplinaId)

    const novasMatriculas = [
      ...matriculasAtuais,
      {
        id: `${disciplina.id}-${Date.now()}-${matriculasAtuais.length}`,
        disciplinaId: disciplina.id,
        situacao: 'Ativa',
        data: new Date().toLocaleDateString('pt-BR'),
      },
    ]
    atualizarMatriculas(novasMatriculas)
    return { sucesso: true, mensagem: 'Matrícula realizada com sucesso.' }
  }

  const cancelarMatricula = (matriculaId) => {
    const matricula = matriculasRef.current.find((item) => item.id === matriculaId)
    if (!matricula || matricula.situacao !== 'Ativa') {
      return { sucesso: false, mensagem: 'Esta matrícula não está ativa.' }
    }

    const matriculasAtualizadas = matriculasRef.current.map((item) =>
      item.id === matriculaId ? { ...item, situacao: 'Cancelada' } : item,
    )
    atualizarMatriculas(matriculasAtualizadas)
    return { sucesso: true, mensagem: 'Matrícula cancelada com sucesso.' }
  }

  const concluirDisciplina = (disciplinaId) => {
    const disciplina = disciplinas.find((item) => item.id === disciplinaId)
    if (!disciplina) {
      return { sucesso: false, mensagem: 'Disciplina não encontrada.' }
    }
    if (concluidas.has(disciplinaId)) {
      return { sucesso: false, mensagem: 'Esta disciplina já está registrada como concluída.' }
    }

    const proximasConcluidas = new Set(concluidas)
    proximasConcluidas.add(disciplinaId)
    disciplinasConcluidas.clear()
    proximasConcluidas.forEach((id) => disciplinasConcluidas.add(id))
    setConcluidas(proximasConcluidas)
    saveData('disciplinasConcluidas', Array.from(proximasConcluidas))

    const matriculasAtualizadas = matriculasRef.current.map((matricula) =>
      matricula.disciplinaId === disciplinaId && matricula.situacao === 'Ativa'
        ? { ...matricula, situacao: 'Concluída' }
        : matricula,
    )
    atualizarMatriculas(matriculasAtualizadas)

    return { sucesso: true, mensagem: `${disciplina.nome} registrada como concluída.` }
  }

  const registrarDisciplinaConcluida = concluirDisciplina
  const marcarDisciplinaConcluida = concluirDisciplina

  const valor = {
    disciplinas,
    matriculas,
    matriculasAtivas,
    disciplinasConcluidas: concluidas,
    vagasDisponiveis,
    matricular,
    cancelarMatricula,
    concluirDisciplina,
    registrarDisciplinaConcluida,
    marcarDisciplinaConcluida,
  }

  return (
    <AcademicoContext.Provider value={valor}>
      {children}
    </AcademicoContext.Provider>
  )
}

// O hook permanece junto ao contexto para preservar a API pública do módulo.
export function useAcademico() {
  const contexto = useContext(AcademicoContext)
  if (!contexto) {
    throw new Error('useAcademico deve ser usado dentro de AcademicoProvider.')
  }
  return contexto
}
