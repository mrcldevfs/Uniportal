
import { NavLink, Outlet } from 'react-router-dom'

function LayoutAdministrador() {
  return (
    <div className="d-flex min-vh-100">
      <aside className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h4 className="mb-4">UniPortal</h4>

        <p className="text-secondary small">ADMINISTRAÇÃO</p>

        <nav className="nav flex-column gap-2">
          <NavLink to="/administrador" end className="nav-link text-white">
            Painel
          </NavLink>

          <NavLink to="/administrador/disciplinas" className="nav-link text-white">
            Disciplinas
          </NavLink>

          <NavLink to="/administrador/professores" className="nav-link text-white">
            Professores
          </NavLink>

          <NavLink to="/administrador/turmas" className="nav-link text-white">
            Turmas
          </NavLink>
        </nav>
      </aside>

      <main className="flex-grow-1">
        <header className="bg-white border-bottom p-3">
          <span className="fw-semibold">Portal Administrativo</span>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default LayoutAdministrador
