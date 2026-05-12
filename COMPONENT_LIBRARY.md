# LabourLink Component Library

## Overview

A comprehensive, production-ready React component library built with TypeScript, Tailwind CSS, and Radix UI. Designed specifically for the LabourLink migrant workers management system.

## Features

- ✅ **TypeScript Support** - Full type safety with interfaces for all components
- ✅ **Tailwind CSS** - Utility-first styling, no separate CSS files
- ✅ **Radix UI** - Accessible base components from Radix
- ✅ **Fully Responsive** - Mobile-first design with responsive breakpoints
- ✅ **Dark Mode Ready** - CSS variables support light/dark themes
- ✅ **Accessible** - WCAG AA compliant with ARIA labels
- ✅ **Theme System** - Customizable colors via CSS variables
- ✅ **Loading States** - Built-in loading spinners and disabled states
- ✅ **Error Handling** - Validation and error display patterns

## Installation

The component library is built into the project. Simply import components from your components folder:

```typescript
import { Button, Input, Card } from '@/app/components';
```

## Project Structure

```
src/
├── app/components/
│   ├── common/           # 15 foundational components
│   ├── layout/           # 5 layout components
│   ├── forms/            # 8 form components
│   ├── cards/            # 6 card display components
│   ├── tables/           # 5 table components
│   └── index.ts          # Main export file
├── types/
│   └── components.types.ts  # Shared type definitions
└── styles/
    └── theme.css         # Design tokens via CSS variables
```

## Common Components

### Button
A versatile button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'link'
- `size`: 'sm' | 'default' | 'lg' | 'icon' | 'icon-sm'
- `isLoading`: boolean - Shows spinner and disables button
- `icon`: ReactNode - Icon to display
- `asChild`: boolean - Render as Slot (use with asChild={true} for custom elements)

**Usage:**
```typescript
<Button variant="primary" isLoading={isLoading}>
  Submit Form
</Button>
```

### Input
Text input with label, error state, and optional icon.

**Props:**
- `label`: string - Input label
- `error`: string - Error message
- `hint`: string - Helper text below input
- `icon`: ReactNode - Icon to display
- `iconPosition`: 'left' | 'right'
- `clearable`: boolean - Show clear button
- `onClear`: () => void - Callback when cleared

**Usage:**
```typescript
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  error={errors.email}
  required
/>
```

### Card
Container component with header, content, and footer sections.

**Props:**
- `variant`: 'default' | 'outline' | 'elevated' | 'flat'
- `hoverable`: boolean - Add hover effect

**Components:**
- `Card` - Main container
- `CardHeader` - Header section with border
- `CardTitle` - Title element
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer with border

**Usage:**
```typescript
<Card variant="default">
  <CardHeader>
    <CardTitle>My Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
  <CardFooter>
    <Button>Cancel</Button>
    <Button>Submit</Button>
  </CardFooter>
</Card>
```

### Select
Dropdown component with search, multi-select, and clearable options.

**Props:**
- `options`: SelectOption[] - Array of options
- `value`: string | number | array
- `onChange`: (value) => void
- `label`: string
- `placeholder`: string
- `multiSelect`: boolean
- `searchable`: boolean
- `clearable`: boolean
- `error`: string
- `hint`: string

**Usage:**
```typescript
<Select
  label="Choose role"
  options={[
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' }
  ]}
  value={selectedRole}
  onChange={setSelectedRole}
  searchable
/>
```

### TextArea
Multi-line text input with character counter.

**Props:**
- `label`: string
- `error`: string
- `hint`: string
- `maxLength`: number
- `showCounter`: boolean - Display character count
- `required`: boolean

**Usage:**
```typescript
<TextArea
  label="Description"
  placeholder="Enter description..."
  maxLength={500}
  showCounter
/>
```

### Checkbox & RadioGroup
Selection components with labels and descriptions.

**Usage:**
```typescript
<Checkbox
  id="remember"
  label="Remember me"
  checked={rememberMe}
  onCheckedChange={setRememberMe}
/>

<RadioGroup
  label="Account Type"
  options={[
    { value: 'worker', label: 'Worker', description: 'Looking for work' },
    { value: 'agency', label: 'Agency', description: 'Hiring agency' }
  ]}
  value={accountType}
  onChange={setAccountType}
/>
```

### Modal
Dialog component with overlay, header, footer, and close button.

**Components:**
- `Modal` - Root component
- `ModalTrigger` - Trigger button
- `ModalContent` - Modal container
- `ModalHeader` / `ModalTitle` / `ModalDescription` - Header area
- `ModalFooter` - Footer area
- `ModalCloseButton` - Close button

**Usage:**
```typescript
<Modal open={isOpen} onOpenChange={setIsOpen}>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Dialog Title</ModalTitle>
    </ModalHeader>
    <ModalFooter>
      <Button>Close</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### Alert
Feedback component with variants for different message types.

**Props:**
- `variant`: 'default' | 'success' | 'destructive' | 'warning' | 'info'
- `title`: string
- `description`: string
- `icon`: ReactNode
- `closeable`: boolean
- `onClose`: () => void

**Usage:**
```typescript
<Alert variant="success" title="Success" description="Operation completed">
  <AlertDescription>Additional details here</AlertDescription>
</Alert>
```

### Badge
Small label component with variants and remove button.

**Props:**
- `variant`: 'default' | 'secondary' | 'success' | 'destructive' | 'warning' | 'info' | 'outline'
- `size`: 'sm' | 'default' | 'lg'
- `icon`: ReactNode
- `onRemove`: () => void

**Usage:**
```typescript
<Badge variant="success" onRemove={() => removeBadge()}>
  Active
</Badge>
```

### LoadingSpinner
Animated spinner for loading states.

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `text`: string - Optional loading text
- `fullscreen`: boolean - Center on screen with overlay

**Usage:**
```typescript
<LoadingSpinner size="md" text="Loading..." />
<LoadingSpinner fullscreen /> {/* Overlay spinner */}
```

### Breadcrumb
Navigation trail component.

**Usage:**
```typescript
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Jobs', href: '/jobs' },
    { label: 'Details', isActive: true }
  ]}
/>
```

### Pagination
Page navigation with previous/next buttons and page numbers.

**Props:**
- `currentPage`: number
- `totalPages`: number
- `onPageChange`: (page: number) => void
- `totalItems`: number
- `itemsPerPage`: number
- `showPageNumbers`: boolean
- `maxPageButtons`: number

**Usage:**
```typescript
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  totalItems={100}
  itemsPerPage={10}
/>
```

### Tooltip
Hover information display using Radix UI.

**Usage:**
```typescript
<Tooltip>
  <TooltipTrigger>Hover me</TooltipTrigger>
  <TooltipContent>Tooltip text</TooltipContent>
</Tooltip>
```

### EmptyState
Display for empty data lists.

**Usage:**
```typescript
<EmptyState
  title="No jobs found"
  description="Try adjusting your filters"
  action={{
    label: "Create job",
    onClick: () => navigate('/create-job')
  }}
/>
```

## Layout Components

### Header
Navigation header with logo, menu items, search, and user profile dropdown.

**Props:**
- `logo`: ReactNode
- `logoText`: string
- `logoHref`: string
- `navItems`: Array of nav items
- `userMenu`: User dropdown configuration
- `searchable`: boolean
- `sticky`: boolean

### Sidebar
Collapsible navigation sidebar with submenu support.

**Props:**
- `items`: SidebarItem[] - Menu items with icons and labels
- `collapsible`: boolean
- `defaultCollapsed`: boolean
- `logo`: ReactNode
- `footer`: ReactNode

### Footer
Application footer with links and social media.

**Props:**
- `columns`: FooterColumn[] - Link columns
- `copyright`: string
- `companyName`: string
- `socialLinks`: Array of social links
- `contactInfo`: Email, phone, address

### Container
Max-width content wrapper.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'

### MainLayout
Combines Header, Sidebar, Footer, and main content area.

**Props:**
- `header`: HeaderProps & { enabled?: boolean }
- `sidebar`: SidebarProps & { enabled?: boolean }
- `footer`: FooterProps & { enabled?: boolean }
- `showHeaderOnly`: boolean

**Usage:**
```typescript
<MainLayout
  header={{
    logo: <Logo />,
    logoText: "LabourLink"
  }}
  sidebar={{
    items: menuItems
  }}
>
  {children}
</MainLayout>
```

## Form Components

### LoginForm
Pre-built login form with email and password.

**Props:**
- `onSubmit`: (data: LoginFormData) => Promise<void>
- `isLoading`: boolean
- `error`: string
- `onForgotPassword`: () => void
- `redirectText`: string
- `redirectLink`: string

### RegistrationForm
Multi-step registration form with role selection.

**Props:**
- `onSubmit`: (data: RegistrationFormData) => Promise<void>
- `isLoading`: boolean
- `userRoles`: UserRole[]

### ComplaintForm
Form for filing complaints with file uploads.

**Props:**
- `onSubmit`: (data: ComplaintFormData) => Promise<void>
- `complaintTypes`: SelectOption[]

### JobApplicationForm
Form for applying to jobs with cover letter and resume.

**Props:**
- `jobTitle`: string
- `onSubmit`: (data: JobApplicationFormData) => Promise<void>

### JobPostingForm
Form for creating/editing job postings.

**Props:**
- `onSubmit`: (data: JobPostingFormData) => Promise<void>
- `initialData`: Partial<JobPostingFormData>

### ProfileForm
User profile editing form with avatar upload.

**Props:**
- `onSubmit`: (data: ProfileFormData) => Promise<void>
- `showSkills`: boolean

### Password Forms
ForgotPasswordForm and ResetPasswordForm for password reset flow.

## Card Components

### JobCard
Displays job posting with apply button and save option.

### WorkerProfileCard
Shows worker profile with skills, rating, and hire button.

### ApplicationCard
Displays job application with status and action buttons.

### ComplaintCard
Shows complaint summary with status and priority.

### AgencyCard
Displays agency/company information.

### NewsCard
Shows news article with image and excerpt.

## Table Components

### GenericTable
Reusable table with sorting, selection, and custom actions.

**Props:**
- `columns`: TableColumn[] - Column definitions
- `data`: T[] - Table data
- `keyExtractor`: (row, index) => string | number
- `actions`: TableAction[] - Row actions
- `onSelectRow`: (row, selected) => void
- `sortable`: boolean
- `hoverable`: boolean
- `striped`: boolean

**Usage:**
```typescript
<GenericTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' }
  ]}
  data={users}
  keyExtractor={(row) => row.id}
  actions={[
    { label: 'Edit', onClick: (row) => edit(row) }
  ]}
/>
```

### Specialized Tables
- `JobTable` - Displays jobs with view/edit/delete actions
- `ComplaintTable` - Shows complaints with status and priority
- `ApplicationTable` - Lists job applications with accept/reject
- `UserTable` - Manages users with role and status

## Design System

### Colors (CSS Variables)

**Light Mode (default):**
- `--primary: #030213` (Dark Navy)
- `--secondary: oklch(0.95 0.0058 264.53)` (Very Light)
- `--destructive: #d4183d` (Red)
- `--muted: #ececf0` (Light Gray)
- `--accent: #e9ebef` (Light Gray)

**Dark Mode:**
Automatically inverted using CSS custom properties.

### Spacing

Tailwind default spacing system:
- `1` = 4px, `2` = 8px, `3` = 12px, `4` = 16px, etc.

### Border Radius

- Default: `0.625rem` (10px)
- Using Tailwind classes: `rounded-md`, `rounded-lg`, etc.

### Shadows

- `shadow-sm` - Small shadow for cards
- `shadow-md` - Medium shadow for elevated elements
- `shadow-lg` - Large shadow for modals

### Typography

Fonts are set up in `fonts.css`. Use Tailwind classes:
- `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`
- `font-normal`, `font-medium`, `font-semibold`, `font-bold`

## Accessibility

All components follow WCAG AA guidelines:

- ✅ Keyboard navigation support
- ✅ ARIA labels on interactive elements
- ✅ Focus states clearly visible
- ✅ Color contrast >= 4.5:1
- ✅ Semantic HTML structure
- ✅ Loading states announced
- ✅ Error messages linked to form fields

## Responsive Design

All components use mobile-first approach with Tailwind breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Example:**
```typescript
className="flex flex-col md:flex-row lg:grid lg:grid-cols-3"
```

## Dark Mode

Dark mode is automatically supported via CSS variables:

```typescript
// Automatically applies dark mode styles
// Triggered by .dark class or system preference
```

## Common Patterns

### Form Validation

```typescript
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState({});

const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm(formData);
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  await submitForm(formData);
};
```

### Loading States

```typescript
<Button isLoading={isLoading} disabled={isLoading}>
  Save Changes
</Button>

<LoadingSpinner fullscreen />
```

### Error Handling

```typescript
{error && (
  <Alert variant="destructive" title="Error" description={error} />
)}
```

## Performance Tips

1. **Use React.memo** for cards and list items
2. **Lazy load** large tables with pagination
3. **Debounce** search inputs
4. **Code split** form components by route
5. **Memoize** callbacks with useCallback

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

## Contributing

When adding new components:

1. Use TypeScript interfaces for all props
2. Include JSDoc comments
3. Export from barrel files (index.ts)
4. Add tests (Jest + React Testing Library)
5. Document usage examples
6. Ensure accessibility compliance
7. Support light/dark mode

## License

Part of LabourLink - Migrant Workers Management System

## Support

For issues or feature requests, contact the development team.
