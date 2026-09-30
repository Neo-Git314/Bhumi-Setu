# BHUMI SETU 360° — Client Frontend
**React 19 + Tailwind CSS + Leaflet GIS + Recharts + Lucide Icons**

The frontend application is structured as follows:

```
src/
  components/       # Reusable UI controls (Modals, Tables, Skeletons, Badges)
  pages/            # 16 Full Governance Application Pages
  layouts/          # DashboardLayout & Navigation
  features/         # Domain-specific modules
  services/         # API Client & Data synchronization
  hooks/            # Custom React hooks
  routes/           # Route definitions
  utils/            # Formatting, cadastral date & currency helpers
  data/             # Seed data and mock fixtures
  context/          # AuthContext & ToastContext
```

## Running the Frontend:
```bash
npm install
npm run dev
```

The Vite dev server runs at `http://localhost:5173` and proxies `/api` calls directly to the Express backend on port `5000`.
