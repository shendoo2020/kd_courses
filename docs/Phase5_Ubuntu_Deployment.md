# Phase 5: Ubuntu Server Deployment Guide

**Author:** [DevOps & Validation Engineer]
**Project:** KDCourses - Premium Course Management Platform

This guide provides step-by-step, copy-paste terminal commands to deploy the KDCourses stack (Next.js Frontend, Node.js/Express Backend, PostgreSQL) onto a fresh **Ubuntu 22.04 LTS** or **24.04 LTS** server.

---

## Step 1: Initial Server Setup & Firewall (UFW)

Secure the server immediately by configuring the Uncomplicated Firewall (UFW).

```bash
# Update package lists and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Allow OpenSSH before enabling firewall to prevent locking yourself out
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS traffic
sudo ufw allow 'Nginx Full'

# Enable the firewall
sudo ufw enable

# Check firewall status
sudo ufw status
```

## Step 2: Install Node.js (v20 LTS) & PM2

We use NVM (Node Version Manager) for flexibility, and PM2 to manage our Node.js processes.

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM into the current shell (or reconnect to your SSH session)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js v20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Install PM2 globally
npm install -g pm2
```

## Step 3: Install & Configure PostgreSQL

Install the database, create a dedicated user, and provision the KDCourses database.

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Switch to the postgres user to execute database commands
sudo -i -u postgres

# Open the psql prompt
psql

# --- INSIDE PSQL PROMPT ---
# Create the database and user (Replace 'secure_password_here' with a strong password)
CREATE DATABASE kdcourses;
CREATE USER kduser WITH ENCRYPTED PASSWORD 'KDuser_p@ssw0rd';
GRANT ALL PRIVILEGES ON DATABASE kdcourses TO kduser;
\q
# --- END PSQL PROMPT ---

# Exit the postgres user session
exit
```

## Step 4: Clone Repository & Build Backend

Assuming your code is in a Git repository, we will pull it and build the backend.

```bash
# Create a directory for the app
mkdir -p ~/app/kdcourses
cd ~/app/kdcourses

# (Example) Clone your repository. Replace with your actual repo URL.
# git clone https://github.com/yourusername/KDCourses.git .

# --- Navigate to backend ---
cd backend

# Install dependencies
npm install

# Create the .env file
cat << 'EOF' > .env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://kduser:secure_password_here@localhost:5432/kdcourses?schema=public"
JWT_SECRET="generate_a_very_long_secure_random_string_here"
EOF

# Run Prisma database push (Creates tables based on schema)
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Build the TypeScript backend
npm run build

# Start the backend using PM2
pm2 start dist/server.js --name "kdcourses-api"
```

## Step 5: Build Frontend (Next.js)

Now, we build the Next.js frontend application.

```bash
# --- Navigate to frontend ---
cd ~/app/kdcourses/frontend

# Install dependencies
npm install

# Create the .env.local file to point to the live backend
cat << 'EOF' > .env.local
NEXT_PUBLIC_API_URL="https://yourdomain.com/api"
EOF

# Build the Next.js application
npm run build

# Start the Next.js frontend using PM2
pm2 start npm --name "kdcourses-web" -- start
```

## Step 6: Save PM2 Processes

Ensure that your Node.js apps restart automatically if the server reboots.

```bash
# Save current PM2 list
pm2 save

# Generate a startup script for PM2 (Run the command it outputs as sudo)
pm2 startup
```

## Step 7: Configure Nginx Reverse Proxy

Install Nginx and configure it to route traffic to the Next.js frontend (Port 3000) and Express backend (Port 5000).

```bash
# Install Nginx
sudo apt install nginx -y

# Create a new Nginx configuration file
sudo nano /etc/nginx/sites-available/kdcourses

# --- PASTE THE FOLLOWING INTO NANO ---
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Route /api requests to the Express Backend (Port 5000)
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Route all other requests to the Next.js Frontend (Port 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
# --- END NANO ---
# Save and exit (Ctrl+O, Enter, Ctrl+X)

# Enable the configuration by creating a symlink
sudo ln -s /etc/nginx/sites-available/kdcourses /etc/nginx/sites-enabled/

# Test Nginx configuration for syntax errors
sudo nginx -t

# Restart Nginx to apply changes
sudo systemctl restart nginx
```

## Step 8: Secure with SSL (Certbot/Let's Encrypt)

Secure your domains with a free Let's Encrypt SSL certificate. *(Ensure your domain's DNS A records point to this server's IP before running).*

```bash
# Install Certbot and the Nginx plugin
sudo apt install certbot python3-certbot-nginx -y

# Obtain and install the SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# (Follow the interactive prompts to provide an email and agree to terms)
# Certbot will automatically configure HTTPS in your Nginx config and set up auto-renewal.
```

---
*Deployment Complete. The KDCourses platform is now live, secured, and managed by PM2.*