import { Link } from 'react-router-dom'
import { useAcademico } from '../../dados/AcademicoContext'
import { montarGrade } from '../../services/consultasAluno'
import { DIAS_DA_GRADE, TURNOS } from '../../services/horarios'

function CartaoDeAula({ disciplina, horario }) {
  return (
    <div className="bg-primary-subtle border rounded p-2 small mb-1">
      <div className="fw-semibold">
        {disciplina.codigo} - {disciplina.nome}
      </div>
      <div className="text-secondary">
        {horario.inicio}–{horario.fim}
      </div>
      <div className="text-secondary">{disciplina.professor}</div>
      {horario.codigo && <div className="text-secondary">código {horario.codigo}</div>}
    </div>
  )
}

function GradeHoraria() {
  // A grade é calculada a partir das matrículas ativas: matricular ou cancelar
  // atualiza esta tela automaticamente, sem nenhuma ação extra.
  const contexto = useAcademico()
  const { matriz, foraDaGrade } = montarGrade(contexto)
  const totalMatriculadas = contexto.matriculasAtivas.length

  return (
    <section>
      <h2>Grade horária</h2>
      <p className="text-secondary mb-4">
        Suas aulas organizadas por dia da semana e turno, com base nas matrículas ativas.
      </p>

      {totalMatriculadas === 0 && (
        <div className="alert alert-info">
          Sua grade horária está vazia.{' '}
          <Link to="/aluno/disciplinas" className="alert-link">
            Ver disciplinas disponíveis
          </Link>
        </div>
      )}

      <div className="bg-white rounded-3 border table-responsive">
        <table className="table table-bordered align-middle mb-0" style={{ minWidth: '720px' }}>
          <caption className="visually-hidden">Grade horária semanal do aluno</caption>

          <thead>
            <tr>
              <th scope="col" style={{ width: '90px' }}>
                Turno
              </th>
              {DIAS_DA_GRADE.map((dia) => (
                <th key={dia} scope="col" className="text-center">
                  {dia}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {TURNOS.map((turno) => (
              <tr key={turno.numero}>
                <th scope="row">{turno.nome}</th>

                {DIAS_DA_GRADE.map((dia) => {
                  const aulas = matriz[dia][turno.numero]

                  return (
                    <td key={dia} className="p-2" style={{ height: '90px', verticalAlign: 'top' }}>
                      {aulas.length === 0 ? (
                        <>
                          <span className="text-secondary" aria-hidden="true">
                            —
                          </span>
                          <span className="visually-hidden">Sem aula</span>
                        </>
                      ) : (
                        aulas.map(({ disciplina, horario }) => (
                          <CartaoDeAula
                            key={`${disciplina.id}-${horario.inicio}`}
                            disciplina={disciplina}
                            horario={horario}
                          />
                        ))
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {foraDaGrade.length > 0 && (
        <div className="mt-3">
          <h3 className="h6">Aulas em outros dias ou horários</h3>
          {foraDaGrade.map(({ disciplina, horario }) => (
            <div key={`${disciplina.id}-${horario.dia}-${horario.inicio}`} className="small">
              {disciplina.codigo} - {disciplina.nome}: {horario.rotulo}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default GradeHoraria
