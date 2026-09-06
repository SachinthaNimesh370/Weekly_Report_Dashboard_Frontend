# 📊 Sisenco Weekly Report & Team Dashboard

An enterprise-grade **Weekly Report Generator and Consolidated Team Dashboard** built with **React (Vite)**, **Vanilla CSS**, and **Spring Boot REST API**. 

The frontend connects to a live AWS EC2 backend database (`http://52.66.241.245:8080`), providing automated weekly reporting workflows, team compliance tracking, and project workload analytics.

---

## 🚀 Live Backend Deployment

- **Backend Base URL**: `http://52.66.241.245:8080`
- **Architecture**: Spring Boot 3 with JWT Security, Hibernate/JPA, and MySQL Database.
- **Frontend CI/CD**: Automated deployment to AWS EC2 via GitHub Actions (`.github/workflows/deploy.yml`).

---

## 🔐 Demo Login Credentials (Seeded Sri Lankan Accounts)

All accounts are pre-seeded and active in the live EC2 database with the universal password: **`Password@123`**

### 1. System Administrator
| Name | Email | Password | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Sachintha Nimesh** | `admin@sisenco.lk` | `Password@123` | `ROLE_ADMIN` | Full administrative control, user provisioning, project creation & deletions |

### 2. Engineering Lead / Manager
| Name | Email | Password | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Nuwan Silva** | `nuwan.silva@sisenco.lk` | `Password@123` | `ROLE_MANAGER` | Consolidated team dashboard, report reviews, change requests & approvals |

### 3. Engineering Team Members
| Name | Email | Password | Role | Assigned Focus Area |
| :--- | :--- | :--- | :--- | :--- |
| **Chamara Fernando** | `chamara.f@sisenco.lk` | `Password@123` | `ROLE_TEAM_MEMBER` | Senior Fullstack Engineer *(Commercial Bank App)* |
| **Dilshan Jayawardena** | `dilshan.j@sisenco.lk` | `Password@123` | `ROLE_TEAM_MEMBER` | Backend & Cloud Engineer *(e-Channelling Platform)* |
| **Kavindi Wickramasinghe** | `kavindi.w@sisenco.lk` | `Password@123` | `ROLE_TEAM_MEMBER` | QA & Test Automation Specialist *(Cypress / OWASP)* |
| **Tharindu Rajapaksha** | `tharindu.r@sisenco.lk` | `Password@123` | `ROLE_TEAM_MEMBER` | Frontend React Engineer *(Dialog Axiata IoT)* |
| **Anuki Senanayake** | `anuki.s@sisenco.lk` | `Password@123` | `ROLE_TEAM_MEMBER` | UI & Mobile Apps Engineer *(SLT Fiber App)* |
> 💡 **Sign-In**: Use any of the pre-seeded credentials above to log in and test role-based access for Admin, Manager, or Team Member, or register a new account via the **Create Account** tab.

---

## 📂 Active Enterprise Projects in Database

1. **Commercial Bank Mobile Banking App Revamp**
   - *LankaQR EMV standard payment integration, biometric auth, and CBSL compliance.*
2. **e-Channelling Telemedicine & Doctor Booking Platform**
   - *Digital healthcare consultation, prescription sync, and hospital slot scheduling.*
3. **Dialog Axiata Enterprise IoT & Telemetry System**
   - *Industrial IoT telemetry ingestion, live SVG gauges, and automated sensor alerting.*
4. **Sri Lanka Telecom (SLT) Fiber Self-Care App**
   - *Fiber connection diagnostics, bill payments, and package upgrade engine.*

---

## ✨ Key Features

- **Personal Weekly Report Form**: Dynamic Monday–Sunday week cycles, task entries with planned vs. actual progress, task type breakdowns (Development, Testing, Meetings, Documentation), blockers, and key achievements.
- **Version Control & Draft Management**: Auto-saving drafts, edit existing submissions, version incrementing on re-submission, and manager revision history.
- **Consolidated Team Dashboard**: Real-time team compliance rate, active submissions, open blockers count, hours distribution charts, and member status cards.
- **Manager Review Workflow**: Side-by-side report inspection, 1-click approval, and formal change requests with inline comments.
- **Project & Category Management**: Full project lifecycle management (Create, Edit, Activate/Deactivate, Delete) and team member assignments.
- **User & Role Administration**: Real-time user directory, role assignments (`ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_TEAM_MEMBER`), and account status toggles.
- **Zero Mock Data Leaks**: 100% data driven from the live EC2 backend database with graceful empty states.

---

## 🛠️ Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

### 1. Clone the Repository
```bash
git clone https://github.com/SachinthaNimesh370/Weekly_Report_Dashboard_Frontend.git
cd Weekly_Report_Dashboard_Frontend
```

### 2. Configure Environment
Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=http://52.66.241.245:8080
```

### 3. Install Dependencies & Run Dev Server
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates production bundle in `dist/`.

---

## 🚢 CI/CD & Deployment to AWS EC2

This repository includes a GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that builds and deploys the frontend directly to an AWS EC2 instance running Nginx.

### Required GitHub Secrets
Navigate to **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions**, and add:

| Secret Name | Value |
| :--- | :--- |
| `EC2_HOST` | Frontend EC2 Public IP or Domain Name |
| `EC2_SSH_KEY` | Private SSH Key content (`.pem`) for SSH access |
| `VITE_API_URL` | `http://52.66.241.245:8080` (Backend API URL) |

### Deployment Pipeline Stages
1. **Build**: Pulls code, installs dependencies with `npm ci`, sets environment variables, runs `npm run build`.
2. **SCP Artifacts**: Securely copies `dist/` build files to `/var/www/weekly-report/` on EC2.
3. **Nginx Reload**: Tests configuration (`sudo nginx -t`) and reloads Nginx service (`sudo systemctl reload nginx`).

---

## 🔒 Security & Git Policies

- **Private Keys (`.pem`) & Secrets**: `.gitignore` is configured to explicitly ignore `*.pem`, `.pem`, `.env`, and `.env.local` to prevent private key and credential leaks to public repositories.
- **Authentication**: All API requests utilize JWT Bearer tokens stored in local storage and refreshed on login.
