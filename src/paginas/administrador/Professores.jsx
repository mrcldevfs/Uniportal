import { useEffect, useState } from 'react'
import { gerarId, obterDadosInstitucionais, salvarDadosInstitucionais } from '../../services/institution'
import { turmaServico } from '../../services/turmaServico'

const formularioVazio = { nome: '', email: '', especialidade: '' }

function Professores() {
  const [professores, setProfessores] = useState(() => obterDadosInstitucionais('professores'))
  const [termoBusca, setTermoBusca] = useState('')
  const [formulario, setFormulario] = useState(formularioVazio)
  const [professorEditando, setProfessorEditando] = useState(null)
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    salvarDadosInstitucionais('professores', professores)
  }, [professores])

  const professoresFiltrados = professores.filter((professor) =>
    `${professor.nome} ${professor.email} ${professor.especialidade}`.toLowerCase().includes(termoBusca.toLowerCase()),
  )

  function abrirCadastro(professor = null) {
    setProfessorEditando(professor)
    setFormulario(professor ? { ...professor } : formularioVazio)
    setFormularioAberto(true)
    setMensagem('')
  }

  function fecharCadastro() {
    setFormularioAberto(false)
    setProfessorEditando(null)
    setFormulario(formularioVazio)
  }

  function salvarProfessor(evento) {
    evento.preventDefault()
    const registro = { nome: formulario.nome.trim(), email: formulario.email.trim().toLowerCase(), especialidade: formulario.especialidade.trim() }
    const emailDuplicado = professores.some((professor) =>
      professor.email.toLowerCase() === registro.email && professor.id !== professorEditando?.id,
    )

    if (emailDuplicado) {
      setMensagem('Já existe um professor cadastrado com esse e-mail.')
      return
    }
    if (professorEditando) {
      setProfessores((atuais) => atuais.map((professor) => professor.id === professorEditando.id ? { ...registro, id: professor.id } : professor))

      const turmas = turmaServico.listar()
      turmas.forEach((turma) => {
        if (
          String(turma.professorId) === String(professorEditando.id) ||
          turma.professor === professorEditando.nome
        ) {
          turmaServico.salvar({
            ...turma,
            professorId: professorEditando.id,
            professor: registro.nome,
          })
        }
      })
      setMensagem('Professor atualizado com sucesso.')
    } else {
      setProfessores((atuais) => [...atuais, { ...registro, id: gerarId('prof') }])
      setMensagem('Professor cadastrado com sucesso.')
    }
    fecharCadastro()
  }

  function excluirProfessor(professor) {
    const turmas = turmaServico.listar()
    const turmaVinculada = turmas.find((turma) =>
      String(turma.professorId) === String(professor.id) ||
      turma.professor === professor.nome,
    )

    if (turmaVinculada) {
      setMensagem(`Não é possível excluir: o professor está vinculado à turma ${turmaVinculada.codigo}.`)
      return
    }

    if (!window.confirm(`Deseja excluir o cadastro de ${professor.nome}?`)) return
    setProfessores((atuais) => atuais.filter((item) => String(item.id) !== String(professor.id)))
    setMensagem('Professor removido com sucesso.')
  }

  return (
    <section>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Professores</h1>
          <p className="text-secondary mb-0">Cadastro e consulta de professores.</p>
        </div>
        <button className="btn btn-primary" onClick={() => abrirCadastro()}>Novo professor</button>
      </div>

      {mensagem && (
        <div className={`alert ${mensagem.startsWith('Já existe') ? 'alert-warning' : 'alert-success'}`} role="status">
          {mensagem}
        </div>
      )}

      {formularioAberto && (
        <form className="card rounded-0 mb-4" onSubmit={salvarProfessor}>
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h2 className="h6 mb-0">{professorEditando ? 'Editar professor' : 'Novo professor'}</h2>
            <button type="button" className="btn-close" aria-label="Fechar formulário" onClick={fecharCadastro} />
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label" htmlFor="nome-professor">Nome completo <span className="text-danger">*</span></label>
                <input id="nome-professor" className="form-control" value={formulario.nome} onChange={(evento) => setFormulario({ ...formulario, nome: evento.target.value })} required maxLength="100" />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="email-professor">E-mail institucional <span className="text-danger">*</span></label>
                <input
                  id="email-professor"
                  className="form-control"
                  type="email"
                  value={formulario.email}
                  onChange={(evento) => setFormulario({ ...formulario, email: evento.target.value })}
                  onInvalid={(evento) => {
                    evento.currentTarget.setCustomValidity(
                      evento.currentTarget.validity.valueMissing
                        ? 'Informe o e-mail institucional.'
                        : 'Digite um e-mail válido.',
                    )
                  }}
                  onInput={(evento) => evento.currentTarget.setCustomValidity('')}
                  required
                  maxLength="120"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="especialidade-professor">Área de atuação <span className="text-danger">*</span></label>
                <input id="especialidade-professor" className="form-control" value={formulario.especialidade} onChange={(evento) => setFormulario({ ...formulario, especialidade: evento.target.value })} required maxLength="100" />
              </div>
            </div>
          </div>
          <div className="card-footer bg-white text-end">
            <button type="button" className="btn btn-secondary me-2" onClick={fecharCadastro}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{professorEditando ? 'Salvar alterações' : 'Cadastrar'}</button>
          </div>
        </form>
      )}

      <div className="card rounded-0">
        <div className="card-header bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <div>
            <h2 className="h6 mb-1">Lista de professores</h2>
            <small className="text-secondary">{professores.length} cadastrado(s)</small>
          </div>
          <label className="visually-hidden" htmlFor="buscar-professor">Buscar professor</label>
          <input id="buscar-professor" className="form-control" type="search" placeholder="Buscar nome, e-mail ou área" value={termoBusca} onChange={(evento) => setTermoBusca(evento.target.value)} style={{ maxWidth: '320px' }} />
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead>
              <tr><th>Nome</th><th>E-mail</th><th>Área de atuação</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {professoresFiltrados.map((professor) => (
                <tr key={professor.id}>
                  <td>{professor.nome}</td>
                  <td>{professor.email}</td>
                  <td>{professor.especialidade}</td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => abrirCadastro(professor)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => excluirProfessor(professor)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {professoresFiltrados.length === 0 && (
                <tr><td colSpan="4" className="text-center text-secondary py-4">Nenhum professor encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Professores
