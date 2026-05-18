# 🚀 Quick Reference Card

## Installation

### Install Map (One-time setup)
```bash
cd frontend
npm install leaflet react-leaflet @types/leaflet
```

Add to `frontend/src/index.css`:
```css
@import 'leaflet/dist/leaflet.css';
```

Uncomment Leaflet code in `frontend/src/components/BarangayMap.tsx`

---

## Running the App

### Terminal 1 - Backend
```bash
cd backend
php artisan serve
```
Runs on: http://localhost:8000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Runs on: http://localhost:5173

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard/stats` | GET | Get all program counts |
| `/api/dashboard/recent-activities` | GET | Get last 10 activities |
| `/api/dashboard/appointments/today` | GET | Get today's schedule |

---

## Dashboard Features

### ✅ Real Data
- Immunization count
- Maternal care count
- Family planning count
- Senior citizen count

### ✅ Recent Activity
- Shows last 10 records
- Displays time ago
- Filtered by barangay

### ✅ Today's Schedule
- Shows appointments
- Sorted by time
- Filtered by barangay

### ✅ Map
- Shows assigned barangays
- Interactive markers
- Population stats

---

## File Structure

```
frontend/src/
├── components/
│   ├── BarangayMap.tsx          ← Map component
│   ├── DashboardLayout.tsx      ← Layout wrapper
│   └── Sidebar.tsx              ← Navigation
├── pages/dashboard/
│   ├── MidwifeDashboard.tsx     ← Main dashboard
│   └── AdminDashboard.tsx       ← Admin view
├── services/
│   ├── dashboardService.ts      ← API calls
│   └── api.ts                   ← Axios config
└── types/
    └── index.ts                 ← TypeScript types

backend/app/Http/Controllers/
└── DashboardController.php      ← API logic
```

---

## Customization

### Change Map Center
Edit `BarangayMap.tsx`:
```typescript
const center: [number, number] = [14.5995, 120.9842]; // Your coordinates
```

### Add Barangay Coordinates
```sql
UPDATE barangays 
SET latitude = 14.5995, longitude = 120.9842 
WHERE id = 1;
```

### Adjust Activity Limit
Edit `DashboardController.php`:
```php
->limit(10) // Change to desired number
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Map not showing | Install Leaflet packages |
| No data | Check backend running |
| 401 errors | Login again |
| Layout broken | Clear cache, rebuild |

---

## Quick Commands

```bash
# Install everything
npm install

# Build for production
npm run build

# Clear cache
npm run dev -- --force

# Check Laravel routes
php artisan route:list

# Run migrations
php artisan migrate
```

---

## Documentation

- 📖 Full Guide: `DASHBOARD_SETUP_GUIDE.md`
- 📋 Summary: `DASHBOARD_SUMMARY.md`
- 🗺️ Map Setup: See guide Section "Map Integration"

---

## Support

Check these files for detailed help:
1. `DASHBOARD_SETUP_GUIDE.md` - Complete setup instructions
2. `DASHBOARD_SUMMARY.md` - What changed and why
3. `README.md` - Project overview

---

**Everything is ready! Just install Leaflet and start coding! 🎉**
