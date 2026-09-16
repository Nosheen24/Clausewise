# Clausewise Frontend

Clausewise is a Contract Lifecycle Management Platform frontend built with Next.js, TypeScript, and Tailwind CSS.

## Overview

Clausewise helps mid-sized companies manage their contracts by providing a central platform for:
- Contract upload and management
- Automated information extraction with confidence scoring
- Human review queues
- Playbook comparison
- Obligation tracking and calendar
- Approval workflows
- Version history and comparison

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components built for Clausewise's professional/legal aesthetic
- **PDF Viewer**: @react-pdf-viewer/core
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context + Hooks
- **Mock Data**: Built-in mock data layer (easily replaceable with real API)

## Design System

The interface follows a professional and trustworthy design suitable for legal and business users:

- **Primary**: #14304F (nav, headers, buttons)
- **Accent**: #C9A227 (highlights, status indicators)
- **Background**: #FBF9F4 (page background)
- **Surface**: #FFFFFF (cards, panels)
- **Typography**: Geist Sans for UI elements, Georgia/Times New Roman for document content

## Development Process

### Architecture
- **App Router**: Next.js 16 App Router for file-based routing
- **Server Components**: Default for static/read-only pages
- **Client Components**: Used for interactive features (forms, filters, modals)
- **Component Composition**: Reusable UI components in `components/ui/`, feature-specific in `components/*/`
- **Context Provider**: Auth context for user state management
- **Mock Data Layer**: Centralized data in `lib/data.ts` that mirrors the expected API shape

### Design Patterns
- Component composition with typed props
- Context-based state management for authentication
- Separation of concerns (UI, logic, data)
- Mock data abstraction layer for easy API integration

## Getting Started

### Prerequisites
- Node.js 18+
- npm 10+

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. Use any email and any password to log in (mock authentication).

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
clausewise-frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Landing page (redirects to dashboard/login)
│   ├── login/             # Login page
│   ├── dashboard/         # Main dashboard view
│   ├── contracts/         # Contract listing
│   ├── contracts/[id]/    # Contract details
│   ├── upload/            # Contract upload page
│   ├── document/[id]/     # Document viewer with PDF.js
│   ├── review/            # Human review queue
│   ├── playbooks/         # Playbook management
│   ├── calendar/          # Obligation calendar
│   ├── approvals/         # Approval queue
│   ├── versions/[id]/     # Version history
│   ├── settings/          # Organization settings
│   └── users/             # User management
├── components/
│   ├── ui/                # Reusable UI components (Button, Card, Badge, etc.)
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── dashboard/         # Dashboard-specific components
│   ├── contracts/         # Contract-specific components
│   ├── details/           # Contract detail components
│   ├── viewer/            # Document viewer components
│   ├── review/            # Review queue components
│   ├── calendar/          # Calendar components
│   ├── approval/          # Approval components
│   ├── forms/             # Form components
│   └── providers/         # Context providers (Auth)
├── lib/
│   ├── data.ts            # Mock data generator (mirrors API shape)
│   ├── utils.ts           # cn() utility (clsx + tailwind-merge)
│   └── constants.ts       # App constants
├── types/
│   └── index.ts           # TypeScript type definitions
├── styles/
│   └── globals.css        # Tailwind + custom styles
└── public/                # Static assets
```

## Pages and Features

| Page | Route | Description |
|------|-------|-------------|
| Login | /login | Sign in page |
| Dashboard | /dashboard | Overview with stats, recent contracts, obligations |
| Contracts | /contracts | List all contracts with search/filter |
| Contract Details | /contracts/[id] | View extracted info, clauses, obligations |
| Upload | /upload | Drag-and-drop contract upload |
| Document Viewer | /document/[id] | PDF viewer with extracted data |
| Review Queue | /review | Low/medium confidence items for human review |
| Playbooks | /playbooks | Organization contract rules |
| Obligation Calendar | /calendar | Track important dates and deadlines |
| Approvals | /approvals | Approve or reject contracts |
| Version History | /versions/[id] | Compare contract versions |
| Settings | /settings | Organization settings and thresholds |
| Users | /users | User management and roles |

## Mock Data

The frontend uses a built-in mock data layer (`src/lib/data.ts`) that provides:
- 15 contracts with varied statuses
- Extracted fields with realistic confidence scores
- Contract versions
- Obligations with due dates
- Playbooks with rules
- Review items
- Users with different roles

When ready to connect to the backend, replace `src/lib/data.ts` with API calls to the Django REST API endpoints.

## Future Integration

When connecting to the backend, the following API endpoints will be used:

- `POST /api/auth/login/` - Authentication
- `GET /api/contracts/` - List contracts
- `POST /api/contracts/` - Upload contracts
- `GET /api/contracts/{id}/` - Contract details
- `GET /api/contracts/{id}/extraction/` - Extracted fields
- `GET /api/contracts/{id}/versions/` - Version history
- `GET /api/reviews/` - Review queue items
- `GET /api/playbooks/` - Playbooks
- `GET /api/obligations/` - Obligations
- `POST /api/approvals/{id}/approve/` - Approve contracts

## Environment Variables

Create a `.env` file (not committed):

```
# Not required for frontend mock data mode
# When connecting to backend:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## License

Proprietary - Clausewise