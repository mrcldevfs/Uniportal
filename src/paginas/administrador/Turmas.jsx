
import { useState, useEffect } from 'react';
import { turmaServico } from '../../services/turmaServico';
import { obterDadosInstitucionais } from '../../services/institution';

function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [disciplinas] = useState(() =>
    obterDadosInstitucionais('disciplinas')
  );

  const [idEdicao, setIdEdicao] = useState(null);
  const [disciplinaId, setDisciplinaId] = useState('');

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
    setDisciplinaId('');
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

  function handleSelecionarDisciplina(e) {
    const id = e.target.value;
    const selecionada = disciplinas.find(
      (item) => item.id === id
    );

    setDisciplinaId(id);
    setDisciplina(selecionada?.nome || '');
    setPeriodo(selecionada?.periodo || '');
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!codigo || !disciplinaId || !professor || !periodo ||
        !diasSemana || !horario || !vagasTotais) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const turmaDados = {
      id: idEdicao,
      disciplinaId,
      codigo,
      disciplina,
      professor,
      periodo,
      turno,
      diasSemana,
      horario,
      vagasTotais: Number(vagasTotais),
      vagasOcupadas: Number(vagasOcupadas) || 0,
    };

    turmaServico.salvar(turmaDados);
    limparFormulario();
    carregarTurmas();

    alert(
      idEdicao
        ? 'Turma atualizada com sucesso!'
        : 'Turma cadastrada com sucesso!'
    );
  }

  function handleEditar(turma) {
    const disciplinaEncontrada = disciplinas.find(
      (item) =>
        item.id === turma.disciplinaId ||
        item.nome === turma.disciplina
    );

    setIdEdicao(turma.id);
    setDisciplinaId(disciplinaEncontrada?.id || '');
    setCodigo(turma.codigo);
    setDisciplina(disciplinaEncontrada?.nome || turma.disciplina);
    setProfessor(turma.professor);
    setPeriodo(disciplinaEncontrada?.periodo || turma.periodo);
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
        <p style={{ color: '#666' }}>
          Criação de turmas, associação de disciplinas, professores,
          horários e controlo de vagas.
        </p>
      </div>

      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3>{idEdicao ? 'Editar Turma' : 'Nova Turma / Oferta'}</h3>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginTop: '16px'
          }}
        >
          <div>
            <label>Código da Turma</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: TURMA-A"
              required
              style={estiloInput}
            />
          </div>

          <div>
            <label>Disciplina</label>
            <select
              value={disciplinaId}
              onChange={handleSelecionarDisciplina}
              required
              style={estiloInput}
            >
              <option value="">Selecione uma disciplina</option>
              {disciplinas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.codigo} - {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Professor Responsável</label>
            <input
              type="text"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              placeholder="Ex: Ana Souza"
              required
              style={estiloInput}
            />
          </div>

          <div>
            <label>Período</label>
            <input
              type="text"
              value={periodo}
              readOnly
              style={{ ...estiloInput, background: '#eee' }}
            />
          </div>

          <div>
            <label>Turno</label>
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              style={estiloInput}
            >
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Noturno">Noturno</option>
            </select>
          </div>

          <div>
            <label>Dias da Semana</label>
            <input
              type="text"
              value={diasSemana}
              onChange={(e) => setDiasSemana(e.target.value)}
              placeholder="Ex: Seg e Qua"
              required
              style={estiloInput}
            />
          </div>

          <div>
            <label>Horário</label>
            <input
              type="text"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              placeholder="Ex: 19:10 - 22:35"
              required
              style={estiloInput}
            />
          </div>

          <div>
            <label>Vagas Totais</label>
            <input
              type="number"
              min="1"
              value={vagasTotais}
              onChange={(e) => setVagasTotais(e.target.value)}
              required
              style={estiloInput}
            />
          </div>

          <div>
            <label>Vagas Ocupadas</label>
            <input
              type="number"
              min="0"
              value={vagasOcupadas}
              onChange={(e) => setVagasOcupadas(e.target.value)}
              style={estiloInput}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            gridColumn: '1 / -1'
          }}>
            <button type="submit" style={estiloBotao}>
              {idEdicao ? 'Salvar Alterações' : 'Cadastrar Turma'}
            </button>

            {idEdicao && (
              <button
                type="button"
                onClick={limparFormulario}
                style={{ ...estiloBotao, background: '#6c757d' }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3>Grade de Ofertas e Ocupação de Vagas</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '16px',
            textAlign: 'left',
            minWidth: '800px'
          }}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Disciplina</th>
                <th>Professor</th>
                <th>Turno / Horário</th>
                <th>Dias</th>
                <th>Ocupação (Disp / Tot)</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {turmas.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    Nenhuma turma cadastrada.
                  </td>
                </tr>
              ) : (
                turmas.map((turma) => {
                  const vagasDisponiveis =
                    turma.vagasTotais - (turma.vagasOcupadas || 0);

                  return (
                    <tr key={turma.id}>
                      <td>{turma.codigo}</td>
                      <td>{turma.disciplina}</td>
                      <td>{turma.professor}</td>
                      <td>
                        {turma.turno}
                        <br />
                        <small>{turma.horario}</small>
                      </td>
                      <td>{turma.diasSemana}</td>
                      <td>
                        {turma.vagasOcupadas || 0} / {turma.vagasTotais}
                        <br />
                        <small>{vagasDisponiveis} vagas livres</small>
                      </td>
                      <td>
                        <button onClick={() => handleEditar(turma)}>
                          Editar
                        </button>
                        {' '}
                        <button onClick={() => handleExcluir(turma.id)}>
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

const estiloInput = {
  display: 'block',
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginTop: '6px',
};

const estiloBotao = {
  background: '#0056b3',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '600',
};

export default Turmas;
