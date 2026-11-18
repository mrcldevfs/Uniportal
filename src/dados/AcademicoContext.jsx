/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useRef, useState } from 'react'
import { getData, saveData } from '../services/storage'
import { turmaServico } from '../services/turmaServico'
import { obterDadosInstitucionais } from '../services/institution'

const AcademicoContext = createContext(null)

const mesmoId = (a, b) => String(a) === String(b)
const idDaDisciplina = (oferta) => oferta.disciplinaId ?? oferta.id
const idDaTurmaNaMatricula = (matricula) => matricula.turmaId ?? matricula.disciplinaId

function idDaDisciplinaNaMatricula(matricula, disciplinas) {
  if (matricula.turmaId !== undefined && matricula.turmaId !== null) {
    return matricula.disciplinaId
  }
  const ofertaLegada = disciplinas.find((item) => mesmoId(item.id, matricula.disciplinaId))
  return ofertaLegada ? idDaDisciplina(ofertaLegada) : matricula.disciplinaId
}

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
  const matriculasAtivas = matriculas.filter(
    (matricula) =>
      matricula.situacao === 'Ativa' &&
      mesmoId(idDaTurmaNaMatricula(matricula), disciplina.id),
  ).length
  const ocupacaoRegistrada = Number(disciplina.vagasOcupadas) || 0

  // A ocupação já é atualizada no serviço de turmas ao matricular/cancelar.
  // Math.max evita descontar duas vezes as matrículas novas.
  return Math.max(disciplina.vagas - Math.max(ocupacaoRegistrada, matriculasAtivas), 0)
}

export function validarMatricula(turmaId, matriculasAtuais, disciplinas, disciplinasConcluidas) {
  const disciplina = disciplinas.find((item) => mesmoId(item.id, turmaId))
  if (!disciplina) {
    return { sucesso: false, mensagem: 'Disciplina não encontrada.' }
  }

  const disciplinaId = idDaDisciplina(disciplina)
  const matriculasAtivas = matriculasAtuais.filter((matricula) => matricula.situacao === 'Ativa')

  if (disciplinasConcluidas.has(disciplinaId)) {
    return { sucesso: false, mensagem: 'Você já concluiu esta disciplina.' }
  }

  if (
    matriculasAtivas.some((matricula) =>
      mesmoId(idDaDisciplinaNaMatricula(matricula, disciplinas), disciplinaId),
    )
  ) {
    return { sucesso: false, mensagem: 'Você já está matriculado nesta disciplina.' }
  }

  const faltantes = disciplina.preRequisitos.filter((requisitoId) =>
    !disciplinasConcluidas.has(requisitoId),
  )
  if (faltantes.length > 0) {
    const nomes = faltantes
      .map((requisitoId) =>
        disciplinas.find((item) => mesmoId(idDaDisciplina(item), requisitoId))?.nome,
      )
      .filter(Boolean)
    return {
      sucesso: false,
      mensagem: `Pré-requisito não atendido: ${nomes.join(', ') || faltantes.join(', ')}.`,
    }
  }

  if (obterVagasDisponiveis(disciplina, matriculasAtuais) <= 0) {
    return { sucesso: false, mensagem: 'Não há vagas disponíveis nesta turma.' }
  }

  const conflito = matriculasAtivas
    .map((matricula) => {
      const turmaIdMatriculada = idDaTurmaNaMatricula(matricula)
      return disciplinas.find((item) => mesmoId(item.id, turmaIdMatriculada)) ??
        disciplinas.find((item) =>
          mesmoId(idDaDisciplina(item), idDaDisciplinaNaMatricula(matricula, disciplinas)),
        )
    })
    .find((oferta) => oferta && horariosConflitam(oferta.horarios, disciplina.horarios))

  if (conflito) {
    return {
      sucesso: false,
      mensagem: `Conflito de horário com ${conflito.nome}.`,
    }
  }

  return { sucesso: true, mensagem: 'Matrícula realizada com sucesso.' }
}

function turmasParaDisciplinas(turmas) {
  const disciplinasInstitucionais = obterDadosInstitucionais('disciplinas')

  return turmas.map((turma) => {
    const disciplinaBase = disciplinasInstitucionais.find(
      (item) => mesmoId(item.id, turma.disciplinaId) || item.nome === turma.disciplina,
    )

    return {
      // id identifica a oferta; disciplinaId identifica a disciplina institucional.
      id: String(turma.id),
      disciplinaId: disciplinaBase?.id ?? turma.disciplinaId ?? null,
      codigo: disciplinaBase?.codigo ?? turma.codigo,
      codigoTurma: turma.codigo,
      nome: disciplinaBase?.nome ?? turma.disciplina,
      cargaHoraria: disciplinaBase?.cargaHoraria ?? null,
      creditos: disciplinaBase?.creditos ?? null,
      periodo: disciplinaBase?.periodo ?? turma.periodo,
      professor: turma.professor,
      vagas: turma.vagasTotais,
      vagasOcupadas: turma.vagasOcupadas,
      preRequisitos: disciplinaBase?.preRequisitos ?? [],
      horarios: (turma.dias || []).map((dia) => ({
        dia,
        inicio: turma.inicio || '',
        fim: turma.fim || '',
      })),
    }
  })
}

export function AcademicoProvider({ children }) {
  const disciplinas = turmasParaDisciplinas(turmaServico.listar())

  const [matriculas, setMatriculas] = useState(() => {
    const salvas = getData('matriculas')
    if (!Array.isArray(salvas)) return []

    // Migra o formato antigo, no qual disciplinaId guardava o ID da turma.
    return salvas.map((matricula) => {
      if (matricula.turmaId !== undefined && matricula.turmaId !== null) return matricula
      const oferta = disciplinas.find((item) => mesmoId(item.id, matricula.disciplinaId))
      return oferta
        ? { ...matricula, turmaId: oferta.id, disciplinaId: idDaDisciplina(oferta) }
        : matricula
    })
  })
  const matriculasRef = useRef(matriculas)

  const [disciplinasConcluidasIds, setDisciplinasConcluidasIds] = useState(() => {
    const salvas = getData('disciplinas-concluidas')
    if (!Array.isArray(salvas)) return []

    // Converte registros antigos que eventualmente guardavam o ID da turma.
    return [...new Set(salvas.map((id) => {
      const oferta = disciplinas.find((item) => mesmoId(item.id, id))
      return oferta ? idDaDisciplina(oferta) : id
    }))]
  })

  const atualizarMatriculas = (proximas) => {
    matriculasRef.current = proximas
    setMatriculas(proximas)
    saveData('matriculas', proximas)
  }

  const disciplinasConcluidas = new Set(disciplinasConcluidasIds)
  const matriculasAtivas = matriculas.filter((matricula) => matricula.situacao === 'Ativa')
  const vagasDisponiveis = (disciplina) => obterVagasDisponiveis(disciplina, matriculas)

  const matricular = (turmaId) => {
    const matriculasAtuais = matriculasRef.current
    const validacao = validarMatricula(turmaId, matriculasAtuais, disciplinas, disciplinasConcluidas)
    if (!validacao.sucesso) return validacao

    const oferta = disciplinas.find((item) => mesmoId(item.id, turmaId))
    const novas = [
      ...matriculasAtuais,
      {
        id: `${turmaId}-${Date.now()}-${matriculasAtuais.length}`,
        turmaId: oferta.id,
        disciplinaId: idDaDisciplina(oferta),
        situacao: 'Ativa',
        data: new Date().toLocaleDateString('pt-BR'),
      },
    ]
    atualizarMatriculas(novas)
    turmaServico.atualizarOcupacao(oferta.id, 1)
    return { sucesso: true, mensagem: 'Matrícula realizada com sucesso.' }
  }

  const cancelarMatricula = (matriculaId) => {
    const matricula = matriculasRef.current.find((item) => item.id === matriculaId)
    if (!matricula || matricula.situacao !== 'Ativa') {
      return { sucesso: false, mensagem: 'Esta matrícula não está ativa.' }
    }

    const atualizadas = matriculasRef.current.map((item) =>
      item.id === matriculaId ? { ...item, situacao: 'Cancelada' } : item,
    )
    atualizarMatriculas(atualizadas)
    turmaServico.atualizarOcupacao(idDaTurmaNaMatricula(matricula), -1)
    return { sucesso: true, mensagem: 'Matrícula cancelada com sucesso.' }
  }

  const concluirDisciplina = (id) => {
    const oferta = disciplinas.find((item) => mesmoId(item.id, id))
    const disciplinaId = oferta ? idDaDisciplina(oferta) : id
    if (disciplinasConcluidasIds.some((concluidaId) => mesmoId(concluidaId, disciplinaId))) return
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
