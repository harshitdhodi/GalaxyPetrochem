# Galaxy Petrochem - Premium MERN Application

Galaxy Petrochem is a sophisticated web application built using the MERN stack (MongoDB, Express, React, Node.js), complemented by Astro for high-performance static content. This project is designed for robust business management, featuring a powerful backend, a responsive frontend, and optimized deployment configurations.

## 🚀 Key Features

- **Dynamic Frontend**: Built with React and Vite for blazing-fast performance.
- **Robust Backend**: Express.js server with Mongoose for MongoDB integration.
- **State Management**: Redux Toolkit for predictable state transitions.
- **Modern UI**: Styled with Tailwind CSS and Ant Design for a premium look and feel.
- **Image Processing**: Sharp-powered image optimization.
- **Static Content**: Astro integration for SEO-optimized marketing pages.
- **Secure Authentication**: JWT-based auth with bcrypt hashing.

## 📂 Project Structure

```text
GalaxyPetrochem/
├── backend/                # Node.js Express Server
│   ├── controller/         # Request handlers & Business logic
│   ├── model/              # MongoDB (Mongoose) schemas
│   ├── route/              # API Route definitions
│   ├── middleware/         # Custom middlewares (Auth, Error handling)
│   ├── uploads/            # Uploaded files/images
│   ├── index.js            # Server entry point
│   └── package.json        # Backend dependencies & scripts
├── frontend/               # React Vite Application
│   ├── src/                # React components, hooks, & state
│   ├── public/             # Static assets
│   ├── tailwind.config.js  # Styling configuration
│   ├── vite.config.js      # Build tool configuration
│   └── package.json        # Frontend dependencies & scripts
├── astro/                  # Astro Marketing/Static Site
│   └── galaxyastro/        # Astro project source
└── README.md               # Project documentation
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
                                                   .env
<!-- DATABASE_URI = mongodb+srv://harshit:Harshit%40123@userinfo.lmbsytd.mongodb.net/Galaxy
JWT_SECRET_KEY = assdfsdfdggewfgvtehtrj
EMAIL_USER=harshit.dhodi2108@gmail.com
EMAIL_PASS=geyb xikp rssl uwqt
EMAIL_FROM=harshit.dhodi2108@gmail.com
PORT = 3036 -->


```
Run the server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Run the frontend:
```bash
npm run dev
```

---

## 🌐 Server Setup & VPS Deployment

This project is optimized for deployment on a Linux VPS (Ubuntu) using **Nginx** as a reverse proxy and **PM2** for process management.

### Deployment Workflow
1. **Frontend Build**:
   ```bash
   cd frontend
   npm run build
   ```
   Copy the `dist/` folder contents to `/var/www/galaxypetrochem/frontend/dist` (or wherever your Nginx points).

2. **Process Management (PM2)**:
   ```bash
   cd backend
   pm2 start index.js --name "galaxy-api"
   ```

### 🛠️ Nginx Configuration (`galaxypetro.in.conf`)

Create or update your Nginx configuration at `/etc/nginx/sites-available/galaxypetro.in.conf`:

```nginx
server {
    listen 80;
    server_name galaxypetro.in www.galaxypetro.in;

    # Frontend - Static Files
    root /var/www/galaxypetrochem/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Reverse Proxy
    location /api/ {
        proxy_pass http://localhost:3036; # Backend running on port 3036
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Uploads & Images - Optimized Serving
    location /uploads/ {
        alias /var/www/galaxypetrochem/backend/uploads/;
    }

    location /images/ {
        proxy_pass http://localhost:3036; # Sharp image processing happens here
    }

    # SSL (Optional but Recommended with Certbot)
    # listen 443 ssl;
    # ssl_certificate /etc/letsencrypt/live/galaxypetro.in/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/galaxypetro.in/privkey.pem;
}
```

---

## 📦 Tech Stack Summary

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Ant Design, Redux Toolkit |
| **Backend** | Node.js, Express, Mongoose, JWT, Multer, Sharp |
| **Database** | MongoDB |
| **Static Site** | Astro |
| **DevOps** | Nginx, PM2, VPS |

---

## 📄 License

This project is proprietary. All rights reserved.
