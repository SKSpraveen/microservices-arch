# 🍔 QuickBite System

A scalable and modular food delivery platform inspired by Uber Eats, built using **microservices architecture**, supporting Customers, Drivers, Restaurant Owners, and Admins.

---

## 🧱 Project Structure

```
microservices-arch/
├── backend/
│   ├── auth-service/
│   ├── delivery-service/
│   ├── notification-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── restaurant-service/
│   ├── review-service/
│   ├── search-service/
│   └── user-service/
├── frontend/
│   ├── driver/                 # Driver & Hotel Owner App (Next.js)
│   ├── food-delivery-dashboard/ # Admin Panel (Next.js)
│   └── main/                   # Customer App (Next.js)
├── gateway/                    # API Gateway (Go + Gin)
├── infra k8s/                  # Kubernetes Deployment Files
│   ├── *.yaml
├── docker-compose.yml
├── push_images.sh              # Docker image build & push script
└── README.md
```

---

## 🚀 Deployment Overview

| Component       | Tech Stack                             | Deployed On            |
|----------------|------------------------------------------|------------------------|
| Frontend Apps  | Next.js + TypeScript + Tailwind + ShadCN | Vercel                 |
| API Gateway    | Go + Gin                                 | Render (Docker + K8s)  |
| Backend Services | Express + TypeScript                   | Render (Docker + K8s)  |
| Database       | MongoDB Cluster (per service DB)         | MongoDB Atlas          |
| Auth           | JWT-based Authentication                 |                        |

---

## 🧩 Microservices

All backend services are built with **Express + TypeScript** and communicate via **HTTP**.

- `auth-service`: JWT auth & token issuance  
- `user-service`: Profile, roles, permissions  
- `restaurant-service`: Hotel details, menus  
- `order-service`: Order management  
- `payment-service`: Stripe integration  
- `delivery-service`: Driver & vehicle management  
- `notification-service`: Brevo (email/SMS) integration  
- `review-service`: Ratings & complaints (customers/drivers/hotels/app)  
- `search-service`: Location-based search (Google Maps, Leaflet, OSM)

---

## 📡 External APIs

- Stripe – Payment processing  
- Brevo – Notifications (emails/SMS)  
- Cloudinary – Image uploads  
- Google Maps / OpenStreetMap / Leaflet – Location services  

---

## 🐳 Docker & Kubernetes

- All services are containerized with Docker  
- Kubernetes manifests are available under `infra k8s/`  
- Use `docker-compose.yml` for local dev/testing  
- Use `push_images.sh` to build & push all images  

---

## 📦 Environment Variables

Each service has a `.env` file with secrets and config.

### Example: `auth-service/.env`
```
PORT=3001
JWT_SECRET=supersecretkey
MONGO_URI=mongodb+srv://...
```

> You must create appropriate `.env` files in each service directory.

---

## 📍 API Gateway Routes

| Route Prefix        | Forwarded To           |
|---------------------|------------------------|
| `/api/auth`         | Auth Service           |
| `/api/users`        | User Service           |
| `/api/orders`       | Order Service          |
| `/api/restaurants`  | Restaurant Service     |
| `/api/payments`     | Payment Service        |
| `/api/delivery`     | Delivery Service       |
| `/api/notifications`| Notification Service   |
| `/api/reviews`      | Review Service         |
| `/api/search`       | Search Service         |

---

## 🧪 Local Development

```bash
# Install dependencies
pnpm install

# Run services
pnpm run dev

# API Gateway
go run main.go  # Requires Go + Gin
```

---

## 🧪 Testing

Each service contains unit tests using Jest.

```bash
cd backend/auth-service
pnpm test
```

## ✨ Linting & Formatting

```bash
pnpm lint
pnpm format
```

---

## 🚨 Logging & Monitoring

- All services log to stdout using Winston / custom middleware.
- Future integration with Prometheus & Grafana for metrics.
- Alerts planned via Discord or Slack via Webhooks.

---

## 📂 CI/CD

- GitHub Actions used to lint, test, and deploy services.
- Vercel auto-deploys frontend apps on push to `main`.
- Docker images are built and pushed via `push_images.sh`.

---

## 👥 Contributors

- Vihanga Mallawaarachchi — Full Stack Developement
- Kushanka Semasinghe - Full StackDevelopment
- Sasindu - Full Stack Development
- Supun Sandakalum - Full Stack developement

---
