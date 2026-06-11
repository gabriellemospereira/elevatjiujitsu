## Módulo Eventos e Campeonatos de Jiu-Jitsu

Esse é um módulo grande. Proponho integrá-lo ao app atual (Elevate) reaproveitando login, perfis e papéis já existentes, em **3 fases**. Confirme as escolhas antes de eu codar.

---

### Fase 1 — Fundação (Catálogo público + Inscrições)

**Banco (novas tabelas):**
- `events` — nome, descrição, data/horário início/fim, cidade, estado, endereço, lat/lng, organizador, valor, regulamento (url), premiação, banner, status (rascunho/publicado/cancelado)
- `event_categories` — categorias por evento (nome, faixa, idade min/max, peso min/max, gênero, vagas, valor)
- `event_registrations` — atleta × categoria, status (pendente/confirmada/cancelada), pagamento (manual nesta fase)
- `event_media` — fotos/vídeos do evento
- `event_reviews` — avaliação 1–5 + comentário
- Novo papel `organizador` no enum `app_role`
- RLS: leitura pública de eventos publicados; organizador edita os seus; atleta gerencia suas inscrições

**Páginas públicas:**
- `/eventos` — listagem com filtros (cidade, estado, data, faixa, categoria, organizador) e busca
- `/eventos/:slug` — detalhes, galeria, cronograma, mapa (Google Maps via connector), categorias, botão inscrever
- Home pública ganha seção "Próximos eventos" + contador regressivo do principal

**Área logada:**
- `/app/eventos` — minhas inscrições, próximos, histórico
- Inscrição em categoria → cria `event_registrations`, envia e-mail de confirmação

**Área organizador (`/app/org`):**
- CRUD de eventos, categorias e mídia
- Lista de inscritos por categoria, exportar CSV

**Admin:** promover usuário a `organizador`.

---

### Fase 2 — Resultados, Medalhas e Ranking

- `event_results` — atleta, categoria, colocação (1º/2º/3º)
- Dashboard do atleta: medalhas (ouro/prata/bronze), pódios, eventos participados
- Página `/ranking` — ranking regional por pontuação acumulada (fórmula simples: ouro 9 / prata 3 / bronze 1, ajustável)
- Organizador lança resultados pós-evento

---

### Fase 3 — Extras

- Check-in por QR Code (token único por inscrição)
- Certificado digital em PDF (participação e pódio)
- Compartilhamento em redes sociais (OG tags por evento)
- Notificações por e-mail (lembretes 7d/1d antes via cron)
- Pagamento online (Stripe) — opcional, só se você quiser

---

### Decisões que preciso de você

1. **Pagamento da inscrição na Fase 1:** manual (organizador confirma) ou já integrar Stripe?
2. **Escopo geográfico:** só Londrina/PR ou aberto a eventos de todo Brasil?
3. **Mapa:** posso ativar o conector Google Maps (recomendado) ou prefere link externo simples?
4. **Tema claro:** o app hoje é dark only. Adiciono toggle claro/escuro agora ou mantém só dark?

Confirma essas 4 + se posso seguir pela **Fase 1** que já começo a implementar.
