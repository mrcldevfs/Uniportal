import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  return (
    <main className="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <h1 className="mb-3">UniPortal</h1>
      <p className="text-secondary mb-4">
        Sistema de Atendimento e Matrículas Universitárias
      </p>

      <div className="d-flex gap-3">
        <button
          className="btn btn-dark"
          onClick={() => navigate('/administrador')}
        >
          Acessar como Administrador
        </button>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/aluno')}
        >
          Acessar como Aluno
        </button>
      </div>
    </main>
  )
}

export default Login
