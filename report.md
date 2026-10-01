# Clausewise - Full Project Report (Frontend + Backend API Development)

## 1. Project Overview

Clausewise is a Contract Lifecycle Management (CLM) platform designed for mid-sized companies that need to manage contracts end-to-end. The platform covers the complete contract lifecycle: **upload → automated extraction → human review → playbook comparison → approval → obligation tracking → version history**.

The project is structured as a full-stack application:
- **Frontend:** Next.js 16 (App Router) with TypeScript and Tailwind CSS 4
- **Backend:** Django REST Framework API with database integration
- **Database:** Relational database to store all application data

The frontend was built first with a mock data layer to ensure the UI works independently, and the backend API is being developed to replace this mock layer seamlessly.

---

## 2. Frontend (Already Completed)

### Pages Built (15 routes)
1. Landing Page (`/`)
2. Login Page (`/login`)
3. Signup Page (`/signup`)
4. Dashboard (`/dashboard`)
5. Contracts List (`/contracts`)
6. Contract Detail (`/contracts/[id]`)
7. Document Viewer (`/document/[id]`)
8. Upload Page (`/upload`)
9. Review Queue (`/review`)
10. Playbooks (`/playbooks`)
11. Obligation Calendar (`/calendar`)
12. Approvals (`/approvals`)
13. Version History (`/versions/[id]`)
14. Settings (`/settings`)
15. Users (`/users`)

### Key Frontend Features
- Mock authentication with localStorage persistence
- Contract management with full CRUD flow
- AI extraction display with confidence scores
- Human review queue for low-confidence extractions
- Playbook comparison and clause-level matching
- Obligation tracking with calendar view
- Approval workflow with state-machine enforcement
- Version history and comparison
- Responsive layout (mobile, tablet, desktop)
- PDF rendering with extracted data overlay

### Frontend Tech Stack
- Next.js 16 App Router
- TypeScript (strict mode)
- Tailwind CSS 4
- Lucide React icons
- date-fns
- React Context + Hooks
- @react-pdf-viewer/core

---

## 3. Back-End API Development

The backend is being developed to power all frontend functionality. It will be built as a RESTful API that interfaces with a relational database and provides secure authentication, proper error handling, and data validation.

### 3.1 Framework Selection

**Django REST Framework (DRF)** is selected as the backend framework because:

- Built-in ORM eliminates manual SQL queries
- Automatic schema generation for the database
- Built-in authentication mechanisms (Token, Session)
- Django admin panel for quick database management
- Third-party packages for JWT authentication, validation, and testing
- Mature ecosystem with excellent documentation
- Easy integration with the frontend via REST endpoints

### 3.2 Database Schema

A relational database (SQLite for development, PostgreSQL for production) will be used with the following core tables:

#### Users / Organizations
- **User:** id, name, email, password (hashed), role (admin, reviewer, approver), organization
- **Organization:** id, name, settings (confidence thresholds, notification preferences)

#### Contracts
- **Contract:** id, title, description, status (draft, under_review, legal_review, approved, rejected, expired, renewed), organization, created_at, updated_at
- **ContractVersion:** id, contract, version_number, file_path, uploaded_by, uploaded_at, description

#### Extracted Fields
- **ExtractedField:** id, contract, field_type (parties, dates, payment_terms, liability_caps, renewal_windows), value, confidence_score, extracted_by, extracted_at

#### Clauses and Playbooks
- **Clause:** id, contract, clause_type, text, playbook_match (boolean), deviation_notes
- **Playbook:** id, organization, name, description
- **PlaybookRule:** id, playbook, clause_type, rule_text, is_active

#### Obligations
- **Obligation:** id, contract, description, due_date, status (pending, completed, overdue), assigned_to

#### Review Queue
- **ReviewItem:** id, contract, field, extracted_value, reviewer_note, status (pending, approved, rejected), reviewed_by, reviewed_at

#### Approvals
- **Approval:** id, contract, action (approve, reject), approved_by, approved_at, comments, status

### 3.3 API Endpoints (RESTful)

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | User login with email/password |
| POST | `/api/auth/register/` | New user registration |
| GET | `/api/auth/profile/` | Get current user profile |
| POST | `/api/auth/logout/` | Logout / revoke token |

#### Contracts (CRUD)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contracts/` | List all contracts (with search/filter) |
| POST | `/api/contracts/` | Create new contract |
| GET | `/api/contracts/{id}/` | Get contract details |
| PUT/PATCH | `/api/contracts/{id}/` | Update contract |
| DELETE | `/api/contracts/{id}/` | Delete contract |
| POST | `/api/contracts/{id}/upload/` | Upload contract document |
| GET | `/api/contracts/{id}/extraction/` | Get extracted fields with confidence |
| GET | `/api/contracts/{id}/versions/` | Get version history |
| GET | `/api/contracts/{id}/clauses/` | Get clauses with playbook match status |
| GET | `/api/contracts/{id}/obligations/` | Get contract obligations |

#### Review Queue
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/` | List review queue items |
| POST | `/api/reviews/{id}/` | Submit review decision |
| GET | `/api/reviews/{id}/` | Get specific review item |

#### Approvals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/approvals/` | List approval queue |
| POST | `/api/approvals/{id}/approve/` | Approve contract |
| POST | `/api/approvals/{id}/reject/` | Reject contract |

#### Playbooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/playbooks/` | List playbooks |
| POST | `/api/playbooks/` | Create playbook |
| PUT/PATCH | `/api/playbooks/{id}/` | Update playbook |
| GET | `/api/playbooks/{id}/rules/` | Get playbook rules |

#### Obligations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/obligations/` | List all obligations |
| PATCH | `/api/obligations/{id}/` | Update obligation status |
| GET | `/api/obligations/upcoming/` | Get upcoming obligations |

#### Users and Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/` | List users (admin only) |
| GET | `/api/settings/` | Get organization settings |
| PATCH | `/api/settings/` | Update organization settings |

### 3.4 Authentication and Security

The backend will implement:
- **JWT-based authentication** with access and refresh tokens
- **Role-based access control** (admin, reviewer, approver)
- **Password hashing** using Django's built-in PBKDF2 or bcrypt
- **Token revocation** on logout
- **CORS configuration** to allow only the frontend origin
- **Input validation** using Django serializers and validators
- **Rate limiting** to prevent abuse
- **CSRF protection** for session-based authentication
- **SQL injection prevention** via Django ORM (parameterized queries)
- **XSS prevention** through Django's auto-escaping
- **File upload validation** (file type, size limits for PDFs)

### 3.5 Error Handling

The backend will return consistent JSON error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": ["Specific error message"]
    }
  }
}
```

Error codes will follow standard HTTP status codes:
- `400 Bad Request` — invalid input
- `401 Unauthorized` — not authenticated
- `403 Forbidden` — authenticated but no permission
- `404 Not Found` — resource doesn't exist
- `409 Conflict` — state transition conflict
- `500 Internal Server Error` — server-side issue

### 3.6 Data Validation

Validation rules implemented at the API level:
- Email format validation
- Strong password requirements (length, special characters)
- Contract title required (min 3 characters)
- Confidence scores between 0 and 100
- Due dates must be valid dates
- Status transitions must follow defined workflow (Draft → Under Review → Legal Review → Approved/Rejected)
- File uploads limited to PDF format with size limit
- Unique constraint on contract title per organization

### 3.7 Testing Strategy

API tests will be written to verify functionality of all endpoints using Django's built-in test client and pytest:

| Test Category | What It Verifies |
|---------------|-----------------|
| Authentication Tests | Login, logout, token refresh, unauthorized access |
| Contract CRUD Tests | Create, read, update, delete contracts |
| Upload Tests | PDF upload, validation, processing |
| Extraction Tests | Field extraction with confidence scores |
| Review Queue Tests | Submit and retrieve review decisions |
| Approval Tests | Valid and invalid state transitions |
| Playbook Tests | Rule creation and clause matching |
| Obligation Tests | CRUD and status updates |
| Permission Tests | Role-based access control |
| Error Handling Tests | Consistent error responses |

### 3.8 API Documentation

Documentation will be provided in a dedicated `API_DOCS.md` file (or OpenAPI/Swagger format) detailing:
- Every endpoint with HTTP method
- Request parameters (path, query, body)
- Request body schemas
- Expected response formats
- Error responses
- Authentication requirements
- Example requests and responses

### 3.9 Backend Project Structure

```
backend/
├── manage.py
├── README.md
├── API_DOCS.md
├── .env.example
├── config/                 # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── asgi.py
├── apps/
│   ├── auth/               # User authentication
│   ├── contracts/          # Contract CRUD
│   ├── extraction/         # Field extraction
│   ├── review/             # Review queue
│   ├── approvals/          # Approval workflow
│   ├── playbooks/          # Playbook management
│   ├── obligations/        # Obligation tracking
│   └── users/              # User management
├── database/               # SQLite/PostgreSQL configuration
├── tests/                  # API test suite
└── requirements.txt
```

### 3.10 Setup and Execution Instructions

```bash
# Clone the repository
git clone <repository-url>

# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Apply database migrations
python manage.py migrate

# Start development server
python manage.py runserver 8000
```

The backend will run on `http://localhost:8000/api/` and the frontend on `http://localhost:3000`.

---

## 4. Integration Between Frontend and Backend

The frontend's `lib/data.ts` mock layer is designed as the **single swap point**. When the backend is ready:

1. Replace mock data functions in `lib/data.ts` with `fetch` calls to backend endpoints
2. Update `NEXT_PUBLIC_API_URL` in `.env` to point to the backend
3. Frontend components remain unchanged because they depend on function signatures, not data sources

**Example swap:**

```typescript
// Before (mock)
export async function getContracts() {
  return mockContracts;
}

// After (real API)
export async function getContracts() {
  const response = await fetch(`${API_URL}/api/contracts/`);
  return response.json();
}
```

---

## 5. Current Status

### Completed
- Full frontend application (15 pages)
- Responsive design system
- Mock data layer
- Component library
- Documentation (README)

### In Progress
- Backend API development (Django REST Framework)
- Database schema design
- Authentication implementation
- API endpoint development
- API testing

### Next Steps
1. Set up Django project structure
2. Configure database and models
3. Implement authentication (JWT)
4. Build contract CRUD endpoints
5. Implement upload and extraction endpoints
6. Build review, approval, playbook, and obligation endpoints
7. Write comprehensive API tests
8. Document all endpoints in API_DOCS.md
9. Connect frontend to real backend

---

## 6. Key Features Summary

1. **Mock Authentication** — Login/signup with any credentials
2. **Contract Management** — Full CRUD flow with list, detail, upload, version tracking
3. **AI Extraction Display** — Extracted fields with confidence scores
4. **Human Review Queue** — Filterable list for manual review
5. **Playbook Comparison** — Clause-level matching against rules
6. **Obligation Tracking** — Calendar view with deadline management
7. **Approval Workflow** — State-machine enforced transitions
8. **Version History** — Compare contract versions
9. **Responsive Layout** — Mobile, tablet, desktop breakpoints
10. **Document Viewer** — PDF rendering with data overlay
11. **Backend API** — RESTful endpoints with database integration
12. **Security** — JWT auth, validation, error handling

---

## 7. Verification Checklist

### Frontend
- [x] `npm run dev` starts without errors
- [x] Login → Dashboard flow works
- [x] Contract list → Detail → Approve flow works
- [x] Upload → processing → extraction pipeline works
- [x] Review Queue filtering works
- [x] Calendar displays obligations
- [x] Playbooks page renders
- [x] Approvals workflow functional
- [x] Version comparison works
- [x] `npm run build` compiles cleanly
- [x] `npm run lint` passes
- [x] Invalid approval transitions blocked in UI
- [x] Responsive at mobile (375px), tablet (768px), desktop

### Backend (Planned)
- [ ] Django project setup complete
- [ ] Database models created and migrated
- [ ] Authentication (JWT) working
- [ ] All CRUD endpoints implemented
- [ ] Upload and extraction endpoints working
- [ ] Review and approval endpoints working
- [ ] Playbook and obligation endpoints working
- [ ] API tests passing
- [ ] API documentation complete
- [ ] Frontend connected to real backend
