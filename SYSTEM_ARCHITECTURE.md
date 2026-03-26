# 🚂 Rail Fleet Dashboard - System Architecture & Data Flow

## 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Data Structure](#data-structure)
3. [Component Hierarchy](#component-hierarchy)
4. [Data Flow](#data-flow)
5. [Routes & Navigation](#routes--navigation)
6. [Feature Breakdown](#feature-breakdown)

---

## 📱 Application Overview

**Technology Stack:**
- Framework: React 19 + Vite 8
- Routing: React Router v7
- Styling: Tailwind CSS v4 + Custom CSS (index.css)
- Charting: Recharts (RadialBar, Area charts)
- Icons: Lucide React

**Core Purpose:** Display train fleet health monitoring dashboard with real-time system metrics and issue tracking.

---

## 🗂️ Data Structure

### **1. Trains Data**
```javascript
{
  id: string,           // T01, T02, ...
  name: string,         // Northline Express
  status: 'healthy' | 'warning' | 'critical',
  openIssues: number,   // Count of open issues
  efficiency: number,   // 0-100%
  healthyCarriages: number  // Count
}

Total: 6 trains
```

**Location:** `mockData.js` → `trains` array

---

### **2. Carriages Data**
```javascript
{
  id: string,           // C01, C02, ...
  type: string,         // 'Head', 'Passenger', 'Cargo', 'Power'
  status: 'healthy' | 'warning' | 'critical',
  issues: number        // Count of active issues in this carriage
}

Structure: carriagesByTrain[trainId] = [carriage1, carriage2, ...]
```

**Location:** `mockData.js` → `carriagesByTrain` object
**Relationship:** Each train has 5 carriages

---

### **3. Systems Data** (Generated Dynamically)
```javascript
{
  id: string,           // e.g., "T01-C01-brakes"
  name: string,         // 'Brakes', 'HVAC', 'Doors', 'Power', 'Network'
  health: number,       // 52-97% (generated from seed formula)
  trend: [
    {
      day: 'D1',
      value: number     // Health value for that day
    },
    // ... 7 days total
  ]
}

Available Systems: Brakes, HVAC, Doors, Power, Network (5 total)
```

**Location:** `mockData.js` → `getCarriageSystems(trainId, carriageId)` function
**Generation:** Deterministic seed-based calculation per train/carriage/system

---

### **4. Issues Data**
```javascript
{
  id: string,                // ISS-1001, ISS-1002, ...
  trainId: string,           // T01, T02, ... (which train)
  carriageId: string,        // C01, C02, ... (which carriage)
  system: string,            // 'Doors', 'HVAC', 'Brakes', etc.
  description: string,       // Issue description
  priority: 'high' | 'medium' | 'low',
  status: 'open' | 'in-progress' | 'closed',
  assignee: {
    name: string,
    initials: string,
    color: string             // Tailwind color class
  } | null,
  date: string              // YYYY-MM-DD
}

Total: 14 issues across all trains
```

**Location:** `mockData.js` → `issues` array
**Access:** `getActiveIssuesByCarriage(trainId, carriageId)` filters active issues

---

## 🏗️ Component Hierarchy

```
App
├── createBrowserRouter
│   ├── / (FleetDashboard)
│   └── /carriage/:carriageId (CarriageDetail)
│
└── AppLayout
    ├── Sidebar
    │   └── Navigation Links (Dashboard only)
    │
    └── main (Outlet - renders route content)
        ├── FleetDashboard
        │   ├── TrainBogie (component)
        │   ├── CarriageWindow (component)
        │   └── [For each train]
        │       ├── Train header (name, efficiency, issues)
        │       ├── Locomotive (visual)
        │       │   ├── Windshield (kính)
        │       │   ├── Headlights (đèn)
        │       │   ├── Speed stripes
        │       │   ├── Pantograph (cần lấy điện)
        │       │   └── Bogies (bánh xe)
        │       ├── Railway track (đường ray)
        │       └── [For each carriage]
        │           ├── Connector (khớp nối)
        │           └── Carriage visual
        │               ├── Windows
        │               ├── Type label
        │               ├── Issues count
        │               └── Bogies
        │
        └── CarriageDetail (when navigating to /carriage/:carriageId)
            ├── Back link
            ├── Header (Train ID / Carriage ID)
            ├── [For each system of the carriage]
            │   ├── System name & health %
            │   ├── Radial gauge chart
            │   └── 7-day trend area chart
            └── Active issues list (if any)
                └── [For each issue]
                    ├── Issue ID, description
                    ├── Priority badge
                    ├── Status & assignee
                    └── Date
```

---

## 🔄 Data Flow

### **Flow 1: Load Fleet Dashboard**

```
1. Browser load http://localhost:5173/
   ↓
2. React Router matches "/" route → FleetDashboard component
   ↓
3. FleetDashboard component mounts
   ├─ Import: trains, getCarriagesByTrain from mockData.js
   ├─ Import: statusConfig (color mapping for healthy/warning/critical)
   └─ Import: TrainBogie component
   ↓
4. For each train in trains array:
   ├─ Get carriages: getCarriagesByTrain(train.id)
   ├─ Get config: statusConfig[train.status] → colors & labels
   ├─ Render train container
   ├─ Render locomotive (with visual details)
   ├─ Render railway track
   └─ For each carriage in carriages:
      ├─ Get config: statusConfig[carriage.status]
      └─ Render carriage visual
   ↓
5. Render complete train with all components
```

**Data Sources:**
- Input: mockData.js (trains, carriagesByTrain)
- Config: statusConfig (in component)
- Output: Visual train fleet grid

---

### **Flow 2: Navigate to Carriage Details**

```
1. User navigation (currently blocked - no Link components)
   
   OR Direct URL: http://localhost:5173/carriage/C01
   ↓
2. React Router matches "/carriage/:carriageId" → CarriageDetail
   ↓
3. CarriageDetail component mounts
   ├─ Extract params: carriageId from URL
   ├─ Extract params: trainId? (currently not in route - ISSUE!)
   └─ Import: getCarriageSystems, getActiveIssuesByCarriage, getTrainById
   ↓
4. Get carriage systems:
   └─ systems = getCarriageSystems(trainId, carriageId)
      ├─ For each baseSystems (Brakes, HVAC, Doors, Power, Network)
      ├─ Generate health score from seed formula
      ├─ Generate 7-day trend data
      └─ Return systems array
   ↓
5. Get carriage issues:
   └─ contextualIssues = getActiveIssuesByCarriage(trainId, carriageId)
      └─ Filter issues where trainId + carriageId match + status !== 'closed'
   ↓
6. Render systems grid
   ├─ For each system:
   │  ├─ System name & health score
   │  ├─ RadialBar chart (health gauge)
   │  └─ Area chart (7-day trend)
   └─ Render issues list
      └─ For each issue:
         ├─ Issue details (ID, description, priority)
         ├─ Status & assignee
         └─ Date
```

**Data Sources:**
- Input: URL params (carriageId), mockData.js (systems, issues, trains)
- Processing: Seed-based generation, filtering
- Output: System cards + issues list

**⚠️ Current Issue:** Route is `/carriage/:carriageId` but doesn't accept trainId!
Need: `/train/:trainId/carriage/:carriageId` or pass trainId via Another method

---

### **Flow 3: Status Color Mapping**

```
statusConfig = {
  healthy: { 
    dot: 'bg-emerald-400',        // 🟢 Green pulse dot
    text: 'text-emerald-600',     // Green text
    progress: 'bg-emerald-500',   // Green progress bar
    label: 'Healthy',
    bg: 'status-healthy'          // CSS class (from index.css)
  },
  warning: { 
    dot: 'bg-amber-400',          // 🟡 Amber pulse dot
    text: 'text-amber-600',       // Amber text
    progress: 'bg-amber-500',     // Amber progress bar
    label: 'Warning',
    bg: 'status-warning'          // CSS class
  },
  critical: { 
    dot: 'bg-red-400',            // 🔴 Red pulse dot
    text: 'text-red-600',         // Red text
    progress: 'bg-red-500',       // Red progress bar
    label: 'Critical',
    bg: 'status-critical'         // CSS class
  }
}

Usage: config = statusConfig[train.status]
       → Use config.bg for background color
       → Use config.dot for status dot
       → Use config.text for text color
       → Use config.progress for progress bar
```

---

## 🛣️ Routes & Navigation

### **Active Routes:**

```
Route          Component           Purpose
─────────────────────────────────────────────
/              FleetDashboard      View all 6 trains with carriages
/carriage/:id  CarriageDetail      View system metrics for a carriage
*              → /                 Fallback to home
```

### **Navigation Currently Blocked:**

Currently NO interactive Links exist in FleetDashboard:
- ❌ Cannot click train to view train details (TrainDetail was deleted)
- ❌ Cannot click carriage to view carriage details (no Link component)
- ✅ Can manually type `/carriage/C01` in URL (but needs trainId in route)

### **Sidebar Navigation:**

- Dashboard (/) - Only active nav link
- Other links (Issues, Reports, Settings) - Deleted

---

## ✨ Feature Breakdown

### **Feature 1: Fleet Overview (FleetDashboard)**

**What's Displayed:**
- For each of 6 trains:
  - Train name + ID + status dot (pulsing)
  - Efficiency percentage
  - Open issues count
  - Locomotive visual (aerodynamic design)
    - Windshield + Headlights + Speed stripes
    - Pantograph (overhead line equipment)
    - 2 Bogies with 4 wheels total
  - Railway track (ray + tà vẹt + đá dăm)
  - 5 Carriages per train
    - Each with windows, type label, issues count
    - 2 Bogies per carriage
  - Connector elements between carriages
  - Dynamic colors based on healthiness

**Data Source:** mockData.js (trains + carriagesByTrain)

**Interactivity:**
- Hover train/carriage → slight elevation (-translate-y-1)
- Responsive scroll for long train consist

---

### **Feature 2: System Health Monitoring (CarriageDetail)**

**What's Displayed (for a selected carriage):**
- Carriage ID reference (e.g., "T01 / C03")
- 5 System cards:
  - System name (Brakes, HVAC, Doors, Power, Network)
  - Health score 52-97%
  - Radial gauge chart (circular progress)
  - 7-day trend area chart (with gradient fill)
- Active issues list:
  - Issue description
  - Priority badge (high/medium/low colors)
  - Assignee info (name, initials, avatar color) or "Unassigned"
  - Date

**Data Sources:** mockData.js (getCarriageSystems, getActiveIssuesByCarriage)

**Interactivity:**
- Back link to dashboard (but currently broken - links to /train/:trainId)
- Charts are interactive (Recharts tooltips)

---

### **Feature 3: Issue Tracking**

**Structure:**
```
Issue belongs to:
  ├─ Train (T01, T02, ...)
  ├─ Carriage (C01, C02, ...)
  └─ System (Doors, HVAC, ...)

Per Issue:
  ├─ ID (ISS-1001, ...)
  ├─ Description
  ├─ Priority (high/medium/low)
  ├─ Status (open/in-progress/closed)
  ├─ Assignee (person or unassigned)
  └─ Date created
```

**Visibility:**
- CarriageDetail shows issues for that specific carriage
- Only shows active issues (status !== 'closed')

**Statistics:**
- Total: 14 issues
- Open: 11
- In Progress: 2
- Closed: 1
- Distributed across T01, T02, T03, T05, T06

---

## 🗄️ Data Access Functions

### **mockData.js Exports:**

```javascript
// Direct exports (arrays/objects)
export const trains              // Array of 6 trains
export const carriagesByTrain    // Object: trainId → carriages[]
export const issues              // Array of 14 issues
export const navLinks            // Array: only Dashboard link

// Utility functions (generate/filter data)
export function getCarriageSystems(trainId, carriageId)
  → Returns 5 system health objects with 7-day trends
  → Called by: CarriageDetail
  
export function getActiveIssuesByCarriage(trainId, carriageId)
  → Returns issues for carriage (status !== 'closed')
  → Called by: CarriageDetail
  
export function getTrainById(trainId)
  → Returns train object by ID
  → Called by: CarriageDetail (for back link)
  
export function getCarriagesByTrain(trainId)
  → Returns carriages array for a train
  → Called by: FleetDashboard
```

---

## 🎨 Styling & Theme

### **Color Sys**:

**Status Colors (Semantic):**
- 🟢 Healthy: #10b981 (Emerald)
- 🟡 Warning: #f59e0b (Amber)
- 🔴 Critical: #ef4444 (Rose)

**Base Colors:**
- Background: #f8fafc (Slate 50)
- Text: #0f172a (Slate 900)
- Borders: #cbd5e1 (Slate 200)
- Cards: #ffffff (White) with shadow

**CSS Classes (index.css):**
```css
.status-healthy    /* Gradient bg for healthy trains */
.status-warning    /* Gradient bg for warning trains */
.status-critical   /* Gradient bg for critical trains */
.glass-card        /* Glass-morphism effect (not used in FleetDashboard) */
```

**Tailwind Usage:** Heavy use of Tailwind utilities + custom CSS

---

## 🔌 Component Props

### **FleetDashboard**
No props - uses imports directly

### **CarriageDetail**
Uses `useParams()` hook:
```javascript
const { carriageId } = useParams()
// Note: trainId is missing from route params!
```

### **Sidebar**
```javascript
<Sidebar links={navLinks} />
// links: Array of nav link objects
```

---

## ⚠️ Known Issues & Limitations

1. **CarriageDetail Route:** 
   - Current: `/carriage/:carriageId`
   - Missing: trainId parameter
   - Fix needed: Change to `/train/:trainId/carriage/:carriageId`

2. **No Navigation to CarriageDetail:**
   - No Link components in FleetDashboard
   - User cannot click to navigate to carriage details
   - Fix needed: Add Link to `/carriage/:carriageId` on carriage elements

3. **Back Link Broken:**
   - CarriageDetail tries to link to `/train/:trainId`
   - But TrainDetail page was deleted
   - Fix needed: Use `/` (home) instead

4. **CSS Classes Not Used:**
   - `.status-healthy/warning/critical` defined but not applied
   - FleetDashboard uses inline Tailwind styles instead
   - `.glass-card`, `.status-glow` defined but unused

5. **trainId Extraction in CarriageDetail:**
   - Component calls `getTrainById(trainId)` but trainId not available from params
   - Currently relies on trainId being available (breaks without it)

---

## 📊 Data Relationship Diagram

```
┌─────────────────────────────────────────────────┐
│  TRAINS (6 total)                               │
│  ├─ T01, T02, T03, T04, T05, T06                │
│  └─ Each has: id, name, status, efficiency...  │
└─────────────────────────────────────────────────┘
         ↓ carriagesByTrain object
┌─────────────────────────────────────────────────┐
│  CARRIAGES (5 per train)                        │
│  ├─ C01 (Head), C02-C04 (Passenger/Cargo)      │
│  ├─ C05 (Power)                                 │
│  └─ Each has: id, type, status, issues count   │
└─────────────────────────────────────────────────┘
         ↓ getCarriageSystems()
┌─────────────────────────────────────────────────┐
│  SYSTEMS (5 per carriage)                       │
│  ├─ Brakes, HVAC, Doors, Power, Network        │
│  └─ Each has: id, name, health%, 7-day trend   │
└─────────────────────────────────────────────────┘
         ↓ getActiveIssuesByCarriage()
┌─────────────────────────────────────────────────┐
│  ISSUES (14 total across all train/carriage)    │
│  ├─ trainId + carriageId + system + description│
│  └─ priority, status, assignee, date           │
└─────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
src/
├── App.jsx                          # Router setup
├── index.css                        # Global styles + unused CSS
├── main.jsx                         # Entry point
├── layout/
│   └── AppLayout.jsx                # Main layout wrapper
├── screens/
│   ├── FleetDashboard.jsx           # Main dashboard page (✅ Active)
│   └── CarriageDetail.jsx           # Carriage details page (✅ Active)
├── components/
│   ├── Sidebar.jsx                  # Navigation sidebar
│   ├── EmptyState.jsx               # Empty state fallback
│   └── (ChatbotPanel deleted)       # ❌ Removed
└── data/
    └── mockData.js                  # All mock data + utility functions
```

---

## 🚀 How to Extend

### **Add a new train:**
```javascript
export const trains = [
  // ... existing trains
  {
    id: 'T07',
    name: 'New Express',
    status: 'healthy',
    openIssues: 0,
    efficiency: 95,
    healthyCarriages: 5,
  }
];

export const carriagesByTrain = {
  // ... existing trains
  T07: [
    { id: 'C01', type: 'Head', status: 'healthy', issues: 0 },
    // ... 4 more carriages
  ]
};
```

### **Add a new issue:**
```javascript
export const issues = [
  // ... existing issues
  {
    id: 'ISS-1015',
    trainId: 'T07',
    carriageId: 'C02',
    system: 'HVAC',
    description: 'New issue',
    priority: 'medium',
    status: 'open',
    assignee: { name: 'John', initials: 'JD', color: 'bg-blue-500/80' },
    date: '2026-03-26',
  }
];
```

### **Fix route params:**
```javascript
// In App.jsx
{ path: 'train/:trainId/carriage/:carriageId', element: <CarriageDetail /> }

// In CarriageDetail.jsx
const { trainId, carriageId } = useParams()
```

---

**Last Updated:** 26 March 2026
**System Version:** 1.0.0 (Simplified - TrainDetail removed)
