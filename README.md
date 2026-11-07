# Next.js Starter

A modern, scalable Next.js App Router boilerplate with TypeScript, Tailwind CSS, and comprehensive tooling. Mirrors the [react-vite-boilerplate](https://github.com/mattjaikaran/react-vite-boilerplate) architecture for Next.js.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + Shadcn/ui (new-york, zinc)
- **State**: Zustand (client state) + TanStack Query (server state)
- **Forms**: React Hook Form + Zod validation
- **HTTP**: Axios with interceptors (JWT refresh, Django CSRF) + generated hey-api client
- **Theme**: next-themes (light/dark/system)
- **Icons**: Lucide React

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (main)/            # Public route group (about, contact, faq, etc.)
│   ├── (auth)/            # Auth route group (login, register, magic-link)
│   ├── dashboard/         # Protected dashboard routes
│   ├── todos/             # Todo CRUD routes
│   └── api/               # API routes (health check)
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── nav/               # Navbar, Footer
│   ├── layouts/           # MainLayout, DashboardLayout, AuthLayout
│   ├── shared/            # Hero, DataTable, FeatureFlag
│   ├── charts/            # AreaChart, BarChart, DonutChart, StatCard
│   └── providers/         # ThemeProvider, QueryProvider, AppProviders
├── hooks/
│   ├── api/               # Generic API hooks (useApiGet, useApiPost, etc.)
│   ├── queries/           # Domain query hooks (useProfile, useTodos)
│   ├── mutations/         # Domain mutation hooks (useLogin, useCreateTodo)
│   └── utils/             # useDebounce, useLocalStorage, useMediaQuery
├── lib/
│   ├── api.ts             # Axios instance with interceptors
│   ├── api-client.ts      # Generated-client config (reuses the axios instance)
│   ├── utils.ts           # cn() helper, generateId
│   ├── django-integration.ts
│   ├── api/               # Service layer
│   │   ├── services/      # BaseService, AuthService, TodoService
│   │   └── utils/         # Response handlers, query key factories
│   ├── store/             # Zustand stores
│   │   └── slices/        # auth, config, todo, ui slices
│   └── utils/             # Array, async, format, object, storage, validation
├── src/api/generated/     # Generated hey-api client, types, Zod, Query hooks
├── forms/                 # React Hook Form + Zod forms
│   ├── auth/              # LoginForm, RegisterForm, MagicLinkForm
│   └── todos/             # TodoForm
├── types/                 # TypeScript type definitions
├── config/                # App configuration (env vars, feature flags)
├── openapi.json           # Committed contract fixture for the paired backend
├── openapi-ts.config.ts   # hey-api generator config
└── middleware.ts           # Auth middleware stub
```

## Getting Started

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local

# Run development server
bun dev

# Build for production
bun run build

# Start production server
bun start
```

## Django Backend Integration

This boilerplate is designed to work with a Django backend. API requests are proxied via `next.config.ts` rewrites:

```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/api/v1/:path*',
      destination: `${process.env.INTERNAL_API_URL}/api/v1/:path*`,
    },
  ];
}
```

Set `NEXT_PUBLIC_MODE=django-spa` for Django SPA mode with CSRF token support.

## Generated API Client

`@hey-api/openapi-ts` generates a typed axios SDK, Zod schemas, and TanStack Query
helpers from an OpenAPI contract into `src/api/generated`. The generated files are
committed, so the app builds before a backend exists.

```bash
bun run api:generate   # regenerate src/api/generated
bun run api:check      # fail if the committed output is stale
```

`api:check` is part of `bun run gauntlet`. Do not edit `src/api/generated` by hand.

The config reads `OPENAPI_INPUT` when set. Otherwise it uses
`../backend/docs/openapi/openapi.json` in a mattstack monorepo and falls back to the
committed `openapi.json` fixture in a standalone checkout.

The generated client is configured in `lib/api-client.ts`. It reuses the axios
instance from `lib/api.ts`, so bearer-token, CSRF, refresh, and error interceptors
apply, and it resolves the API origin so contract paths (`/api/...`) are not
double-prefixed.

```typescript
import { todoListTodos } from '@/src/api/generated';

const { data } = await todoListTodos({ throwOnError: true });
```

Client components, route handlers, and server components can call the SDK. TanStack
Query helpers live in `@/src/api/generated/@tanstack/react-query.gen`.

## Key Patterns

### API Layer
- Axios instance with JWT token refresh and Django CSRF support
- `BaseService` abstract class for CRUD operations
- Domain-specific services (AuthService, TodoService)
- Generated typed SDK, Zod schemas, and TanStack Query helpers in `src/api/generated`
- Query key factories for consistent cache management

### State Management
- **Zustand** for client state (auth, UI, config)
- **TanStack Query** for server state (todos, profile)
- Selector hooks for minimal re-renders

### Protected route redirects

See [AGENTS.md](AGENTS.md#code-standards-and-architecture-rules).

### Feature Flags
```tsx
<FeatureFlag feature="enableTodos">
  <TodoList />
</FeatureFlag>
```

## Related

- [react-vite-boilerplate](https://github.com/mattjaikaran/react-vite-boilerplate) - React Vite version
- [matt-stack](https://github.com/mattjaikaran/matt-stack) - CLI for scaffolding projects

## License

MIT
