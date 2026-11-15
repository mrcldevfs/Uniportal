
function PaginaEmConstrucao({ titulo, descricao }) {
    return (
      <div className="bg-white rounded-3 border p-4">
        <h2>{titulo}</h2>
        <p className="text-secondary mb-0">{descricao}</p>
      </div>
    )
  }
  
  export default PaginaEmConstrucao
  