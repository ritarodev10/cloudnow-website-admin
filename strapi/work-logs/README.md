# Work Logs & Invoice Management - Strapi Schema

This directory contains Strapi schema definitions for the work logs and invoice management system.

## Schema Files

### Core Collections

1. **work-sessions-schema.json** - Individual work sessions logged by staff
   - Tracks time, description, project, category
   - Calculates hours and earnings
   - Handles overlap detection

2. **invoices-schema.json** - Invoices generated from work logs
   - Auto-generated from work sessions
   - Tracks payment status
   - Links to work sessions

3. **staff-schema.json** - Staff members with roles and rates
   - Personal information and contact details
   - Role and category assignments
   - Current hourly rate
   - Links to work sessions and invoices

4. **staff-categories-schema.json** - Categories for organizing staff
   - Department-based grouping
   - Permission settings per category
   - Color coding for UI

5. **hourly-rates-schema.json** - History of rate changes
   - Tracks rate changes over time
   - Effective dates
   - Audit trail

## Components

### Invoice Components

- **invoice.period** - Start and end dates for invoice period
- **invoice.item** - Line items with hours, rate, and amount

### Staff Components

- **staff.permissions** - Permission settings for categories
  - canViewOwnLogs
  - canViewTeamLogs
  - canViewAllLogs
  - canManageStaff
  - canApproveInvoices

## API Integration Notes

### Endpoints Structure

```
/api/work-sessions
/api/invoices
/api/staff-members
/api/staff-categories
/api/hourly-rates
```

### Key Relationships

- Staff Members → Work Sessions (one-to-many)
- Staff Members → Invoices (one-to-many)
- Staff Members → Hourly Rates (one-to-many)
- Staff Categories → Staff Members (one-to-many)
- Invoices → Work Sessions (one-to-many)

### Authentication & Authorization

- Use Strapi's built-in authentication
- Implement role-based access control
- Staff can only access their own data
- Admins can access all data based on permissions

### Data Validation

- Time ranges must be valid (start < end)
- Hourly rates must be positive
- Required fields are enforced
- Unique constraints on email and invoice numbers

### Future Enhancements

- Add approval workflows for invoices
- Implement time tracking integrations
- Add reporting and analytics endpoints
- Support for multiple currencies
- Bulk operations for invoice generation

## Migration Notes

When migrating from mock data to Strapi:

1. Create all collections first
2. Seed staff categories and members
3. Import historical work sessions
4. Generate invoices from work sessions
5. Set up proper permissions and roles
6. Test all CRUD operations
7. Implement real-time updates if needed



