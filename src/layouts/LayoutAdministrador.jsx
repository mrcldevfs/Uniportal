
import { Link, NavLink, Outlet } from 'react-router-dom'

function LayoutAdministrador() {
  return (
    <div className="d-md-flex min-vh-100">
      <aside className="admin-sidebar bg-dark text-white p-3">
        <Link to="/administrador" className="text-white">
          <h4 className="mb-4">UniPortal</h4>
        </Link>
        <p className="small text-secondary">ADMINISTRAÇÃO</p>
        <nav className="nav flex-column gap-1">
          <NavLink to="/administrador" end className={({ isActive }) => `nav-link rounded-0 ${isActive ? 'active' : ''}`}>
            Painel
          </NavLink>
          <NavLink to="/administrador/disciplinas" className={({ isActive }) => `nav-link rounded-0 ${isActive ? 'active' : ''}`}>
            Disciplinas
          </NavLink>
          <NavLink to="/administrador/professores" className={({ isActive }) => `nav-link rounded-0 ${isActive ? 'active' : ''}`}>
            Professores
          </NavLink>
          <NavLink to="/administrador/turmas" className={({ isActive }) => `nav-link rounded-0 ${isActive ? 'active' : ''}`}>
            Turmas
          </NavLink>
        </nav>
      </aside>

      <main className="flex-grow-1">
        <header className="bg-white border-bottom d-flex justify-content-between align-items-center px-4 py-3">
          <span>Área administrativa</span>
          <Link to="/" className="text-secondary">Sair</Link>
        </header>
        <div className="container-fluid p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default LayoutAdministrador
