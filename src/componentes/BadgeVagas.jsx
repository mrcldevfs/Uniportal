// Mostra a situação de vagas de uma turma: texto + cor (a cor nunca é a única informação).
function BadgeVagas({ vagas, capacidade, ocupadas = 0 }) {
  if (vagas <= 0) {
    return (
      <span className="badge text-bg-danger">
        {capacidade > 0 ? `Lotada · ${ocupadas}/${capacidade}` : 'Sem vagas'}
      </span>
    )
  }

  const poucasVagas = vagas / capacidade <= 0.2
  const cor = poucasVagas ? 'warning' : 'success'

  return (
    <span className={`badge text-bg-${cor}`}>
      {vagas}/{capacidade} {vagas === 1 ? 'vaga' : 'vagas'}
    </span>
  )
}

export default BadgeVagas
