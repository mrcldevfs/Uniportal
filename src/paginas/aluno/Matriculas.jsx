import { useState } from 'react'
import { useAcademico } from '../../dados/AcademicoContext'

function Matriculas() {
  const { disciplinas, matriculas, cancelarMatricula, concluirDisciplina } = useAcademico()
  const [mensagem, setMensagem] = useState(null)

  const cancelar = (matriculaId) => {
    const resultado = cancelarMatricula(matriculaId)
    setMensagem(resultado)
  }

  const concluir = (disciplinaId) => {
    setMensagem(concluirDisciplina(disciplinaId))
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
                const disciplina = disciplinas.find(
                  (item) => item.id === matricula.disciplinaId,
                )
                return (
                  <tr key={matricula.id}>
                        <td>
                          {disciplina
                            ? `${disciplina.codigo} - ${disciplina.nome}`
                            : `Disciplina removida (ID: ${matricula.disciplinaId})`}
                        </td>
                    <td>{matricula.data}</td>
                    <td>
                          <span className={`badge text-bg-${matricula.situacao === 'Ativa' ? 'success' : matricula.situacao === 'Concluída' ? 'primary' : 'secondary'}`}>
                        {matricula.situacao}
                      </span>
                    </td>
                    <td className="text-end">
                      {matricula.situacao === 'Ativa' && (
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                className="btn btn-outline-success btn-sm"
                                onClick={() => concluir(matricula.disciplinaId)}
                              >
                                Concluir disciplina
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => cancelar(matricula.id)}
                              >
                                Cancelar matrícula
                              </button>
                            </div>
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
