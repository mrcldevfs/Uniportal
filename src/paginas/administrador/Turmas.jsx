import { useState, useEffect } from 'react'
import { turmaServico } from '../../services/turmaServico'
import { obterDadosInstitucionais } from '../../services/institution'
import { getData } from '../../services/storage'
import { DIAS_DA_GRADE } from '../../services/horarios'

function Turmas() {
  const [turmas, setTurmas] = useState([])
  const [disciplinas] = useState(() => obterDadosInstitucionais('disciplinas'))
  const [professores] = useState(() => obterDadosInstitucionais('professores'))

  const [idEdicao, setIdEdicao] = useState(null)
  const [disciplinaId, setDisciplinaId] = useState('')
  const [codigo, setCodigo] = useState('')
  const [disciplina, setDisciplina] = useState('')
  const [professorId, setProfessorId] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [turno, setTurno] = useState('Noturno')
  const [dias, setDias] = useState([])
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [vagasTotais, setVagasTotais] = useState('')

  useEffect(() => { carregarTurmas() }, [])

  function carregarTurmas() {
    setTurmas(turmaServico.listar())
  }

  function limparFormulario() {
    setIdEdicao(null)
    setDisciplinaId('')
    setCodigo('')
    setDisciplina('')
    setProfessorId('')
    setPeriodo('')
    setTurno('Noturno')
    setDias([])
    setInicio('')
    setFim('')
    setVagasTotais('')
  }

  function handleSelecionarDisciplina(e) {
    const id = e.target.value
    const selecionada = disciplinas.find(item => item.id === id)
    setDisciplinaId(id)
    setDisciplina(selecionada?.nome || '')
    setPeriodo(selecionada?.periodo || '')
  }

  function toggleDia(dia) {
    setDias(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!codigo || !disciplinaId || !professorId || !dias.length || !inicio || !fim || !vagasTotais) {
      alert('Por favor, preencha todos os campos obrigatórios!')
      return
    }

    const disciplinaSelecionada = disciplinas.find((item) => String(item.id) === String(disciplinaId))
    const professorSelecionado = professores.find((item) => String(item.id) === String(professorId))

    if (!disciplinaSelecionada) {
      alert('Selecione uma disciplina válida.')
      return
    }
    if (!professorSelecionado) {
      alert('Selecione um professor válido.')
      return
    }

    const turmaAtual = idEdicao
      ? turmas.find((item) => String(item.id) === String(idEdicao))
      : null
    const vagasOcupadas = turmaAtual?.vagasOcupadas || 0
    const vagasSolicitadas = Number(vagasTotais)

    if (vagasSolicitadas < vagasOcupadas) {
      alert(`A capacidade não pode ser menor que a ocupação atual (${vagasOcupadas} vaga(s)).`)
      return
    }

    const codigoNormalizado = codigo.trim().toUpperCase()
    const codigoDuplicado = turmas.find((turma) =>
      String(turma.codigo).trim().toUpperCase() === codigoNormalizado &&
      (!idEdicao || String(turma.id) !== String(idEdicao)),
    )

    if (codigoDuplicado) {
      alert('Já existe uma turma cadastrada com esse código.')
      return
    }

    turmaServico.salvar({
      id: idEdicao,
      disciplinaId,
      codigo: codigoNormalizado,
      disciplina: disciplinaSelecionada.nome,
      professorId,
      professor: professorSelecionado.nome,
      periodo,
      turno,
      dias,
      inicio,
      fim,
      vagasTotais: Number(vagasTotais),
      vagasOcupadas: turmaAtual?.vagasOcupadas || 0,
    })
    limparFormulario()
    carregarTurmas()
    alert(idEdicao ? 'Turma atualizada com sucesso!' : 'Turma cadastrada com sucesso!')
  }

  function handleEditar(turma) {
    const disciplinaEncontrada = disciplinas.find(
      (item) => String(item.id) === String(turma.disciplinaId) || item.nome === turma.disciplina,
    )
    const professorEncontrado = professores.find(
      (item) => String(item.id) === String(turma.professorId) || item.nome === turma.professor,
    )

    setIdEdicao(turma.id)
    setDisciplinaId(disciplinaEncontrada?.id || '')
    setCodigo(turma.codigo)
    setDisciplina(disciplinaEncontrada?.nome || turma.disciplina)
    setProfessorId(professorEncontrado?.id || '')
    setPeriodo(disciplinaEncontrada?.periodo || turma.periodo || '')
    setTurno(turma.turno)
    setDias(turma.dias || [])
    setInicio(turma.inicio || '')
    setFim(turma.fim || '')
    setVagasTotais(turma.vagasTotais)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleExcluir(id) {
    const matriculas = getData('matriculas')
    const matriculaVinculada = Array.isArray(matriculas) && matriculas.find((matricula) =>
      String(matricula.turmaId ?? matricula.disciplinaId) === String(id),
    )

    if (matriculaVinculada) {
      alert('Não é possível excluir esta turma: existem matrículas vinculadas ao histórico acadêmico.')
      return
    }

    if (confirm('Deseja realmente excluir esta turma?')) {
      turmaServico.remover(id)
      carregarTurmas()
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2>Gestão de Turmas e Ofertas</h2>
        <p style={{ color: '#666' }}>
          Criação de turmas, associação de disciplinas, professores, horários e controle de vagas.
        </p>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3>{idEdicao ? 'Editar Turma' : 'Nova Turma / Oferta'}</h3>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div>
            <label>Código da Turma</label>
            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)}
              placeholder="Ex: TURMA-A" required style={estiloInput} />
          </div>

          <div>
            <label>Disciplina</label>
            <select value={disciplinaId} onChange={handleSelecionarDisciplina} required style={estiloInput}>
              <option value="">Selecione uma disciplina</option>
              {disciplinas.map(item => (
                <option key={item.id} value={item.id}>{item.codigo} - {item.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Professor Responsável</label>
            <select value={professorId} onChange={e => setProfessorId(e.target.value)} required style={estiloInput}>
              <option value="">Selecione um professor</option>
              {professores.map(item => (
                <option key={item.id} value={item.id}>{item.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Período</label>
            <input type="text" value={periodo} readOnly style={{ ...estiloInput, background: '#eee' }} />
          </div>

          <div>
            <label>Turno</label>
            <select value={turno} onChange={e => setTurno(e.target.value)} style={estiloInput}>
              <option>Matutino</option>
              <option>Vespertino</option>
              <option>Noturno</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label>Dias da Semana</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
              {DIAS_DA_GRADE.map(dia => (
                <label key={dia} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={dias.includes(dia)} onChange={() => toggleDia(dia)} />
                  {dia}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label>Início</label>
            <input type="time" value={inicio} onChange={e => setInicio(e.target.value)}
              required style={estiloInput} />
          </div>

          <div>
            <label>Fim</label>
            <input type="time" value={fim} onChange={e => setFim(e.target.value)}
              required style={estiloInput} />
          </div>

          <div>
            <label>Vagas Totais</label>
            <input type="number" min="1" value={vagasTotais} onChange={e => setVagasTotais(e.target.value)}
              required style={estiloInput} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', gridColumn: '1 / -1' }}>
            <button type="submit" style={estiloBotao}>
              {idEdicao ? 'Salvar Alterações' : 'Cadastrar Turma'}
            </button>
            {idEdicao && (
              <button type="button" onClick={limparFormulario} style={{ ...estiloBotao, background: '#6c757d' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3>Grade de Ofertas e Ocupação de Vagas</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr>
                {['Código', 'Disciplina', 'Professor', 'Turno / Horário', 'Dias', 'Ocupação', 'Ações'].map(h => (
                  <th key={h} style={{ borderBottom: '2px solid #dee2e6', padding: '8px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {turmas.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '16px', color: '#666' }}>Nenhuma turma cadastrada.</td></tr>
              ) : turmas.map(turma => {
                const livres = turma.vagasTotais - (turma.vagasOcupadas || 0)
                return (
                  <tr key={turma.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '8px' }}>{turma.codigo}</td>
                    <td style={{ padding: '8px' }}>{turma.disciplina}</td>
                    <td style={{ padding: '8px' }}>{turma.professor}</td>
                    <td style={{ padding: '8px' }}>
                      {turma.turno}<br />
                      <small>{turma.inicio} – {turma.fim}</small>
                    </td>
                    <td style={{ padding: '8px' }}>{(turma.dias || []).join(', ')}</td>
                    <td style={{ padding: '8px' }}>
                      {turma.vagasOcupadas || 0} / {turma.vagasTotais}<br />
                      <small>{livres} vagas livres</small>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <button onClick={() => handleEditar(turma)} style={{ marginRight: '6px' }}>Editar</button>
                      <button onClick={() => handleExcluir(turma.id)}>Excluir</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const estiloInput = {
  display: 'block', width: '100%', padding: '8px',
  borderRadius: '4px', border: '1px solid #ccc', marginTop: '6px',
}

const estiloBotao = {
  background: '#0056b3', color: '#fff', border: 'none',
  padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600',
}

export default Turmas
