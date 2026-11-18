const PREFIX = 'uniportal_'

function obterArmazenamento() {
  return globalThis.localStorage
}

// Recupera dados persistidos. Em caso de chave ausente ou conteúdo inválido,
// retorna uma lista vazia para manter a aplicação utilizável.
export function getData(key) {
  try {
    const valor = obterArmazenamento()?.getItem(`${PREFIX}${key}`)
    if (valor === null || valor === undefined || valor === '') return []

    return JSON.parse(valor) ?? []
  } catch (error) {
    console.error(`Erro ao recuperar os dados de "${key}":`, error)
    return []
  }
}

// Informa se a chave já existe, permitindo diferenciar ausência de dados
// de uma lista intencionalmente vazia.
export function hasData(key) {
  try {
    const armazenamento = obterArmazenamento()
    return armazenamento ? armazenamento.getItem(`${PREFIX}${key}`) !== null : false
  } catch (error) {
    console.error(`Erro ao verificar os dados de "${key}":`, error)
    return false
  }
}

export function saveData(key, data) {
  try {
    const conteudo = JSON.stringify(data)
    if (conteudo === undefined) return false

    obterArmazenamento()?.setItem(`${PREFIX}${key}`, conteudo)
    return Boolean(obterArmazenamento())
  } catch (error) {
    console.error(`Erro ao salvar os dados de "${key}":`, error)
    return false
  }
}

export function removeData(key) {
  try {
    obterArmazenamento()?.removeItem(`${PREFIX}${key}`)
    return Boolean(obterArmazenamento())
  } catch (error) {
    console.error(`Erro ao remover os dados de "${key}":`, error)
    return false
  }
}
