import { useState } from 'react'
import { useAcademico } from '../../dados/AcademicoContext'

function DisciplinasDisponiveis() {
  const { disciplinas, matriculasAtivas, vagasDisponiveis, matricular } =
    useAcademico()
  const [mensagem, setMensagem] = useState(null)

  const realizarMatricula = (disciplinaId) => {
    const resultado = matricular(disciplinaId)
    setMensagem(resultado)
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
        <div className={`alert alert-${mensagem.sucesso ? 'success' : 'danger'}`}>
          {mensagem.mensagem}
        </div>
      )}

      <div className="row g-3">
        {disciplinas.map((disciplina) => {
          const matriculado = matriculasAtivas.some(
            (matricula) => matricula.disciplinaId === disciplina.id,
          )
          const vagas = vagasDisponiveis(disciplina)
          return (
            <div className="col-md-6" key={disciplina.id}>
              <article className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between gap-2">
                    <h3 className="h5">{disciplina.codigo} - {disciplina.nome}</h3>
                    <span className={`badge text-bg-${vagas > 0 ? 'success' : 'secondary'} h-100`}>
                      {vagas} vaga(s)
                    </span>
                  </div>
                  <p className="text-secondary mb-2">Professor: {disciplina.professor}</p>
                  <p className="small mb-2">
                    <strong>Horários:</strong>{' '}
                    {disciplina.horarios.map((horario) =>
                      `${horario.dia}, ${horario.inicio}-${horario.fim}`,
                    ).join(' | ')}
                  </p>
                  <p className="small mb-3">
                    <strong>Pré-requisitos:</strong>{' '}
                    {disciplina.preRequisitos.length
                      ? disciplina.preRequisitos.map((id) =>
                        disciplinas.find((item) => item.id === id)?.codigo,
                      ).join(', ')
                      : 'Nenhum'}
                  </p>
                  <button
                    className="btn btn-primary"
                    disabled={matriculado || vagas <= 0}
                    onClick={() => realizarMatricula(disciplina.id)}
                  >
                    {matriculado ? 'Matriculado' : 'Matricular-se'}
                  </button>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default DisciplinasDisponiveis
