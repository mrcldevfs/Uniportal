
import { Link } from 'react-router-dom'
import { obterDadosInstitucionais } from '../../services/institution'

function PainelAdministrador() {
  const disciplinas = obterDadosInstitucionais('disciplinas')
  const professores = obterDadosInstitucionais('professores')
  const turmas = obterDadosInstitucionais('turmas')
  const matriculas = obterDadosInstitucionais('matriculas')
  const disciplinasRecentes = [...disciplinas].slice(-4).reverse()
  const professoresRecentes = professores.slice(0, 4)

  return (
    <section>
      <div className="mb-4">
        <h1 className="h3">Painel Administrativo</h1>
        <p className="text-secondary mb-0">Resumo geral da instituição.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><div className="card rounded-0"><div className="card-body"><h2 className="h6">Disciplinas</h2><p className="display-6 mb-0">{disciplinas.length}</p></div></div></div>
        <div className="col-sm-6 col-xl-3"><div className="card rounded-0"><div className="card-body"><h2 className="h6">Professores</h2><p className="display-6 mb-0">{professores.length}</p></div></div></div>
        <div className="col-sm-6 col-xl-3"><div className="card rounded-0"><div className="card-body"><h2 className="h6">Turmas</h2><p className="display-6 mb-0">{turmas.length}</p></div></div></div>
        <div className="col-sm-6 col-xl-3"><div className="card rounded-0"><div className="card-body"><h2 className="h6">Matrículas</h2><p className="display-6 mb-0">{matriculas.length}</p></div></div></div>
      </div>

      <div className="row g-3">
        <div className="col-lg-5">
          <section className="card rounded-0 h-100">
            <h2 className="card-header h6 bg-white">Dados da universidade</h2>
            <div className="card-body">
              <p><strong>Nome:</strong> UniPortal</p>
              <p><strong>Disciplinas:</strong> {disciplinas.length}</p>
              <p><strong>Professores:</strong> {professores.length}</p>
              <p><strong>Turmas:</strong> {turmas.length}</p>
              <p className="mb-3"><strong>Matrículas:</strong> {matriculas.length}</p>
              <Link to="/administrador/disciplinas" className="btn btn-primary btn-sm me-2">Ver disciplinas</Link>
              <Link to="/administrador/professores" className="btn btn-outline-secondary btn-sm">Ver professores</Link>
            </div>
          </section>
        </div>

        <div className="col-lg-7">
          <section className="card rounded-0 h-100">
            <h2 className="card-header h6 bg-white">Professores cadastrados</h2>
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead><tr><th>Nome</th><th>E-mail</th><th>Área</th></tr></thead>
                <tbody>
                  {professoresRecentes.map((professor) => (
                    <tr key={professor.id}>
                      <td>{professor.nome}</td>
                      <td>{professor.email}</td>
                      <td>{professor.especialidade}</td>
                    </tr>
                  ))}
                  {professoresRecentes.length === 0 && <tr><td colSpan="3">Nenhum professor cadastrado.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="col-12">
          <section className="card rounded-0">
            <h2 className="card-header h6 bg-white">Disciplinas cadastradas</h2>
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead><tr><th>Código</th><th>Disciplina</th><th>Período</th><th>Carga horária</th></tr></thead>
                <tbody>
                  {disciplinasRecentes.map((disciplina) => (
                    <tr key={disciplina.id}>
                      <td>{disciplina.codigo}</td>
                      <td>{disciplina.nome}</td>
                      <td>{disciplina.periodo}</td>
                      <td>{disciplina.cargaHoraria}h</td>
                    </tr>
                  ))}
                  {disciplinasRecentes.length === 0 && <tr><td colSpan="4">Nenhuma disciplina cadastrada.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default PainelAdministrador
