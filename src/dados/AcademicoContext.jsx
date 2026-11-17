import { createContext, useContext, useRef, useState } from 'react'

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
const AcademicoContext = createContext(null)

function horariosConflitam(primeira, segunda) {
  return primeira.some((horario) =>
    segunda.some(
      (outroHorario) =>
        horario.dia === outroHorario.dia &&
        horario.inicio < outroHorario.fim &&
        outroHorario.inicio < horario.fim,
    ),
  )
}

function obterVagasDisponiveis(disciplina, matriculas) {
  return disciplina.vagas -
    matriculas.filter(
      (matricula) =>
        matricula.situacao === 'Ativa' &&
        matricula.disciplinaId === disciplina.id,
    ).length
}

export function AcademicoProvider({ children }) {
  const [matriculas, setMatriculas] = useState([])
  const matriculasRef = useRef(matriculas)

  const matriculasAtivas = matriculas.filter(
    (matricula) => matricula.situacao === 'Ativa',
  )

  const vagasDisponiveis = (disciplina) =>
    obterVagasDisponiveis(disciplina, matriculas)

  const matricular = (disciplinaId) => {
    const disciplina = disciplinas.find((item) => item.id === disciplinaId)
    if (!disciplina) {
      return { sucesso: false, mensagem: 'Disciplina não encontrada.' }
    }

    const matriculasAtuais = matriculasRef.current
    const matriculasAtivasAtuais = matriculasAtuais.filter(
      (matricula) => matricula.situacao === 'Ativa',
    )

    if (disciplinasConcluidas.has(disciplina.id)) {
      return {
        sucesso: false,
        mensagem: 'Você já concluiu esta disciplina.',
      }
    }

    if (
      matriculasAtivasAtuais.some(
        (matricula) => matricula.disciplinaId === disciplina.id,
      )
    ) {
      return { sucesso: false, mensagem: 'Você já está matriculado nesta disciplina.' }
    }

    if (obterVagasDisponiveis(disciplina, matriculasAtuais) <= 0) {
      return { sucesso: false, mensagem: 'Não há vagas disponíveis nesta turma.' }
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

    const conflito = matriculasAtivasAtuais
      .map((matricula) =>
        disciplinas.find((item) => item.id === matricula.disciplinaId),
      )
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

    const novasMatriculas = [
      ...matriculasAtuais,
      {
        id: `${disciplina.id}-${Date.now()}`,
        disciplinaId: disciplina.id,
        situacao: 'Ativa',
        data: new Date().toLocaleDateString('pt-BR'),
      },
    ]
    matriculasRef.current = novasMatriculas
    setMatriculas(novasMatriculas)
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
    matriculasRef.current = matriculasAtualizadas
    setMatriculas(matriculasAtualizadas)
    return { sucesso: true, mensagem: 'Matrícula cancelada com sucesso.' }
  }

  const valor = {
    disciplinas,
    matriculas,
    matriculasAtivas,
    disciplinasConcluidas,
    vagasDisponiveis,
    matricular,
    cancelarMatricula,
  }

  return (
    <AcademicoContext.Provider value={valor}>
      {children}
    </AcademicoContext.Provider>
  )
}

// O hook permanece junto ao contexto para preservar a API pública do módulo.
// eslint-disable-next-line react-refresh/only-export-components
export function useAcademico() {
  const contexto = useContext(AcademicoContext)
  if (!contexto) {
    throw new Error('useAcademico deve ser usado dentro de AcademicoProvider.')
  }
  return contexto
}
