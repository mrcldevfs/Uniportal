import { useAcademico } from '../../dados/AcademicoContext'

function GradeHoraria() {
  const { disciplinas, matriculasAtivas } = useAcademico()
  const matriculas = matriculasAtivas
    .map((matricula) =>
      disciplinas.find((disciplina) => disciplina.id === matricula.disciplinaId),
    )
    .filter(Boolean)

  return (
    <section>
      <h2>Grade horária</h2>
      <p className="text-secondary mb-4">
        Horários das disciplinas com matrícula ativa.
      </p>
      {!matriculas.length ? (
        <div className="alert alert-info">Sua grade horária está vazia.</div>
      ) : (
        <div className="row g-3">
          {matriculas.flatMap((disciplina) =>
            disciplina.horarios.map((horario) => (
              <div className="col-md-6" key={`${disciplina.id}-${horario.dia}`}>
                <div className="card border-primary h-100">
                  <div className="card-body">
                    <h3 className="h5 mb-1">{disciplina.codigo} - {disciplina.nome}</h3>
                    <p className="mb-0">{horario.dia}: {horario.inicio} às {horario.fim}</p>
                  </div>
                </div>
              </div>
            )),
          )}
        </div>
      )}
    </section>
  )
}

export default GradeHoraria
