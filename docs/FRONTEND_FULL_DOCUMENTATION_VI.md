# Train Fleet Health Monitoring Dashboard - Frontend Documentation (Vietnamese)

## 1. Muc tieu tai lieu
Tai lieu nay mo ta day du he thong frontend cho dashboard giam sat suc khoe doan tau, bao gom:
- Kien truc ky thuat.
- Cau truc source code.
- Quy chuan UI/UX va CSS (Tailwind).
- Luong du lieu mock.
- Routing, state, component architecture.
- Huong dan chay local, build, lint.
- Huong dan deployment (Netlify, Vercel, static hosting, Nginx).
- Danh sach kiem tra truoc ban giao.

## 2. Tong quan san pham
Dashboard gom 4 lop man hinh theo luong drill-down:
1. Fleet Dashboard: tong quan tat ca train.
2. Train Detail: xem danh sach carriage cua 1 train.
3. Carriage Detail: xem health theo tung he thong ben trong carriage + issue lien quan.
4. Issue Management: loc, theo doi, gan nguoi xu ly issue.

Ngoai ra co:
- Top Bar toan cuc (search + breadcrumb + notification).
- Sidebar co che do collapse.
- AI Chatbot dang FAB + slide panel, co context-aware subtitle.

## 3. Tech Stack
- Framework: React 19 (functional component + hooks).
- Bundler: Vite 8.
- Router: react-router-dom 7.
- Styling: Tailwind CSS v4 (dark mode first).
- Icons: lucide-react.
- Charts: recharts (gauge radial + line trend).
- Lint: ESLint.

## 4. Cau truc thu muc

src/
- App.jsx: route configuration tong.
- main.jsx: entry point.
- index.css: global style + Tailwind theme.
- data/
  - mockData.js: du lieu mock trung tam + helper query.
- layout/
  - AppLayout.jsx: shell layout (sidebar + topbar + content + chatbot).
- components/
  - Sidebar.jsx
  - TopBar.jsx
  - ChatbotPanel.jsx
  - StatusDot.jsx
  - EmptyState.jsx
  - LoadingState.jsx
- screens/
  - FleetDashboard.jsx
  - TrainDetail.jsx
  - CarriageDetail.jsx
  - IssueManagement.jsx
  - PlaceholderScreen.jsx

docs/
- FRONTEND_FULL_DOCUMENTATION_VI.md (tai lieu nay)

## 5. Kien truc Frontend

### 5.1 App Shell
App duoc to chuc theo mo hinh persistent shell:
- Sidebar va TopBar khong bi unmount khi doi route.
- Main content dung Outlet de render man hinh theo route.
- Chatbot panel nam ngoai main content de co the mo o moi route.

Loi ich:
- UX dong nhat.
- Chuyen route nhanh.
- De mo rong them module trong tuong lai.

### 5.2 Routing
Route hien tai:
- / -> FleetDashboard
- /train/:trainId -> TrainDetail
- /train/:trainId/carriage/:carriageId -> CarriageDetail
- /issues -> IssueManagement
- /reports -> PlaceholderScreen
- /settings -> PlaceholderScreen
- * -> redirect ve /

### 5.3 State Management
Project dang dung local component state (useState/useMemo) vi:
- Hien tai du lieu la mock, khong can global store.
- Scope state ro rang theo tung man hinh.

Neu scale len backend that:
- Co the dung TanStack Query cho server-state.
- Co the them Zustand/Redux cho global UI state (neu can).

## 6. Data Layer va Mock Data
Toan bo du lieu mock nam trong src/data/mockData.js:
- trains: danh sach train va KPI lien quan.
- carriagesByTrain: map train -> danh sach carriage.
- issues: danh sach issue chi tiet.
- getCarriageSystems(trainId, carriageId): sinh du lieu health trend theo he thong.
- getTrainById, getCarriagesByTrain, getActiveIssuesByCarriage: helper query.

Nguyen tac:
- Khong goi backend that.
- UI luon co du lieu de trinh dien day du.
- Du lieu co trang thai healthy/warning/critical + open/in-progress/closed.

## 7. Mo ta tung man hinh

### 7.1 Screen 1 - Fleet Dashboard
Thanh phan chinh:
- KPI row: Total Pending Issues, Healthy Trains, Fleet Efficiency, Critical Alerts.
- Train grid responsive (6 card).
- Moi card hien:
  - Train ID + Name.
  - Status dot glow.
  - Efficiency progress bar.
  - Open issues.
- Click card -> route sang Train Detail.

### 7.2 Screen 2 - Train Detail
Thanh phan chinh:
- Header thong tin train + status.
- Visual train layout (carriage theo chieu ngang) + icon dau tau.
- Carriage card co style theo status:
  - healthy: neutral.
  - warning: amber border/background.
  - critical: rose border/background.
- Click carriage -> route sang Carriage Detail.

### 7.3 Screen 3 - Carriage Detail
Split view:
- Top half:
  - Grid system health card: Brakes, HVAC, Doors, Power, Network.
  - Radial gauge the hien health %.
  - Sparkline 7 ngay bang LineChart.
- Bottom half:
  - Bang mini issue context theo dung train/carriage dang xem.
  - Priority badge theo mau semantic.
  - Empty state khi khong co issue active.

### 7.4 Screen 4 - Issue Management
Thanh phan chinh:
- Filter bar: Train ID, Carriage ID, Priority, Status, Date.
- Data table columns:
  - Issue ID
  - Location (Train/Carriage/System)
  - Short Description
  - Priority
  - Status
  - Assignee
- Assignee:
  - Co avatar initials neu da assign.
  - Hien nut Assign neu chua assign.
- Empty state khi khong co ket qua filter.

## 8. UI/UX va CSS Guidelines

### 8.1 Dark Mode First
- Nen chinh: slate-900.
- Card/panel: slate-800.
- Border: slate-700.
- Effect background: gradient/radial de tao cam giac industrial control room.

### 8.2 Semantic Colors
- Good: emerald-400.
- Warning: amber-400.
- Critical: rose-500.

### 8.3 Typography
- Display font: Rajdhani (heading, title).
- Body font: Sora.
- Muc tieu: giao dien manh me, ky thuat, hien dai.

### 8.4 Responsive
- Grid KPI va cards co breakpoints ro rang.
- Train layout horizontal co overflow-x cho man hinh hep.
- Table dat trong overflow container de khong vo layout mobile.

### 8.5 Empty va Loading States
- EmptyState component cho list/table khong du lieu.
- LoadingState component duoc chuan bi cho luong load async trong tuong lai.

## 9. Cac component dung chung
- StatusDot: mapping status -> mau + text + glow.
- EmptyState: thong diep trong truong hop khong co du lieu.
- LoadingState: skeleton loading don gian.
- Sidebar: dieu huong module + collapse.
- TopBar: search + breadcrumbs + notification.
- ChatbotPanel: FAB + panel tro ly AI.

## 10. Chatbot integration
Chatbot dang la UI-level integration:
- FAB nam goc duoi phai.
- Click de mo slide-in panel.
- Subtitle thay doi theo route hien tai (context-aware):
  - Fleet context.
  - Train context.
  - Carriage context.
  - Issues context.

Neu muon noi backend AI that:
1. Tao API layer (REST/GraphQL).
2. Them conversation state (history, typing, streaming).
3. Them auth token + error handling.
4. Them telemetry log cho query/response.

## 11. Huong dan chay local
Yeu cau:
- Node.js 20+ (khuyen nghi).
- npm 10+.

Cai package:

npm install

Chay dev:

npm run dev

Lint:

npm run lint

Build production:

npm run build

Preview build:

npm run preview

## 12. Build va Production Notes
- Build output o thu muc dist/.
- Vite warning chunk > 500KB xuat hien do import chart + icon ecosystem.
- Neu can toi uu:
  - Code split theo route bang lazy().
  - Tach module chart chi load o man hinh can dung.

## 13. Deployment Guide

### 13.1 Vercel
- Framework preset: Vite.
- Build command: npm run build.
- Output directory: dist.
- Neu dung client-side routing, can rewrite tat ca route -> /index.html (Vercel thuong auto xu ly voi Vite).

### 13.2 Netlify
- Build command: npm run build.
- Publish directory: dist.
- Tao file _redirects:
  /* /index.html 200

### 13.3 Static Hosting (Nginx)
- Build: npm run build.
- Copy to web root.
- Cau hinh try_files de React Router route dung:
  try_files $uri /index.html;

Mau Nginx server block:

server {
  listen 80;
  server_name your-domain.com;
  root /var/www/train-fleet-dashboard;
  index index.html;

  location / {
    try_files $uri /index.html;
  }

  location /assets/ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000, immutable";
  }
}

## 14. Bien moi truong
Hien tai chua can bien moi truong do su dung mock data 100%.
Khi ket noi backend, de xuat:
- VITE_API_BASE_URL
- VITE_ENABLE_CHATBOT_STREAM
- VITE_APP_ENV

## 15. Bao mat frontend (co ban)
- Khong hardcode secret key vao source.
- Validate input chatbot truoc khi gui backend.
- Escape/noi dung server tra ve neu render rich text.
- Bat CSP headers o reverse proxy.

## 16. Kiem thu va quality gates
Hien tai:
- Da pass npm run lint.
- Da pass npm run build.

De xuat tiep theo:
- Unit test: Vitest + React Testing Library.
- E2E: Playwright (drill-down flow + filter issues).
- Visual regression: Percy/Chromatic (neu can).

## 17. Performance checklist
- Dung dynamic import cho screen chart nang.
- Toi uu icon import (chi import icon can dung).
- Bat gzip/brotli tai layer web server/CDN.
- Cache static assets co hash filename.

## 18. Accessibility checklist
- Dam bao contrast text tren nen toi.
- Keyboard focus cho nut/filter/input.
- ARIA label bo sung cho cac icon-only button neu can.
- Kiem tra tab order tren sidebar/topbar/chat panel.

## 19. Roadmap de mo rong
1. Ket noi API that + auth.
2. Realtime updates qua websocket.
3. Rule engine canh bao thong minh.
4. Export report PDF/CSV.
5. Internationalization (vi/en).
6. Permission matrix theo vai tro (Ops, Manager, Admin).

## 20. Ban giao nhanh cho doi ky thuat
Checklist:
- [ ] npm install
- [ ] npm run dev
- [ ] npm run lint
- [ ] npm run build
- [ ] Kiem tra 4 man hinh chinh va drill-down
- [ ] Kiem tra filters o Issue Management
- [ ] Kiem tra chatbot panel mo/dong va context subtitle
- [ ] Chot phuong an deploy

---

Tai lieu duoc cap nhat den ngay: 2026-03-26.
