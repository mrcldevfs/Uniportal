import { useEffect, useState } from 'react'
import { gerarId, obterDadosInstitucionais, salvarDadosInstitucionais } from '../../services/institution'

const formularioVazio = { codigo: '', nome: '', cargaHoraria: '', creditos: '', periodo: '' }

function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState(() => obterDadosInstitucionais('disciplinas'))
  const [termoBusca, setTermoBusca] = useState('')
  const [formulario, setFormulario] = useState(formularioVazio)
  const [disciplinaEditando, setDisciplinaEditando] = useState(null)
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    salvarDadosInstitucionais('disciplinas', disciplinas)
  }, [disciplinas])

  const disciplinasFiltradas = disciplinas.filter((disciplina) =>
    `${disciplina.codigo} ${disciplina.nome} ${disciplina.periodo}`.toLowerCase().includes(termoBusca.toLowerCase()),
  )

  function abrirCadastro(disciplina = null) {
    setDisciplinaEditando(disciplina)
    setFormulario(disciplina ? { ...disciplina } : formularioVazio)
    setFormularioAberto(true)
    setMensagem('')
  }

  function fecharCadastro() {
    setFormularioAberto(false)
    setDisciplinaEditando(null)
    setFormulario(formularioVazio)
  }

  function salvarDisciplina(evento) {
    evento.preventDefault()
    const registro = {
      ...formulario,
      codigo: formulario.codigo.trim().toUpperCase(),
      nome: formulario.nome.trim(),
      cargaHoraria: Number(formulario.cargaHoraria),
      creditos: Number(formulario.creditos),
      periodo: formulario.periodo.trim(),
    }
    const codigoDuplicado = disciplinas.some((disciplina) =>
      disciplina.codigo.toLowerCase() === registro.codigo.toLowerCase() && disciplina.id !== disciplinaEditando?.id,
    )

    if (codigoDuplicado) {
      setMensagem('Já existe uma disciplina cadastrada com esse código.')
      return
    }

    if (disciplinaEditando) {
      setDisciplinas((atuais) => atuais.map((disciplina) =>
        disciplina.id === disciplinaEditando.id ? { ...registro, id: disciplina.id } : disciplina,
      ))
      setMensagem('Disciplina atualizada com sucesso.')
    } else {
      setDisciplinas((atuais) => [...atuais, { ...registro, id: gerarId('disc') }])
      setMensagem('Disciplina cadastrada com sucesso.')
    }
    fecharCadastro()
  }

  function excluirDisciplina(disciplina) {
    if (!window.confirm(`Deseja excluir a disciplina ${disciplina.nome}?`)) return
    setDisciplinas((atuais) => atuais.filter((item) => item.id !== disciplina.id))
    setMensagem('Disciplina excluída com sucesso.')
  }

  return (
    <section>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Disciplinas</h1>
          <p className="text-secondary mb-0">Cadastro e consulta de disciplinas.</p>
        </div>
        <button className="btn btn-primary" onClick={() => abrirCadastro()}>Nova disciplina</button>
      </div>

      {mensagem && (
        <div className={`alert ${mensagem.startsWith('Já existe') ? 'alert-warning' : 'alert-success'}`} role="status">
          {mensagem}
        </div>
      )}

      {formularioAberto && (
        <form className="card rounded-0 mb-4" onSubmit={salvarDisciplina}>
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h2 className="h6 mb-0">{disciplinaEditando ? 'Editar disciplina' : 'Nova disciplina'}</h2>
            <button type="button" className="btn-close" aria-label="Fechar formulário" onClick={fecharCadastro} />
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label" htmlFor="codigo-disciplina">Código <span className="text-danger">*</span></label>
                <input id="codigo-disciplina" className="form-control" value={formulario.codigo} onChange={(evento) => setFormulario({ ...formulario, codigo: evento.target.value })} required maxLength="12" placeholder="Ex.: ADS101" />
              </div>
              <div className="col-md-5">
                <label className="form-label" htmlFor="nome-disciplina">Nome da disciplina <span className="text-danger">*</span></label>
                <input id="nome-disciplina" className="form-control" value={formulario.nome} onChange={(evento) => setFormulario({ ...formulario, nome: evento.target.value })} required maxLength="100" />
              </div>
              <div className="col-md-2">
                <label className="form-label" htmlFor="carga-horaria">Carga horária <span className="text-danger">*</span></label>
                <input id="carga-horaria" className="form-control" type="number" min="1" max="1000" value={formulario.cargaHoraria} onChange={(evento) => setFormulario({ ...formulario, cargaHoraria: evento.target.value })} required />
              </div>
              <div className="col-md-2">
                <label className="form-label" htmlFor="creditos">Créditos <span className="text-danger">*</span></label>
                <input id="creditos" className="form-control" type="number" min="1" max="20" value={formulario.creditos} onChange={(evento) => setFormulario({ ...formulario, creditos: evento.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="periodo">Período recomendado <span className="text-danger">*</span></label>
                <input id="periodo" className="form-control" value={formulario.periodo} onChange={(evento) => setFormulario({ ...formulario, periodo: evento.target.value })} required maxLength="30" placeholder="Ex.: 1º período" />
              </div>
            </div>
          </div>
          <div className="card-footer bg-white text-end">
            <button type="button" className="btn btn-secondary me-2" onClick={fecharCadastro}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{disciplinaEditando ? 'Salvar alterações' : 'Cadastrar'}</button>
          </div>
        </form>
      )}

      <div className="card rounded-0">
        <div className="card-header bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <div>
            <h2 className="h6 mb-1">Lista de disciplinas</h2>
            <small className="text-secondary">{disciplinas.length} cadastrada(s)</small>
          </div>
          <label className="visually-hidden" htmlFor="buscar-disciplina">Buscar disciplina</label>
          <input id="buscar-disciplina" className="form-control" type="search" placeholder="Buscar por nome ou código" value={termoBusca} onChange={(evento) => setTermoBusca(evento.target.value)} style={{ maxWidth: '320px' }} />
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead>
              <tr><th>Código</th><th>Disciplina</th><th>Período</th><th>Carga horária</th><th>Créditos</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {disciplinasFiltradas.map((disciplina) => (
                <tr key={disciplina.id}>
                  <td>{disciplina.codigo}</td>
                  <td>{disciplina.nome}</td>
                  <td>{disciplina.periodo}</td>
                  <td>{disciplina.cargaHoraria}h</td>
                  <td>{disciplina.creditos}</td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => abrirCadastro(disciplina)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => excluirDisciplina(disciplina)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {disciplinasFiltradas.length === 0 && (
                <tr><td colSpan="6" className="text-center text-secondary py-4">Nenhuma disciplina encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Disciplinas
