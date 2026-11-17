// Utilitários de horário do portal do aluno (Pessoa 3).
//
// O modelo de matrículas (dados/AcademicoContext.jsx) descreve cada horário como
//   { dia: 'Segunda', inicio: '08:00', fim: '10:00' }
// Aqui esse formato é convertido para o do enunciado: um código de 2 dígitos,
//   1º dígito = dia da semana (1 = domingo, 2 = segunda ... 7 = sábado)
//   2º dígito = turno (1 = manhã, 2 = tarde, 3 = noite)
// Exemplos: "21" = segunda de manhã; "33" = terça à noite.

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

// Segunda a sábado: os dias exibidos na grade horária.
export const DIAS_DA_GRADE = DIAS.slice(1)

export const TURNOS = [
  { numero: 1, nome: 'Manhã' },
  { numero: 2, nome: 'Tarde' },
  { numero: 3, nome: 'Noite' },
]

// Ignora maiúsculas, espaços e acentos, para "Terca", "terça" e "Terça-feira" valerem o mesmo.
function simplificar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

// Devolve o nome padronizado do dia ('Segunda', 'Terça'...) ou null se não reconhecer.
export function nomeDoDia(dia) {
  const chave = simplificar(dia)
  return DIAS.find((nome) => chave.startsWith(simplificar(nome))) ?? null
}

export function nomeDoDiaDeHoje(data = new Date()) {
  return DIAS[data.getDay()]
}

function emMinutos(horaMinuto) {
  const [hora, minuto = 0] = String(horaMinuto).split(':').map(Number)
  const total = hora * 60 + minuto
  return Number.isNaN(total) ? null : total
}

// Manhã até 11:59, tarde até 17:59 e noite a partir das 18:00.
export function turnoDoHorario(inicio) {
  const minutos = emMinutos(inicio)
  if (minutos === null) return null
  if (minutos < 12 * 60) return 1
  if (minutos < 18 * 60) return 2
  return 3
}

// Acrescenta ao horário original o dia padronizado, o turno, o código e a duração.
export function detalharHorario(horario) {
  const dia = nomeDoDia(horario.dia)
  const turno = turnoDoHorario(horario.inicio)
  const inicio = emMinutos(horario.inicio)
  const fim = emMinutos(horario.fim)

  return {
    ...horario,
    dia: dia ?? horario.dia,
    turno,
    nomeTurno: TURNOS.find((item) => item.numero === turno)?.nome ?? null,
    codigo: dia && turno ? `${DIAS.indexOf(dia) + 1}${turno}` : null,
    horas: inicio !== null && fim !== null && fim > inicio ? (fim - inicio) / 60 : 0,
    rotulo: `${dia ?? horario.dia}, ${horario.inicio}–${horario.fim}`,
  }
}

// Soma das horas de aula por semana (aceita horários já detalhados ou não).
export function horasSemanais(horarios) {
  const total = horarios.reduce((soma, horario) => soma + detalharHorario(horario).horas, 0)
  return Math.round(total * 10) / 10
}
