import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAcademico } from '../../dados/AcademicoContext'
import { obterAlunoLogado } from '../../dados/aluno'
import { resumirAluno } from '../../services/consultasAluno'
import { nomeDoDiaDeHoje } from '../../services/horarios'

function CartaoIndicador({ titulo, valor, complemento }) {
  return (
    <div className="col-6 col-lg-3">
      <div className="bg-white rounded-3 border p-3 h-100">
        <p className="text-secondary small mb-1">{titulo}</p>
        <p className="fs-3 fw-semibold mb-0">{valor}</p>
        {complemento && <p className="text-secondary small mb-0">{complemento}</p>}
      </div>
    </div>
  )
}

function PainelAluno() {
  const contexto = useAcademico()
  const aluno = obterAlunoLogado()
  const [hoje] = useState(() => nomeDoDiaDeHoje())

  // Calculado a cada renderização: matricular ou cancelar atualiza o painel na hora.
  const resumo = resumirAluno(contexto, hoje)

  return (
    <div className="d-flex flex-column gap-4">
      <section className="bg-white rounded-3 border p-4">
        <p className="text-secondary small mb-1">Bem-vindo(a) de volta</p>
        <h2 className="h3 mb-3">{aluno.nome}</h2>

        <dl className="row mb-0">
          <dt className="col-sm-3">Registro acadêmico</dt>
          <dd className="col-sm-9">{aluno.registro}</dd>

          <dt className="col-sm-3">Curso</dt>
          <dd className="col-sm-9">{aluno.curso}</dd>

          <dt className="col-sm-3">Semestre atual</dt>
          <dd className="col-sm-9">{aluno.semestreAtual}º semestre</dd>

          <dt className="col-sm-3">Ingresso</dt>
          <dd className="col-sm-9 mb-0">{aluno.ingresso}</dd>
        </dl>
      </section>

      <section aria-label="Indicadores acadêmicos">
        <div className="row g-3">
          <CartaoIndicador titulo="Disciplinas matriculadas" valor={resumo.totalMatriculadas} />
          <CartaoIndicador titulo="Horas de aula por semana" valor={`${resumo.horasSemanais} h`} />
          <CartaoIndicador titulo="Disciplinas concluídas" valor={resumo.totalConcluidas} />
          <CartaoIndicador
            titulo="Disponíveis para matrícula"
            valor={resumo.podemSerCursadas}
            complemento="com vaga e pré-requisitos cumpridos"
          />
        </div>
      </section>

      <section className="bg-white rounded-3 border p-4">
        <h3 className="h5">Aulas de hoje ({hoje})</h3>

        {resumo.aulasDeHoje.length === 0 ? (
          <p className="text-secondary mb-0">Você não tem aulas hoje.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {resumo.aulasDeHoje.map(({ disciplina, horario }) => (
              <li
                key={`${disciplina.id}-${horario.inicio}`}
                className="list-group-item px-0 d-flex justify-content-between gap-2"
              >
                <span>
                  <span className="fw-semibold">
                    {disciplina.codigo} - {disciplina.nome}
                  </span>
                  <span className="text-secondary"> · {disciplina.professor}</span>
                </span>
                <span className="badge text-bg-primary align-self-center">
                  {horario.inicio}–{horario.fim}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="d-flex flex-wrap gap-2">
        <Link to="/aluno/disciplinas" className="btn btn-primary">
          Ver disciplinas disponíveis
        </Link>
        <Link to="/aluno/grade-horaria" className="btn btn-outline-primary">
          Ver minha grade horária
        </Link>
      </section>
    </div>
  )
}

export default PainelAluno
