# Next.js Starter

A modern, scalable Next.js App Router boilerplate with TypeScript, Tailwind CSS, and comprehensive tooling. Mirrors the [react-vite-boilerplate](https://github.com/mattjaikaran/react-vite-boilerplate) architecture for Next.js.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + Shadcn/ui (new-york, zinc)
- **State**: Zustand (client state) + TanStack Query (server state)
- **Forms**: React Hook Form + Zod validation
- **HTTP**: Axios with interceptors (JWT refresh, Django CSRF)
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
│   ├── utils.ts           # cn() helper, generateId
│   ├── django-integration.ts
│   ├── api/               # Service layer
│   │   ├── services/      # BaseService, AuthService, TodoService
│   │   └── utils/         # Response handlers, query key factories
│   ├── store/             # Zustand stores
│   │   └── slices/        # auth, config, todo, ui slices
│   └── utils/             # Array, async, format, object, storage, validation
├── forms/                 # React Hook Form + Zod forms
│   ├── auth/              # LoginForm, RegisterForm, MagicLinkForm
│   └── todos/             # TodoForm
├── types/                 # TypeScript type definitions
├── config/                # App configuration (env vars, feature flags)
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

## Key Patterns

### API Layer
- Axios instance with JWT token refresh and Django CSRF support
- `BaseService` abstract class for CRUD operations
- Domain-specific services (AuthService, TodoService)
- Query key factories for consistent cache management

### State Management
- **Zustand** for client state (auth, UI, config)
- **TanStack Query** for server state (todos, profile)
- Selector hooks for minimal re-renders

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
