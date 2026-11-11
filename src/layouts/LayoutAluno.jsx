
import { NavLink, Outlet } from 'react-router-dom'

function LayoutAluno() {
  return (
    <div className="d-flex min-vh-100">
      <aside className="bg-primary text-white p-3" style={{ width: '250px' }}>
        <h4 className="mb-4">UniPortal</h4>

        <p className="text-white-50 small">ÁREA DO ALUNO</p>

        <nav className="nav flex-column gap-2">
          <NavLink to="/aluno" end className="nav-link text-white">
            Meu painel
          </NavLink>

          <NavLink to="/aluno/disciplinas" className="nav-link text-white">
            Disciplinas disponíveis
          </NavLink>

          <NavLink to="/aluno/matriculas" className="nav-link text-white">
            Minhas matrículas
          </NavLink>

          <NavLink to="/aluno/grade-horaria" className="nav-link text-white">
            Grade horária
          </NavLink>
        </nav>
      </aside>

      <main className="flex-grow-1">
        <header className="bg-white border-bottom p-3">
          <span className="fw-semibold">Portal do Aluno</span>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default LayoutAluno
