# Dashboard Setup Guide

## ✅ What's Been Implemented

### 1. **Real Data Integration**
- ✅ Dashboard now fetches real statistics from the backend
- ✅ Recent activities show actual records from the database
- ✅ Today's appointments display real scheduled appointments
- ✅ All demo data has been removed
- ✅ Loading states added for better UX

### 2. **Layout Fixes**
- ✅ Used `flex-1` on grid wrapper for full height
- ✅ Applied `flex flex-col` on each card
- ✅ Cards now stretch vertically to fill remaining space
- ✅ Equal height rows that expand to fill the screen

### 3. **Backend API Endpoints Created**
- ✅ `GET /api/dashboard/stats` - Returns real counts for all programs
- ✅ `GET /api/dashboard/recent-activities` - Returns recent records
- ✅ `GET /api/dashboard/appointments/today` - Returns today's schedule

---

## 🗺️ Map Integration Guide

### Option 1: Leaflet (Recommended - Free & Open Source)

#### Step 1: Install Dependencies
```bash
cd frontend
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

#### Step 2: Import Leaflet CSS
Add to `frontend/src/index.css`:
```css
@import 'leaflet/dist/leaflet.css';
```

#### Step 3: Create Map Component
Create `frontend/src/components/BarangayMap.tsx`:

```typescript
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Barangay } from '@/types';

interface BarangayMapProps {
  barangays: Barangay[];
}

// Fix Leaflet default icon issue
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function BarangayMap({ barangays }: BarangayMapProps) {
  // Default center (adjust to your location)
  const center: [number, number] = [14.5995, 120.9842]; // Manila coordinates
  
  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-full w-full rounded-xl"
      style={{ minHeight: '300px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {barangays.map((barangay, index) => {
        // Generate positions around the center (you'll need real coordinates)
        const lat = center[0] + (Math.random() - 0.5) * 0.05;
        const lng = center[1] + (Math.random() - 0.5) * 0.05;
        
        return (
          <Marker key={barangay.id} position={[lat, lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{barangay.name}</h3>
                <p className="text-sm text-gray-600">Population: {barangay.population || 'N/A'}</p>
                <p className="text-sm text-gray-600">Captain: {barangay.barangay_captain || 'N/A'}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
```

#### Step 4: Update Dashboard to Use Map
Replace the map placeholder in `MidwifeDashboard.tsx`:

```typescript
import BarangayMap from '@/components/BarangayMap';

// Inside the map section, replace the placeholder div with:
{user?.barangays && user.barangays.length > 0 && (
  <BarangayMap barangays={user.barangays} />
)}
```

---

### Option 2: Google Maps (Requires API Key)

#### Step 1: Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. Add to `.env`: `VITE_GOOGLE_MAPS_API_KEY=your_key_here`

#### Step 2: Install Package
```bash
npm install @react-google-maps/api
```

#### Step 3: Create Component
```typescript
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export default function BarangayGoogleMap({ barangays }) {
  const center = { lat: 14.5995, lng: 120.9842 };
  
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerClassName="h-full w-full rounded-xl"
        center={center}
        zoom={13}
      >
        {barangays.map((barangay) => (
          <Marker
            key={barangay.id}
            position={{ lat: 14.5995, lng: 120.9842 }}
            title={barangay.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
```

---

## 📊 Database Tables Needed

The dashboard expects these tables to exist:

### 1. `appointments` table (for Today's Schedule)
```sql
CREATE TABLE appointments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    barangay_id BIGINT UNSIGNED NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    appointment_type VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (barangay_id) REFERENCES barangays(id)
);
```

### 2. Other Program Tables
Make sure these exist (or adjust DashboardController):
- `maternal_care_records`
- `family_planning_records`
- `senior_citizen_records`

If they don't exist yet, the controller will return 0 counts (graceful fallback).

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
php artisan serve
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Dashboard
1. Login as a midwife
2. Dashboard will fetch real data
3. If no data exists, it shows empty states
4. Add records to see them appear

---

## 🎯 Next Steps

### To Get Real Coordinates for Barangays:
1. **Option A**: Add `latitude` and `longitude` columns to `barangays` table
2. **Option B**: Use geocoding API to convert addresses to coordinates
3. **Option C**: Manually input coordinates for each barangay

### Migration for Coordinates:
```php
Schema::table('barangays', function (Blueprint $table) {
    $table->decimal('latitude', 10, 8)->nullable();
    $table->decimal('longitude', 11, 8)->nullable();
});
```

### Update Barangay Type:
```typescript
export interface Barangay {
  // ... existing fields
  latitude?: number;
  longitude?: number;
}
```

---

## 📝 Summary

✅ **Completed:**
- Real data integration
- Backend API endpoints
- Layout fixes with flex-1
- Loading states
- Empty state handling
- Time ago calculations

🗺️ **Map Options:**
- **Leaflet**: Free, no API key needed (recommended)
- **Google Maps**: Requires API key, more features

📊 **Data Flow:**
1. Frontend calls `/api/dashboard/stats`
2. Backend queries database for real counts
3. Frontend displays actual numbers
4. Auto-refreshes on mount

All demo data removed - dashboard now shows real calculations! 🎉
