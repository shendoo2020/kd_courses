# Phase 5: Ubuntu Server Deployment Guide (V2 & Enhancements Updated)

**Author:** [DevOps & Validation Engineer]  
**Project:** KDCourses / KLZ Academy - Premium Course Management Platform

This guide provides step-by-step, copy-paste terminal commands to deploy the KLZ Academy stack onto a fresh **Ubuntu 22.04 / 24.04 LTS** server. It accounts for Cloud Provider specific firewalls (like Oracle Cloud's iptables), V2 architecture additions (Stripe, pdf-lib certificates, Nodemailer SMTP), and continuous deployment with GitHub Actions.

---

## Step 1: Initial Server Setup & Firewall

Secure the server and open ports 80 (HTTP) and 443 (HTTPS). (Note: For Oracle Cloud, you **MUST** also add an Ingress Rule for Port 80 and 443 in your Cloud Console Virtual Cloud Network Security Lists).

```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Force iptables to allow HTTP (Port 80) at the top priority
sudo iptables -I INPUT 1 -p tcp -m state --state NEW --dport 80 -j ACCEPT
# Force iptables to allow HTTPS (Port 443)
sudo iptables -I INPUT 1 -p tcp -m state --state NEW --dport 443 -j ACCEPT

# Save the iptables rules so they persist across reboots
sudo netfilter-persistent save
```

---

## Step 2: Install Node.js (v20 LTS) & PM2

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM into the current shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js v20 LTS and global PM2 process manager
nvm install 20
nvm use 20
nvm alias default 20
npm install -g pm2
```

---

## Step 3: Install & Configure PostgreSQL

Install PostgreSQL and create the user, database, and schema privileges required by the Prisma ORM.

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Create the database user (Password MUST match the .env file)
sudo -u postgres psql -c "CREATE USER kduser WITH ENCRYPTED PASSWORD 'KDuser_p@ssw0rd';"

# Create the database
sudo -u postgres psql -c "CREATE DATABASE kdcourses;"

# Grant privileges to the user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kdcourses TO kduser;"
sudo -u postgres psql -d kdcourses -c "ALTER SCHEMA public OWNER TO kduser;"
```

---

## Step 4: Transfer Code & Build Backend

```bash
# Create directory structure
mkdir -p ~/app
cd ~/app

# Clone your repository
git clone https://github.com/shendoo2020/kd_courses.git kdcourses
cd ~/app/kdcourses/backend

# Install dependencies (including stripe, pdf-lib, and nodemailer)
npm install

# Create the production .env file
cat << 'EOF' > .env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://kduser:KDuser_p@ssw0rd@localhost:5432/kdcourses?schema=public"
JWT_SECRET="generate_a_very_long_secure_random_string_here"
STRIPE_SECRET_KEY="sk_live_or_sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="http://84.235.239.86"

# Transactional Email / Password Reset Service (Resend or SendGrid recommended)
SMTP_HOST="smtp.resend.com"
SMTP_PORT=587
SMTP_USER="resend"
SMTP_PASS="re_your_api_key_here"
SMTP_FROM='"KLZ Academy Support" <support@yourdomain.com>'
EOF

# Push schema directly to PostgreSQL and generate Prisma Client
npx prisma db push
npx prisma generate

# Build the TypeScript backend
npm run build

# Start the backend using PM2
pm2 start dist/server.js --name "kdcourses-api"
```

---

## Step 5: Build Frontend (Next.js)

```bash
# Navigate to frontend
cd ~/app/kdcourses/frontend

# Install dependencies
npm install

# Create the production .env.local file
cat << 'EOF' > .env.local
NEXT_PUBLIC_API_URL="http://84.235.239.86/api"
EOF

# Build the Next.js production bundle
npm run build

# Start the Next.js frontend using PM2
pm2 start npm --name "kdcourses-web" -- start
```

---

## Step 6: Configure Nginx Reverse Proxy

Route all incoming traffic: `/api/*` to Express (port 5000) and `/` to Next.js (port 3000).

```bash
# Install Nginx
sudo apt install nginx -y

# Delete the default Nginx welcome page
sudo rm -f /etc/nginx/sites-enabled/default

# Create our KDCourses Nginx configuration
sudo bash -c 'cat << '\''EOF'\'' > /etc/nginx/sites-available/kdcourses
server {
    listen 80 default_server;
    server_name _;

    # Express REST API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF'

# Enable configuration and test syntax
sudo ln -s /etc/nginx/sites-available/kdcourses /etc/nginx/sites-enabled/ 2>/dev/null
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 7: Save PM2 Processes

```bash
# Save current PM2 processes to ensure auto-restart on system reboot
pm2 save
pm2 startup
```

---

## Step 8: Continuous Deployment (GitHub Actions)

Any commit pushed to `main` triggers `.github/workflows/deploy.yml` which SSHs into the server and executes:

```bash
cd ~/app/kdcourses
git pull origin main
cd backend && npm install && npx prisma generate && npx prisma db push && npm run build
pm2 restart kdcourses-api --update-env
cd ../frontend && npm install && npm run build
pm2 restart kdcourses-web --update-env
sudo systemctl reload nginx
```

---

## 🛠 Operational Lessons Learned & Troubleshooting Guide (LLCs)

### 1. Windows PowerShell Command Chaining vs Bash
- **Problem:** Attempting to chain commands with `&&` in Windows PowerShell (e.g. `npm install && npm run build`) throws:
  `ParserError: The token '&&' is not a valid statement separator in this version.`
- **Solution:** In PowerShell 5.1, use semicolon `;` instead:
  `npm install; npm run build`
  In Linux/Ubuntu Bash, `&&` is standard.

### 2. Path Arguments with Parentheses or Brackets
- **Problem:** Paths containing parentheses or brackets (such as Next.js route groups `(auth)` or dynamic routes `[id]`) trigger subexpression parsing errors in PowerShell if unquoted.
- **Solution:** Always wrap path arguments in single quotes:
  `git add 'frontend/src/app/(auth)/login/page.tsx'`

### 3. Git Push in Headless / Agent CLI Environments
- **Problem:** When Git Credential Manager prompts are disabled or the environment sets `credential.helper=`, running `git push` fails with:
  `fatal: could not read Username for 'https://github.com': terminal prompts disabled`
- **Solution:** Pass the Windows Credential Manager helper explicitly in the command:
  `git -c credential.helper=wincred push origin main`

### 4. Prisma Local Generation vs Live Database Push
- **Problem:** Running `npx prisma db push` locally when PostgreSQL is stopped fails with:
  `Error: P1001: Can't reach database server at localhost:5432`
- **Solution:** Use `npx prisma generate` locally. This compiles TypeScript types offline without needing a database connection. Schema updates to PostgreSQL will be applied automatically on the production server via `npx prisma db push` during CI/CD deployment.

### 5. Transactional Email Strategy: 3rd-Party vs Self-Hosted SMTP
- **Best Practice:** Hosting a local Postfix SMTP server on an Ubuntu VM often results in emails being routed straight to spam folders (Gmail, Outlook) due to lacking PTR records, SPF, DKIM, and DMARC.
- **Solution:** Configure `nodemailer` with environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) pointing to free tiers of transactional services like **Resend** (3,000 free emails/month) or **SendGrid** (100 free emails/day).
- In development without SMTP credentials configured, the backend logs the generated temporary password directly to the console for testing.

### 6. Next.js JSX Ternary Nesting
- **Problem:** Deeply nested multi-branch ternary operators (`a ? b ? c : d : e ? f : g`) in JSX can trigger SWC syntax errors during production builds.
- **Solution:** Refactor mutually exclusive UI views into clean, top-level boolean conditions:
  ```tsx
  {isLoading && <LoadingState />}
  {!isLoading && error && <ErrorState error={error} />}
  {!isLoading && !error && activeTab === 'enrolled' && <EnrolledCourses />}
  {!isLoading && !error && activeTab === 'wishlist' && <WishlistCourses />}
  ```
