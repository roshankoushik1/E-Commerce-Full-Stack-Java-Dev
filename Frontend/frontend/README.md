# E-Commerce Frontend & Microservices Overview

## High-Level Summary
A modular e-commerce platform composed of a React SPA frontend and multiple Spring Boot microservices behind an API Gateway. Service discovery via Eureka. Core user-facing modules:
1. Home (Landing + Hero + Featured Sections)
2. Login & Signup (Authentication)
3. Cart (Add / Update / Wishlist Move / Checkout Flow Start)
4. Track Order (Order status + history)
5. Admin Panel (Products CRUD UI, Orders view, Users (emails) view, Logout)

## Frontend (React)
Location: `ecommerce/my-react-app`
Tech: React + Vite, Context-based state (Auth, Cart, Products, Bills), lightweight API client with token injection.

### Key UI Modules
- Home Page: Aggregates Hero, Explore, Categories, New Arrivals components.
- Login / Signup: JWT-based auth + special local admin shortcut (`admin@gmail.com` / `admin`).
- Cart Page: Line-item model (no variant merging). Supports guest persistence via `localStorage` and server sync post-login.
- Track Order Page: Fetches orders/bills (service at port 9105) and displays status.
- Admin Panel: Products CRUD (in-memory / context), Orders (service 9105), Users (emails from Auth service 9101), Logout.

### Notable Frontend Behaviors
- Price normalization to prevent cent/dollar drift when moving between cart and wishlist.
- Optimistic quantity updates with server reconciliation.
- Fallback caching for Users list (admin) when endpoint temporarily fails.
- Graceful handling of 401 (auto logout) and selective 403 messaging.

## Microservice & Infra Ports
| Service / Module    | Port | Notes |
|---------------------|------|-------|
| API Gateway         | 8305 | Single external ingress (suggest route aggregation) |
| Eureka Server       | 8761 | Service discovery |
| Hero Service        | 9093 | Supplies hero section content |
| Explore Service     | 9089 | Provides explore items (listed twice in original spec) |
| ExploreAll Service  | 9095 | Full catalog exploration |
| Category Service    | 9094 | Category metadata / taxonomy |
| New Arrivals Service| 9091 | Latest products feed |
| Cart Service        | 9092 | Cart + Wishlist endpoints (primary API_BASE currently) |
| Checkout Service    | 9099 | Checkout orchestration / payment intent (planned) |
| Track Order / Orders| 9105 | Order status, bills, shipping (used by Admin + Trackorder) |
| Auth Service        | 9101 | Login, signup, user emails (`/api/auth/...`) |
| (Optional) Offers   | 9092/api/offers | Referenced constant for promotional endpoints |
| (Optional) Bills    | 9105 (/bills) | Billing info (mapped without /api) |

## Recommended Gateway Routing (Examples)
```
/gateway/auth -> http://localhost:9101/api/auth
/gateway/cart -> http://localhost:9092/api
/gateway/orders -> http://localhost:9105
/gateway/hero -> http://localhost:9093
/gateway/explore -> http://localhost:9089
/gateway/explore-all -> http://localhost:9095
/gateway/categories -> http://localhost:9094
/gateway/new -> http://localhost:9091
/gateway/checkout -> http://localhost:9099
```
(Adjust to match your Spring Cloud Gateway route definitions.)

## Auth Flow
- Admin shortcut (no backend call): sets `auth_token = admin_token`.
- Regular users: `/api/auth/login` returns JWT stored in `localStorage`.
- Token decoded client-side to derive email; optional `/user-id` lookup.
- 401 responses trigger global logout event.

## Cart & Wishlist Logic
- Each add creates a distinct line (no variant consolidation).
- Guest mode uses `guest_cart` in `localStorage` + session toast warning.
- Moves from wishlist -> cart trigger full re-fetch to ensure normalization consistency.

## Admin Panel
Tabs: Products | Orders | Users
- Products: Context-managed mock CRUD (no backend persistence yet).
- Orders: Attempts `/orders` then `/api/orders` on port 9105.
- Users: Fetches `/emails` from Auth service (9101); name derived from email prefix; role fixed to `User`.
- Logout: Clears token, returns to landing.

## Environment Variables (Suggested)
```
VITE_API_BASE_URL=http://localhost:9092/api
VITE_AUTH_BASE_URL=http://localhost:9101/api/auth
VITE_OFFERS_BASE_URL=http://localhost:9092/api/offers
VITE_BILLS_BASE_URL=http://localhost:9105
VITE_IMAGE_BASE_URL=http://localhost:9092/images
```

## Local Development Steps
1. Start Eureka (8761).
2. Start each microservice (9091, 9092, 9093, 9089, 9094, 9095, 9099, 9101, 9105).
3. Start API Gateway (8305) once services are registered.
4. Install frontend deps:
   - `cd ecommerce/my-react-app`
   - `npm install`
   - `npm run dev`
5. Access frontend at Vite dev URL (typically `http://localhost:5173`).

## Testing Accounts
- Admin: `admin@gmail.com` / `admin` (local override)
- Regular: Use signup then login (JWT).

## Future Enhancements (Optional)
- Persist Products CRUD via dedicated Product Service.
- Consolidate price normalization into shared utility module.
- Add role-based route guards (admin vs user) at router level.
- Integrate checkout (payment intent + order creation sequence).
- Real-time order status via WebSocket / SSE from Track Order service.
- Centralized logging & tracing (Zipkin / OpenTelemetry) across services.

## Troubleshooting
| Issue | Likely Cause | Action |
|-------|--------------|--------|
| 403 on /emails | Missing auth role / using admin_token | Use real JWT or relax endpoint security for admin_token dev case |
| Price jumps after wishlist move | Duplicate normalization mismatch | Ensure shared logic not bypassed; refresh cart |
| Orders empty | Wrong path (/orders vs /api/orders) | Check actual controller mapping on port 9105 |
| Images broken | Incorrect `VITE_IMAGE_BASE_URL` | Verify base and trailing slash handling |

## License
Internal project (no explicit license specified). Add one if distributing.

---
Generated documentation – extend as backend evolves.
