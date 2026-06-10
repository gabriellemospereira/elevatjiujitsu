# Fase 2 — Agenda, Reservas e Áreas de Professor/Admin

A Fase 1 (login, perfil, módulo de graduação, dashboard básico) já está no ar. Esta fase entrega o **núcleo operacional** do sistema: agenda de aulas, reservas, chamada/presença, histórico e CRUD básico para professor e admin. Fica como Fase 3 a parte de gamificação avançada, gráficos Recharts, certificados PDF, QR check-in, e-mails, push e carteirinha digital.

## O que entra nesta fase

### 1. Banco de dados (novas tabelas e ajustes)
- `class_schedules` — grade fixa semanal (dia da semana, horário início/fim, modalidade, professor, vagas, local).
- `class_sessions` — ocorrências reais de aula em uma data específica (gerada a partir da grade). Fonte de verdade para reservas e chamada.
- `reservations` — reserva do aluno em uma `class_session` (status: confirmada, cancelada, presente, falta).
- `graduations` — histórico de graduações do aluno (faixa anterior, faixa nova, data, professor responsável, observação). Permite calcular "data da última graduação" e "próxima graduação prevista".
- `student_notes` — observações privadas do professor sobre um aluno.
- Ajuste em `attendance`: passa a referenciar `class_session_id` (mantém compatibilidade).
- RLS:
  - Aluno: lê grade e sessões, gerencia suas próprias reservas, lê suas presenças/graduações.
  - Professor: lê tudo, edita sessões/reservas/presenças das aulas que leciona, cria notas.
  - Admin: full CRUD em tudo (via `has_role`).
- GRANTs corretos para `authenticated` e `service_role` em todas as novas tabelas.

### 2. Área do Aluno (expansão)
- **Dashboard** ganha: data da última graduação, próxima graduação prevista (estimativa por ritmo de aulas), presenças no mês, frequência %.
- **Agenda (`/app/agenda`)**: calendário semanal com aulas, professor, vagas restantes e local. Botões "Reservar" / "Cancelar". Lista de "Minhas próximas aulas".
- **Histórico (`/app/historico`)**: tabela com data, modalidade, professor, presença/falta, filtros por mês e modalidade.
- Toast de confirmação ao reservar/cancelar.

### 3. Área do Professor (`/prof`)
Acessível para quem tem role `professor` ou `admin`.
- **Minhas aulas hoje/semana**: lista de `class_sessions` do professor.
- **Chamada**: tela por sessão com lista de inscritos + botão "Presente/Falta" (grava em `attendance` + atualiza `reservations.status`). Permite adicionar aluno avulso (drop-in).
- **Gestão de horários**: CRUD da grade semanal (`class_schedules`) das aulas que leciona.
- **Notas de aluno**: criar/editar observação privada.

### 4. Área Administrativa (`/admin`)
Acessível só para `admin`.
- **Alunos**: lista com busca, editar perfil, alterar faixa/grau, registrar graduação (cria linha em `graduations` e atualiza `profiles.belt_id` + `degree`), promover a professor/admin.
- **Professores**: lista, promover/rebaixar.
- **Turmas/Horários**: CRUD completo de `class_schedules` e geração de `class_sessions` para as próximas semanas.
- **Graduações**: ajustar `belts.classes_to_next_belt`.
- **Relatórios (versão simples desta fase)**: cards com totais — alunos ativos, aulas no mês, frequência média, alunos próximos da graduação (>80% do requisito). Gráficos Recharts ficam para Fase 3.

### 5. Infra técnica
- Roteamento: `ProtectedRoute` aceita `requireRole?: 'professor' | 'admin'`.
- Hook `useRole()` para checar role do usuário logado.
- Job/edge function leve `generate-sessions` (executada sob demanda pelo admin nesta fase; cron fica para Fase 3) que materializa `class_sessions` das próximas 4 semanas a partir da grade.
- Estrutura de arquivos:
```text
src/pages/
  app/
    Agenda.tsx
    Historico.tsx       # expandir
    Dashboard.tsx       # expandir
  prof/
    Index.tsx
    Chamada.tsx
    Horarios.tsx
    Notas.tsx
  admin/
    Index.tsx
    Alunos.tsx
    Professores.tsx
    Turmas.tsx
    Graduacoes.tsx
    Relatorios.tsx
src/hooks/
  useRole.tsx
  useSchedule.tsx
  useReservations.tsx
supabase/functions/
  generate-sessions/index.ts
```

## O que NÃO entra nesta fase (vai para Fase 3/4)
- Gráficos Recharts (linha/barra/pizza) detalhados.
- Notificações automáticas, e-mails de lembrete, Web Push.
- QR Code de check-in.
- Carteirinha digital.
- Certificado PDF de graduação.
- Ranking gamificado com medalhas/conquistas.
- Planos/mensalidades e cobrança (precisa decisão: Stripe? Pagar.me? Manual?).

## Perguntas antes de codar
1. **Planos/mensalidades**: cobrança online (Stripe) ou só cadastro manual de quem pagou? (Sugiro deixar fora desta fase.)
2. **Reservas**: aluno pode reservar com quantas horas de antecedência mínima? E cancelar até quanto tempo antes? (Sugiro: reservar até 30 min antes, cancelar até 1h antes.)
3. **Geração de sessões**: gerar automaticamente 4 semanas à frente toda semana, ou só sob demanda no admin nesta fase?

Posso seguir com a Fase 2 assim que confirmar (ou responder "pode ir" para usar os defaults sugeridos).
