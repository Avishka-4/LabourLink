import * as React from "react";
import { GenericTable, type TableColumn, type TableAction } from "./GenericTable";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

// Job Table
export interface JobTableData {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  applicants: number;
  status: string;
  posted: Date;
}

export interface JobTableProps {
  data: JobTableData[];
  onView?: (job: JobTableData) => void;
  onEdit?: (job: JobTableData) => void;
  onDelete?: (job: JobTableData) => void;
  loading?: boolean;
}

const JobTable: React.FC<JobTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const columns: TableColumn<JobTableData>[] = [
    {
      key: "title",
      label: "Job Title",
      sortable: true,
      render: (value: string, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.company}</p>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
    },
    {
      key: "jobType",
      label: "Type",
      render: (value: string) => <Badge variant="secondary" size="sm">{value}</Badge>,
    },
    {
      key: "applicants",
      label: "Applicants",
      sortable: true,
      render: (value: number) => <span className="font-medium">{value}</span>,
    },
    {
      key: "posted",
      label: "Posted",
      sortable: true,
      render: (value: Date) => value.toLocaleDateString(),
    },
  ];

  const actions: TableAction<JobTableData>[] = [
    {
      label: "View",
      onClick: onView || (() => {}),
      variant: "outline",
    },
    {
      label: "Edit",
      onClick: onEdit || (() => {}),
      variant: "outline",
      condition: () => !!onEdit,
    },
    {
      label: "Delete",
      onClick: onDelete || (() => {}),
      variant: "danger",
      condition: () => !!onDelete,
    },
  ];

  return (
    <GenericTable
      columns={columns}
      data={data}
      keyExtractor={(row) => row.id}
      actions={actions}
      loading={loading}
      hoverable
      striped
    />
  );
};

// Complaint Table
export interface ComplaintTableData {
  id: string;
  title: string;
  type: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  filed: Date;
}

export interface ComplaintTableProps {
  data: ComplaintTableData[];
  onView?: (complaint: ComplaintTableData) => void;
  onUpdate?: (complaint: ComplaintTableData) => void;
  loading?: boolean;
}

const ComplaintTable: React.FC<ComplaintTableProps> = ({
  data,
  onView,
  onUpdate,
  loading = false,
}) => {
  const statusStyles = {
    open: "bg-blue-50 text-blue-900 dark:bg-blue-950",
    "in-progress": "bg-yellow-50 text-yellow-900 dark:bg-yellow-950",
    resolved: "bg-green-50 text-green-900 dark:bg-green-950",
    closed: "bg-gray-50 text-gray-900 dark:bg-gray-950",
  };

  const priorityStyles = {
    low: "text-blue-600",
    medium: "text-yellow-600",
    high: "text-orange-600",
    urgent: "text-red-600",
  };

  const columns: TableColumn<ComplaintTableData>[] = [
    {
      key: "title",
      label: "Complaint",
      sortable: true,
      render: (value: string, row) => (
        <div>
          <p className="font-medium line-clamp-1">{value}</p>
          <p className="text-xs text-muted-foreground">{row.type}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[value as keyof typeof statusStyles]}`}>
          {value}
        </span>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (value: string) => (
        <span className={`text-xs font-medium ${priorityStyles[value as keyof typeof priorityStyles]}`}>
          {value.toUpperCase()}
        </span>
      ),
    },
    {
      key: "filed",
      label: "Filed",
      sortable: true,
      render: (value: Date) => value.toLocaleDateString(),
    },
  ];

  const actions: TableAction<ComplaintTableData>[] = [
    {
      label: "View",
      onClick: onView || (() => {}),
      variant: "outline",
    },
    {
      label: "Update",
      onClick: onUpdate || (() => {}),
      variant: "outline",
      condition: () => !!onUpdate,
    },
  ];

  return (
    <GenericTable
      columns={columns}
      data={data}
      keyExtractor={(row) => row.id}
      actions={actions}
      loading={loading}
      hoverable
      striped
    />
  );
};

// Application Table
export interface ApplicationTableData {
  id: string;
  applicantName: string;
  jobTitle: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  applied: Date;
}

export interface ApplicationTableProps {
  data: ApplicationTableData[];
  onView?: (app: ApplicationTableData) => void;
  onAccept?: (app: ApplicationTableData) => void;
  onReject?: (app: ApplicationTableData) => void;
  loading?: boolean;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  data,
  onView,
  onAccept,
  onReject,
  loading = false,
}) => {
  const statusStyles = {
    pending: "bg-yellow-50 text-yellow-900 dark:bg-yellow-950",
    reviewing: "bg-blue-50 text-blue-900 dark:bg-blue-950",
    accepted: "bg-green-50 text-green-900 dark:bg-green-950",
    rejected: "bg-red-50 text-red-900 dark:bg-red-950",
  };

  const columns: TableColumn<ApplicationTableData>[] = [
    {
      key: "applicantName",
      label: "Applicant",
      sortable: true,
    },
    {
      key: "jobTitle",
      label: "Job",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[value as keyof typeof statusStyles]}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "applied",
      label: "Applied",
      sortable: true,
      render: (value: Date) => value.toLocaleDateString(),
    },
  ];

  const actions: TableAction<ApplicationTableData>[] = [
    {
      label: "View",
      onClick: onView || (() => {}),
      variant: "outline",
    },
    {
      label: "Accept",
      onClick: onAccept || (() => {}),
      variant: "outline",
      condition: (row) => row.status === "pending" && !!onAccept,
    },
    {
      label: "Reject",
      onClick: onReject || (() => {}),
      variant: "danger",
      condition: (row) => row.status === "pending" && !!onReject,
    },
  ];

  return (
    <GenericTable
      columns={columns}
      data={data}
      keyExtractor={(row) => row.id}
      actions={actions}
      loading={loading}
      hoverable
      striped
    />
  );
};

// User Table
export interface UserTableData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  joined: Date;
}

export interface UserTableProps {
  data: UserTableData[];
  onView?: (user: UserTableData) => void;
  onEdit?: (user: UserTableData) => void;
  onDeactivate?: (user: UserTableData) => void;
  loading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  data,
  onView,
  onEdit,
  onDeactivate,
  loading = false,
}) => {
  const statusStyles = {
    active: "bg-green-50 text-green-900 dark:bg-green-950",
    inactive: "bg-gray-50 text-gray-900 dark:bg-gray-950",
    suspended: "bg-red-50 text-red-900 dark:bg-red-950",
  };

  const columns: TableColumn<UserTableData>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      render: (value: string) => <Badge size="sm">{value}</Badge>,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[value as keyof typeof statusStyles]}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "joined",
      label: "Joined",
      sortable: true,
      render: (value: Date) => value.toLocaleDateString(),
    },
  ];

  const actions: TableAction<UserTableData>[] = [
    {
      label: "View",
      onClick: onView || (() => {}),
      variant: "outline",
    },
    {
      label: "Edit",
      onClick: onEdit || (() => {}),
      variant: "outline",
      condition: () => !!onEdit,
    },
    {
      label: "Deactivate",
      onClick: onDeactivate || (() => {}),
      variant: "danger",
      condition: () => !!onDeactivate,
    },
  ];

  return (
    <GenericTable
      columns={columns}
      data={data}
      keyExtractor={(row) => row.id}
      actions={actions}
      loading={loading}
      hoverable
      striped
    />
  );
};

export { JobTable, ComplaintTable, ApplicationTable, UserTable };
