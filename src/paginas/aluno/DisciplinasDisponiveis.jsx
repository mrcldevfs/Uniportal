import { useState } from 'react'
import BadgeVagas from '../../componentes/BadgeVagas'
import DisciplinaDetalhesModal from '../../componentes/DisciplinaDetalhesModal'
import { useAcademico } from '../../dados/AcademicoContext'
import { analisarDisciplina } from '../../services/consultasAluno'
import { DIAS_DA_GRADE, TURNOS } from '../../services/horarios'

function DisciplinasDisponiveis() {
  const contexto = useAcademico()
  const { disciplinas, matricular } = contexto

  const [mensagem, setMensagem] = useState(null)
  const [busca, setBusca] = useState('')
  const [dia, setDia] = useState('')
  const [turno, setTurno] = useState('')
  const [somenteComVagas, setSomenteComVagas] = useState(false)
  const [detalhesId, setDetalhesId] = useState(null)

  const analises = disciplinas.map((disciplina) => analisarDisciplina(disciplina, contexto))

  // Aplica todos os filtros de uma vez sobre a lista completa.
  const termo = busca.trim().toLowerCase()
  const analisesFiltradas = analises.filter(({ disciplina, horarios, lotada }) => {
    const texto = `${disciplina.nome} ${disciplina.codigo} ${disciplina.professor}`.toLowerCase()

    if (termo && !texto.includes(termo)) return false
    if (dia && !horarios.some((horario) => horario.dia === dia)) return false
    if (turno && !horarios.some((horario) => String(horario.turno) === turno)) return false
    if (somenteComVagas && lotada) return false

    return true
  })

  const analiseEmDetalhe = analises.find((analise) => analise.disciplina.id === detalhesId)

  // Regras de matrícula (vagas, duplicidade, pré-requisitos, conflito) ficam no contexto.
  const realizarMatricula = (disciplinaId) => {
    setMensagem(matricular(disciplinaId))
    setDetalhesId(null)
  }

  const limparFiltros = () => {
    setBusca('')
    setDia('')
    setTurno('')
    setSomenteComVagas(false)
  }

  return (
    <section>
      <div className="mb-4">
        <h2>Disciplinas disponíveis</h2>
        <p className="text-secondary">
          Consulte as turmas e faça sua matrícula respeitando as regras acadêmicas.
        </p>
      </div>

      {mensagem && (
        <div className={`alert alert-${mensagem.sucesso ? 'success' : 'danger'}`} role="alert">
          {mensagem.mensagem}
        </div>
      )}

      <form className="bg-white rounded-3 border p-3 mb-3" onSubmit={(evento) => evento.preventDefault()}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-4">
            <label htmlFor="filtro-busca" className="form-label">
              Buscar
            </label>
            <input
              id="filtro-busca"
              type="search"
              className="form-control"
              placeholder="Disciplina, código ou professor"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>

          <div className="col-6 col-lg-2">
            <label htmlFor="filtro-dia" className="form-label">
              Dia
            </label>
            <select
              id="filtro-dia"
              className="form-select"
              value={dia}
              onChange={(evento) => setDia(evento.target.value)}
            >
              <option value="">Todos</option>
              {DIAS_DA_GRADE.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-lg-2">
            <label htmlFor="filtro-turno" className="form-label">
              Turno
            </label>
            <select
              id="filtro-turno"
              className="form-select"
              value={turno}
              onChange={(evento) => setTurno(evento.target.value)}
            >
              <option value="">Todos</option>
              {TURNOS.map((item) => (
                <option key={item.numero} value={item.numero}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-lg-4 d-flex align-items-center justify-content-between gap-3">
            <div className="form-check mb-0">
              <input
                id="filtro-vagas"
                type="checkbox"
                className="form-check-input"
                checked={somenteComVagas}
                onChange={(evento) => setSomenteComVagas(evento.target.checked)}
              />
              <label htmlFor="filtro-vagas" className="form-check-label">
                Somente com vagas
              </label>

            <button type="button" className="btn btn-outline-secondary" onClick={limparFiltros}>
              Limpar filtros
            </button>
          </div>
        </div>
      </form>

      <p className="text-secondary small" aria-live="polite">
        {analisesFiltradas.length} {analisesFiltradas.length === 1 ? 'disciplina encontrada' : 'disciplinas encontradas'}
      </p>

      {analisesFiltradas.length === 0 ? (
        <div className="alert alert-info">Nenhuma disciplina corresponde aos filtros escolhidos.</div>
      ) : (
        <div className="row g-3">
          {analisesFiltradas.map((analise) => {
            const { disciplina } = analise

            return (
              <div className="col-md-6" key={disciplina.id}>
                <article className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between gap-2">
                      <h3 className="h5">
                        {disciplina.codigo} - {disciplina.nome}
                      </h3>
                      <span className="align-self-start text-nowrap">
                        <BadgeVagas vagas={analise.vagas} capacidade={analise.capacidade} />
                      </span>
                    </div>

                    <p className="text-secondary mb-2">Professor: {disciplina.professor}</p>

                    <p className="small mb-2">
                      <strong>Horários:</strong> {analise.horarios.map((horario) => horario.rotulo).join(' | ')}
                    </p>

                    <p className="small mb-2">
                      <strong>Pré-requisitos:</strong>{' '}
                      {analise.preRequisitos.length
                        ? analise.preRequisitos.map((requisito) => requisito.codigo).join(', ')
                        : 'Nenhum'}
                    </p>

                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {analise.matriculado && <span className="badge text-bg-primary">Matriculado</span>}
                      {analise.concluida && <span className="badge text-bg-secondary">Já cursada</span>}
                      {!analise.preRequisitosCumpridos && (
                        <span className="badge text-bg-warning">Pré-requisito pendente</span>
                      )}
                    </div>

                    <div className="d-flex flex-wrap gap-2 mt-auto">
                      <button
                        className="btn btn-primary"
                        disabled={analise.matriculado || analise.vagas <= 0}
                        onClick={() => realizarMatricula(disciplina.id)}
                      >
                        {analise.matriculado ? 'Matriculado' : 'Matricular-se'}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setDetalhesId(disciplina.id)}
                      >
                        Detalhes
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      )}

      {analiseEmDetalhe && (
        <DisciplinaDetalhesModal
          analise={analiseEmDetalhe}
          onFechar={() => setDetalhesId(null)}
          onMatricular={realizarMatricula}
        />
      )}
    </section>
  )
}

export default DisciplinasDisponiveis
