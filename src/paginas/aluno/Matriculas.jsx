import { useState } from 'react'
import { useAcademico } from '../../dados/AcademicoContext'

function Matriculas() {
  const { disciplinas, matriculas, cancelarMatricula } = useAcademico()
  const [mensagem, setMensagem] = useState(null)

  const cancelar = (matriculaId) => {
    setMensagem(cancelarMatricula(matriculaId))
  }

  return (
    <section>
      <h2>Minhas matrículas</h2>
      <p className="text-secondary mb-4">
        Acompanhe a situação das suas matrículas e cancele inscrições ativas.
      </p>
      {mensagem && (
        <div className={`alert alert-${mensagem.sucesso ? 'success' : 'danger'}`}>
          {mensagem.mensagem}
        </div>
      )}
      {!matriculas.length ? (
        <div className="alert alert-info">Você ainda não possui matrículas.</div>
      ) : (
        <div className="table-responsive bg-white rounded border">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr><th>Disciplina</th><th>Data</th><th>Situação</th><th /></tr>
            </thead>
            <tbody>
              {matriculas.map((matricula) => {
                const turmaId = matricula.turmaId ?? matricula.disciplinaId
                const disciplina = disciplinas.find((item) => String(item.id) === String(turmaId))
                return (
                  <tr key={matricula.id}>
                    <td>{disciplina?.codigo} - {disciplina?.nome}</td>
                    <td>{matricula.data}</td>
                    <td>
                      <span className={`badge text-bg-${matricula.situacao === 'Ativa' ? 'success' : 'secondary'}`}>
                        {matricula.situacao}
                      </span>
                    </td>
                    <td className="text-end">
                      {matricula.situacao === 'Ativa' && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => cancelar(matricula.id)}
                        >
                          Cancelar matrícula
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Matriculas
