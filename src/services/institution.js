import { getData, hasData, saveData } from './storage'

const dadosIniciais = {
  disciplinas: [
    { id: 'disc-1', codigo: 'ADS101', nome: 'Algoritmos e Lógica de Programação', cargaHoraria: 80, creditos: 4, periodo: '1º período' },
    { id: 'disc-2', codigo: 'ADS102', nome: 'Desenvolvimento Web', cargaHoraria: 80, creditos: 4, periodo: '2º período' },
    { id: 'disc-3', codigo: 'ADS203', nome: 'Banco de Dados', cargaHoraria: 60, creditos: 3, periodo: '3º período' },
    { id: 'disc-4', codigo: 'ADS204', nome: 'Engenharia de Software', cargaHoraria: 60, creditos: 3, periodo: '4º período' },
    { id: 'disc-5', codigo: 'ADS305', nome: 'Redes de Computadores', cargaHoraria: 60, creditos: 3, periodo: '5º período' },
  ],
  professores: [
    { id: 'prof-1', nome: 'Ana Carolina Souza', email: 'ana.souza@uniportal.edu.br', especialidade: 'Desenvolvimento Web' },
    { id: 'prof-2', nome: 'Bruno Martins', email: 'bruno.martins@uniportal.edu.br', especialidade: 'Banco de Dados' },
    { id: 'prof-3', nome: 'Camila Oliveira', email: 'camila.oliveira@uniportal.edu.br', especialidade: 'Engenharia de Software' },
    { id: 'prof-4', nome: 'Daniel Costa', email: 'daniel.costa@uniportal.edu.br', especialidade: 'Redes e Infraestrutura' },
  ],
}

export function obterDadosInstitucionais(chave) {
  if (!hasData(chave)) {
    const iniciais = dadosIniciais[chave] || []
    saveData(chave, iniciais)
    return iniciais
  }

  return getData(chave)
}

export function salvarDadosInstitucionais(chave, dados) {
  return saveData(chave, dados)
}

export function gerarId(prefixo) {
  return `${prefixo}-${globalThis.crypto?.randomUUID?.() || Date.now().toString(36)}`
}
