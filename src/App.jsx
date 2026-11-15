
import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import LayoutAdministrador from './layouts/LayoutAdministrador'
import LayoutAluno from './layouts/LayoutAluno'

// Páginas administrativas
import PainelAdministrador from './paginas/administrador/PainelAdministrador'
import Disciplinas from './paginas/administrador/Disciplinas'
import Professores from './paginas/administrador/Professores'
import Turmas from './paginas/administrador/Turmas'

// Páginas do aluno
import PainelAluno from './paginas/aluno/PainelAluno'
import DisciplinasDisponiveis from './paginas/aluno/DisciplinasDisponiveis'
import Matriculas from './paginas/aluno/Matriculas'
import GradeHoraria from './paginas/aluno/GradeHoraria'

// Login
import Login from './paginas/Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/administrador" element={<LayoutAdministrador />}>
        <Route index element={<PainelAdministrador />} />
        <Route path="disciplinas" element={<Disciplinas />} />
        <Route path="professores" element={<Professores />} />
        <Route path="turmas" element={<Turmas />} />
      </Route>

      <Route path="/aluno" element={<LayoutAluno />}>
        <Route index element={<PainelAluno />} />
        <Route path="disciplinas" element={<DisciplinasDisponiveis />} />
        <Route path="matriculas" element={<Matriculas />} />
        <Route path="grade-horaria" element={<GradeHoraria />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
