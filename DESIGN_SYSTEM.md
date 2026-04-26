# Conexão AI - Design System & System Design

Este documento define os padrões visuais, tokens de design e arquitetura de componentes do ecossistema Conexão AI. O objetivo é garantir que toda a plataforma (Frontend público e Backoffice CMS) mantenha uma identidade visual premium, consistente e alinhada com as cores da marca.

## 1. Identidade Visual e Cores

O sistema utiliza uma paleta de cores minimalista com alto contraste, baseada nas cores do logo da marca, suportando temas claros e escuros via CSS Variables (`globals.css`) e extensões do Tailwind (`tailwind.config.ts`).

### Paleta Principal (Tokens)
- **Background**: Fundo principal da aplicação (Branco no claro, Preto/Slate-950 no escuro).
  - Variável: `--background`
- **Foreground**: Texto principal e elementos de alto destaque (Preto no claro, Branco no escuro).
  - Variável: `--foreground`
- **Primary / Accent**: Cor principal de destaque (Verde Esmeralda/Logo ou Preto/Slate-900 dependendo do contexto).
  - Variável: `--primary` / `--accent`
- **Muted**: Textos secundários, bordas e fundos sutis.
  - Variáveis: `--muted`, `--muted-foreground`, `--border`
- **Card/Surface**: Fundos de cartões e painéis com elevação subtil.
  - Variável: `--card`, `--surface`

### Cores Baseadas no Logo (Referência)
*Sempre utilize os utilitários do Tailwind (`bg-primary`, `text-primary`, `bg-foreground`, `text-[#ffffff]`) para manter a consistência com o tema.*

- **Texto em botões escuros:** Deve ser sempre explicitamente `#ffffff` (`text-[#ffffff]`) para evitar problemas de contraste no Tailwind v4.

## 2. Tipografia

A plataforma adota uma hierarquia tipográfica focada na legibilidade (estilo editorial).

- **Font Display (Títulos):** Tipografia com serifa ou sem serifa geométrica (configurada na variável `--font-display` / `font-display`). Utilizada em títulos principais (H1, H2).
- **Font Sans (Interface):** Tipografia sem serifa padrão do sistema (Inter, Roboto ou system-ui). Utilizada para corpo de texto, botões, navegação e descrições.
- **Font Mono (Código/Dados):** Utilizada em painéis do CMS, slugs, e dados técnicos.

## 3. Padrões de Layout e UI

Todos os novos componentes e páginas devem seguir as seguintes regras:

### Glassmorphism
- Elementos flutuantes, como o cabeçalho (Header) ou barras de pesquisa, devem utilizar o efeito *glass*.
- Classe de utilidade: `backdrop-blur-md bg-background/80`.

### Sombras e Bordas
- **Premium Radius:** Os elementos arredondados devem partilhar a mesma escala de raio global (ex: `rounded-lg` ou `rounded-full` para botões primários).
- **Subtle Borders:** Separadores devem utilizar os componentes `<Separator />` do Shadcn UI ou a classe `border-[var(--line)]` / `border-border`. Evitar sombras pesadas; focar em bordas subtis.

### Shadcn UI (Componentes Core)
Nós utilizamos o **Shadcn UI** como base para a construção dos componentes do painel e do frontend. Não crie componentes do zero se já existir um correspondente no Shadcn.

**Componentes Disponíveis:**
- `Button` (Primário, Secundário, Outline, Ghost)
- `Card` (Para posts, widgets e resumos)
- `Badge` (Para categorias e tags)
- `Breadcrumb` (Para navegação em páginas de artigos e CMS)
- `Separator` (Para divisão estrutural de seções)
- `Input` / `Select` (Para formulários)

**Exemplo de uso de Botão com contraste garantido:**
```tsx
import { Button } from "@/components/ui/button"

// Correto
<Button className="bg-foreground text-[#ffffff] hover:bg-primary">
  Ação Primária
</Button>

// Correto (Variante padrão do Shadcn)
<Button variant="default">
  Ação Primária
</Button>
```

## 4. Padronização do Componente de Logo (`BrandLogo`)

Para evitar problemas de proporção (distorção), o logo **nunca** deve ser inserido manualmente com tags `<img />` soltas. Utilize sempre o componente centralizado `BrandLogo.tsx`.

- O `BrandLogo` já contém restrições de altura e utiliza `object-fit: contain` com preenchimento relativo.
- Utilização: `<BrandLogo />` (Presente no `Header`, `Footer` e `CmsSidebar`).

## 5. Estrutura do Projeto (Frontend)

O frontend Next.js App Router (Turbopack) está dividido da seguinte forma:

```text
frontend/
├── app/
│   ├── (public)/          # Rotas acessíveis aos usuários (Home, Sobre)
│   ├── blog/              # Rotas dos artigos (Posts, Categorias)
│   └── cms/               # Backoffice administrativo (Dashboard, Posts, Mídia)
├── components/
│   ├── ui/                # Componentes base do Shadcn UI (Botões, Inputs, Cards)
│   ├── layout/            # Estruturas de página (Header, Footer, Nav)
│   ├── blog/              # Componentes específicos de conteúdo
│   └── cms/               # Componentes internos do painel administrativo
├── lib/
│   ├── utils.ts           # Funções utilitárias (cn, formatDate, slugify)
│   ├── site.ts            # Metadados globais e navegação
│   └── api.ts             # Integrações com o Backend (Django)
└── public/
    └── brand/             # Assets da marca (Logos, Favicons)
```

## 6. Regras de Ouro (Golden Rules)
1. **Não use cores inline isoladas:** Exceto a cor `text-[#ffffff]` em fundos escuros. Para os restantes, confie no tema (`bg-primary`, `text-muted-foreground`).
2. **Utilize Shadcn UI para layout comum:** Reutilize componentes baseados em `Card`, `Breadcrumb` e `Separator`.
3. **Consistência Semântica:** Os textos de metadados devem usar `text-sm text-muted-foreground`. Títulos de blocos devem ser `font-semibold`.
4. **Sem Componentes de Cliente Desnecessários:** No App Router, prefira sempre Server Components para velocidade. Use `"use client"` apenas onde o estado é essencial (como formulários do CMS).
