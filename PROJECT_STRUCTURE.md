# CloudNow Website Admin Panel - Project Structure

## Overview

This document outlines the complete folder structure for the CloudNow Website Admin Panel project built with Next.js 15, TypeScript, and shadcn/ui.

## Root Directory Structure

```
cloudnow-website-admin/
├── components.json          # shadcn/ui configuration
├── eslint.config.mjs        # ESLint configuration
├── next-env.d.ts           # Next.js TypeScript declarations
├── next.config.ts          # Next.js configuration
├── package.json           # Dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
├── README.md              # Project documentation
├── public/                # Static assets
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── src/                   # Source code
    ├── app/               # Next.js App Router
    ├── components/        # React components
    ├── hooks/            # Custom React hooks
    └── lib/              # Utility libraries
```

## Detailed Source Structure (`src/`)

### App Router (`src/app/`)

```
app/
├── favicon.ico
├── globals.css           # Global styles
├── layout.tsx           # Root layout
├── page.tsx             # Home page
├── auth/                # Authentication routes
│   └── login/
│       └── page.tsx     # Login page
└── dashboard/           # Protected dashboard routes
    ├── dashboard/
    │   └── page.tsx     # Dashboard home
    ├── blog/
    │   ├── page.tsx     # Blog list
    │   └── [id]/
    │       └── page.tsx # Blog edit/create
    ├── testimonials/
    │   └── page.tsx     # Testimonials management
    ├── careers/
    │   ├── page.tsx     # Job listings
    │   ├── [id]/
    │   │   └── page.tsx # Job edit/create
    │   └── applications/
    │       └── page.tsx # Job applications
    ├── services/
    │   ├── page.tsx     # Service pages list
    │   └── [id]/
    │       └── page.tsx # Service page edit/create
    ├── faqs/
    │   └── page.tsx     # FAQs management
    ├── submissions/
    │   ├── contact/
    │   │   └── page.tsx # Contact form submissions
    │   └── applications/
    │       └── page.tsx # Job applications
    ├── analytics/
    │   └── page.tsx     # Analytics dashboard
    └── users/
        └── page.tsx     # User management (super admin)
```

### Components (`src/components/`)

```
components/
├── ui/                  # shadcn/ui components
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── navigation-menu.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── table.tsx
│   └── tooltip.tsx
├── auth/               # Authentication components
│   ├── LoginForm.tsx
│   ├── AuthGuard.tsx
│   └── PermissionGuard.tsx
├── layout/             # Layout components
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   └── Breadcrumbs.tsx
├── blog/               # Blog management components
│   ├── BlogList.tsx
│   ├── BlogForm.tsx
│   ├── BlogCard.tsx
│   └── RichTextEditor.tsx
├── testimonials/       # Testimonials components
│   ├── TestimonialsList.tsx
│   ├── TestimonialForm.tsx
│   └── TestimonialCard.tsx
├── careers/            # Careers components
│   ├── JobListings.tsx
│   ├── JobForm.tsx
│   ├── ApplicationsList.tsx
│   └── ApplicationCard.tsx
├── services/           # Services components
│   ├── ServicesList.tsx
│   ├── ServiceForm.tsx
│   ├── PageBuilder.tsx
│   └── ComponentEditor.tsx
├── faqs/               # FAQs components
│   ├── FAQsList.tsx
│   ├── FAQForm.tsx
│   └── FAQCard.tsx
├── submissions/        # Submissions components
│   ├── ContactSubmissions.tsx
│   ├── JobApplications.tsx
│   └── SubmissionCard.tsx
├── analytics/          # Analytics components
│   ├── VisitorStats.tsx
│   ├── GeographicChart.tsx
│   ├── DeviceAnalytics.tsx
│   └── PageViewsChart.tsx
├── users/              # User management components
│   ├── UsersList.tsx
│   ├── UserForm.tsx
│   └── UserCard.tsx
└── forms/              # Shared form components
    ├── DataTable.tsx
    ├── ImageUpload.tsx
    ├── SearchFilter.tsx
    └── BulkActions.tsx
```

### Libraries (`src/lib/`)

```
lib/
├── utils.ts            # Utility functions
├── auth/               # Authentication utilities
│   ├── AuthContext.tsx
│   ├── auth-utils.ts
│   └── permissions.ts
├── strapi/             # Strapi API client
│   ├── client.ts
│   ├── api.ts
│   └── types.ts
└── types/              # TypeScript type definitions
    ├── auth.ts
    ├── blog.ts
    ├── testimonials.ts
    ├── careers.ts
    ├── services.ts
    ├── faqs.ts
    ├── submissions.ts
    ├── analytics.ts
    └── users.ts
```

### Hooks (`src/hooks/`)

```
hooks/
├── use-mobile.ts       # Mobile detection hook
├── use-auth.ts         # Authentication hook
├── use-permissions.ts  # Permissions hook
├── use-api.ts          # API data fetching hook
└── use-analytics.ts    # Analytics data hook
```

## Key Features by Directory

### Authentication (`auth/`)

- Login/logout functionality
- JWT token management
- Role-based access control
- Permission guards

### Dashboard (`dashboard/`)

- Overview statistics
- Quick actions
- Recent activity feed
- Navigation menu

### Content Management

- **Blog**: Article CRUD, rich text editor, image uploads
- **Testimonials**: Customer feedback management
- **Careers**: Job listings and applications
- **Services**: Page builder with components
- **FAQs**: Frequently asked questions

### Submissions (`submissions/`)

- Contact form submissions
- Job applications
- Status management
- Export functionality

### Analytics (`analytics/`)

- Visitor statistics
- Geographic data
- Device/browser analytics
- Page performance metrics

### User Management (`users/`)

- Staff user CRUD
- Role assignment
- Permission management
- Activity logs

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Add shadcn/ui components
npx shadcn@latest add [component-name]
```

## Environment Variables

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

## Next Steps

1. Set up authentication system
2. Create dashboard layout
3. Implement content management features
4. Add analytics dashboard
5. Set up user management
6. Integrate with Strapi backend
7. Add testing and deployment configuration
