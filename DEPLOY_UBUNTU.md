# Deploy Next.js (Ubuntu Server)

This project is a **full Next.js app** (App Router + server routes), so you deploy it as a Node.js service.

## 0) What you need from you

- A domain name (example: `cms.yourdomain.com`)
- A Linux server (Ubuntu 22.04/24.04 recommended)
- Your production environment variables:
  - `DATABASE_URL=...`
  - `SESSION_SECRET=...` (strong random string)

> If you haven’t decided yet, you can deploy without a domain first and test via server IP.

---

## 1) Install Node.js + npm (recommended)

Use NodeSource to install **Node LTS** (includes npm).

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

node -v
npm -v
```

---

## 2) Upload / clone the project

### Option A: Git clone
```bash
cd /var/www
sudo mkdir -p church-manager
sudo chown -R $USER:$USER /var/www/church-manager
cd /var/www/church-manager

# Example:
# git clone https://github.com/<you>/<repo>.git .
```

### Option B: SCP / rsync
Copy the folder to `/var/www/church-manager`.

---

## 3) Install dependencies + build

Inside the project folder:

```bash
npm ci
npm run build
```

---

## 4) Set production environment variables

Create a server-only env file (NOT committed to git):

```bash
sudo nano /etc/church-manager.env
```

Example content:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
SESSION_SECRET=change-me-to-a-long-random-secret
```

Lock it down:

```bash
sudo chown root:root /etc/church-manager.env
sudo chmod 600 /etc/church-manager.env
```

---

## 5) Run the app (choose ONE)

### Option 5A (recommended): PM2

```bash
sudo npm i -g pm2

cd /var/www/church-manager

# Start Next.js in production
pm2 start npm --name church-manager -- start -- --port 3000

# Make PM2 restart on reboot
pm2 save
pm2 startup
```

> PM2 will print a command like `sudo env PATH=... pm2 startup systemd -u ... --hp ...` — run that.

**Important:** PM2 does not automatically load `/etc/church-manager.env`.

Simplest approach is to export variables before starting:

```bash
set -a
source /etc/church-manager.env
set +a
pm2 restart church-manager || pm2 start npm --name church-manager -- start -- --port 3000
```

If you prefer PM2 to manage env explicitly, tell me and I’ll add an `ecosystem.config.cjs`.

### Option 5B: systemd (best for servers)

Create a systemd service:

```bash
sudo nano /etc/systemd/system/church-manager.service
```

Paste:

```ini
[Unit]
Description=Church Manager (Next.js)
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/church-manager
EnvironmentFile=/etc/church-manager.env
ExecStart=/usr/bin/npm run start -- --port 3000
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo chown -R www-data:www-data /var/www/church-manager
sudo systemctl daemon-reload
sudo systemctl enable --now church-manager
sudo systemctl status church-manager --no-pager
```

Logs:

```bash
sudo journalctl -u church-manager -f
```

---

## 6) Nginx reverse proxy (domain → localhost:3000)

Install:

```bash
sudo apt-get install -y nginx
```

Create config:

```bash
sudo nano /etc/nginx/sites-available/church-manager
```

Template (replace `YOUR_DOMAIN_HERE`):

```nginx
server {
  listen 80;
  server_name YOUR_DOMAIN_HERE;

  client_max_body_size 20m;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSockets (safe to include)
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

Enable:

```bash
sudo ln -sf /etc/nginx/sites-available/church-manager /etc/nginx/sites-enabled/church-manager
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7) HTTPS with Let’s Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_DOMAIN_HERE
```

Auto-renew is usually installed automatically. You can verify:

```bash
sudo systemctl status certbot.timer --no-pager
```

---

## 8) Firewall (optional but recommended)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Common issues

- **Repo not found** when cloning via SSH: use HTTPS clone URL or fix GitHub SSH keys/access.
- **DB connection issues**: confirm `DATABASE_URL` works from the server and outbound port 5432 is allowed.
- **Build vs runtime**: `npm run build` must succeed on the server.

---

## Tell me these 2 things and I’ll generate the exact config

1) Your domain (example: `cms.jtwministry.org`)
2) Pick: **PM2** or **systemd**
