## Fase 1 — Fundação do Sistema Elevate

Esta é a primeira de 4 ondas. Aqui montamos a base de dados, login e o módulo de graduação animado. As demais fases (Admin, Gamificação/Analytics, PWA/Emails/Push/Certificados) virão depois, sobre essa base.

### O que será entregue nesta fase

**1. Backend (Lovable Cloud)**
- Ativação do Lovable Cloud (banco, auth, storage, edge functions).
- Storage bucket `avatars` para foto do aluno.

**2. Estrutura de dados**
- `profiles` — nome completo, telefone, data de nascimento, data de matrícula, foto, faixa atual, grau, vínculo com `auth.users`.
- `user_roles` — papéis `admin`, `professor`, `aluno` (tabela separada + função `has_role` para evitar recursão em RLS).
- `belts` — faixas (Branca, Azul, Roxa, Marrom, Preta) com aulas necessárias para próxima graduação (60/120/180/250).
- `classes` — catálogo de aulas/modalidades (BJJ Adulto, Kids, Funcional, etc.).
- `attendance` — presenças (aluno, aula, professor, data, modalidade). Fonte da verdade para graduação, ranking e histórico. Nesta fase ainda sem UI de chamada — virá na Fase 2 (Admin).
- RLS em todas as tabelas + grants para `authenticated` / `service_role`.

**3. Autenticação**
- Login/cadastro com e-mail e senha + Google.
- Auto-criação de `profile` no signup via trigger.
- Página `/auth` (login + cadastro), proteção de rotas, logout.
- Redirecionamento: aluno → `/dashboard`, admin/professor → `/admin` (Fase 2).

**4. Layout do app logado**
- Novo layout `/app` com sidebar (Dashboard, Perfil, Graduação, Histórico — placeholders nas fases seguintes).
- Site institucional atual segue acessível em `/` (você pediu para transformar tudo em logado, mas mantenho a home pública para captação de novos alunos e adiciono botão "Área do Aluno"). Se quiser tornar tudo restrito, ajusto numa próxima iteração.

**5. Página de Perfil (`/app/perfil`)**
- Upload de foto (Storage).
- Nome, telefone, e-mail, nascimento, data de matrícula.
- Faixa e grau (somente leitura para o aluno — quem altera é admin/professor na Fase 2).

**6. Módulo de Graduação (`/app/graduacao`)**
- Faixa atual + próxima faixa.
- Aulas realizadas / aulas restantes / % concluída.
- Barra de progresso animada (Framer Motion) com gradiente dourado.
- Cálculo automático via contagem de `attendance`.

**7. Dashboard do Aluno (`/app/dashboard`)**
- Cards: foto, nome, faixa atual, grau, tempo de academia, total de aulas, posição no ranking (placeholder até Fase 3), próxima graduação (mini barra de progresso).

### Detalhes técnicos

```text
src/
├── pages/
│   ├── Auth.tsx                  # login + signup
│   └── app/
│       ├── Dashboard.tsx
│       ├── Perfil.tsx
│       └── Graduacao.tsx
├── components/app/
│   ├── AppLayout.tsx             # sidebar + header logado
│   ├── BeltProgress.tsx          # barra animada
│   └── ProtectedRoute.tsx
├── hooks/
│   ├── useAuth.tsx               # onAuthStateChange + getUser
│   ├── useProfile.tsx
│   └── useGraduation.tsx
└── integrations/supabase/...     # auto-gerado
```

Migrations (ordem):
1. enum `app_role` + tabela `user_roles` + função `has_role`.
2. `profiles` + trigger `handle_new_user`.
3. `belts` (seed com 5 faixas e requisitos).
4. `classes` (seed com modalidades atuais do site).
5. `attendance`.
6. Bucket `avatars` (público) + policies.

Todas as tabelas com `GRANT` apropriado a `authenticated` e `service_role`, e RLS:
- Aluno vê/edita só o próprio perfil e presenças.
- Admin/professor (via `has_role`) vê tudo.

### Próximas fases (resumo, não fazem parte desta entrega)

- **Fase 2 — Admin:** CRUD de alunos/professores/horários/graduações, chamada de aulas, alterar faixa/grau, relatórios.
- **Fase 3 — Gamificação & Analytics:** Histórico com filtros, ranking mensal/trimestral/anual com medalhas, sistema de conquistas/badges, dashboards Recharts (linha/barra/pizza/área), metas mensais.
- **Fase 4 — Extras Premium:** Dark mode com persistência, PWA instalável, emails transacionais (graduação, lembretes), Web Push, certificados PDF de graduação.

Posso seguir com a Fase 1?
