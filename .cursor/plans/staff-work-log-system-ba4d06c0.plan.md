<!-- ba4d06c0-7ed8-4078-838a-6b14185528b4 c0d45495-e62c-41cd-91fd-0969d784874b -->
# Work Logs UI Improvements

## Overview

Improve the My Work Logs page by changing the description copy, implementing separate view tabs (Daily, Weekly, Monthly), and adding edit actions to session cards.

## Changes Required

### 1. Update Page Description Copy

**File**: `src/app/(dashboard)/my-work/logs/page.tsx`

Change line 259:

```typescript
description="Track your work hours with our video-editor-style timeline interface."
```

To:

```typescript
description="Record your daily work hours and manage your time"
```

### 2. Update Type Definitions

**File**: `src/types/work-logs.ts`

Update `TimelineViewMode` interface (line 51-55) to support three view types:

```typescript
export interface TimelineViewMode {
  type: "daily" | "weekly" | "monthly";
  date: string;
  zoom: number;
}
```

Add new interface for monthly view data:

```typescript
export interface MonthlyDaySummary {
  date: string;
  totalHours: number;
  sessionCount: number;
}
```

### 3. Create New View Components

#### A. Weekly Calendar View Component

**New File**: `src/components/work-logs/weekly-calendar-view.tsx`

Create a traditional calendar grid component:

- 7-day calendar grid (Mon-Sun)
- Each day shows time blocks as colored rectangles
- Session descriptions visible on hover
- Click on a session to view/edit details
- Props: `sessions`, `selectedWeek`, `onSessionClick`, `onDateChange`

#### B. Monthly Summary View Component

**New File**: `src/components/work-logs/monthly-summary-view.tsx`

Create a monthly calendar with daily hour totals:

- Full month calendar grid
- Each day shows total hours worked
- Click on a day to switch to daily view for that date
- Props: `monthlySummary`, `selectedMonth`, `onDayClick`

### 4. Update Timeline Controls Component

**File**: `src/components/work-logs/timeline-controls.tsx`

Replace the Daily/Weekly toggle buttons (around line 100-110) with three tab buttons:

- "Daily" tab
- "Weekly" tab  
- "Monthly" tab

Use shadcn/ui Tabs component for better UX:

```typescript
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs value={viewMode.type} onValueChange={(value) => onViewModeChange({ ...viewMode, type: value as "daily" | "weekly" | "monthly" })}>
  <TabsList>
    <TabsTrigger value="daily">Daily</TabsTrigger>
    <TabsTrigger value="weekly">Weekly</TabsTrigger>
    <TabsTrigger value="monthly">Monthly</TabsTrigger>
  </TabsList>
</Tabs>
```

### 5. Update Main Page Component

**File**: `src/app/(dashboard)/my-work/logs/page.tsx`

#### A. Add state for monthly data (after line 48):

```typescript
const [monthlySummary, setMonthlySummary] = useState<MonthlyDaySummary[]>([]);
```

#### B. Update view mode change handler (line 233-245):

- When switching to weekly: load sessions for entire week
- When switching to monthly: calculate daily summaries for entire month
- When switching to daily: load sessions for selected date

#### C. Replace timeline rendering section (line 306-314):

```typescript
{/* Conditional View Rendering */}
{viewMode.type === "daily" && (
  <TimelineCanvas
    blocks={timelineBlocks}
    onBlockCreate={handleBlockCreate}
    onBlockClick={handleBlockClick}
    viewMode="daily"
    selectedDate={viewMode.date}
    zoom={viewMode.zoom}
  />
)}

{viewMode.type === "weekly" && (
  <WeeklyCalendarView
    sessions={sessions}
    selectedWeek={viewMode.date}
    onSessionClick={handleBlockClick}
    onDateChange={handleDateChange}
  />
)}

{viewMode.type === "monthly" && (
  <MonthlySummaryView
    monthlySummary={monthlySummary}
    selectedMonth={viewMode.date}
    onDayClick={(date) => {
      setViewMode({ type: "daily", date, zoom: 1 });
    }}
  />
)}
```

#### D. Update session list to only show in daily view (line 317):

```typescript
{viewMode.type === "daily" && sessions.length > 0 && (
```

### 6. Add Edit Button to Session Cards

**File**: `src/app/(dashboard)/my-work/logs/page.tsx`

Update session card rendering (lines 324-358) to add edit button:

```typescript
<div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
  <div className="flex-1">
    <div className="font-medium">{session.description}</div>
    <div className="text-sm text-gray-500">
      {session.startTime} - {session.endTime}
      {session.project && ` • ${session.project}`}
      {session.category && ` • ${session.category}`}
    </div>
  </div>
  <div className="flex items-center gap-3">
    <div className="text-right">
      <div className="font-medium">
        {/* hours calculation */}
      </div>
      <div className="text-sm text-gray-500">
        {/* earnings calculation */}
      </div>
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        setEditingSession(session);
        setIsFormOpen(true);
      }}
    >
      <PencilIcon className="h-4 w-4" />
    </Button>
  </div>
</div>
```

Import PencilIcon from lucide-react at the top.

### 7. Implement Data Loading Logic

#### A. Weekly data loading

**File**: `src/data/work-logs.ts`

Add utility function:

```typescript
export const getWeekSessions = (startDate: string, staffId: string): WorkSession[] => {
  // Get sessions for 7 days starting from startDate
  // Filter by staffId
  // Return sorted by date and time
};
```

#### B. Monthly summary calculation

**File**: `src/data/work-logs.ts`

Add utility function:

```typescript
export const getMonthSummary = (month: string, staffId: string): MonthlyDaySummary[] => {
  // Calculate total hours per day for entire month
  // Return array of daily summaries
};
```

### 8. Update Timeline Controls Props

**File**: `src/components/work-logs/timeline-controls.tsx`

Update interface to handle monthly view:

- Hide zoom controls for weekly and monthly views
- Show appropriate date picker based on view type (day picker, week picker, month picker)

## Implementation Notes

- Use shadcn/ui Tabs component for view switching
- Weekly view shows calendar grid with session blocks
- Monthly view shows calendar with hour totals per day
- Clicking a day in monthly view switches to daily view for that date
- Edit button opens the same WorkSessionForm modal
- Session cards only appear in daily view below the timeline
- Timer widget remains visible in all views
- Weekly and monthly views are read-only (no drag-to-create)

## Files to Create

1. `src/components/work-logs/weekly-calendar-view.tsx`
2. `src/components/work-logs/monthly-summary-view.tsx`

## Files to Modify

1. `src/types/work-logs.ts` - Add monthly view type and summary interface
2. `src/app/(dashboard)/my-work/logs/page.tsx` - Update description, add view logic, add edit buttons
3. `src/components/work-logs/timeline-controls.tsx` - Replace toggle with tabs
4. `src/data/work-logs.ts` - Add weekly and monthly data loading functions

### To-dos

- [ ] Create type definitions and mock data files for work logs, invoices, and staff management
- [ ] Update sidebar configuration with new menu sections (My Work and Staff Management)
- [ ] Build video-editor-style timeline UI components with drag-and-drop functionality
- [ ] Implement start/stop timer with localStorage persistence and auto-block creation
- [ ] Create staff work log pages with timeline UI and invoice list
- [ ] Create admin pages for viewing all work logs, staff management, and invoice approval
- [ ] Implement overlap detection and total hours calculation logic
- [ ] Build invoice auto-generation and management components
- [ ] Add timeline/table view toggle and daily/weekly view options
- [ ] Create Strapi schema files for future API integration
- [ ] Delete old staff page and ensure all imports are updated