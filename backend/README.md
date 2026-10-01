# Clausewise Backend - Django REST Framework API

## Overview

The Clausewise backend is a Django REST Framework (DRF) API that powers the Contract Lifecycle Management platform. It handles:

- User authentication and authorization
- Contract CRUD operations
- File upload and extraction processing
- Human review queue management
- Playbook comparison and clause matching
- Obligation tracking and calendar
- Approval workflows and state transitions
- Organization settings and user management

The backend is designed to be a RESTful API that integrates with the Next.js frontend via standard HTTP requests.

## Tech Stack

- **Framework:** Django REST Framework
- **Language:** Python 3.8+
- **Database:** SQLite for development, PostgreSQL for production
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Django REST Framework serializers with field validation
- **Security:** CORS headers, CSRF protection, password hashing
- **Testing:** Django test suite with pytest

## Installation

### Prerequisites

```bash
# Python 3.8+
# pip
```

### Setup Steps

1. Clone this repository
2. Navigate to the `backend` directory
3. Create virtual environment
4. Install dependencies
5. Apply migrations
6. Start the development server

### Detailed Instructions

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
# venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file from example
cp .env.example .env

# Apply database migrations
python manage.py migrate

# Create superuser (optional, for admin access)
python manage.py createsuperuser

# Start development server
python manage.py runserver 8000
```

The API will be available at `http://localhost:8000/api/`

## API Documentation

See `API_DOCS.md` for complete API documentation including:

- All endpoints with HTTP methods
- Request/response schemas
- Authentication requirements
- Error responses
- Example requests/responses

## Key Features

### Authentication

- User registration and login
- JWT token-based authentication
- Protected routes for authenticated users
- Role-based access control (admin, reviewer, approver)

### Contract Management

- Upload contract documents (PDF)
- Automated field extraction with confidence scores
- Human review queue for low/medium confidence extractions
- Version control and comparison
- Clause extraction and playbook matching
- Obligation tracking with due dates

### Workflows

- **Approval Workflow:** State-machine transitions
  - Draft → Under Review → Legal Review → Approved/Rejected
  - Only authorized users can perform transitions
- **Review Queue:** Handle uncertain extractions
- **Playbook Comparison:** Match clauses against organization rules

### Security

- Password hashing (PBKDF2 with SHA256)
- JWT token validation
- CORS headers for frontend integration
- Rate limiting (basic)
- Input validation and sanitization

## Project Structure

```
backend/
├── manage.py                    # Django project entry point
├── README.md                    # Project documentation
├── API_DOCS.md                   # API reference documentation
├── .env.example                 # Environment variables template
├── config/                     # Django configuration
│   ├── settings.py              # Main settings
│   ├── urls.py                  # URL routing
│   └── asgi.py                  # ASGI configuration
├── apps/                       # Django applications
│   ├── auth/                   # User authentication
│   ├── contracts/              # Contract CRUD operations
│   ├── extraction/             # Field extraction logic
│   ├── review/                 # Review queue management
│   ├── approvals/              # Approval workflow
│   ├── playbooks/              # Playbook management
│   ├── obligations/            # Obligation tracking
│   └── users/                  # User management
├── database/                   # Database configuration
├── tests/                      # Test suite
└── requirements.txt           # Python dependencies
```

## Development

### Running Tests

```bash
# Run all tests
python manage.py test

# Run tests for specific app
python manage.py test contracts
python manage.py test auth

# Run with pytest (if installed)
pytest
```

### Database Migrations

```bash
# Apply migrations
python manage.py migrate

# Create new migration
python manage.py makemigrations

# Show migration status
python manage.py showmigrations
```

### Creating Superuser

```bash
python manage.py createsuperuser
```

## API Endpoints

See `API_DOCS.md` for complete API reference. Key endpoints include:

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/auth/profile/` - Get current user profile

### Contracts
- `GET /api/contracts/` - List contracts
- `POST /api/contracts/` - Create contract
- `GET /api/contracts/{id}/` - Get contract details
- `PUT/PATCH /api/contracts/{id}/` - Update contract
- `DELETE /api/contracts/{id}/` - Delete contract
- `POST /api/contracts/{id}/upload/` - Upload contract document

### Review Queue
- `GET /api/reviews/` - List review queue
- `POST /api/reviews/{id}/` - Submit review decision

### Approvals
- `GET /api/approvals/` - List approval queue
- `POST /api/approvals/{id}/approve/` - Approve contract
- `POST /api/approvals/{id}/reject/` - Reject contract

### Other Resources
- Playbooks, obligations, users, settings

## Environment Configuration

Create a `.env` file (not committed to git) with the following:

```bash
# Django settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite for development)
DATABASE_URL=sqlite:///db.sqlite3

# CORS origins (comma-separated)
CORS_ORIGINS=http://localhost:3000

# JWT settings
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
```

## Security Considerations

1. **Production Setup:**
   - Use HTTPS
   - Set `DEBUG=False`
   - Use PostgreSQL instead of SQLite
   - Set proper `ALLOWED_HOSTS`
   - Use secure cookie settings

2. **Authentication:**
   - Strong passwords (minimum length, complexity)
   - Rate limiting on login endpoints
   - Password hashing with salt

3. **API Security:**
   - Input validation on all endpoints
   - CORS restriction to frontend origin
   - API key authentication for third-party integrations (future)

## Deployment

The backend can be deployed using:

- **Docker:** Containerize the Django application
- **AWS/GCP/Azure:** Managed Python hosting services
- **Traditional servers:** Using gunicorn + nginx

Refer to the deployment documentation in the repository for specific instructions.

## Future Enhancements

1. **WebSocket Support:** Real-time notifications for approvals
2. **File Processing:** Background task processing for large PDFs
3. **Advanced Analytics:** Contract analytics and reporting
4. **API Versioning:** Versioned API endpoints for backward compatibility
5. **Rate Limiting:** Advanced rate limiting per user/API key
6. **Logging:** Comprehensive API and application logging

## License

Proprietary - Clausewise