import { useEffect, useRef } from 'react'
import BadgeVagas from './BadgeVagas'

// Janela com os detalhes de uma disciplina ofertada.
// `analise` vem de analisarDisciplina() (services/consultasAluno.js).
// `onMatricular` é o mesmo manipulador usado pelo botão do cartão (regras da Pessoa 4).
function DisciplinaDetalhesModal({ analise, onFechar, onMatricular }) {
  const dialogoRef = useRef(null)
  const { disciplina } = analise

  useEffect(() => {
    dialogoRef.current?.focus()
  }, [])

  useEffect(() => {
    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', aoPressionarTecla)
    return () => document.removeEventListener('keydown', aoPressionarTecla)
  }, [onFechar])

  const percentualOcupado =
    analise.capacidade > 0 ? Math.round((analise.ocupadas / analise.capacidade) * 100) : 100

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div
        ref={dialogoRef}
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-disciplina-detalhes"
        tabIndex={-1}
        onClick={(evento) => {
          if (evento.target === evento.currentTarget) onFechar()
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <p className="text-secondary small mb-0">{disciplina.codigo}</p>
                <h2 className="modal-title fs-5" id="titulo-disciplina-detalhes">
                  {disciplina.nome}
                </h2>
              </div>
              <button type="button" className="btn-close" aria-label="Fechar" onClick={onFechar} />
            </div>

            <div className="modal-body">
              <dl className="row mb-0">
                <dt className="col-sm-4">Professor</dt>
                <dd className="col-sm-8">{disciplina.professor}</dd>

                <dt className="col-sm-4">Horários</dt>
                <dd className="col-sm-8">
                  <ul className="list-unstyled mb-0">
                    {analise.horarios.map((horario) => (
                      <li key={`${horario.dia}-${horario.inicio}`}>
                        {horario.rotulo}
                        <span className="text-secondary">
                          {horario.nomeTurno && ` · ${horario.nomeTurno}`}
                          {horario.codigo && ` (código ${horario.codigo})`}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <span className="text-secondary small">{analise.horasSemanais} h de aula por semana</span>
                </dd>

                <dt className="col-sm-4">Vagas</dt>
                <dd className="col-sm-8">
                  <BadgeVagas vagas={analise.vagas} capacidade={analise.capacidade} />
                  <div
                    className="progress mt-2"
                    role="progressbar"
                    aria-label="Ocupação da turma"
                    aria-valuenow={percentualOcupado}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="progress-bar" style={{ width: `${percentualOcupado}%` }} />
                  </div>
                  <span className="text-secondary small">
                    {analise.ocupadas} de {analise.capacidade} vagas ocupadas
                  </span>
                </dd>

                <dt className="col-sm-4">Pré-requisitos</dt>
                <dd className="col-sm-8 mb-0">
                  {analise.preRequisitos.length === 0 ? (
                    <span className="text-secondary">Nenhum</span>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {analise.preRequisitos.map((requisito) => (
                        <li key={requisito.id} className="d-flex justify-content-between gap-2">
                          <span>
                            {requisito.codigo} - {requisito.nome}
                          </span>
                          <span className={`badge text-bg-${requisito.cumprido ? 'success' : 'danger'}`}>
                            {requisito.cumprido ? 'Cumprido' : 'Pendente'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </dl>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onFechar}>
                Fechar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={
                  analise.matriculado ||
                  analise.concluida ||
                  analise.vagas <= 0 ||
                  !analise.preRequisitosCumpridos ||
                  Boolean(analise.conflitoHorario)
                }
                onClick={() => onMatricular(disciplina.id)}
              >
                {analise.matriculado
                  ? 'Matriculado'
                  : analise.concluida
                    ? 'Já cursada'
                    : analise.vagas <= 0
                      ? 'Sem vagas'
                      : !analise.preRequisitosCumpridos
                        ? 'Pré-requisitos pendentes'
                        : analise.conflitoHorario
                          ? 'Conflito de horário'
                          : 'Matricular-se'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DisciplinaDetalhesModal
