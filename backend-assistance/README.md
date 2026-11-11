# Backend Assistance & Integration Notes

This directory tracks API questions, schema agreements, and integration documentation between the SafeBite Frontend team and the Backend team.

## Current Working Agreements (Phase 1)
- **Base API URL**: `https://q136wfhl-3000.inc1.devtunnels.ms`
- **Active Backend Routes**:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `POST /api/auth/logout` (stateless, client clears token)
  - `GET /api/auth/profile`
  - `PATCH /api/auth/profile` (updates `fullName`)
  - `POST /api/auth/forgot-password` (informational)
