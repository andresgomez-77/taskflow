# TaskFlow 🚀

SaaS de gestión de tareas tipo Kanban con autenticación JWT, dashboard privado y CRUD completo.

## Stack Técnico

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** — tipado estático end-to-end
- **TailwindCSS** — estilos utility-first
- **React Query (TanStack Query v5)** — server state, caché y sincronización
- **Axios** — HTTP client con interceptores JWT

### Backend
- **NestJS** — framework modular con DI
- **Prisma ORM** — type-safe DB access
- **PostgreSQL** — base de datos relacional
- **JWT + Passport** — autenticación stateless
- **bcrypt** — hash de contraseñas

## Estructura del Proyecto

```
taskflow/
├── frontend/          # Next.js App
│   └── src/
│       ├── app/           # App Router pages
│       ├── components/    # Componentes reutilizables
│       ├── hooks/         # Custom hooks
│       ├── lib/           # Axios, utils
│       ├── store/         # Estado global (si se necesita)
│       └── types/         # Tipos TypeScript compartidos
├── backend/           # NestJS API
│   └── src/
│       ├── auth/          # Módulo autenticación
│       ├── tasks/         # Módulo tareas
│       ├── prisma/        # Servicio Prisma
│       └── common/        # Guards, decorators, pipes
└── package.json       # Monorepo root
```

## Iniciar el proyecto

### Prerrequisitos
- Node.js >= 20
- PostgreSQL corriendo localmente o en la nube
- npm >= 10

### Backend
```bash
cd backend
cp .env.example .env       # Configura tus variables
npm install
npx prisma migrate dev     # Crea las tablas
npm run start:dev          # Inicia en http://localhost:3001
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                # Inicia en http://localhost:3000
```

## Variables de Entorno

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
JWT_SECRET="tu-secreto-muy-seguro-aqui"
JWT_EXPIRATION="7d"
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Fases de Desarrollo

- [x] **Fase 0** — Setup del proyecto
- [ ] **Fase 1** — Autenticación (JWT)
- [ ] **Fase 2** — Modelos y base de datos
- [ ] **Fase 3** — CRUD de tareas
- [ ] **Fase 4** — Kanban Board
- [ ] **Fase 5** — UI/UX Profesional
- [ ] **Fase 6** — Optimización
- [ ] **Fase 7** — Testing
- [ ] **Fase 8** — Deploy

## Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add task creation form
fix: resolve JWT expiration bug
chore: update prisma schema
docs: add API documentation
refactor: extract auth service logic
test: add auth unit tests
```
