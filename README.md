# 🍯 NAPI Abelhas — Frontend

Sistema de Gestão de Amostras Apícolas. Controle de qualidade para mel, própolis, geleia real e outros produtos da apicultura.

## Tecnologias

- **Next.js 16** — React framework com App Router
- **React 19** — Biblioteca de UI
- **TypeScript 5** — Tipagem estática
- **Tailwind CSS 4** — Estilização utilitária
- **DaisyUI 5** — Componentes prontos sobre Tailwind

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- npm, yarn ou pnpm

## Instalação

```bash
# Clone o repositório
git clone https://github.com/The-Loop-Code/frontend-napi-abelhas.git
cd frontend-napi-abelhas

# Instale as dependências
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

| Variável | Descrição | Padrão |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API backend | `http://localhost:3001` |

## Scripts

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Inicia o build de produção
```

## Estrutura do projeto

```
src/
├── app/                  # Rotas (App Router)
│   ├── (auth)/           # Rotas de autenticação (login, registro)
│   ├── amostras/         # CRUD de amostras
│   └── produtores/       # CRUD de produtores
├── components/
│   ├── atoms/            # Componentes base (Button, Input, Badge)
│   ├── molecules/        # Composições simples (FormField, SearchBar)
│   ├── organisms/        # Composições complexas (Sidebar, AmostraTable, AnaliseModal)
│   └── templates/        # Layouts de página (DashboardTemplate)
├── constants/            # Enums e constantes (tipos de amostra, status, rotas)
├── hooks/                # Hooks customizados
├── services/             # Cliente HTTP e serviços da API
├── types/                # Interfaces TypeScript
└── utils/                # Funções utilitárias
```

## Funcionalidades

- **Amostras** — Cadastro, listagem e acompanhamento de amostras apícolas (mel, própolis, geleia real, cera, pólen)
- **Produtores** — Gestão de produtores com dados de contato e endereço
- **Análises** — Registro de análises físico-químicas, microbiológicas, sensoriais e de resíduos
- **Dashboard** — Navegação com sidebar e layout responsivo

## Licença

Este projeto está sob a licença [MIT](LICENSE).

---

Desenvolvido por **Italo Kaique Bertini Bueno** &copy; 2026
