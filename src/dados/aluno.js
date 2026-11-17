// Dados acadêmicos do aluno exibidos no painel (Pessoa 3).
//
// Ainda não existe cadastro de alunos nem login real no sistema, então o portal
// usa este aluno de demonstração. Quando a Pessoa 5 definir o modelo de aluno e a
// persistência, basta trocar o corpo de obterAlunoLogado() e manter os mesmos campos.

const ALUNO_DEMONSTRACAO = {
  nome: 'Lucas Ferreira',
  registro: '20260001',
  curso: 'Análise e Desenvolvimento de Sistemas',
  semestreAtual: 2,
  ingresso: '2026/1',
}

export function obterAlunoLogado() {
  return ALUNO_DEMONSTRACAO
}
