// Consultas somente de leitura do portal do aluno.
import { DIAS_DA_GRADE, TURNOS, detalharHorario, horasSemanais } from './horarios'

const mesmoId = (a, b) => String(a) === String(b)
const idDaDisciplina = (oferta) => oferta.disciplinaId ?? oferta.id
const idDaTurmaNaMatricula = (matricula) => matricula.turmaId ?? matricula.disciplinaId

function ofertaDaMatricula(matricula, disciplinas) {
  const turmaId = idDaTurmaNaMatricula(matricula)
  return disciplinas.find((item) => mesmoId(item.id, turmaId)) ??
    disciplinas.find((item) => mesmoId(idDaDisciplina(item), matricula.disciplinaId))
}

export function analisarDisciplina(disciplina, contexto) {
  const { disciplinas, matriculasAtivas, disciplinasConcluidas, vagasDisponiveis } = contexto
  const capacidade = disciplina.vagas
  const vagas = Math.max(vagasDisponiveis(disciplina), 0)

  const preRequisitos = disciplina.preRequisitos.map((id) => {
    const requisito = disciplinas.find((item) => mesmoId(idDaDisciplina(item), id))
    return {
      id,
      codigo: requisito?.codigo ?? id,
      nome: requisito?.nome ?? id,
      cumprido: disciplinasConcluidas.has(id),
    }
  })

  const ofertasMatriculadas = matriculasAtivas
    .map((matricula) => ofertaDaMatricula(matricula, disciplinas))
    .filter(Boolean)
  const conflito = ofertasMatriculadas.find((oferta) =>
    oferta.horarios.some((horario) =>
      disciplina.horarios.some(
        (outroHorario) =>
          horario.dia === outroHorario.dia &&
          horario.inicio < outroHorario.fim &&
          outroHorario.inicio < horario.fim,
      ),
    ),
  )

  return {
    disciplina,
    capacidade,
    vagas,
    ocupadas: Math.max(capacidade - vagas, 0),
    lotada: vagas === 0,
    matriculado: matriculasAtivas.some((matricula) =>
      mesmoId(idDaDisciplinaNaMatricula(matricula, disciplinas), idDaDisciplina(disciplina)),
    ),
    concluida: disciplinasConcluidas.has(idDaDisciplina(disciplina)),
    preRequisitos,
    preRequisitosCumpridos: preRequisitos.every((requisito) => requisito.cumprido),
    conflitoHorario: conflito?.nome ?? null,
    horarios: disciplina.horarios.map(detalharHorario),
    horasSemanais: horasSemanais(disciplina.horarios),
  }
}

function idDaDisciplinaNaMatricula(matricula, disciplinas) {
  if (matricula.turmaId !== undefined && matricula.turmaId !== null) return matricula.disciplinaId
  return idDaDisciplina(ofertaDaMatricula(matricula, disciplinas) ?? { id: matricula.disciplinaId })
}

function ordenarPorInicio(a, b) {
  return a.horario.inicio.localeCompare(b.horario.inicio)
}

export function resumirAluno(contexto, hoje) {
  const analises = contexto.disciplinas.map((disciplina) => analisarDisciplina(disciplina, contexto))
  const matriculadas = analises.filter((analise) => analise.matriculado)

  return {
    totalMatriculadas: matriculadas.length,
    horasSemanais: Math.round(matriculadas.reduce((soma, analise) => soma + analise.horasSemanais, 0) * 10) / 10,
    totalConcluidas: contexto.disciplinasConcluidas.size,
    podemSerCursadas: analises.filter(
      (analise) => !analise.matriculado && !analise.concluida && !analise.lotada && analise.preRequisitosCumpridos,
    ).length,
    aulasDeHoje: matriculadas
      .flatMap((analise) =>
        analise.horarios
          .filter((horario) => horario.dia === hoje)
          .map((horario) => ({ disciplina: analise.disciplina, horario })),
      )
      .sort(ordenarPorInicio),
  }
}

export function montarGrade(contexto) {
  const matriz = {}
  for (const dia of DIAS_DA_GRADE) {
    matriz[dia] = {}
    for (const turno of TURNOS) matriz[dia][turno.numero] = []
  }

  const foraDaGrade = []
  for (const disciplina of contexto.disciplinas) {
    const matriculado = contexto.matriculasAtivas.some((matricula) =>
      mesmoId(idDaDisciplinaNaMatricula(matricula, contexto.disciplinas), idDaDisciplina(disciplina)),
    )
    if (!matriculado) continue

    for (const horario of disciplina.horarios.map(detalharHorario)) {
      const celula = matriz[horario.dia]?.[horario.turno]
      if (celula) celula.push({ disciplina, horario })
      else foraDaGrade.push({ disciplina, horario })
    }
  }

  for (const dia of DIAS_DA_GRADE) {
    for (const turno of TURNOS) matriz[dia][turno.numero].sort(ordenarPorInicio)
  }

  return { matriz, foraDaGrade }
}
