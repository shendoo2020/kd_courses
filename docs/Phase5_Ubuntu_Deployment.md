# Phase 5: Ubuntu Server Deployment Guide (V2 Updated)

**Author:** [DevOps & Validation Engineer]
**Project:** KDCourses - Premium Course Management Platform

This guide provides step-by-step, copy-paste terminal commands to deploy the KDCourses stack onto a fresh **Ubuntu 22.04 / 24.04 LTS** server. It has been updated to account for Cloud Provider specific firewalls (like Oracle Cloud's iptables) and V2 architecture additions.

---

## Step 1: Initial Server Setup & Firewall

Secure the server and open port 80. (Note: For Oracle Cloud, you **MUST** also add an Ingress Rule for Port 80 in your Cloud Console Virtual Cloud Network Security Lists).

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

## Step 2: Install Node.js (v20 LTS) & PM2

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM into the current shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js v20 LTS and PM2
nvm install 20
nvm use 20
nvm alias default 20
npm install -g pm2
```

## Step 3: Install & Configure PostgreSQL

Install the database and create the exact user and password required by our backend `.env`.

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

## Step 4: Transfer Code & Build Backend

We assume you have pushed your local code to a GitHub repository.

```bash
# Create a directory for the app
mkdir -p ~/app
cd ~/app

# Clone your repository (Replace URL with your actual repo!)
# git clone https://github.com/YOUR_USERNAME/KDCourses.git kdcourses
cd ~/app/kdcourses/backend

# Install dependencies (Including V2 stripe & pdf-lib)
npm install

# Create the .env file
cat << 'EOF' > .env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://kduser:KDuser_p@ssw0rd@localhost:5432/kdcourses?schema=public"
JWT_SECRET="generate_a_very_long_secure_random_string_here"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
EOF

# Push schema and Generate Prisma Client
npx prisma db push
npx prisma generate

# Build the TypeScript backend
npm run build

# Start the backend using PM2
pm2 start dist/server.js --name "kdcourses-api"
```

## Step 5: Build Frontend (Next.js)

```bash
# Navigate to frontend
cd ~/app/kdcourses/frontend

# Install dependencies
npm install

# Create the .env.local file. REPLACE IP WITH YOUR SERVER'S ACTUAL IP OR DOMAIN!
cat << 'EOF' > .env.local
NEXT_PUBLIC_API_URL="http://84.235.239.86/api"
EOF

# Build the Next.js application
npm run build

# Start the Next.js frontend using PM2
pm2 start npm --name "kdcourses-web" -- start
```

## Step 6: Configure Nginx Reverse Proxy

Install Nginx, delete the default override page, and configure it to route traffic.

```bash
# Install Nginx
sudo apt install nginx -y

# Delete the default Nginx welcome page
sudo rm -f /etc/nginx/sites-enabled/default

# Create our KDCourses config
sudo bash -c 'cat << '\''EOF'\'' > /etc/nginx/sites-available/kdcourses
server {
    listen 80 default_server;
    server_name _;

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

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

# Enable configuration and restart
sudo ln -s /etc/nginx/sites-available/kdcourses /etc/nginx/sites-enabled/ 2>/dev/null
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: Save PM2 Processes

```bash
# Save current PM2 list so they restart on server reboot
pm2 save
pm2 startup
```

---
*Deployment Complete. The KDCourses V2 platform is now live.*