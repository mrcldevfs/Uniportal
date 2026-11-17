// Consultas (somente leitura) do portal do aluno (Pessoa 3).
//
// Estas funções NÃO alteram dados: recebem o que o AcademicoContext já oferece
// (disciplinas, matrículas ativas, concluídas e vagasDisponiveis) e montam as
// informações que as telas precisam. Matricular e cancelar continuam no contexto
// (Pessoa 4), e a persistência fica com a Pessoa 5.

import { DIAS_DA_GRADE, TURNOS, detalharHorario, horasSemanais } from './horarios'

// Situação completa de uma disciplina para o aluno: vagas, pré-requisitos, horários...
export function analisarDisciplina(disciplina, contexto) {
  const { disciplinas, matriculasAtivas, disciplinasConcluidas, vagasDisponiveis } = contexto

  const capacidade = disciplina.vagas
  const vagas = Math.max(vagasDisponiveis(disciplina), 0)

  const preRequisitos = disciplina.preRequisitos.map((id) => {
    const requisito = disciplinas.find((item) => item.id === id)
    return {
      id,
      codigo: requisito?.codigo ?? id,
      nome: requisito?.nome ?? id,
      cumprido: disciplinasConcluidas.has(id),
    }
  })

  const conflito = matriculasAtivas
    .map((matricula) => disciplinas.find((item) => item.id === matricula.disciplinaId))
    .find((matriculaDisciplina) =>
      matriculaDisciplina
        ? matriculaDisciplina.horarios.some((horario) =>
            disciplina.horarios.some(
              (outroHorario) =>
                horario.dia === outroHorario.dia &&
                horario.inicio < outroHorario.fim &&
                outroHorario.inicio < horario.fim,
            ),
          )
        : false,
    )

  return {
    disciplina,
    capacidade,
    vagas,
    ocupadas: Math.max(capacidade - vagas, 0),
    lotada: vagas === 0,
    matriculado: matriculasAtivas.some((matricula) => matricula.disciplinaId === disciplina.id),
    concluida: disciplinasConcluidas.has(disciplina.id),
    preRequisitos,
    preRequisitosCumpridos: preRequisitos.every((requisito) => requisito.cumprido),
    conflitoHorario: conflito?.nome ?? null,
    horarios: disciplina.horarios.map(detalharHorario),
    horasSemanais: horasSemanais(disciplina.horarios),
  }
}

function ordenarPorInicio(a, b) {
  return a.horario.inicio.localeCompare(b.horario.inicio)
}

// Números do painel inicial. `hoje` é o nome do dia ('Segunda', 'Terça'...).
export function resumirAluno(contexto, hoje) {
  const analises = contexto.disciplinas.map((disciplina) => analisarDisciplina(disciplina, contexto))
  const matriculadas = analises.filter((analise) => analise.matriculado)

  return {
    totalMatriculadas: matriculadas.length,
    horasSemanais: Math.round(matriculadas.reduce((soma, a) => soma + a.horasSemanais, 0) * 10) / 10,
    totalConcluidas: contexto.disciplinasConcluidas.size,
    // Disciplinas em que o aluno poderia se matricular agora.
    podemSerCursadas: analises.filter(
      (a) => !a.matriculado && !a.concluida && !a.lotada && a.preRequisitosCumpridos,
    ).length,
    aulasDeHoje: matriculadas
      .flatMap((a) =>
        a.horarios.filter((horario) => horario.dia === hoje).map((horario) => ({ disciplina: a.disciplina, horario })),
      )
      .sort(ordenarPorInicio),
  }
}

// Grade individual: matriz[dia][turno] = aulas daquele dia e turno, em ordem de horário.
// Horários fora de segunda–sábado ou sem turno reconhecido vão para `foraDaGrade`,
// para nenhuma aula desaparecer da tela.
export function montarGrade(contexto) {
  const matriz = {}
  for (const dia of DIAS_DA_GRADE) {
    matriz[dia] = {}
    for (const turno of TURNOS) {
      matriz[dia][turno.numero] = []
    }
  }

  const foraDaGrade = []

  for (const disciplina of contexto.disciplinas) {
    const matriculado = contexto.matriculasAtivas.some((m) => m.disciplinaId === disciplina.id)
    if (!matriculado) continue

    for (const horario of disciplina.horarios.map(detalharHorario)) {
      const celula = matriz[horario.dia]?.[horario.turno]
      if (celula) {
        celula.push({ disciplina, horario })
      } else {
        foraDaGrade.push({ disciplina, horario })
      }
    }
  }

  for (const dia of DIAS_DA_GRADE) {
    for (const turno of TURNOS) {
      matriz[dia][turno.numero].sort(ordenarPorInicio)
    }
  }

  return { matriz, foraDaGrade }
}
