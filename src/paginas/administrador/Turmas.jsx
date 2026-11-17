import { useState, useEffect } from 'react';
import { turmaServico } from '../../services/turmaServico';

function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [idEdicao, setIdEdicao] = useState(null);
  
  const [codigo, setCodigo] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [professor, setProfessor] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [turno, setTurno] = useState('Noturno');
  const [diasSemana, setDiasSemana] = useState('');
  const [horario, setHorario] = useState('');
  const [vagasTotais, setVagasTotais] = useState('');
  const [vagasOcupadas, setVagasOcupadas] = useState('');

  useEffect(() => {
    carregarTurmas();
  }, []);

  function carregarTurmas() {
    setTurmas(turmaServico.listar());
  }

  function limparFormulario() {
    setIdEdicao(null);
    setCodigo('');
    setDisciplina('');
    setProfessor('');
    setPeriodo('');
    setTurno('Noturno');
    setDiasSemana('');
    setHorario('');
    setVagasTotais('');
    setVagasOcupadas('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!codigo || !disciplina || !professor || !periodo || !diasSemana || !horario || !vagasTotais) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const turmaDados = {
      id: idEdicao,
      codigo,
      disciplina,
      professor,
      periodo,
      turno,
      diasSemana,
      horario,
      vagasTotais: Number(vagasTotais),
      vagasOcupadas: Number(vagasOcupadas) || 0
    };

    turmaServico.salvar(turmaDados);
    limparFormulario();
    carregarTurmas();
    alert(idEdicao ? 'Turma atualizada com sucesso!' : 'Turma cadastrada com sucesso!');
  }

  function handleEditar(turma) {
    setIdEdicao(turma.id);
    setCodigo(turma.codigo);
    setDisciplina(turma.disciplina);
    setProfessor(turma.professor);
    setPeriodo(turma.periodo);
    setTurno(turma.turno);
    setDiasSemana(turma.diasSemana);
    setHorario(turma.horario);
    setVagasTotais(turma.vagasTotais);
    setVagasOcupadas(turma.vagasOcupadas);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleExcluir(id) {
    if (confirm('Deseja realmente excluir esta turma?')) {
      turmaServico.remover(id);
      carregarTurmas();
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2>Gestão de Turmas e Ofertas (Pessoa 2)</h2>
        <p style={{ color: '#666' }}>Criação de turmas, associação de disciplinas, professores, horários e controlo de vagas.</p>
      </div>

      {/* Formulário de Cadastro / Edição */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3>{idEdicao ? 'Editar Turma' : 'Nova Turma / Oferta'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Código da Turma</label>
            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ex: TURMA-A" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Disciplina</label>
            <input type="text" value={disciplina} onChange={e => setDisciplina(e.target.value)} placeholder="Ex: Desenvolvimento Web" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Professor Responsável</label>
            <input type="text" value={professor} onChange={e => setProfessor(e.target.value)} placeholder="Ex: Ana Souza" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Período</label>
            <input type="text" value={periodo} onChange={e => setPeriodo(e.target.value)} placeholder="Ex: 2º período" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Turno</label>
            <select value={turno} onChange={e => setTurno(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Noturno">Noturno</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Dias da Semana</label>
            <input type="text" value={diasSemana} onChange={e => setDiasSemana(e.target.value)} placeholder="Ex: Seg e Qua" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Horário</label>
            <input type="text" value={horario} onChange={e => setHorario(e.target.value)} placeholder="Ex: 19:10 - 22:35" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Vagas Totais</label>
            <input type="number" value={vagasTotais} onChange={e => setVagasTotais(e.target.value)} placeholder="Ex: 40" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Vagas Ocupadas</label>
            <input type="number" value={vagasOcupadas} onChange={e => setVagasOcupadas(e.target.value)} placeholder="Ex: 10" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', gridColumn: '1 / -1' }}>
            <button type="submit" style={{ background: '#0056b3', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
              {idEdicao ? 'Salvar Alterações' : 'Cadastrar Turma'}
            </button>
            {idEdicao && (
              <button type="button" onClick={limparFormulario} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Grade de Ofertas / Tabela */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3>Grade de Ofertas e Ocupação de Vagas</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', color: '#333' }}>
                <th style={{ padding: '12px' }}>Código</th>
                <th style={{ padding: '12px' }}>Disciplina</th>
                <th style={{ padding: '12px' }}>Professor</th>
                <th style={{ padding: '12px' }}>Turno / Horário</th>
                <th style={{ padding: '12px' }}>Dias</th>
                <th style={{ padding: '12px' }}>Ocupação (Disp / Tot)</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmas.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '16px', textAlign: 'center', color: '#666' }}>Nenhuma turma cadastrada.</td>
                </tr>
              ) : (
                turmas.map(turma => {
                  const vagasDisponiveis = turma.vagasTotais - (turma.vagasOcupadas || 0);
                  return (
                    <tr key={turma.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{turma.codigo}</td>
                      <td style={{ padding: '12px' }}>{turma.disciplina}</td>
                      <td style={{ padding: '12px' }}>{turma.professor}</td>
                      <td style={{ padding: '12px' }}>{turma.turno} <br/><small style={{color: '#666'}}>{turma.horario}</small></td>
                      <td style={{ padding: '12px' }}>{turma.diasSemana}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ color: vagasDisponiveis > 0 ? 'green' : 'red', fontWeight: '600' }}>
                          {turma.vagasOcupadas || 0} / {turma.vagasTotais}
                        </span>
                        <br/><small style={{color: '#666'}}>{vagasDisponiveis} vagas livres</small>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button onClick={() => handleEditar(turma)} style={{ background: '#ffc107', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontWeight: '500' }}>
                          Editar
                        </button>
                        <button onClick={() => handleExcluir(turma.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Turmas;