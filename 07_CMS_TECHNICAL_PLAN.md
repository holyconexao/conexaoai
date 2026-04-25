# Conexão AI — Plano Técnico do Novo CMS Editorial

Este documento descreve a arquitetura, estrutura e o roadmap de implementação para o novo CMS (Content Management System) do Conexão AI. Este CMS substitui o uso do Django Admin como interface principal de gestão de conteúdos, assumindo-se como um backoffice editorial próprio e desenhado à medida.

## 1. Arquitetura

- **Backend:** O Django continua a ser o backend e a única fonte de verdade.
- **Frontend (CMS):** O novo CMS será uma interface separada, construída em Next.js (integrado no frontend atual na rota `/cms`).
- **Integração:** O backend expõe APIs REST autenticadas (`/api/cms/...`) para consumir e gerir recursos:
  - Autenticação
  - Posts
  - Categorias
  - Tags
  - Autores
  - Subscritores da Newsletter
  - Media (Cloudinary)
- **Segurança:** O acesso ao CMS é estritamente protegido por login (JWT) e sistema de permissões baseado em funções (Roles).

---

## 2. Estrutura de Páginas (Next.js App Router)

- `/cms/login` — Autenticação e recuperação básica de sessão.
- `/cms` — Dashboard (métricas e atalhos rápidos).
- `/cms/posts` — Tabela de posts (filtros, pesquisa, paginação).
- `/cms/posts/new` — Criação de um novo post.
- `/cms/posts/[id]` — Edição de um post existente.
- `/cms/categories` — CRUD de categorias.
- `/cms/tags` — CRUD de tags.
- `/cms/authors` — Gestão de autores e perfis.
- `/cms/newsletter` — Lista de subscritores com filtros por estado.
- `/cms/media` — Biblioteca de imagens e upload para o Cloudinary.
- `/cms/settings` — Configurações editoriais (futuro).

---

## 3. Componentes Principais de UI

- **CmsShell:** Layout base contendo `Sidebar`, `Topbar` e `Breadcrumbs`.
- **CmsSidebar:** Navegação principal do backoffice.
- **CmsHeader:** Informação do utilizador atual e ações rápidas.
- **DataTable:** Tabelas de dados com suporte a filtros e ordenação.
- **StatusBadge:** Indicadores visuais de estado (`draft`, `published`, `scheduled`).
- **SearchInput & FilterBar:** Componentes de pesquisa e filtragem.
- **EmptyState:** Ecrãs amigáveis para quando não existem dados.
- **ConfirmDialog:** Modais de confirmação para ações destrutivas (ex: eliminar post).
- **FormSection:** Wrapper para agrupar campos de formulário por contexto lógico.
- **RichTextEditor:** Editor de conteúdo (WYSIWYG ou Markdown).
- **SlugField:** Campo de slug com geração automática e edição manual.
- **SeoPanel:** Painel de otimização de SEO (`meta title`, `meta description`, `OG image`).
- **PublishPanel:** Controlo de estado, destaque e data de publicação.
- **MediaPicker & CloudinaryUpload:** Seleção de imagens existentes e upload direto.
- **PreviewPane:** Janela de pré-visualização em tempo real do artigo.
- **Toast / InlineError:** Sistema de feedback claro para sucesso ou erro nas ações.

---

## 4. Estrutura do Módulo de Posts

Os campos de criação/edição de posts estão organizados por blocos funcionais:

- **Conteúdo:** Título, Slug, Resumo (Excerpt), Corpo (Conteúdo principal).
- **Estrutura:** Categoria, Tags, Autor.
- **Media:** Imagem destacada, Alt text, OG image específica.
- **SEO:** Meta title, Meta description, Canonical URL, Keywords.
- **Publicação:** Status (`draft`, `published`), Featured (Destaque), Published_at (Data de publicação).

---

## 5. Endpoints de API Necessários (Backend Django)

O DRF (Django REST Framework) deverá expor os seguintes endpoints na rota `/api/cms/`:

**Autenticação:**
- `POST /api/cms/auth/login/`
- `POST /api/cms/auth/logout/`
- `GET /api/cms/me/`

**Posts:**
- `GET /api/cms/posts/`
- `POST /api/cms/posts/`
- `GET /api/cms/posts/{id}/`
- `PATCH /api/cms/posts/{id}/`
- `DELETE /api/cms/posts/{id}/`

**Categorias:**
- `GET /api/cms/categories/`
- `POST /api/cms/categories/`
- `PATCH /api/cms/categories/{id}/`
- `DELETE /api/cms/categories/{id}/`

**Tags:**
- `GET /api/cms/tags/`
- `POST /api/cms/tags/`
- `PATCH /api/cms/tags/{id}/`
- `DELETE /api/cms/tags/{id}/`

**Autores e Newsletter:**
- `GET /api/cms/authors/`
- `GET /api/cms/subscribers/`

**Media:**
- `POST /api/cms/media/upload/` (ou upload direto para Cloudinary com assinatura segura do backend).

---

## 6. Sistema de Permissões (RBAC)

- **Admin:** Acesso total a todas as funcionalidades e configurações.
- **Editor:** Capacidade de criar, editar e publicar conteúdo de qualquer autor.
- **Author:** Capacidade de criar e editar apenas os próprios posts.
- **Viewer:** Leitura operacional (apenas visualização de dados e métricas).

---

## 7. Direção de Design (UI/UX)

- A interface deve ser **clara e editorial**, distanciando-se de um "admin genérico" de base de dados.
- **Esquema de Cores:** Sidebar escura ou neutra (dark mode/gray) para separar a navegação da área de conteúdo (que deve ser luminosa e focada no texto).
- **Tipografia:** Séria, altamente legível, focada no conforto de escrita.
- **Hierarquia:** Forte hierarquia visual para não sobrecarregar formulários grandes (uso de `FormSection` e separadores).
- **Estados visíveis:** Os estados de publicação (Draft, Published) devem ser óbvios ao primeiro olhar.
- **Foco:** Menos aparência de um sistema ERP, mais aparência de uma plataforma de "Publishing" moderna (inspirada em ferramentas como Ghost ou Sanity).

---

## 8. Fases de Entrega

A construção do CMS será feita de forma faseada para garantir entrega rápida de valor:

### 🚀 MVP (Fase 1) - O Foco Atual
- Layout base (`CmsShell`) e proteção de rotas.
- Ecrã de Login.
- Dashboard simples.
- CRUD de Posts (listagem, criação, edição).
- CRUD de Categorias.
- CRUD de Tags.

### ⚡ V2 (Fase 2)
- Gestão de Media (Biblioteca e integração profunda com Cloudinary).
- Gestão de Autores.
- Gestão da Newsletter.
- Preview em tempo real de artigos.

### 🔥 V3 (Fase 3)
- Agendamento de publicações (`scheduled`).
- Workflow editorial (aprovações).
- Auditoria e histórico de revisões.

---

> **Recomendação Prática para o Desenvolvimento:** Começar imediatamente pela construção do MVP no Next.js (`/cms`) e expor as APIs base no Django. O Django Admin passará a ser utilizado estritamente como fallback técnico e gestão de sistema de baixo nível. A operação editorial migrará para o novo painel assim que Posts, Categorias, Tags e Media estiverem funcionais.
