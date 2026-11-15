# UniPortal

## Sistema de Gestão Acadêmica e Matrículas Universitárias

O **UniPortal** é uma aplicação web desenvolvida como projeto acadêmico com o objetivo de centralizar e facilitar processos relacionados à gestão acadêmica de uma instituição de ensino superior.

A plataforma possui duas áreas principais: uma área administrativa, destinada à gestão institucional, e um portal do aluno, destinado à consulta de informações acadêmicas e realização de matrículas.

O projeto busca aplicar conceitos de desenvolvimento web, arquitetura de software, organização de código, componentes reutilizáveis, persistência de dados e implementação de regras de negócio.

## 1. Objetivos do projeto

- Desenvolver uma aplicação web para apoiar processos acadêmicos.
- Facilitar o gerenciamento de disciplinas, professores e turmas.
- Permitir que alunos consultem ofertas acadêmicas disponíveis.
- Implementar processos de matrícula e cancelamento.
- Aplicar regras acadêmicas para garantir a consistência das operações.
- Desenvolver uma aplicação modular, organizada e de fácil manutenção.

## 2. Funcionalidades

### Área administrativa

- Visualização de informações gerais da instituição.
- Cadastro, consulta, edição e exclusão de disciplinas.
- Cadastro, consulta, edição e exclusão de professores.
- Criação e gerenciamento de turmas.
- Associação de disciplinas e professores às turmas.
- Definição de horários, capacidade e disponibilidade de vagas.

### Área do aluno

- Visualização do painel acadêmico.
- Consulta de disciplinas e turmas disponíveis.
- Consulta de informações sobre professores, horários e vagas.
- Realização de matrículas.
- Cancelamento de matrículas.
- Consulta das disciplinas matriculadas.
- Visualização da grade horária.

## 3. Regras de negócio

O sistema deverá considerar as seguintes regras:

1. Não permitir matrículas em turmas sem vagas disponíveis.
2. Impedir matrículas duplicadas do mesmo aluno na mesma turma.
3. Não permitir conflitos de horários entre disciplinas matriculadas.
4. Validar os pré-requisitos das disciplinas, quando aplicável.
5. Atualizar a disponibilidade de vagas após matrículas e cancelamentos.
6. Preservar a consistência dos dados durante as operações acadêmicas.
7. Não permitir a exclusão de turmas com matrículas ativas sem tratar previamente essas matrículas.

## 4. Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| React | Construção da interface e dos componentes |
| JavaScript | Implementação da lógica da aplicação |
| Vite | Ambiente de desenvolvimento e build |
| Bootstrap | Estilização e componentes visuais |
| React Router | Navegação entre páginas |
| localStorage | Persistência local dos dados no navegador |
| Git e GitHub | Controle de versão e colaboração |

## 5. Arquitetura da aplicação

A aplicação utiliza uma organização modular, separando a interface visual das operações de dados e das regras de negócio.

O fluxo básico de funcionamento é:

1. **Páginas:** apresentam as funcionalidades e informações ao usuário.
2. **Componentes:** elementos reutilizáveis utilizados em diferentes páginas.
3. **Layouts:** definem a estrutura visual das áreas administrativa e do aluno.
4. **Serviços:** concentram operações sobre os dados e regras de negócio.
5. **Dados:** armazenam informações iniciais utilizadas pela aplicação.
6. **Persistência:** utiliza o localStorage do navegador para manter os dados entre acessos.

Essa separação busca facilitar a manutenção, os testes e o desenvolvimento simultâneo dos módulos.

## 6. Modelo de dados

O sistema utiliza as seguintes entidades principais:

| Entidade | Descrição |
|---|---|
| Aluno | Representa o estudante que utiliza o portal. |
| Professor | Representa os docentes da instituição. |
| Disciplina | Representa as disciplinas oferecidas. |
| Turma | Representa uma oferta de determinada disciplina, com professor, horário e capacidade. |
| Matrícula | Relaciona um aluno a uma turma. |

As entidades são relacionadas por identificadores únicos (IDs), evitando a duplicação desnecessária de informações.

Exemplo: uma turma possui um `disciplinaId` e um `professorId`, enquanto uma matrícula possui um `alunoId` e um `turmaId`.

## 7. Organização do projeto

O código está organizado por responsabilidades, separando páginas, componentes reutilizáveis, layouts e serviços de dados.

```text
src/
├── componentes/       # Componentes reutilizáveis
├── layouts/           # Estruturas das áreas do sistema
├── paginas/
│   ├── administrador/ # Funcionalidades administrativas
│   └── aluno/         # Funcionalidades do aluno
├── servicos/          # Regras de negócio e operações com dados
├── dados/             # Dados iniciais para utilização do sistema
├── estilos/           # Estilos globais
├── App.jsx            # Rotas da aplicação
└── main.jsx           # Inicialização da aplicação
```

## 8. Padrões de desenvolvimento

Para manter a consistência do código, a equipe deverá seguir algumas convenções:

- Utilizar nomes de componentes e páginas em PascalCase.
- Utilizar nomes de funções e variáveis em camelCase.
- Manter componentes reutilizáveis na pasta `componentes`.
- Manter regras de negócio e operações de dados na pasta `servicos`.
- Evitar duplicação de código sempre que possível.
- Evitar implementar regras de negócio diretamente nos componentes visuais quando elas puderem ser centralizadas nos serviços.
- Cada integrante deverá trabalhar preferencialmente em uma branch própria.
- Integrar alterações à branch principal por meio de Pull Requests.

## 9. Testes e validação

Durante o desenvolvimento, as funcionalidades deverão ser verificadas considerando tanto o comportamento esperado quanto as regras de negócio.

Alguns cenários importantes incluem:

- Cadastro e edição de disciplinas.
- Criação de turmas e atualização de vagas.
- Matrícula de alunos em turmas disponíveis.
- Bloqueio de matrículas sem vagas.
- Bloqueio de matrículas duplicadas.
- Validação de conflitos de horários.
- Cancelamento de matrículas e recuperação de vagas.
- Persistência dos dados após atualizar a página.

Os testes serão realizados progressivamente durante a implementação e integração dos módulos.

## 10. Desenvolvimento em equipe

O projeto está organizado em cinco frentes de desenvolvimento:

1. **Gestão institucional:** disciplinas e professores.
2. **Gestão de turmas:** ofertas acadêmicas, horários e vagas.
3. **Portal do aluno:** consulta de informações e disciplinas disponíveis.
4. **Matrículas e regras acadêmicas:** inscrições, cancelamentos e validações.
5. **Arquitetura e integração:** estrutura do projeto, persistência de dados, integração entre módulos e qualidade.

O Git e o GitHub são utilizados para controle de versão, compartilhamento do código e integração das contribuições da equipe.

## 11. Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Git instalado.

### Clonar o repositório

```bash
git clone https://github.com/mrcldevfs/Uniportal.git
```

### Entrar na pasta do projeto

```bash
cd Uniportal
```

### Instalar as dependências

```bash
npm install
```

### Iniciar o ambiente de desenvolvimento

```bash
npm run dev
```

Acesse o endereço disponibilizado pelo Vite, normalmente:

```text
http://localhost:5173/
```

### Gerar a versão de produção

```bash
npm run build
```

## 12. Observações sobre armazenamento

Nesta etapa do projeto, o armazenamento será realizado utilizando `localStorage`.

Isso significa que os dados ficam salvos no navegador e não são automaticamente compartilhados entre diferentes computadores ou usuários. A solução atende à proposta de persistência local do projeto acadêmico.

---

## Contexto acadêmico

Este projeto foi desenvolvido no contexto de uma atividade acadêmica de desenvolvimento de software, com foco na aplicação prática dos conceitos de programação, arquitetura de aplicações, desenvolvimento de interfaces e implementação de regras de negócio.

**UniPortal — Simplificando a gestão acadêmica e o processo de matrículas universitárias.**